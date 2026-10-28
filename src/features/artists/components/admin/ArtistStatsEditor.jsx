import { useState } from "react";

import {
  useCreateArtistStatMutation,
  useUpdateArtistStatMutation,
  usePublishArtistStatMutation,
  useArchiveArtistStatMutation,
  useRestoreArtistStatMutation,
} from "../../api/artistStatsMutations";

const EMPTY_FORM = {
  value: "",
  label: "",
  sort_order: 0,
};

// Administra las cifras editoriales del portafolio de un artista.
function ArtistStatsEditor({ artistId, stats = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistStatMutation();
  const updateMutation = useUpdateArtistStatMutation();
  const publishMutation = usePublishArtistStatMutation();
  const archiveMutation = useArchiveArtistStatMutation();
  const restoreMutation = useRestoreArtistStatMutation();

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

  function startEditing(stat) {
    setEditingId(stat.id);

    setForm({
      value: stat.value ?? "",
      label: stat.label ?? "",
      sort_order: stat.sort_order ?? 0,
    });

    setNotice("");
  }

  // Crea o actualiza una cifra.
  async function saveStat() {
    const value = form.value.trim();
    const label = form.label.trim();

    if (!value || !label || isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          changes: {
            value,
            label,
            sort_order: Number(form.sort_order || 0),
          },
        });

        await onChanged?.();

        setNotice("Cifra actualizada correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          value,
          label,
          sortOrder: Number(form.sort_order || 0),
        });

        await onChanged?.();

        setNotice("Cifra creada correctamente como borrador.");
      }

      resetForm();
    } catch {
      setNotice(
        editingId
          ? "No fue posible actualizar la cifra."
          : "No fue posible crear la cifra.",
      );
    }
  }

  async function publishStat(stat) {
    try {
      await publishMutation.mutateAsync(stat.id);
      await onChanged?.();

      setNotice(`"${stat.label}" fue publicada correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${stat.label}".`);
    }
  }

  async function archiveStat(stat) {
    try {
      await archiveMutation.mutateAsync(stat.id);
      await onChanged?.();

      setNotice(`"${stat.label}" fue archivada correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${stat.label}".`);
    }
  }

  async function restoreStat(stat) {
    try {
      await restoreMutation.mutateAsync(stat.id);
      await onChanged?.();

      setNotice(`"${stat.label}" fue recuperada como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${stat.label}".`);
    }
  }

  const orderedStats = [...stats].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-stats-editor">
      <h3>Cifras</h3>

      <p className="artist-stats-editor__help">
        Agrega cifras breves para destacar la trayectoria, alcance o impacto del
        artista.
      </p>

      {notice && <p className="artist-stats-editor__notice">{notice}</p>}

      <div className="artist-stats-editor__form">
        <div className="field-grid">
          <div className="field">
            <label htmlFor="artist-stat-value">Valor</label>

            <input
              id="artist-stat-value"
              type="text"
              value={form.value}
              placeholder="+100K"
              onChange={(event) => updateForm("value", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="artist-stat-label">Etiqueta</label>

            <input
              id="artist-stat-label"
              type="text"
              value={form.label}
              placeholder="Reproducciones"
              onChange={(event) => updateForm("label", event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="artist-stat-sort-order">Orden</label>

            <input
              id="artist-stat-sort-order"
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(event) => updateForm("sort_order", event.target.value)}
            />
          </div>
        </div>

        <div className="artist-stats-editor__form-actions">
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
            onClick={saveStat}
            disabled={isSaving}
          >
            {isSaving
              ? "Guardando..."
              : editingId
                ? "Guardar cambios"
                : "Agregar cifra"}
          </button>
        </div>
      </div>

      {orderedStats.length > 0 && (
        <div className="artist-stats-editor__list">
          {orderedStats.map((stat) => (
            <article key={stat.id} className="artist-stats-editor__item">
              <div className="artist-stats-editor__content">
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>

                <small>
                  {stat.publication_status === "published"
                    ? "Publicado"
                    : stat.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-stats-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(stat)}
                >
                  Editar
                </button>

                {stat.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishStat(stat)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {stat.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveStat(stat)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {stat.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreStat(stat)}
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

export default ArtistStatsEditor;
