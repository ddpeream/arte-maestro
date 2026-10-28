import { useState } from "react";

import ArtistImagePicker from "./ArtistImagePicker";

import {
  useCreateArtistGalleryItemMutation,
  useUpdateArtistGalleryItemMutation,
  usePublishArtistGalleryItemMutation,
  useArchiveArtistGalleryItemMutation,
  useRestoreArtistGalleryItemMutation,
} from "../../api/artistGalleryMutations";

const EMPTY_FORM = {
  caption: "",
  sort_order: 0,
  image_file: null,
};

// Administra las fotografías de galería del artista.
function ArtistGalleryEditor({ artistId, gallery = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistGalleryItemMutation();

  const updateMutation = useUpdateArtistGalleryItemMutation();

  const publishMutation = usePublishArtistGalleryItemMutation();

  const archiveMutation = useArchiveArtistGalleryItemMutation();

  const restoreMutation = useRestoreArtistGalleryItemMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const editingItem = gallery.find((item) => item.id === editingId);

  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEditing(item) {
    setEditingId(item.id);

    setForm({
      caption: item.caption ?? "",
      sort_order: item.sort_order ?? 0,
      image_file: null,
    });

    setNotice("");
  }

  async function saveItem() {
    if (!editingId && !form.image_file) {
      setNotice("Selecciona una imagen para agregarla a la galería.");

      return;
    }

    if (isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            caption: form.caption,
            sort_order: Number(form.sort_order || 0),
            image_file: form.image_file,
          },
        });

        setNotice("Imagen de galería actualizada correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          caption: form.caption,

          sortOrder: Number(form.sort_order || 0),

          imageFile: form.image_file,
        });

        setNotice("Imagen agregada correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando imagen de galería:", error);

      setNotice(error?.message || "No fue posible guardar la imagen.");
    }
  }

  async function publishItem(item) {
    try {
      await publishMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice("Imagen publicada correctamente.");
    } catch {
      setNotice("No fue posible publicar la imagen.");
    }
  }

  async function archiveItem(item) {
    try {
      await archiveMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice("Imagen archivada correctamente.");
    } catch {
      setNotice("No fue posible archivar la imagen.");
    }
  }

  async function restoreItem(item) {
    try {
      await restoreMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice("Imagen recuperada como borrador.");
    } catch {
      setNotice("No fue posible recuperar la imagen.");
    }
  }

  const orderedGallery = [...gallery].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-gallery-editor">
      <h3>Galería</h3>

      <p>
        Agrega fotografías del artista. Puedes registrar tantas imágenes como
        necesites.
      </p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field field--full">
          <label htmlFor="gallery-caption">Descripción</label>

          <input
            id="gallery-caption"
            type="text"
            value={form.caption}
            placeholder="Descripción breve de la fotografía"
            onChange={(event) => updateForm("caption", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="gallery-sort-order">Orden</label>

          <input
            id="gallery-sort-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>
      </div>

      <ArtistImagePicker
        label="Fotografía"
        file={form.image_file}
        currentUrl={editingItem?.image_url ?? ""}
        onChange={(file) => updateForm("image_file", file)}
      />

      <div className="panel-actions">
        {editingId && (
          <button
            type="button"
            className="btn btn--outline"
            onClick={resetForm}
            disabled={isSaving}
          >
            Cancelar edición
          </button>
        )}

        <button
          type="button"
          className="btn btn--gold"
          onClick={saveItem}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar imagen"
              : "Agregar imagen"}
        </button>
      </div>

      {orderedGallery.length > 0 && (
        <div className="artist-gallery-editor__list">
          {orderedGallery.map((item) => (
            <article key={item.id} className="artist-gallery-editor__item">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.caption || "Imagen de galería"}
                  width="120"
                  loading="lazy"
                />
              )}

              <div>
                <strong>{item.caption || "Sin descripción"}</strong>

                <p>Orden: {item.sort_order ?? 0}</p>

                <small>
                  {item.publication_status === "published"
                    ? "Publicado"
                    : item.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-gallery-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(item)}
                >
                  Editar
                </button>

                {item.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishItem(item)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {item.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveItem(item)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {item.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreItem(item)}
                    disabled={restoreMutation.isPending}
                  >
                    Recuperar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ArtistGalleryEditor;
