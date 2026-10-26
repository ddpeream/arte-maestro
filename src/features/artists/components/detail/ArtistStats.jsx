// Presenta las estadísticas disponibles del artista.
function ArtistStats({ stats }) {
  if (!Array.isArray(stats) || stats.length === 0) {
    return null;
  }

  return (
    <section className="artist-profile__stats">
      {stats.map((stat) => (
        <div key={stat.label}>
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}

export default ArtistStats;
