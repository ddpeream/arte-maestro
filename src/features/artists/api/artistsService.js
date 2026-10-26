import { supabase } from "../../../lib/supabaseClient";
import {
  ARTIST_ADMIN_LIST_SELECT, ARTIST_LIST_SELECT,
  ARTIST_DETAIL_SELECT,
} from "./artistsSelects";


// Crea un artista nuevo inicialmente como borrador.
export async function createArtist(artist) {
  const { data, error } = await supabase
    .from("artists")
    .insert(artist)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
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

    return data ?? [];
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

  return data ?? [];
}

// Trae el detalle público de un artista usando su slug.
export async function getPublishedArtistBySlug(slug) {

    const { data, error } = await supabase
      .from("artists")
      .select(ARTIST_DETAIL_SELECT)
      .eq("slug", slug)
      .eq("publication_status", "published")
      .maybeSingle();

    if (error) {
        throw error;
    }

    return data;
}

// Actualiza los datos de un artista existente por su id.
export async function updateArtist(id, changes) {
  const { data, error } = await supabase
    .from("artists")
    .update(changes)
    .eq("id", id)
    .select(ARTIST_DETAIL_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
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

  return data;
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

  return data;
}
