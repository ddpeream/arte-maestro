import { supabase } from "../../../lib/supabaseClient";

const ARTIST_STAT_SELECT = `
  id,
  artist_id,
  value,
  label,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at
`;

// Crea una cifra nueva como borrador.
export async function createArtistStat({
  artistId,
  value,
  label,
  sortOrder = 0,
}) {
  const { data, error } = await supabase
    .from("artist_stats")
    .insert({
      artist_id: artistId,
      value: value.trim(),
      label: label.trim(),
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_STAT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Actualiza una cifra existente.
export async function updateArtistStat(id, changes) {
  const payload = {};

  if (changes.value !== undefined) {
    payload.value = changes.value.trim();
  }

  if (changes.label !== undefined) {
    payload.label = changes.label.trim();
  }

  if (changes.sort_order !== undefined) {
    payload.sort_order = Number(changes.sort_order || 0);
  }

  const { data, error } = await supabase
    .from("artist_stats")
    .update(payload)
    .eq("id", id)
    .select(ARTIST_STAT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Publica una cifra en borrador.
export async function publishArtistStat(id) {
  const { data, error } = await supabase
    .from("artist_stats")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_STAT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Archiva una cifra publicada.
export async function archiveArtistStat(id) {
  const { data, error } = await supabase
    .from("artist_stats")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_STAT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Recupera una cifra archivada y la devuelve a borrador.
export async function restoreArtistStat(id) {
  const { data, error } = await supabase
    .from("artist_stats")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_STAT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
