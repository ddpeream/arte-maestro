// Muestra el listado administrativo de artistas.
function AdminArtists({ artists, onAdd }) {
  return (
    <section className="admin-section is-active">
      <div className="admin-section__head">
        <div>
          <span className="eyebrow">Gestión de contenido</span>
          <h1>Artistas</h1>
          <p>
            Cada artista se crea como borrador. Publicarlo es una acción aparte,
            una vez tenga al menos una descripción corta.
          </p>
        </div>

        <button type="button" className="btn btn--gold" onClick={onAdd}>
          + Agregar artista
        </button>
      </div>

      <div className="admin-note">
        <span>ⓘ</span>
        <span>
          Vista local de prueba: los registros agregados no se envían a Supabase
          y se perderán al recargar la página.
        </span>
      </div>

      <div className="artists-table-wrap">
        <div className="artists-table-head">
          <span>Artista</span>
          <span>Slug</span>
          <span>Estado</span>
          <span>Destacado</span>
          <span>Creado</span>
        </div>

        {artists.map((artist) => (
          <div className="artist-row" key={artist.id}>
            <div className="artist-row__name">
              <div className="artist-row__thumb" />

              <div>
                <strong>{artist.name}</strong>
                <span>{artist.city || "Sin ciudad"}</span>
              </div>
            </div>

            <span className="muted">/{artist.slug}</span>

            <span className="status-pill status-pill--draft">Borrador</span>

            <span className="muted">{artist.is_featured ? "Sí" : "No"}</span>

            <span className="muted">
              {new Date(artist.created_at).toLocaleDateString("es-CO", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        ))}

        {artists.length === 0 && (
          <div className="empty-state">
            Todavía no hay artistas cargados. Usa «Agregar artista» para crear
            el primero.
          </div>
        )}
      </div>
    </section>
  );
}

export default AdminArtists;
