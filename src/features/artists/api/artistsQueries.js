import { queryOptions } from "@tanstack/react-query";
import {
  getPublishedArtistBySlug,
  getPublishedArtists,
  getAdminArtists,
} from "./artistsService";

// Configura la consulta del listado público de artistas.
export const publishedArtistsQueryOptions = queryOptions({
    queryKey: ["artists", "published"],
  queryFn: getPublishedArtists,
})

// Configura la consulta de todos los artistas para administración.
export const adminArtistsQueryOptions = queryOptions({
  queryKey: ["artists", "admin"],
  queryFn: getAdminArtists,
});

// Configura la consulta del detalle público de un artista por slug.
export function publishedArtistBySlugQueryOptions(slug) {
    return queryOptions({
        queryKey: ["artists", "published", slug],
        queryFn: () => getPublishedArtistBySlug(slug),
        enabled: Boolean(slug),
    });
}