import { supabase } from "../../../lib/supabaseClient";

import {
  getMediaAssetPublicUrl,
  uploadArtistImage,
} from "./artistMediaService";

export const ARTIST_RELEASE_SELECT = `
  id,
  artist_id,
  title,
  release_type,
  release_year,
  url,
  cover_asset_id,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  cover_asset:media_assets!artist_releases_cover_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  )
`;

// Añade la URL pública de la portada al lanzamiento.
function withReleaseMediaUrl(release) {
  if (!release) {
    return null;
  }

  return {
    ...release,

    cover_url: release.cover_asset
      ? getMediaAssetPublicUrl(release.cover_asset)
      : "",
  };
}

// Crea un lanzamiento inicialmente como borrador.
export async function createArtistRelease({
  artistId,
  title,
  releaseType = "other",
  releaseYear = "",
  url = "",
  sortOrder = 0,
  coverFile = null,
}) {
  let coverAssetId = null;

  if (coverFile) {
    const coverAsset = await uploadArtistImage(coverFile, {
      title: `${title} — carátula`,
      altText: `Carátula de ${title}`,
    });

    coverAssetId = coverAsset.id;
  }

  const { data, error } = await supabase
    .from("artist_releases")
    .insert({
      artist_id: artistId,
      title: title.trim(),
      release_type: releaseType,
      release_year: releaseYear === "" ? null : Number(releaseYear),
      url: url.trim() || null,
      cover_asset_id: coverAssetId,
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_RELEASE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withReleaseMediaUrl(data);
}

// Actualiza un lanzamiento.
// Si no se selecciona una portada nueva, conserva la actual.
export async function updateArtistRelease(id, changes) {
  const { cover_file, title, release_type, release_year, url, sort_order } =
    changes;

  const payload = {
    title: title.trim(),
    release_type,
    release_year: release_year === "" ? null : Number(release_year),
    url: url.trim() || null,
    sort_order: Number(sort_order || 0),
  };

  if (cover_file) {
    const coverAsset = await uploadArtistImage(cover_file, {
      title: `${title} — carátula`,
      altText: `Carátula de ${title}`,
    });

    payload.cover_asset_id = coverAsset.id;
  }

  const { data, error } = await supabase
    .from("artist_releases")
    .update(payload)
    .eq("id", id)
    .select(ARTIST_RELEASE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withReleaseMediaUrl(data);
}

// Publica un lanzamiento en borrador.
export async function publishArtistRelease(id) {
  const { data, error } = await supabase
    .from("artist_releases")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_RELEASE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withReleaseMediaUrl(data);
}

// Archiva un lanzamiento publicado.
export async function archiveArtistRelease(id) {
  const { data, error } = await supabase
    .from("artist_releases")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_RELEASE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withReleaseMediaUrl(data);
}

// Recupera un lanzamiento archivado y lo devuelve a borrador.
export async function restoreArtistRelease(id) {
  const { data, error } = await supabase
    .from("artist_releases")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_RELEASE_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withReleaseMediaUrl(data);
}
