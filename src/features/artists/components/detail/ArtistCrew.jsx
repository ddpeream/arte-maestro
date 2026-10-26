// Presenta los integrantes y colaboradores del artista.
function ArtistCrew({ crew }) {
  if (!Array.isArray(crew) || crew.length === 0) {
    return null;
  }

  return (
    <section id="crew" className="artist-section">
      <header className="artist-section__head">
        <div>
          <span className="eyebrow">Comunidad creativa</span>
          <h2>Crew</h2>
        </div>
      </header>

      <div className="crew-grid">
        {crew.map((member, index) => (
          <article className="crew-card" key={member.id}>
            <div className="crew-card__visual">
              {member.image ? (
                <img src={member.image} alt={member.name} loading="lazy" />
              ) : (
                <span>{String(index + 1).padStart(2, "0")}</span>
              )}
            </div>

            <div className="crew-card__body">
              {member.alias && <span>{member.alias}</span>}

              <h3>{member.name}</h3>

              {Array.isArray(member.roles) && member.roles.length > 0 && (
                <p>{member.roles.join(" · ")}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ArtistCrew;
