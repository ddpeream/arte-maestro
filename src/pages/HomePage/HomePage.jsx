import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
  Headphones,
  MapPin,
  Music2,
  Sparkles,
  Users,
} from "lucide-react";

import { artists } from "../../features/artists/data/artists";
import MediaCard from "../../components/media/MediaCard/MediaCard";
import ImageCarousel from "../../components/media/ImageCarousel/ImageCarousel";

import "./HomePage.css";

const pillars = [
  {
    icon: Music2,
    label: "Músicas afrodescendientes",
  },
  {
    icon: Headphones,
    label: "Obras y sonidos",
  },
  {
    icon: MapPin,
    label: "Territorio y raíz",
  },
  {
    icon: BookOpen,
    label: "Memoria cultural",
  },
  {
    icon: Users,
    label: "Artistas y comunidad",
  },
  {
    icon: Sparkles,
    label: "Circulación e industria",
  },
];

function HomePage() {
  const featuredArtist = artists[0];
  const galleryImages = artists.flatMap((artist) =>
    (artist.gallery || []).map((image) => ({
      ...image,
      id: `${artist.id}-${image.id || image.src}`,
      artistName: artist.name,
      artistHref: `/artistas/${artist.slug}`,
    })),
  );

  return (
    <main>
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="eyebrow">Memoria · Música · Territorio</span>

          <h1>
            Arte Maestro
            <span>MÚSICAS QUE GUARDAN MEMORIA</span>
          </h1>

          <p>
            Un espacio para descubrir, preservar y proyectar las músicas
            afrodescendientes, sus artistas, sus territorios y las historias que
            construyen la diversidad cultural de Medellín.
          </p>

          <div className="home-hero__actions">
            <Link to="/artistas" className="btn btn--gold">
              Explorar artistas
              <ArrowRight size={16} />
            </Link>

            <a href="#memoria" className="btn btn--outline">
              Conocer Arte Maestro
            </a>
            <Link to="/tienda" className="btn btn--outline">Explorar tienda</Link>
          </div>
        </div>

        <div className="home-hero__side">
          <span className="eyebrow">Más que música</span>

          <p>
            RAÍZ
            <br />
            MEMORIA
            <br />
            FUTURO
          </p>
        </div>
      </section>

      <section className="home-pillars">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;

          return (
            <div className="home-pillar" key={pillar.label}>
              <Icon size={21} strokeWidth={1.5} />

              <span>{pillar.label}</span>
            </div>
          );
        })}
      </section>

      <section className="home-manifesto" id="memoria">
        <div>
          <span className="eyebrow">Arte Maestro</span>

          <h2>
            La música también
            <br />
            guarda territorio.
          </h2>
        </div>

        <div className="home-manifesto__copy">
          <p>
            Arte Maestro nace para proteger, visibilizar y promover el desarrollo de
            las músicas afrodescendientes como parte viva del patrimonio
            cultural y de la diversidad que habita Medellín.
          </p>

          <p>
            Aquí convergen memoria, creación, circulación y herramientas para
            que los artistas fortalezcan su participación en la industria
            musical.
          </p>
        </div>
      </section>

      <section className="featured-artist">
        <div className="featured-artist__visual">
          {featuredArtist.featuredImage && (
            <img
              className="featured-artist__image"
              src={featuredArtist.featuredImage}
              alt={featuredArtist.name}
              loading="lazy"
            />
          )}
          <span className="featured-artist__number">01</span>

          <div className="featured-artist__visual-copy">
            <span>Artista destacado</span>
            <strong>{featuredArtist.concept}</strong>
          </div>
        </div>

        <div className="featured-artist__content">
          <span className="eyebrow">
            Medellín · Desde {featuredArtist.founded}
          </span>

          <h2>{featuredArtist.name}</h2>

          <p>{featuredArtist.description}</p>

          <h4>
            <i>{featuredArtist.tagline}</i>
          </h4>
          <div className="featured-artist__genres">
            {featuredArtist.genres.slice(0, 6).map((genre) => (
              <span key={genre}>{genre}</span>
            ))}
          </div>

          <Link
            to={`/artistas/${featuredArtist.slug}`}
            className="featured-artist__link"
          >
            Ver portafolio completo
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {galleryImages.length > 0 && (
        <section
          className="home-media"
          id="galeria"
          aria-labelledby="home-gallery-title"
        >
          <header className="home-section-head">
            <div>
              <span className="eyebrow">Memoria visual</span>
              <h2 id="home-gallery-title">Nuestros artistas</h2>
            </div>
            <p>Rostros, encuentros e imágenes que cuentan su historia.</p>
          </header>
          <ImageCarousel
            images={galleryImages}
            label="Fotografías de los artistas de Arte Maestro"
          />
        </section>
      )}

      <section className="home-media" id="musica">
        <header className="home-section-head">
          <div>
            <span className="eyebrow">En escena</span>
            <h2>School MC en vivo</h2>
          </div>

          <p>
            Presentaciones, sesiones y memoria audiovisual del proyecto
            artístico.
          </p>
        </header>

        <div className="home-media__grid">
          {featuredArtist.liveVideos.slice(0, 4).map((video) => (
            <MediaCard key={video.id} media={video} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
