import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

// Presenta una tarjeta de artista en el catálogo.
function ArtistCard({ artist, index }) {
  const foundedYear = artist.founded_year ?? artist.founded;
  const description = artist.short_description ?? artist.shortDescription;

  return (
    <article className="artist-card">
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
        {foundedYear && <span className="eyebrow">Desde {foundedYear}</span>}

        <h2>{artist.name}</h2>

        <p>{description}</p>

        <div className="artist-card__genres">
          {(artist.genres ?? []).slice(0, 4).map((genre) => (
            <span key={genre}>{genre}</span>
          ))}
        </div>

        <Link to={`/artistas/${artist.slug}`}>
          Ver artista
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

export default ArtistCard;
