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
