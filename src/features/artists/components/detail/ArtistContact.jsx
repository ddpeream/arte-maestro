import { Mail, Phone } from "lucide-react";

import FanSubscriptionForm from "../../../../components/forms/FanSubscriptionForm/FanSubscriptionForm";

// Presenta booking, contactos profesionales y formulario del artista.
function ArtistContact({ artist }) {
  const emails = Array.isArray(artist.contact?.emails)
    ? artist.contact.emails
    : [];

  const phones = Array.isArray(artist.contact?.phones)
    ? artist.contact.phones
    : [];

  const primaryEmail = artist.contact?.primaryEmail ?? "";

  const primaryPhone = artist.contact?.primaryPhone ?? "";

  const hasProfessionalContact = emails.length > 0 || phones.length > 0;

  const artistImage =
    artist.featured_url ||
    artist.featuredImage ||
    artist.hero_url ||
    artist.heroImage ||
    "";

  return (
    <section
      id="contacto"
      className="artist-contact"
      aria-labelledby="artist-subscribe-title"
    >
      <div className="artist-contact__layout">
        <aside
          className="artist-contact__artist"
          aria-label={`Información de ${artist.name}`}
        >
          {artistImage && (
            <img
              className="artist-contact__photo"
              src={artistImage}
              alt={artist.name}
              loading="lazy"
            />
          )}

          <h3 className="artist-contact__name">
            {artistImage && (
              <img
                className="artist-contact__avatar"
                src={artistImage}
                alt=""
                loading="lazy"
              />
            )}

            {artist.name}
          </h3>

          {hasProfessionalContact && (
            <div id="artist-booking" className="artist-contact__booking">
              <span>Booking · Prensa · Industria</span>

              {emails.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  <Mail size={16} aria-hidden="true" />

                  <span>{email}</span>

                  {email === primaryEmail && <small>Principal</small>}
                </a>
              ))}

              {phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`}>
                  <Phone size={16} aria-hidden="true" />

                  <span>{phone}</span>

                  {phone === primaryPhone && <small>Principal</small>}
                </a>
              ))}
            </div>
          )}
        </aside>

        <div className="artist-contact__registration">
          <h2 id="artist-subscribe-title">Contáctanos</h2>

          <FanSubscriptionForm
            key={artist.id}
            artistId={artist.id}
            artistName={artist.name}
          />
        </div>
      </div>
    </section>
  );
}

export default ArtistContact;
