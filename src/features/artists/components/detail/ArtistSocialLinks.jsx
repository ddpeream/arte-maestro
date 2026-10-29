import { ExternalLink, Globe } from "lucide-react";

import {
  SiApplemusic,
  SiFacebook,
  SiInstagram,
  SiSoundcloud,
  SiSpotify,
  SiTiktok,
  SiYoutube,
} from "react-icons/si";

const platformConfig = {
  instagram: {
    label: "Instagram",
    action: "Seguir",
    Icon: SiInstagram,
  },

  facebook: {
    label: "Facebook",
    action: "Seguir",
    Icon: SiFacebook,
  },

  youtube: {
    label: "YouTube",
    action: "Ver canal",
    Icon: SiYoutube,
  },

  spotify: {
    label: "Spotify",
    action: "Escuchar",
    Icon: SiSpotify,
  },

  appleMusic: {
    label: "Apple Music",
    action: "Escuchar",
    Icon: SiApplemusic,
  },

  soundcloud: {
    label: "SoundCloud",
    action: "Escuchar",
    Icon: SiSoundcloud,
  },

  tiktok: {
    label: "TikTok",
    action: "Seguir",
    Icon: SiTiktok,
  },

  website: {
    label: "Sitio web",
    action: "Visitar",
    Icon: Globe,
  },
};

// Presenta las redes sociales y plataformas oficiales del artista.
function ArtistSocialLinks({ artist }) {
  const SOCIAL_PRIORITY = {
    instagram: 1,
    facebook: 2,
    tiktok: 3,
  };

  const links = Object.entries(artist.platforms ?? {})
    .filter(([, url]) => typeof url === "string" && /^https?:\/\//i.test(url))
    .sort(([platformA], [platformB]) => {
      const priorityA = SOCIAL_PRIORITY[platformA] ?? 100;

      const priorityB = SOCIAL_PRIORITY[platformB] ?? 100;

      return priorityA - priorityB;
    });

  if (links.length === 0) {
    return null;
  }

  return (
    <section
      id="redes"
      className="artist-section artist-social"
      aria-labelledby="artist-social-title"
    >
      <header className="artist-section__head artist-social__head">
        <div>
          <span className="eyebrow">Conecta</span>

          <h2 id="artist-social-title">
            Redes &amp;
            <br />
            plataformas
          </h2>
        </div>

        <p>
          Sigue, escucha y descubre a {artist.name} en sus canales oficiales.
        </p>
      </header>

      <div className="artist-social__grid">
        {links.map(([platform, url]) => {
          const config = platformConfig[platform] ?? platformConfig.website;

          const Icon = config.Icon;

          return (
            <a
              key={platform}
              className="artist-social__card"
              data-platform={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="artist-social__icon">
                <Icon size={30} aria-hidden="true" />
              </span>

              <span className="artist-social__content">
                <strong>{config.label}</strong>

                <span>{config.action}</span>
              </span>

              <ExternalLink
                className="artist-social__external"
                size={20}
                aria-hidden="true"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}

export default ArtistSocialLinks;
