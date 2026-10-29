import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

// Presenta la identidad y navegación del portafolio.
function ArtistSidebar({ artist, slug }) {
  const [openSectionsSlug, setOpenSectionsSlug] = useState(null);
  const sectionsToggleRef = useRef(null);

  const sectionsOpen = openSectionsSlug === slug;

  // Define las secciones que tienen contenido.
  const sections = [
    {
      id: "biografia",
      label: "Biografía",
      visible: artist.biography?.length > 0,
    },
    {
      id: "en-vivo",
      label: "En vivo",
      visible: artist.liveVideos?.length > 0,
    },
    {
      id: "discografia",
      label: "Discografía",
      visible: artist.albums?.length > 0,
    },
    {
      id: "videoclips",
      label: "Videoclips",
      visible: artist.videoClips?.length > 0,
    },
    {
      id: "galeria",
      label: "Galería",
      visible: Array.isArray(artist.gallery) && artist.gallery.length > 0,
    },
    {
      id: "crew",
      label: "Crew",
      visible: artist.crew?.length > 0,
    },
    {
      id: "prensa",
      label: "Prensa",
      visible: artist.press?.length > 0,
    },
    {
      id: "redes",
      label: "Redes",
      visible: Object.values(artist.platforms ?? {}).some(
        (url) => typeof url === "string" && /^https?:\/\//i.test(url),
      ),
    },
    {
      id: "contacto",
      label: "Contacto",
      visible: Boolean(artist.id),
    },
  ].filter((section) => section.visible);

  // Cierra la navegación y devuelve el foco cuando corresponde.
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setOpenSectionsSlug(null);
      sectionsToggleRef.current?.focus();
    }
  }

  return (
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
          if (event.target.closest("a")) {
            setOpenSectionsSlug(null);
          }
        }}
        onKeyDown={handleKeyDown}
      >
        {sections.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default ArtistSidebar;
