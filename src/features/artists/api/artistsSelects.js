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
  ),

  stats:artist_stats!artist_stats_artist_id_fkey (
    id,
    value,
    label,
    sort_order,
    publication_status
  ),

  members:artist_members!artist_members_artist_id_fkey (
    id,
    name,
    alias,
    roles,
    photo_asset_id,
    sort_order,
    publication_status,

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
  ),

    releases:artist_releases!artist_releases_artist_id_fkey (
    id,
    title,
    release_type,
    release_year,
    url,
    cover_asset_id,
    sort_order,
    publication_status,

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
  ),

  videos:artist_videos!artist_videos_artist_id_fkey (
    id,
    category,
    title,
    meta,
    media_asset_id,
    sort_order,
    publication_status,

    media_asset:media_assets!artist_videos_media_asset_id_fkey (
      id,
      kind,
      source_type,
      status,
      title,
      external_provider,
      external_id,
      external_url
    )
  ),

    gallery:artist_gallery!artist_gallery_artist_id_fkey (
    id,
    media_asset_id,
    caption,
    sort_order,
    publication_status,

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
  ),

  press:artist_press!artist_press_artist_id_fkey (
    id,
    name,
    url,
    sort_order,
    publication_status
  ),

    links:artist_links!artist_links_artist_id_fkey (
    id,
    platform,
    url,
    sort_order,
    publication_status
  ),

    contacts:artist_contacts!artist_contacts_artist_id_fkey (
    id,
    kind,
    value,
    label,
    is_primary,
    sort_order,
    publication_status
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

// Campos necesarios para editar la información base
// y las secciones relacionadas de un artista.
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
  ),

  stats:artist_stats!artist_stats_artist_id_fkey (
    id,
    value,
    label,
    sort_order,
    publication_status
  ),

  members:artist_members!artist_members_artist_id_fkey (
    id,
    name,
    alias,
    roles,
    photo_asset_id,
    sort_order,
    publication_status,

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
  ),

    releases:artist_releases!artist_releases_artist_id_fkey (
    id,
    title,
    release_type,
    release_year,
    url,
    cover_asset_id,
    sort_order,
    publication_status,

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
  ),

  videos:artist_videos!artist_videos_artist_id_fkey (
    id,
    category,
    title,
    meta,
    media_asset_id,
    sort_order,
    publication_status,

    media_asset:media_assets!artist_videos_media_asset_id_fkey (
      id,
      kind,
      source_type,
      status,
      title,
      external_provider,
      external_id,
      external_url
    )
  ),

    gallery:artist_gallery!artist_gallery_artist_id_fkey (
    id,
    media_asset_id,
    caption,
    sort_order,
    publication_status,

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
  ),

  press:artist_press!artist_press_artist_id_fkey (
    id,
    name,
    url,
    sort_order,
    publication_status
  ),

    links:artist_links!artist_links_artist_id_fkey (
    id,
    platform,
    url,
    sort_order,
    publication_status
  ),

    contacts:artist_contacts!artist_contacts_artist_id_fkey (
    id,
    kind,
    value,
    label,
    is_primary,
    sort_order,
    publication_status
  )
`;
