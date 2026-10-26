import { ExternalLink, Music2 } from "lucide-react";

// Presenta los álbumes y lanzamientos del artista.
function ArtistDiscography({ albums }) {
  if (!Array.isArray(albums) || albums.length === 0) {
    return null;
  }

  return (
    <section id="discografia" className="artist-section artist-discography">
      <header className="artist-section__head">
        <div>
          <span className="eyebrow">Obras</span>
          <h2>Discografía</h2>
        </div>
      </header>

      <div className="album-grid">
        {albums.map((album) => {
          const AlbumWrapper = album.url ? "a" : "article";

          const albumProps = album.url
            ? {
                href: album.url,
                target: "_blank",
                rel: "noreferrer",
              }
            : {};

          return (
            <AlbumWrapper key={album.id} {...albumProps} className="album-card">
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
  );
}

export default ArtistDiscography;
