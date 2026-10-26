// Muestra y permite cerrar los avisos del panel.
function AdminNotice({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="toast is-visible" role="status">
      {message}

      <button
        type="button"
        className="admin-toast-close"
        onClick={onClose}
        aria-label="Cerrar aviso"
      >
        ×
      </button>
    </div>
  );
}

export default AdminNotice;
