import { useState } from "react";

import {
  useCreateArtistPressMutation,
  useUpdateArtistPressMutation,
  usePublishArtistPressMutation,
  useArchiveArtistPressMutation,
  useRestoreArtistPressMutation,
} from "../../api/artistPressMutations";

const EMPTY_FORM = {
  name: "",
  url: "",
  sort_order: 0,
};

// Administra menciones y enlaces de prensa del artista.
function ArtistPressEditor({ artistId, press = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistPressMutation();

  const updateMutation = useUpdateArtistPressMutation();

  const publishMutation = usePublishArtistPressMutation();

  const archiveMutation = useArchiveArtistPressMutation();

  const restoreMutation = useRestoreArtistPressMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

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
      name: item.name ?? "",
      url: item.url ?? "",
      sort_order: item.sort_order ?? 0,
    });

    setNotice("");
  }

  async function savePress() {
    const name = form.name.trim();

    if (!name || isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            name,
            url: form.url,
            sort_order: Number(form.sort_order || 0),
          },
        });

        setNotice("Mención de prensa actualizada correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          name,
          url: form.url,

          sortOrder: Number(form.sort_order || 0),
        });

        setNotice("Mención de prensa creada correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando prensa:", error);

      setNotice(
        error?.message || "No fue posible guardar la mención de prensa.",
      );
    }
  }

  async function publishPress(item) {
    try {
      await publishMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice(`"${item.name}" fue publicado correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${item.name}".`);
    }
  }

  async function archivePress(item) {
    try {
      await archiveMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice(`"${item.name}" fue archivado correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${item.name}".`);
    }
  }

  async function restorePress(item) {
    try {
      await restoreMutation.mutateAsync(item.id);

      await onChanged?.();

      setNotice(`"${item.name}" fue recuperado como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${item.name}".`);
    }
  }

  const orderedPress = [...press].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-press-editor">
      <h3>Prensa</h3>

      <p>
        Agrega medios, publicaciones, entrevistas o menciones relacionadas con
        el artista.
      </p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field field--full">
          <label htmlFor="artist-press-name">Medio o publicación *</label>

          <input
            id="artist-press-name"
            type="text"
            value={form.name}
            placeholder="Radio Nacional de Colombia"
            onChange={(event) => updateForm("name", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="artist-press-url">Enlace</label>

          <input
            id="artist-press-url"
            type="url"
            value={form.url}
            placeholder="https://..."
            onChange={(event) => updateForm("url", event.target.value)}
          />

          <span className="field__help">
            Es opcional. Si existe, debe comenzar por https://
          </span>
        </div>

        <div className="field">
          <label htmlFor="artist-press-order">Orden</label>

          <input
            id="artist-press-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>
      </div>

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
          onClick={savePress}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Agregar prensa"}
        </button>
      </div>

      {orderedPress.length > 0 && (
        <div className="artist-press-editor__list">
          {orderedPress.map((item) => (
            <article key={item.id} className="artist-press-editor__item">
              <div>
                <strong>{item.name}</strong>

                {item.url && (
                  <p>
                    <a href={item.url} target="_blank" rel="noreferrer">
                      Ver enlace
                    </a>
                  </p>
                )}

                <small>
                  {item.publication_status === "published"
                    ? "Publicado"
                    : item.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-press-editor__actions">
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
                    onClick={() => publishPress(item)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {item.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archivePress(item)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {item.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restorePress(item)}
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

export default ArtistPressEditor;
