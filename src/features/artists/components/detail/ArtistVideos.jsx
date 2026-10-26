import MediaCard from "../../../../components/media/MediaCard/MediaCard";

// Presenta videos en vivo o videoclips del artista.
function ArtistVideos({ artist, videos, type = "live" }) {
  if (!Array.isArray(videos) || videos.length === 0) {
    return null;
  }

  const isLive = type === "live";

  return (
    <section id={isLive ? "en-vivo" : "videoclips"} className="artist-section">
      <header className="artist-section__head">
        <div>
          <span className="eyebrow">{isLive ? "Escenario" : "Narrativas"}</span>

          <h2>{isLive ? "En vivo" : "Videoclips"}</h2>
        </div>

        {isLive && (
          <p>Presentaciones que documentan el recorrido de {artist.name}.</p>
        )}
      </header>

      <div className="artist-video-grid">
        {videos.map((video) => (
          <MediaCard key={video.id} media={video} />
        ))}
      </div>
    </section>
  );
}

export default ArtistVideos;
