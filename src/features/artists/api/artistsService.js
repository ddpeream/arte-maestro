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

// Añade URLs utilizables por React a los recursos multimedia del artista.
function withArtistMediaUrls(artist) {
  if (!artist) {
    return null;
  }

  return {
    ...artist,

    hero_url: artist.hero_asset
      ? getMediaAssetPublicUrl(artist.hero_asset)
      : "",

    featured_url: artist.featured_asset
      ? getMediaAssetPublicUrl(artist.featured_asset)
      : "",
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

// Trae la información base completa de un artista
// para edición administrativa.
export async function getAdminArtistById(id) {
  const { data, error } = await supabase
    .from("artists")
    .select(ARTIST_ADMIN_DETAIL_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw error;
  }

  return withArtistMediaUrls(data);
}
