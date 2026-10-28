import { useState } from "react";

import ArtistImagePicker from "./ArtistImagePicker";

import {
  useCreateArtistReleaseMutation,
  useUpdateArtistReleaseMutation,
  usePublishArtistReleaseMutation,
  useArchiveArtistReleaseMutation,
  useRestoreArtistReleaseMutation,
} from "../../api/artistReleasesMutations";

const EMPTY_FORM = {
  title: "",
  release_type: "album",
  release_year: "",
  url: "",
  sort_order: 0,
  cover_file: null,
};

// Administra la discografía del artista.
function ArtistReleasesEditor({ artistId, releases = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistReleaseMutation();

  const updateMutation = useUpdateArtistReleaseMutation();

  const publishMutation = usePublishArtistReleaseMutation();

  const archiveMutation = useArchiveArtistReleaseMutation();

  const restoreMutation = useRestoreArtistReleaseMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const editingRelease = releases.find((release) => release.id === editingId);

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

  function startEditing(release) {
    setEditingId(release.id);

    setForm({
      title: release.title ?? "",
      release_type: release.release_type ?? "other",
      release_year: release.release_year ?? "",
      url: release.url ?? "",
      sort_order: release.sort_order ?? 0,
      cover_file: null,
    });

    setNotice("");
  }

  async function saveRelease() {
    const title = form.title.trim();
    const url = form.url.trim();

    if (!title || isSaving) {
      return;
    }

    if (url && !/^https:\/\/[^\s]+$/i.test(url)) {
      setNotice("El enlace debe comenzar con https://");

      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            title,
            release_type: form.release_type,
            release_year: form.release_year,
            url,
            sort_order: Number(form.sort_order || 0),
            cover_file: form.cover_file,
          },
        });

        setNotice("Lanzamiento actualizado correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          title,
          releaseType: form.release_type,
          releaseYear: form.release_year,
          url,
          sortOrder: Number(form.sort_order || 0),
          coverFile: form.cover_file,
        });

        setNotice("Lanzamiento creado correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando lanzamiento:", error);

      setNotice(
        editingId
          ? "No fue posible actualizar el lanzamiento."
          : "No fue posible crear el lanzamiento.",
      );
    }
  }

  async function publishRelease(release) {
    try {
      await publishMutation.mutateAsync(release.id);

      await onChanged?.();

      setNotice(`"${release.title}" fue publicado correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${release.title}".`);
    }
  }

  async function archiveRelease(release) {
    try {
      await archiveMutation.mutateAsync(release.id);

      await onChanged?.();

      setNotice(`"${release.title}" fue archivado correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${release.title}".`);
    }
  }

  async function restoreRelease(release) {
    try {
      await restoreMutation.mutateAsync(release.id);

      await onChanged?.();

      setNotice(`"${release.title}" fue recuperado como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${release.title}".`);
    }
  }

  const orderedReleases = [...releases].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-releases-editor">
      <h3>Discografía</h3>

      <p>Agrega álbumes, EP, sencillos y otros lanzamientos del artista.</p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="release-title">Título *</label>

          <input
            id="release-title"
            type="text"
            value={form.title}
            placeholder="Nombre del lanzamiento"
            onChange={(event) => updateForm("title", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="release-type">Tipo</label>

          <select
            id="release-type"
            value={form.release_type}
            onChange={(event) => updateForm("release_type", event.target.value)}
          >
            <option value="album">Álbum</option>

            <option value="ep">EP</option>

            <option value="single">Sencillo</option>

            <option value="other">Otro</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="release-year">Año</label>

          <input
            id="release-year"
            type="number"
            min="1"
            max="9999"
            value={form.release_year}
            placeholder="2026"
            onChange={(event) => updateForm("release_year", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="release-sort-order">Orden</label>

          <input
            id="release-sort-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="release-url">Enlace</label>

          <input
            id="release-url"
            type="url"
            value={form.url}
            placeholder="https://..."
            onChange={(event) => updateForm("url", event.target.value)}
          />
        </div>
      </div>

      <ArtistImagePicker
        label="Carátula"
        file={form.cover_file}
        currentUrl={editingRelease?.cover_url ?? ""}
        onChange={(file) => updateForm("cover_file", file)}
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
          onClick={saveRelease}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar lanzamiento"
              : "Agregar lanzamiento"}
        </button>
      </div>

      {orderedReleases.length > 0 && (
        <div className="artist-releases-editor__list">
          {orderedReleases.map((release) => (
            <article key={release.id} className="artist-releases-editor__item">
              {release.cover_url && (
                <img
                  src={release.cover_url}
                  alt={`Carátula de ${release.title}`}
                  width="90"
                  height="90"
                />
              )}

              <div>
                <strong>{release.title}</strong>

                <p>
                  {release.release_type}

                  {release.release_year ? ` · ${release.release_year}` : ""}
                </p>

                <small>
                  {release.publication_status === "published"
                    ? "Publicado"
                    : release.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-releases-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(release)}
                >
                  Editar
                </button>

                {release.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishRelease(release)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {release.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveRelease(release)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {release.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreRelease(release)}
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

export default ArtistReleasesEditor;
