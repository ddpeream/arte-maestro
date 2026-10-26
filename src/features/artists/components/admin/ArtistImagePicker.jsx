import { useEffect, useState } from "react";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Selecciona, valida y previsualiza una imagen del artista.
function ArtistImagePicker({ label, file, onChange }) {
  const [preview, setPreview] = useState("");

  // Genera y libera la URL temporal de vista previa.
  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);

    const frame = requestAnimationFrame(() => {
      setPreview(url);
    });

    return () => {
      cancelAnimationFrame(frame);
      URL.revokeObjectURL(url);
    };
  }, [file]);

  // Valida el formato y tamaño de la imagen seleccionada.
  function selectFile(event) {
    const selected = event.target.files?.[0];

    if (!selected) return;

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
          {preview ? <img src={preview} alt="Vista previa" /> : "Sin imagen"}
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
