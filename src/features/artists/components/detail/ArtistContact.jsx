import { Link } from "react-router";
import { Mail, Music2, Globe, Cloud } from "lucide-react";

import SocialIcon from "../../../../components/media/SocialIcon/SocialIcon";
import FanSubscriptionForm from "../../../../components/forms/FanSubscriptionForm/FanSubscriptionForm";

const platformLabels = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  spotify: "Spotify",
  appleMusic: "Apple Music",
  soundcloud: "SoundCloud",
  tiktok: "TikTok",
  website: "Sitio web",
};

const platformIcons = {
  spotify: Music2,
  appleMusic: Music2,
  soundcloud: Cloud,
  tiktok: Music2,
  website: Globe,
};

// Presenta redes, booking y formulario de contacto.
function ArtistContact({ artist }) {
  const image = artist.featuredImage || artist.heroImage;

  const socialLinks = Object.entries(artist.platforms || {}).filter(
    ([, url]) => typeof url === "string" && /^https?:\/\//i.test(url),
  );

  const hasEmails =
    Array.isArray(artist.contact?.emails) && artist.contact.emails.length > 0;

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
          {image && (
            <img
              className="artist-contact__photo"
              src={image}
              alt={artist.name}
              loading="lazy"
            />
          )}

          <h3 className="artist-contact__name">
            {image && (
              <img
                className="artist-contact__avatar"
                src={image}
                alt=""
                loading="lazy"
              />
            )}
            {artist.name}
          </h3>

          {socialLinks.length > 0 && (
            <nav
              className="artist-contact__social"
              aria-label={`Redes y plataformas de ${artist.name}`}
            >
              {socialLinks.map(([platform, url]) => {
                const Icon = platformIcons[platform] || Globe;

                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {["instagram", "facebook", "youtube"].includes(platform) ? (
                      <SocialIcon
                        platform={platform}
                        size={20}
                        aria-hidden="true"
                      />
                    ) : (
                      <Icon size={20} aria-hidden="true" />
                    )}

                    {platformLabels[platform] || platform}
                  </a>
                );
              })}
            </nav>
          )}

          {hasEmails && (
            <div id="artist-booking" className="artist-contact__booking">
              <span>Booking · Prensa · Industria</span>

              <Link to="/tienda">Ir a la tienda y cotizar →</Link>

              {artist.contact.emails.map((email) => (
                <a key={email} href={`mailto:${email}`}>
                  <Mail size={16} aria-hidden="true" />
                  {email}
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
