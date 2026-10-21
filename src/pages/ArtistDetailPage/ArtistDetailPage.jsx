import { useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router";
import { ChevronDown, ExternalLink, Mail, Music2, Globe, Cloud } from "lucide-react";

import { getArtistBySlug } from "../../features/artists/data/artists";
import SocialIcon from "../../components/media/SocialIcon/SocialIcon";
import MediaCard from "../../components/media/MediaCard/MediaCard";
import FanSubscriptionForm from "../../components/forms/FanSubscriptionForm/FanSubscriptionForm";

import "./ArtistDetailPage.css";

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

function ArtistDetailPage() {
  const { slug } = useParams();
  const [openSectionsSlug, setOpenSectionsSlug] = useState(null);
  const sectionsToggleRef = useRef(null);
  const sectionsOpen = openSectionsSlug === slug;

  const artist = getArtistBySlug(slug);

  if (!artist) {
    return <Navigate to="/artistas" replace />;
  }

  const hasStats = Array.isArray(artist.stats) && artist.stats.length > 0;

  const hasBiography =
    Array.isArray(artist.biography) && artist.biography.length > 0;

  const hasLiveVideos =
    Array.isArray(artist.liveVideos) && artist.liveVideos.length > 0;

  const hasAlbums = Array.isArray(artist.albums) && artist.albums.length > 0;

  const hasVideoClips =
    Array.isArray(artist.videoClips) && artist.videoClips.length > 0;

  const hasCrew = Array.isArray(artist.crew) && artist.crew.length > 0;

  const hasPress = Array.isArray(artist.press) && artist.press.length > 0;

  const hasEmails =
    Array.isArray(artist.contact?.emails) && artist.contact.emails.length > 0;

  const socialLinks = Object.entries(artist.platforms || {}).filter(
    ([, url]) => typeof url === "string" && /^https?:\/\//i.test(url),
  );
  const hasContact = Boolean(artist.id);

  const listeningUrl = artist.platforms?.appleMusic || artist.platforms?.spotify;

  return (
    <main className="artist-profile">
      <div className="artist-profile__layout">
        {/* =========================
            SIDEBAR
        ========================== */}
        <aside className="artist-profile__sidebar">
          <span className="eyebrow">Portafolio de artista</span>

          <h1>{artist.name}</h1>

          <div className="artist-profile__tags">
            {artist.city && <span>{artist.city}</span>}

            {artist.concept && <span>{artist.concept}</span>}
          </div>

          <button
            className="artist-profile__sections-toggle"
            type="button"
            ref={sectionsToggleRef}
            aria-expanded={sectionsOpen}
            aria-controls="artist-sections"
            onClick={() => setOpenSectionsSlug(sectionsOpen ? null : slug)}
          >
            Secciones del artista
            <ChevronDown size={18} aria-hidden="true" />
          </button>

          <nav
            id="artist-sections"
            aria-label={`Secciones de ${artist.name}`}
            className={sectionsOpen ? "is-open" : undefined}
            onClick={(event) => {
              if (event.target.closest("a")) setOpenSectionsSlug(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setOpenSectionsSlug(null);
                sectionsToggleRef.current?.focus();
              }
            }}
          >
            {hasBiography && <a href="#biografia">Biografía</a>}

            {hasLiveVideos && <a href="#en-vivo">En vivo</a>}

            {hasAlbums && <a href="#discografia">Discografía</a>}

            {hasVideoClips && <a href="#videoclips">Videoclips</a>}

            {hasCrew && <a href="#crew">Crew</a>}

            {hasPress && <a href="#prensa">Prensa</a>}

            {hasContact && <a href="#contacto">Contacto</a>}
          </nav>
        </aside>

        {/* =========================
            CONTENIDO PRINCIPAL
        ========================== */}
        <div className="artist-profile__main">
          {/* =========================
              HERO
          ========================== */}
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

          {/* =========================
              ESTADÍSTICAS
          ========================== */}
          {hasStats && (
            <section className="artist-profile__stats">
              {artist.stats.map((stat) => (
                <div key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </section>
          )}

          {/* =========================
              BIOGRAFÍA
          ========================== */}
          {hasBiography && (
            <section id="biografia" className="artist-section artist-biography">
              <header>
                <span className="eyebrow">Trayectoria</span>

                <h2>Biografía</h2>
              </header>

              <div className="artist-biography__text" lang="es">
                {artist.biography.map((paragraph, index) => (
                  <p key={`${artist.id}-bio-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          )}

          {/* =========================
              EN VIVO
          ========================== */}
          {hasLiveVideos && (
            <section id="en-vivo" className="artist-section">
              <header className="artist-section__head">
                <div>
                  <span className="eyebrow">Escenario</span>

                  <h2>En vivo</h2>
                </div>

                <p>
                  Presentaciones que documentan el recorrido de {artist.name}.
                </p>
              </header>

              <div className="artist-video-grid">
                {artist.liveVideos.map((video) => (
                  <MediaCard key={video.id} media={video} />
                ))}
              </div>
            </section>
          )}

          {/* =========================
              DISCOGRAFÍA
          ========================== */}
          {hasAlbums && (
            <section
              id="discografia"
              className="artist-section artist-discography"
            >
              <header className="artist-section__head">
                <div>
                  <span className="eyebrow">Obras</span>

                  <h2>Discografía</h2>
                </div>
              </header>

              <div className="album-grid">
                {artist.albums.map((album) => {
                  const AlbumWrapper = album.url ? "a" : "article";

                  const albumProps = album.url
                    ? {
                        href: album.url,
                        target: "_blank",
                        rel: "noreferrer",
                      }
                    : {};

                  return (
                    <AlbumWrapper
                      key={album.id}
                      {...albumProps}
                      className="album-card"
                    >
                      <div className="album-card__cover">
                        {album.cover ? (
                          <img
                            src={album.cover}
                            alt={`Carátula de ${album.title}`}
                            loading="lazy"
                          />
                        ) : (
                          <>
                            <Music2 size={35} />
                            {album.year && <span>{album.year}</span>}
                          </>
                        )}
                      </div>

                      <div className="album-card__body">
                        <div>
                          <strong>{album.title}</strong>

                          {album.year && <span>{album.year}</span>}
                        </div>

                        {album.url && <ExternalLink size={17} />}
                      </div>
                    </AlbumWrapper>
                  );
                })}
              </div>
            </section>
          )}

          {/* =========================
              VIDEOCLIPS
          ========================== */}
          {hasVideoClips && (
            <section id="videoclips" className="artist-section">
              <header className="artist-section__head">
                <div>
                  <span className="eyebrow">Narrativas</span>

                  <h2>Videoclips</h2>
                </div>
              </header>

              <div className="artist-video-grid">
                {artist.videoClips.map((video) => (
                  <MediaCard key={video.id} media={video} />
                ))}
              </div>
            </section>
          )}

          {/* =========================
              CREW
          ========================== */}
          {hasCrew && (
            <section id="crew" className="artist-section">
              <header className="artist-section__head">
                <div>
                  <span className="eyebrow">Comunidad creativa</span>

                  <h2>Crew</h2>
                </div>
              </header>

              <div className="crew-grid">
                {artist.crew.map((member, index) => (
                  <article className="crew-card" key={member.id}>
                    <div className="crew-card__visual">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          loading="lazy"
                        />
                      ) : (
                        <span>{String(index + 1).padStart(2, "0")}</span>
                      )}
                    </div>

                    <div className="crew-card__body">
                      {member.alias && <span>{member.alias}</span>}

                      <h3>{member.name}</h3>

                      {Array.isArray(member.roles) &&
                        member.roles.length > 0 && (
                          <p>{member.roles.join(" · ")}</p>
                        )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* =========================
              PRENSA
          ========================== */}
          {hasPress && (
            <section id="prensa" className="artist-section artist-press">
              <header>
                <span className="eyebrow">Medios</span>

                <h2>Prensa</h2>
              </header>

              <div>
                {artist.press.map((article) => {
                  if (!article.url) {
                    return (
                      <div key={article.name}>
                        <span>{article.name}</span>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={article.url}
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span>{article.name}</span>

                      <ExternalLink size={18} />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* =========================
              CONTACTO
          ========================== */}
          <section id="contacto" className="artist-contact" aria-labelledby="artist-subscribe-title">
            <div className="artist-contact__layout">
            <aside className="artist-contact__artist" aria-label={`Información de ${artist.name}`}>
              {(artist.featuredImage || artist.heroImage) && (
                <img
                  className="artist-contact__photo"
                  src={artist.featuredImage || artist.heroImage}
                  alt={artist.name}
                  loading="lazy"
                />
              )}
              <h3 className="artist-contact__name">
                {(artist.featuredImage || artist.heroImage) && (
                  <img className="artist-contact__avatar" src={artist.featuredImage || artist.heroImage} alt="" loading="lazy" />
                )}
                {artist.name}
              </h3>
              {socialLinks.length > 0 && (
                <nav className="artist-contact__social" aria-label={`Redes y plataformas de ${artist.name}`}>
                  {socialLinks.map(([platform, url]) => {
                    const Icon = platformIcons[platform] || Globe;
                    return (
                      <a key={platform} href={url} target="_blank" rel="noopener noreferrer">
                        {["instagram", "facebook", "youtube"].includes(platform) ? (
                          <SocialIcon platform={platform} size={20} aria-hidden="true" />
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
              <FanSubscriptionForm key={artist.id} artistId={artist.id} artistName={artist.name} />
            </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default ArtistDetailPage;
