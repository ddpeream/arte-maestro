import { supabase } from "../../../lib/supabaseClient";

export const ARTIST_CONTACT_SELECT = `
  id,
  artist_id,
  kind,
  value,
  label,
  is_primary,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at
`;

function normalizeContactValue(kind, value) {
  const cleanValue = value?.trim() ?? "";

  if (!cleanValue) {
    throw new Error("El contacto es obligatorio.");
  }

  if (kind === "email") {
    return cleanValue.toLowerCase();
  }

  if (kind === "phone") {
    const phone = cleanValue.replace(/[\s().-]/g, "");

    if (!/^\+[1-9][0-9]{1,14}$/.test(phone)) {
      throw new Error(
        "El teléfono debe incluir código de país. Ejemplo: +573001234567",
      );
    }

    return phone;
  }

  throw new Error("Tipo de contacto inválido.");
}

// Crea un contacto como borrador.
// Nunca nace como principal.
export async function createArtistContact({
  artistId,
  kind,
  value,
  label = "",
  sortOrder = 0,
}) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .insert({
      artist_id: artistId,
      kind,
      value: normalizeContactValue(kind, value),
      label: label.trim() || null,
      is_primary: false,
      sort_order: Number(sortOrder || 0),
    })
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Edita el valor, etiqueta y orden.
// El tipo email/phone no se cambia después de creado.
export async function updateArtistContact(id, changes) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .update({
      value: normalizeContactValue(changes.kind, changes.value),
      label: changes.label?.trim() || null,
      sort_order: Number(changes.sort_order || 0),
    })
    .eq("id", id)
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Publica el contacto.
// Publicar no lo convierte automáticamente en principal.
export async function publishArtistContact(id) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .update({
      publication_status: "published",
      is_primary: false,
    })
    .eq("id", id)
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Archiva el contacto.
// Si era principal, deja de serlo.
export async function archiveArtistContact(id) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .update({
      publication_status: "archived",
      is_primary: false,
    })
    .eq("id", id)
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Recupera como borrador y sin condición de principal.
export async function restoreArtistContact(id) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .update({
      publication_status: "draft",
      is_primary: false,
    })
    .eq("id", id)
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Selecciona de forma atómica el contacto principal.
// La RPC V2 exige que el contacto ya esté publicado.
export async function setPrimaryArtistContact(id) {
  const { error } = await supabase.rpc("am_set_primary_artist_contact", {
    p_contact_id: id,
  });

  if (error) {
    throw error;
  }

  return id;
}

// Permite dejar un tipo sin contacto principal.
export async function clearPrimaryArtistContact(id) {
  const { data, error } = await supabase
    .from("artist_contacts")
    .update({
      is_primary: false,
    })
    .eq("id", id)
    .select(ARTIST_CONTACT_SELECT)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
