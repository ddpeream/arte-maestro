// Muestra la sección administrativa del equipo.
function AdminTeam() {
  return (
    <section className="admin-section is-active">
      <div className="admin-section__head">
        <div>
          <span className="eyebrow">Solo super admin</span>
          <h1>Equipo</h1>
          <p>
            Gestión de administradores y editores de Arte Maestro. Esta sección
            es una maqueta sin autorización real.
          </p>
        </div>
      </div>

      <div className="admin-note">
        <span>⚠</span>
        <span>
          Antes de autorizar a alguien, debe existir una identidad en{" "}
          <code>Supabase Auth</code>. Los cambios reales de roles se gestionarán
          de forma segura en <code>staff_accounts</code>, no desde esta maqueta.
        </span>
      </div>

      <div className="staff-table-wrap">
        <div className="staff-table-head">
          <span>Nombre</span>
          <span>Rol</span>
          <span>Estado</span>
          <span>Acciones</span>
        </div>

        <div className="empty-state">
          El equipo se mostrará cuando conectemos la sesión y los permisos.
        </div>
      </div>

      <div className="form-panel">
        <h2>Autorizar administrador</h2>
        <p>
          Vista previa del formulario. La autorización se habilitará al integrar
          las operaciones seguras del servidor.
        </p>

        <div className="field-grid">
          <div className="field field--full">
            <label htmlFor="staff-user-id">
              ID de usuario de Supabase Auth
            </label>
            <input
              id="staff-user-id"
              type="text"
              placeholder="00000000-0000-0000-0000-000000000000"
              disabled
            />
            <small>UUID de auth.users.id, no correo electrónico.</small>
          </div>

          <div className="field field--full">
            <label htmlFor="staff-name">Nombre para mostrar</label>
            <input
              id="staff-name"
              type="text"
              placeholder="Ej. Camilo Restrepo"
              disabled
            />
          </div>

          <div className="field">
            <label htmlFor="staff-role">Rol</label>
            <select id="staff-role" disabled>
              <option>Admin</option>
              <option>Editor</option>
            </select>
          </div>

          <div className="field">
            <label htmlFor="staff-status">Estado inicial</label>
            <select id="staff-status" disabled>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        <div className="panel-actions">
          <button type="button" className="btn btn--gold" disabled>
            Autorizar acceso
          </button>
        </div>
      </div>
    </section>
  );
}

export default AdminTeam;
