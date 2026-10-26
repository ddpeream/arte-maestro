import { Navigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { publishedArtistBySlugQueryOptions } from "../../features/artists/api/artistsQueries";
import { getArtistBySlug } from "../../features/artists/data/artists";

import ArtistSidebar from "../../features/artists/components/detail/ArtistSidebar";
import ArtistHero from "../../features/artists/components/detail/ArtistHero";
import ArtistStats from "../../features/artists/components/detail/ArtistStats";
import ArtistBiography from "../../features/artists/components/detail/ArtistBiography";
import ArtistVideos from "../../features/artists/components/detail/ArtistVideos";
import ArtistDiscography from "../../features/artists/components/detail/ArtistDiscography";
import ArtistCrew from "../../features/artists/components/detail/ArtistCrew";
import ArtistPress from "../../features/artists/components/detail/ArtistPress";
import ArtistContact from "../../features/artists/components/detail/ArtistContact";

import "./ArtistDetailPage.css";

// Coordina la presentación del portafolio público de un artista.
function ArtistDetailPage() {
  const { slug } = useParams();

  // Busca temporalmente el artista en los datos locales existentes.
  const localArtist = getArtistBySlug(slug);

  // Busca el artista publicado en Supabase.
  const {
    data: databaseArtist,
    isLoading,
    isError,
  } = useQuery(publishedArtistBySlugQueryOptions(slug));

  // Prioriza Supabase y usa los datos locales como respaldo temporal.
  const artist = databaseArtist ?? localArtist;

  if (isLoading && !localArtist) {
    return (
      <main className="artist-profile">
        <div className="artist-profile__layout">
          <p>Cargando artista...</p>
        </div>
      </main>
    );
  }

  if (isError && !localArtist) {
    return (
      <main className="artist-profile">
        <div className="artist-profile__layout">
          <p>No fue posible cargar la información del artista.</p>
        </div>
      </main>
    );
  }

  // Si no existe ni en Supabase ni en los datos locales, vuelve al catálogo.
  if (!artist) {
    return <Navigate to="/artistas" replace />;
  }

  return (
    <main className="artist-profile">
      <div className="artist-profile__layout">
        <ArtistSidebar artist={artist} slug={slug} />

        <div className="artist-profile__main">
          <ArtistHero artist={artist} />

          <ArtistStats stats={artist.stats ?? []} />

          <ArtistBiography artist={artist} />

          <ArtistVideos
            artist={artist}
            videos={artist.liveVideos ?? []}
            type="live"
          />

          <ArtistDiscography albums={artist.albums ?? []} />

          <ArtistVideos
            artist={artist}
            videos={artist.videoClips ?? []}
            type="clips"
          />

          <ArtistCrew crew={artist.crew ?? []} />

          <ArtistPress press={artist.press ?? []} />

          <ArtistContact artist={artist} />
        </div>
      </div>
    </main>
  );
}

export default ArtistDetailPage;
