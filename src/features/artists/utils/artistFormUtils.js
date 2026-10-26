export const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Define los valores iniciales del formulario de artistas.
export const EMPTY_ARTIST = {
  name: "",
  slug: "",
  city: "",
  country_code: "",
  founded_year: "",
  sort_order: 0,
  short_description: "",
  concept: "",
  tagline: "",
  quote: "",
  description: "",
  genres: [],
  biography: [""],
  is_featured: false,

  // Referencias persistidas en media_assets.
  hero_asset_id: null,
  featured_asset_id: null,

  // Archivos temporales seleccionados en el navegador.
  hero_file: null,
  featured_file: null,
};

// Convierte el nombre del artista en un slug para su URL.
export function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Convierte un artista existente al formato usado por el formulario.
export function getArtistFormValues(artist) {
  if (!artist) {
    return {
      ...EMPTY_ARTIST,
      genres: [],
      biography: [""],
    };
  }

  return {
    ...EMPTY_ARTIST,

    name: artist.name ?? "",
    slug: artist.slug ?? "",
    city: artist.city ?? "",
    country_code: artist.country_code ?? "",
    founded_year: artist.founded_year ?? "",
    sort_order: artist.sort_order ?? 0,

    short_description: artist.short_description ?? "",
    concept: artist.concept ?? "",
    tagline: artist.tagline ?? "",
    quote: artist.quote ?? "",
    description: artist.description ?? "",

    genres: Array.isArray(artist.genres) ? [...artist.genres] : [],

    biography:
      Array.isArray(artist.biography) && artist.biography.length > 0
        ? [...artist.biography]
        : [""],

    is_featured: Boolean(artist.is_featured),

    // Conserva las referencias actuales al editar.
    hero_asset_id: artist.hero_asset_id ?? null,
    featured_asset_id: artist.featured_asset_id ?? null,

    // Un archivo nuevo solo existe si el usuario lo selecciona.
    hero_file: null,
    featured_file: null,
  };
}
