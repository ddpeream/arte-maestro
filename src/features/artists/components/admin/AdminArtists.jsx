// Devuelve la presentación visual del estado de publicación.
function getPublicationStatus(status) {
  switch (status) {
    case "published":
      return {
        label: "Publicado",
        className: "status-pill status-pill--published",
      };

    case "archived":
      return {
        label: "Archivado",
        className: "status-pill status-pill--archived",
      };

    default:
      return {
        label: "Borrador",
        className: "status-pill status-pill--draft",
      };
  }
}

// Muestra el listado administrativo de artistas y sus acciones.
function AdminArtists({
  artists,
  onAdd,
  onEdit,
  onPublish,
  onArchive,
  isPublishing = false,
  isArchiving = false,
}) {
  return (
    <section className="admin-section is-active">
      <div className="admin-section__head">
        <div>
          <span className="eyebrow">Gestión de contenido</span>

          <h1>Artistas</h1>

          <p>
            Crea artistas, completa su información y publícalos cuando estén
            listos para aparecer en el catálogo.
          </p>
        </div>

        <button type="button" className="btn btn--gold" onClick={onAdd}>
          + Agregar artista
        </button>
      </div>

      <div className="artists-table-wrap">
        <div className="artists-table-head">
          <span>Artista</span>
          <span>Slug</span>
          <span>Estado</span>
          <span>Destacado</span>
          <span>Creado</span>
          <span>Acciones</span>
        </div>

        {artists.map((artist) => {
          const status = getPublicationStatus(artist.publication_status);

          return (
            <div className="artist-row" key={artist.id}>
              <div className="artist-row__name">
                <div className="artist-row__thumb" />

                <div>
                  <strong>{artist.name}</strong>
                  <span>{artist.city || "Sin ciudad"}</span>
                </div>
              </div>

              <span className="muted">/{artist.slug}</span>

              <span className={status.className}>{status.label}</span>

              <span className="muted">{artist.is_featured ? "Sí" : "No"}</span>

              <span className="muted">
                {artist.created_at
                  ? new Date(artist.created_at).toLocaleDateString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </span>

              <div className="artist-row__actions">
                {onEdit && (
                  <button
                    type="button"
                    className="btn btn--small btn--outline"
                    onClick={() => onEdit(artist)}
                  >
                    Editar
                  </button>
                )}

                {artist.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--small btn--gold"
                    disabled={isPublishing}
                    onClick={() => onPublish?.(artist)}
                  >
                    {isPublishing ? "Publicando..." : "Publicar"}
                  </button>
                )}

                {artist.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--small btn--outline"
                    disabled={isArchiving}
                    onClick={() => onArchive?.(artist)}
                  >
                    {isArchiving ? "Archivando..." : "Archivar"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

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
