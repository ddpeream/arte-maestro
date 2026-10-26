export const ARTIST_LIST_SELECT = `
  id,
  slug,
  name,
  city,
  country_code,
  founded_year,
  concept,
  tagline,
  short_description,
  genres,
  hero_asset_id,
  featured_asset_id,
  is_featured,
  sort_order,
  publication_status,
  published_at,

  hero_asset:media_assets!artists_hero_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  ),

  featured_asset:media_assets!artists_featured_asset_id_fkey (
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

export const ARTIST_DETAIL_SELECT = `
  id,
  slug,
  name,
  city,
  country_code,
  founded_year,
  concept,
  tagline,
  quote,
  short_description,
  description,
  biography,
  genres,
  hero_asset_id,
  featured_asset_id,
  is_featured,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  hero_asset:media_assets!artists_hero_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  ),

  featured_asset:media_assets!artists_featured_asset_id_fkey (
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

export const ARTIST_ADMIN_LIST_SELECT = `
  id,
  slug,
  name,
  city,
  country_code,
  founded_year,
  concept,
  short_description,
  genres,
  hero_asset_id,
  featured_asset_id,
  is_featured,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  hero_asset:media_assets!artists_hero_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  ),

  featured_asset:media_assets!artists_featured_asset_id_fkey (
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

// Campos necesarios para editar la información base de un artista.
export const ARTIST_ADMIN_DETAIL_SELECT = `
  id,
  slug,
  name,
  city,
  country_code,
  founded_year,
  concept,
  tagline,
  short_description,
  description,
  quote,
  biography,
  genres,
  hero_asset_id,
  featured_asset_id,
  is_featured,
  sort_order,
  publication_status,
  published_at,
  created_at,
  updated_at,

  hero_asset:media_assets!artists_hero_asset_id_fkey (
    id,
    kind,
    source_type,
    status,
    alt_text,
    storage_bucket,
    storage_path,
    external_provider,
    external_url
  ),

  featured_asset:media_assets!artists_featured_asset_id_fkey (
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
