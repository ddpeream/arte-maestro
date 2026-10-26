// Presenta la biografía del artista por párrafos.
function ArtistBiography({ artist }) {
  if (!Array.isArray(artist.biography) || artist.biography.length === 0) {
    return null;
  }

  return (
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
  );
}

export default ArtistBiography;
