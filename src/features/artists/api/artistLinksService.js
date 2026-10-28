import { supabase } from "../../../lib/supabaseClient";

export const ARTIST_LINK_SELECT = `
  id,
  artist_id,
  platform,
  url,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at
`;

const ALLOWED_PLATFORMS = [
  "instagram",
  "facebook",
  "youtube",
  "spotify",
  "apple_music",
  "soundcloud",
  "tiktok",
  "website",
];

// Valida y normaliza un enlace HTTPS.
function normalizeUrl(value) {
  const url = value?.trim();

  if (!url) {
    throw new Error("El enlace es obligatorio.");
  }

  if (!url.startsWith("https://") || /\s/.test(url)) {
    throw new Error(
      "El enlace debe comenzar por https:// y no contener espacios.",
    );
  }

  return url;
}

// Valida una plataforma permitida.
function validatePlatform(platform) {
  if (!ALLOWED_PLATFORMS.includes(platform)) {
    throw new Error("La plataforma seleccionada no es válida.");
  }

  return platform;
}

// Crea un enlace inicialmente como borrador.
export async function createArtistLink({
  artistId,
  platform,
  url,
  sortOrder = 0,
}) {
  const { data, error } = await supabase
    .from("artist_links")
    .insert({
      artist_id: artistId,
      platform: validatePlatform(platform),
      url: normalizeUrl(url),
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_LINK_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Actualiza un enlace existente.
export async function updateArtistLink(id, changes) {
  const { data, error } = await supabase
    .from("artist_links")
    .update({
      platform: validatePlatform(changes.platform),
      url: normalizeUrl(changes.url),
      sort_order: Number(changes.sort_order || 0),
    })
    .eq("id", id)
    .select(ARTIST_LINK_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Publica un enlace.
export async function publishArtistLink(id) {
  const { data, error } = await supabase
    .from("artist_links")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_LINK_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Archiva un enlace publicado.
export async function archiveArtistLink(id) {
  const { data, error } = await supabase
    .from("artist_links")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_LINK_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Recupera un enlace archivado y lo devuelve a borrador.
export async function restoreArtistLink(id) {
  const { data, error } = await supabase
    .from("artist_links")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_LINK_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
