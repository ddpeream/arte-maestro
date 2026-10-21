import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { artists } from "../../features/artists/data/artists";

import "./ArtistsPage.css";

function ArtistsPage() {
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

      <section className="artists-grid">
        {artists.map((artist, index) => (
          <article key={artist.id} className="artist-card">
            <div className="artist-card__visual">
              <span className="artist-card__index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="artist-card__visual-info">
                <span>{artist.city}</span>
                <strong>{artist.concept}</strong>
              </div>
            </div>

            <div className="artist-card__body">
              <span className="eyebrow">Desde {artist.founded}</span>

              <h2>{artist.name}</h2>

              <p>{artist.shortDescription}</p>

              <div className="artist-card__genres">
                {artist.genres.slice(0, 4).map((genre) => (
                  <span key={genre}>{genre}</span>
                ))}
              </div>

              <Link to={`/artistas/${artist.slug}`}>
                Ver artista
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default ArtistsPage;
