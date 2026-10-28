import { supabase } from "../../../lib/supabaseClient";

import {
  getMediaAssetPublicUrl,
  uploadArtistImage,
} from "./artistMediaService";

export const ARTIST_GALLERY_SELECT = `
  id,
  artist_id,
  media_asset_id,
  caption,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  media_asset:media_assets!artist_gallery_media_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    title,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  )
`;

// Añade la URL pública de la imagen de galería.
export function withGalleryMediaUrl(item) {
  if (!item) {
    return null;
  }

  return {
    ...item,

    image_url: item.media_asset ? getMediaAssetPublicUrl(item.media_asset) : "",
  };
}

// Crea una imagen de galería inicialmente como borrador.
export async function createArtistGalleryItem({
  artistId,
  caption = "",
  sortOrder = 0,
  imageFile,
}) {
  if (!imageFile) {
    throw new Error("Debes seleccionar una imagen para la galería.");
  }

  const cleanCaption = caption.trim();

  const asset = await uploadArtistImage(imageFile, {
    title: cleanCaption || "Imagen de galería",
    altText: cleanCaption || "Imagen de galería del artista",
  });

  const { data, error } = await supabase
    .from("artist_gallery")
    .insert({
      artist_id: artistId,
      media_asset_id: asset.id,
      caption: cleanCaption || null,
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_GALLERY_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withGalleryMediaUrl(data);
}

// Actualiza una imagen de galería.
// Si no se selecciona una imagen nueva, conserva la actual.
export async function updateArtistGalleryItem(id, changes) {
  const { caption = "", sort_order = 0, image_file = null } = changes;

  const cleanCaption = caption.trim();

  const payload = {
    caption: cleanCaption || null,
    sort_order: Number(sort_order || 0),
  };

  if (image_file) {
    const asset = await uploadArtistImage(image_file, {
      title: cleanCaption || "Imagen de galería",
      altText: cleanCaption || "Imagen de galería del artista",
    });

    payload.media_asset_id = asset.id;
  }

  const { data, error } = await supabase
    .from("artist_gallery")
    .update(payload)
    .eq("id", id)
    .select(ARTIST_GALLERY_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withGalleryMediaUrl(data);
}

// Publica una imagen de galería en borrador.
export async function publishArtistGalleryItem(id) {
  const { data, error } = await supabase
    .from("artist_gallery")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_GALLERY_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withGalleryMediaUrl(data);
}

// Archiva una imagen publicada.
export async function archiveArtistGalleryItem(id) {
  const { data, error } = await supabase
    .from("artist_gallery")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_GALLERY_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withGalleryMediaUrl(data);
}

// Recupera una imagen archivada y la devuelve a borrador.
export async function restoreArtistGalleryItem(id) {
  const { data, error } = await supabase
    .from("artist_gallery")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_GALLERY_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withGalleryMediaUrl(data);
}
