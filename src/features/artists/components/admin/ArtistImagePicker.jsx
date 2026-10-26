import { useEffect, useState } from "react";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Selecciona, valida y previsualiza una imagen del artista.
// Si no hay archivo nuevo, puede mostrar la imagen actualmente guardada.
function ArtistImagePicker({ label, file, currentUrl = "", onChange }) {
  const [preview, setPreview] = useState("");

  // Genera una URL temporal cuando el usuario selecciona
  // una imagen nueva y la libera al reemplazarla o desmontar.
  useEffect(() => {
    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    const frame = requestAnimationFrame(() => {
      setPreview(url);
    });

    return () => {
      cancelAnimationFrame(frame);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // La imagen nueva tiene prioridad sobre la ya guardada.
  const displayUrl = preview || currentUrl;

  // Valida formato y tamaño antes de entregar el archivo al formulario.
  function selectFile(event) {
    const selected = event.target.files?.[0];

    if (!selected) {
      return;
    }

    if (
      !ALLOWED_IMAGE_TYPES.includes(selected.type) ||
      selected.size > MAX_IMAGE_SIZE
    ) {
      event.target.value = "";

      window.alert("Selecciona una imagen JPG, PNG o WebP de máximo 10 MiB.");

      return;
    }

    onChange(selected);
  }

  return (
    <div className="field field--full">
      <label>{label}</label>

      <div className="image-field">
        <div className="image-field__preview">
          {displayUrl ? (
            <img src={displayUrl} alt={`${label} — vista previa`} />
          ) : (
            "Sin imagen"
          )}
        </div>

        <div className="image-field__controls">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={selectFile}
            aria-label={label}
          />

          <span className="image-field__meta">
            JPG, PNG o WebP · máx. 10 MiB
          </span>
        </div>
      </div>
    </div>
  );
}

export default ArtistImagePicker;
