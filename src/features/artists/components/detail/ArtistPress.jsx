import { ExternalLink } from "lucide-react";

// Presenta publicaciones y menciones de prensa del artista.
function ArtistPress({ press }) {
  if (!Array.isArray(press) || press.length === 0) {
    return null;
  }

  return (
    <section id="prensa" className="artist-section artist-press">
      <header>
        <span className="eyebrow">Medios</span>
        <h2>Prensa</h2>
      </header>

      <div>
        {press.map((article) => {
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
  );
}

export default ArtistPress;
