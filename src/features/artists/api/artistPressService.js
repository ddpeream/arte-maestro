import { supabase } from "../../../lib/supabaseClient";

export const ARTIST_PRESS_SELECT = `
  id,
  artist_id,
  name,
  url,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at
`;

// Normaliza y valida el enlace opcional de prensa.
function normalizePressUrl(value) {
  const url = value?.trim();

  if (!url) {
    return null;
  }

  if (!url.startsWith("https://") || /\s/.test(url)) {
    throw new Error(
      "El enlace de prensa debe comenzar por https:// y no contener espacios.",
    );
  }

  return url;
}

// Crea una mención de prensa inicialmente como borrador.
export async function createArtistPress({
  artistId,
  name,
  url = "",
  sortOrder = 0,
}) {
  const cleanName = name.trim();

  if (!cleanName) {
    throw new Error("El nombre del medio o publicación es obligatorio.");
  }

  const { data, error } = await supabase
    .from("artist_press")
    .insert({
      artist_id: artistId,
      name: cleanName,
      url: normalizePressUrl(url),
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_PRESS_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Actualiza una mención de prensa.
export async function updateArtistPress(id, changes) {
  const cleanName = changes.name?.trim();

  if (!cleanName) {
    throw new Error("El nombre del medio o publicación es obligatorio.");
  }

  const { data, error } = await supabase
    .from("artist_press")
    .update({
      name: cleanName,
      url: normalizePressUrl(changes.url),
      sort_order: Number(changes.sort_order || 0),
    })
    .eq("id", id)
    .select(ARTIST_PRESS_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Publica una mención de prensa.
export async function publishArtistPress(id) {
  const { data, error } = await supabase
    .from("artist_press")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_PRESS_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Archiva una mención de prensa publicada.
export async function archiveArtistPress(id) {
  const { data, error } = await supabase
    .from("artist_press")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_PRESS_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Recupera una mención archivada y la devuelve a borrador.
export async function restoreArtistPress(id) {
  const { data, error } = await supabase
    .from("artist_press")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_PRESS_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
