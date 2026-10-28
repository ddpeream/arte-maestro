import { supabase } from "../../../lib/supabaseClient";

export const ARTIST_VIDEO_SELECT = `
  id,
  artist_id,
  media_asset_id,
  category,
  title,
  meta,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  media_asset:media_assets!artist_videos_media_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    title,
    external_provider,
    external_id,
    external_url
  )
`;

// Extrae un ID válido de YouTube desde un ID puro o una URL.
export function extractYouTubeId(value) {
  const input = value?.trim();

  if (!input) {
    return "";
  }

  // Permite pegar directamente el ID de 11 caracteres.
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) {
    return input;
  }

  try {
    const url = new URL(input);

    const hostname = url.hostname.replace(/^www\./, "").toLowerCase();

    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    }

    if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "music.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v") ?? "";
      } else {
        const parts = url.pathname.split("/").filter(Boolean);

        if (
          parts[0] === "shorts" ||
          parts[0] === "embed" ||
          parts[0] === "live"
        ) {
          videoId = parts[1] ?? "";
        }
      }
    }

    return /^[A-Za-z0-9_-]{11}$/.test(videoId) ? videoId : "";
  } catch {
    return "";
  }
}

// Devuelve la miniatura pública estándar de YouTube.
export function getYouTubeThumbnail(youtubeId) {
  if (!youtubeId) {
    return "";
  }

  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}

// Reutiliza un media_asset de YouTube existente o crea uno nuevo.
async function getOrCreateYouTubeAsset({ youtubeId, title }) {
  const { data: existingAsset, error: existingError } = await supabase
    .from("media_assets")
    .select(
      `
        id,
        kind,
        source_type,
        status,
        title,
        external_provider,
        external_id,
        external_url
      `,
    )
    .eq("external_provider", "youtube")
    .eq("external_id", youtubeId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingAsset) {
    return existingAsset;
  }

  const { data, error } = await supabase
    .from("media_assets")
    .insert({
      kind: "video",
      source_type: "external",
      status: "ready",
      title: title.trim(),
      external_provider: "youtube",
      external_id: youtubeId,
      external_url: null,
    })
    .select(
      `
      id,
      kind,
      source_type,
      status,
      title,
      external_provider,
      external_id,
      external_url
    `,
    )
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Adapta una fila de artist_videos al formato útil para React.
export function withArtistVideoMedia(video) {
  if (!video) {
    return null;
  }

  const youtubeId = video.media_asset?.external_id ?? "";

  return {
    ...video,

    youtube_id: youtubeId,

    thumbnail: getYouTubeThumbnail(youtubeId),
  };
}

// Crea un video del portafolio inicialmente como borrador.
export async function createArtistVideo({
  artistId,
  category,
  title,
  meta = "",
  youtubeValue,
  sortOrder = 0,
}) {
  const youtubeId = extractYouTubeId(youtubeValue);

  if (!youtubeId) {
    throw new Error("El enlace o ID de YouTube no es válido.");
  }

  const asset = await getOrCreateYouTubeAsset({
    youtubeId,
    title,
  });

  const { data, error } = await supabase
    .from("artist_videos")
    .insert({
      artist_id: artistId,
      media_asset_id: asset.id,
      category,
      title: title.trim(),
      meta: meta.trim() || null,
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_VIDEO_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistVideoMedia(data);
}

// Actualiza los datos editoriales del video.
// Si cambia el enlace de YouTube, cambia también la referencia multimedia.
export async function updateArtistVideo(id, changes) {
  const {
    category,
    title,
    meta,
    youtube_value,
    current_youtube_id,
    sort_order,
  } = changes;

  const payload = {
    category,
    title: title.trim(),
    meta: meta.trim() || null,
    sort_order: Number(sort_order || 0),
  };

  const youtubeId = extractYouTubeId(youtube_value) || current_youtube_id;

  if (!youtubeId) {
    throw new Error("El enlace o ID de YouTube no es válido.");
  }

  if (youtubeId !== current_youtube_id) {
    const asset = await getOrCreateYouTubeAsset({
      youtubeId,
      title,
    });

    payload.media_asset_id = asset.id;
  }

  const { data, error } = await supabase
    .from("artist_videos")
    .update(payload)
    .eq("id", id)
    .select(ARTIST_VIDEO_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistVideoMedia(data);
}

// Publica un video en borrador.
export async function publishArtistVideo(id) {
  const { data, error } = await supabase
    .from("artist_videos")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_VIDEO_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistVideoMedia(data);
}

// Archiva un video publicado.
export async function archiveArtistVideo(id) {
  const { data, error } = await supabase
    .from("artist_videos")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_VIDEO_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistVideoMedia(data);
}

// Recupera un video archivado y lo devuelve a borrador.
export async function restoreArtistVideo(id) {
  const { data, error } = await supabase
    .from("artist_videos")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_VIDEO_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistVideoMedia(data);
}
