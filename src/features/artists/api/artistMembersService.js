import { supabase } from "../../../lib/supabaseClient";
import {
  getMediaAssetPublicUrl,
  uploadArtistImage,
} from "./artistMediaService";

export const ARTIST_MEMBER_SELECT = `
  id,
  artist_id,
  name,
  alias,
  roles,
  photo_asset_id,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  photo_asset:media_assets!artist_members_photo_asset_id_fkey (
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

// Convierte un integrante recibido desde Supabase
// al formato que puede consumir React.
function withMemberMediaUrl(member) {
  if (!member) {
    return null;
  }

  return {
    ...member,

    photo_url: member.photo_asset
      ? getMediaAssetPublicUrl(member.photo_asset)
      : "",
  };
}

// Limpia los roles introducidos desde el formulario.
function normalizeRoles(roles) {
  if (!Array.isArray(roles)) {
    return [];
  }

  return [...new Set(roles.map((role) => role.trim()).filter(Boolean))];
}

// Crea un integrante inicialmente como borrador.
export async function createArtistMember({
  artistId,
  name,
  alias,
  roles,
  sortOrder = 0,
  photoFile = null,
}) {
  let photoAssetId = null;

  if (photoFile) {
    const photoAsset = await uploadArtistImage(photoFile, {
      title: `${name} — integrante`,
      altText: alias ? `${name} (${alias})` : name,
    });

    photoAssetId = photoAsset.id;
  }

  const { data, error } = await supabase
    .from("artist_members")
    .insert({
      artist_id: artistId,

      name: name.trim(),

      alias: alias?.trim() || null,

      roles: normalizeRoles(roles),

      photo_asset_id: photoAssetId,

      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_MEMBER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withMemberMediaUrl(data);
}

// Actualiza un integrante.
// Si no se selecciona una foto nueva, conserva la actual.
export async function updateArtistMember(id, changes) {
  const { photo_file, name, alias, roles, sort_order } = changes;

  const payload = {
    name: name.trim(),

    alias: alias?.trim() || null,

    roles: normalizeRoles(roles),

    sort_order: Number(sort_order || 0),
  };

  if (photo_file) {
    const photoAsset = await uploadArtistImage(photo_file, {
      title: `${name} — integrante`,
      altText: alias ? `${name} (${alias})` : name,
    });

    payload.photo_asset_id = photoAsset.id;
  }

  const { data, error } = await supabase
    .from("artist_members")
    .update(payload)
    .eq("id", id)
    .select(ARTIST_MEMBER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withMemberMediaUrl(data);
}

// Publica un integrante que está en borrador.
export async function publishArtistMember(id) {
  const { data, error } = await supabase
    .from("artist_members")
    .update({
      publication_status: "published",
    })
    .eq("id", id)
    .select(ARTIST_MEMBER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withMemberMediaUrl(data);
}

// Archiva un integrante publicado.
export async function archiveArtistMember(id) {
  const { data, error } = await supabase
    .from("artist_members")
    .update({
      publication_status: "archived",
    })
    .eq("id", id)
    .select(ARTIST_MEMBER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withMemberMediaUrl(data);
}

// Recupera un integrante archivado y lo devuelve a borrador.
export async function restoreArtistMember(id) {
  const { data, error } = await supabase
    .from("artist_members")
    .update({
      publication_status: "draft",
    })
    .eq("id", id)
    .select(ARTIST_MEMBER_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return withMemberMediaUrl(data);
}
