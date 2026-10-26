import { Music2 } from "lucide-react";

// Presenta la imagen principal y las acciones del artista.
function ArtistHero({ artist }) {
  const listeningUrl =
    artist.platforms?.appleMusic || artist.platforms?.spotify;

  const hasEmails =
    Array.isArray(artist.contact?.emails) && artist.contact.emails.length > 0;

  return (
    <section className="artist-profile__hero">
      {artist.heroImage && (
        <img
          className="artist-profile__hero-image"
          src={artist.heroImage}
          alt={artist.name}
          fetchPriority="high"
        />
      )}

      {(artist.city || artist.country) && (
        <span className="eyebrow">
          {artist.city}
          {artist.city && artist.country && " · "}
          {artist.country}
        </span>
      )}

      <h2>{artist.name}</h2>

      {artist.concept && (
        <p className="artist-profile__concept">{artist.concept}</p>
      )}

      {artist.tagline && (
        <p className="artist-profile__tagline">{artist.tagline}</p>
      )}

      <div className="artist-profile__hero-actions">
        {listeningUrl && (
          <a
            href={listeningUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn--gold"
          >
            <Music2 size={16} />
            Escuchar
          </a>
        )}

        {hasEmails && (
          <a href="#artist-booking" className="btn btn--outline">
            Booking
          </a>
        )}
      </div>
    </section>
  );
}

export default ArtistHero;
