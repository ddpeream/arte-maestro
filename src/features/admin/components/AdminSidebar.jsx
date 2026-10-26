// Navegación lateral del panel administrativo.
function AdminSidebar({ section, onSectionChange }) {
  return (
    <aside className="admin__sidebar">
      <div className="admin__brand">
        <span className="admin__brand-mark" />
        <span>Arte Maestro</span>
      </div>

      <span className="admin__role-badge">Panel administrativo · Vista</span>

      <nav className="admin__nav" aria-label="Panel de administración">
        <button
          type="button"
          className={section === "artists" ? "is-active" : ""}
          onClick={() => onSectionChange("artists")}
        >
          Artistas
        </button>

        <button
          type="button"
          className={section === "team" ? "is-active" : ""}
          onClick={() => onSectionChange("team")}
        >
          Equipo
        </button>
      </nav>

      <div className="admin__sidebar-foot">
        <strong>Arte Maestro</strong>
        <span>Prototipo visual · sin sesión conectada</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
