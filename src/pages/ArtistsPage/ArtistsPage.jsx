import { useQuery } from "@tanstack/react-query";

import ArtistCard from "../../features/artists/components/ArtistCard";
import { artists as localArtists } from "../../features/artists/data/artists";
import { publishedArtistsQueryOptions } from "../../features/artists/api/artistsQueries";

import "./ArtistsPage.css";

// Presenta el catálogo usando Supabase y conserva datos locales como respaldo temporal.
function ArtistsPage() {
  const {
    data: remoteArtists = [],
    isLoading,
    isError,
  } = useQuery(publishedArtistsQueryOptions);

  const artists = remoteArtists.length > 0 ? remoteArtists : localArtists;

  return (
    <main className="artists-page">
      <header className="artists-page__header">
        <span className="eyebrow">Catálogo Arte Maestro</span>

        <h1>ARTISTAS</h1>

        <p>
          Voces, agrupaciones y procesos musicales afrodescendientes conectados
          con Medellín, sus territorios y sus memorias.
        </p>
      </header>

      {isLoading && (
        <p className="artists-page__status">Cargando artistas...</p>
      )}

      {isError && (
        <p className="artists-page__status">
          No fue posible consultar Supabase. Mostrando catálogo local.
        </p>
      )}

      <section className="artists-grid">
        {artists.map((artist, index) => (
          <ArtistCard key={artist.id} artist={artist} index={index} />
        ))}
      </section>
    </main>
  );
}

export default ArtistsPage;
