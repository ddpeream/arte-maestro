import { supabase } from "../../../lib/supabaseClient";

import {
  ARTIST_ADMIN_LIST_SELECT,
  ARTIST_LIST_SELECT,
  ARTIST_DETAIL_SELECT,
  ARTIST_ADMIN_DETAIL_SELECT,
} from "./artistsSelects";

import {
  getMediaAssetPublicUrl,
  uploadArtistImage,
} from "./artistMediaService";

// Adapta los recursos multimedia y las secciones relacionadas
// al formato que consume React.
function withArtistMediaUrls(artist) {
  if (!artist) {
    return null;
  }

  const members = Array.isArray(artist.members)
    ? [...artist.members]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((member) => ({
          ...member,

          photo_url: member.photo_asset
            ? getMediaAssetPublicUrl(member.photo_asset)
            : "",
        }))
    : [];

  const releases = Array.isArray(artist.releases)
    ? [...artist.releases]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((release) => ({
          ...release,

          cover_url: release.cover_asset
            ? getMediaAssetPublicUrl(release.cover_asset)
            : "",
        }))
    : [];

    const videos = Array.isArray(artist.videos)
      ? [...artist.videos]
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((video) => {
            const youtubeId = video.media_asset?.external_id ?? "";

            return {
              ...video,

              youtube_id: youtubeId,

              thumbnail: youtubeId
                ? `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`
                : "",
            };
          })
      : [];

      const gallery = Array.isArray(artist.gallery)
        ? [...artist.gallery]
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((item) => ({
              ...item,

              image_url: item.media_asset
                ? getMediaAssetPublicUrl(item.media_asset)
                : "",

              // Alias sencillo para la vista pública.
              image: item.media_asset
                ? getMediaAssetPublicUrl(item.media_asset)
                : "",
            }))
        : [];

  return {
    ...artist,

    hero_url: artist.hero_asset
      ? getMediaAssetPublicUrl(artist.hero_asset)
      : "",

    featured_url: artist.featured_asset
      ? getMediaAssetPublicUrl(artist.featured_asset)
      : "",

    stats: Array.isArray(artist.stats)
      ? [...artist.stats].sort(
          (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
        )
      : [],

    members: Array.isArray(artist.members)
      ? [...artist.members]
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map((member) => ({
            ...member,

            photo_url: member.photo_asset
              ? getMediaAssetPublicUrl(member.photo_asset)
              : "",
          }))
      : [],

    // Adaptador temporal hacia el formato que ya consume ArtistCrew.
    crew: members.map((member) => ({
      id: member.id,
      name: member.name,
      alias: member.alias,
      roles: member.roles ?? [],
      image: member.photo_url,
    })),

    // Adaptador hacia el formato que ya consume ArtistDiscography.
    albums: releases.map((release) => ({
      id: release.id,
      title: release.title,
      year: release.release_year,
      type: release.release_type,
      url: release.url,
      cover: release.cover_url,
    })),

    liveVideos: videos
      .filter((video) => video.category === "live")
      .map((video) => ({
        id: video.id,
        type: "video",
        source: "youtube",
        title: video.title,
        meta: video.meta ?? "",
        youtubeId: video.youtube_id,
        thumbnail: video.thumbnail,
      })),

    videoClips: videos
      .filter((video) => video.category === "clip")
      .map((video) => ({
        id: video.id,
        type: "video",
        source: "youtube",
        title: video.title,
        meta: video.meta ?? "",
        youtubeId: video.youtube_id,
        thumbnail: video.thumbnail,
      })),

    gallery,
  };
}

// Añade URLs multimedia a una lista de artistas.
function withArtistsMediaUrls(artists) {
  return (artists ?? []).map(withArtistMediaUrls);
}

// Procesa las imágenes seleccionadas y devuelve únicamente
// datos que realmente pertenecen a la tabla artists.
async function prepareArtistData(artist) {
  const { hero_file, featured_file, ...artistData } = artist;

  // Estos campos son derivados de las consultas y no pertenecen
  // físicamente a la tabla artists.
  delete artistData.hero_asset;
  delete artistData.featured_asset;
  delete artistData.hero_url;
  delete artistData.featured_url;

  let heroAssetId = artistData.hero_asset_id ?? null;
  let featuredAssetId = artistData.featured_asset_id ?? null;

  // Si el usuario seleccionó una nueva imagen principal,
  // se crea un nuevo media_asset y se sustituye la referencia.
  if (hero_file) {
    const heroAsset = await uploadArtistImage(hero_file, {
      title: `${artistData.name} — imagen principal`,
      altText: `${artistData.name} — imagen principal`,
    });

    heroAssetId = heroAsset.id;
  }

  // Si el usuario seleccionó una nueva imagen destacada,
  // se crea otro media_asset y se sustituye la referencia.
  if (featured_file) {
    const featuredAsset = await uploadArtistImage(featured_file, {
      title: `${artistData.name} — imagen destacada`,
      altText: `${artistData.name} — imagen destacada`,
    });

    featuredAssetId = featuredAsset.id;
  }

  return {
    ...artistData,
    hero_asset_id: heroAssetId,
    featured_asset_id: featuredAssetId,
  };
}

// Crea un artista nuevo inicialmente como borrador.
export async function createArtist(artist) {
  const artistData = await prepareArtistData(artist);

  const { data, error } = await supabase
    .from("artists")
    .insert(artistData)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Trae la lista de artistas publicados para catálogo y tarjetas.
export async function getPublishedArtists() {
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_LIST_SELECT)
    .eq("publication_status", "published")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return withArtistsMediaUrls(data);
}

// Trae todos los artistas para el panel administrativo.
export async function getAdminArtists() {
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_ADMIN_LIST_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return withArtistsMediaUrls(data);
}

// Trae el detalle público de un artista usando su slug.
// Las secciones del portafolio se limitan explícitamente a contenido publicado,
// incluso si quien visita la ruta pública tiene una sesión administrativa.
export async function getPublishedArtistBySlug(slug) {
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_DETAIL_SELECT)
    .eq("slug", slug)
    .eq("publication_status", "published")
    .eq("stats.publication_status", "published")
    .eq("members.publication_status", "published")
    .eq("releases.publication_status", "published")
    .eq("videos.publication_status", "published")
    .eq("gallery.publication_status", "published")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Actualiza los datos de un artista existente por su id.
export async function updateArtist(id, changes) {
  const artistData = await prepareArtistData(changes);

  const { data, error } = await supabase
    .from("artists")
    .update(artistData)
    .eq("id", id)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Publica un artista previamente creado como borrador.
export async function publishArtist(id) {
  const { data, error } = await supabase
    .from("artists")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Archiva un artista sin eliminar físicamente su información.
export async function archiveArtist(id) {
  const { data, error } = await supabase
    .from("artists")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Recupera un artista archivado y lo devuelve a borrador.
export async function restoreArtist(id) {
  const { data, error } = await supabase
    .from("artists")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}

// Trae la información base completa de un artista para edición administrativa.
export async function getAdminArtistById(id) {
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_ADMIN_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Error cargando artista administrativo:",
      error,
    );

    throw error;
  }

  console.log(
    "ARTISTA ADMIN COMPLETO:",
    data,
  );

  console.log(
    "STATS RECIBIDOS:",
    data?.stats,
  );

  return withArtistMediaUrls(data);
}
