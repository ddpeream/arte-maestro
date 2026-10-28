import { Navigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { publishedArtistBySlugQueryOptions } from "../../features/artists/api/artistsQueries";

import ArtistSidebar from "../../features/artists/components/detail/ArtistSidebar";
import ArtistHero from "../../features/artists/components/detail/ArtistHero";
import ArtistStats from "../../features/artists/components/detail/ArtistStats";
import ArtistBiography from "../../features/artists/components/detail/ArtistBiography";
import ArtistVideos from "../../features/artists/components/detail/ArtistVideos";
import ArtistDiscography from "../../features/artists/components/detail/ArtistDiscography";
import ArtistCrew from "../../features/artists/components/detail/ArtistCrew";
import ArtistPress from "../../features/artists/components/detail/ArtistPress";
import ArtistContact from "../../features/artists/components/detail/ArtistContact";

// import { artists as LocalArtists } from "../../features/artists/data/artists";

import "./ArtistDetailPage.css";

// Coordina la presentación del portafolio público de un artista.
function ArtistDetailPage() {
  const { slug } = useParams();

  // Trae desde Supabase el artista publicado correspondiente al slug.
  const {
    data: artist,
    isLoading,
    isError,
  } = useQuery(publishedArtistBySlugQueryOptions(slug));

  if (isLoading) {
    return (
      <main className="artist-profile">
        <div className="artist-profile__layout">
          <p>Cargando artista...</p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="artist-profile">
        <div className="artist-profile__layout">
          <p>No fue posible cargar la información del artista.</p>
        </div>
      </main>
    );
  }

  // Si no existe o no está publicado, vuelve al catálogo.
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
