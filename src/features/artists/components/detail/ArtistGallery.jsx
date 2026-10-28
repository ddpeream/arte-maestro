import ImageCarousel from "../../../../components/media/ImageCarousel/ImageCarousel";

// Presenta la memoria visual publicada del artista.
function ArtistGallery({ artist, gallery }) {
  if (!Array.isArray(gallery) || gallery.length === 0) {
    return null;
  }

  // Adapta las filas de Supabase al formato
  // reutilizable por ImageCarousel.
  const images = gallery
    .filter((item) => item.image)
    .map((item) => ({
      id: item.id,

      src: item.image,

      alt:
        item.media_asset?.alt_text ||
        item.caption ||
        `Fotografía de ${artist.name}`,

      caption: item.caption || "",

      artistName: artist.name,

      artistHref: `/artistas/${artist.slug}`,
    }));

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      id="galeria"
      className="artist-section artist-gallery"
      aria-labelledby="artist-gallery-title"
    >
      <header className="artist-section__head">
        <div>
          <span className="eyebrow">Memoria visual</span>

          <h2 id="artist-gallery-title">Galería</h2>
        </div>

        <p>
          Fotografías que documentan la historia y el recorrido de {artist.name}
          .
        </p>
      </header>

      <ImageCarousel
        images={images}
        label={`Galería fotográfica de ${artist.name}`}
      />
    </section>
  );
}

export default ArtistGallery;
