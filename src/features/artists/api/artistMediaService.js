import { supabase } from "../../../lib/supabaseClient";

const PUBLIC_MEDIA_BUCKET = "public-media";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const MEDIA_ASSET_SELECT = `
  id,
  kind,
  source_type,
  status,
  title,
  alt_text,
  caption,
  credit,
  storage_bucket,
  storage_path,
  original_filename,
  mime_type,
  size_bytes,
  width,
  height,
  external_provider,
  external_id,
  external_url,
  preview_asset_id,
  created_at,
  updated_at
`;

// Valida una imagen antes de enviarla a Storage.
function validateArtistImage(file) {
  if (!file) {
    throw new Error("No se recibió ninguna imagen.");
  }

  if (!IMAGE_TYPES[file.type]) {
    throw new Error("La imagen debe ser JPG, PNG o WebP.");
  }

  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE) {
    throw new Error("La imagen debe pesar máximo 10 MiB.");
  }
}

// Genera el UUID que compartirán la ruta de Storage y media_assets.id.
function createAssetId() {
  if (!globalThis.crypto?.randomUUID) {
    throw new Error("El navegador no permite generar UUID seguros.");
  }

  return globalThis.crypto.randomUUID();
}

// Construye la ruta requerida por el contrato V1:
// images/<uuid>/file.jpg
function createImageStoragePath(assetId, mimeType) {
  const extension = IMAGE_TYPES[mimeType];

  return `images/${assetId}/file.${extension}`;
}

// Obtiene la URL pública de un recurso.
// public-media es un bucket público por diseño del proyecto.
export function getMediaAssetPublicUrl(asset) {
  if (!asset) {
    return "";
  }

  if (
    asset.source_type === "storage" &&
    asset.storage_bucket &&
    asset.storage_path
  ) {
    const { data } = supabase.storage
      .from(asset.storage_bucket)
      .getPublicUrl(asset.storage_path);

    return data?.publicUrl ?? "";
  }

  if (asset.source_type === "external" && asset.external_provider === "url") {
    return asset.external_url ?? "";
  }

  return "";
}

// Consulta un recurso multimedia por UUID.
// Admin/superadmin pueden consultar también recursos no públicos por RLS.
export async function getMediaAssetById(id) {
  if (!id) {
    return null;
  }

  const { data, error } = await supabase
    .from("media_assets")
    .select(MEDIA_ASSET_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

// Consulta el recurso y devuelve también su URL utilizable por React.
export async function getMediaAssetWithUrl(id) {
  const asset = await getMediaAssetById(id);

  if (!asset) {
    return null;
  }

  return {
    ...asset,
    public_url: getMediaAssetPublicUrl(asset),
  };
}

// Sube una imagen a public-media y registra sus metadatos en media_assets.
//
// IMPORTANTE:
// Primero se sube el archivo y después se registra media_assets.
// V1 no concede DELETE de Storage al cliente, por lo que si el INSERT
// en media_assets falla después del upload puede quedar un objeto huérfano.
// Ese riesgo ya forma parte del contrato V1 y su limpieza coordinada
// pertenece a una fase posterior.
export async function uploadArtistImage(
  file,
  { title = null, altText = null } = {},
) {
  validateArtistImage(file);

  const assetId = createAssetId();
  const storagePath = createImageStoragePath(assetId, file.type);

  // 1. Subir archivo físico a Storage.
  const { error: uploadError } = await supabase.storage
    .from(PUBLIC_MEDIA_BUCKET)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // 2. Registrar el recurso en media_assets usando el MISMO UUID
  // incluido en la ruta de Storage.
  const { data: asset, error: assetError } = await supabase
    .from("media_assets")
    .insert({
      id: assetId,
      kind: "image",
      source_type: "storage",
      status: "ready",
      title,
      alt_text: altText,
      storage_bucket: PUBLIC_MEDIA_BUCKET,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select(MEDIA_ASSET_SELECT)
    .single();

  if (assetError) {
    throw assetError;
  }

  return {
    ...asset,
    public_url: getMediaAssetPublicUrl(asset),
  };
}
