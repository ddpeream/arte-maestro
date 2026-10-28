import { useState } from "react";

import {
  useCreateArtistLinkMutation,
  useUpdateArtistLinkMutation,
  usePublishArtistLinkMutation,
  useArchiveArtistLinkMutation,
  useRestoreArtistLinkMutation,
} from "../../api/artistLinksMutations";

const EMPTY_FORM = {
  platform: "spotify",
  url: "",
  sort_order: 0,
};

const PLATFORM_OPTIONS = [
  {
    value: "spotify",
    label: "Spotify",
  },
  {
    value: "apple_music",
    label: "Apple Music",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "facebook",
    label: "Facebook",
  },
  {
    value: "tiktok",
    label: "TikTok",
  },
  {
    value: "soundcloud",
    label: "SoundCloud",
  },
  {
    value: "website",
    label: "Sitio web",
  },
];

function getPlatformLabel(platform) {
  return (
    PLATFORM_OPTIONS.find((item) => item.value === platform)?.label ?? platform
  );
}

// Administra las plataformas y enlaces externos del artista.
function ArtistLinksEditor({ artistId, links = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistLinkMutation();

  const updateMutation = useUpdateArtistLinkMutation();

  const publishMutation = usePublishArtistLinkMutation();

  const archiveMutation = useArchiveArtistLinkMutation();

  const restoreMutation = useRestoreArtistLinkMutation();

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

  function startEditing(link) {
    setEditingId(link.id);

    setForm({
      platform: link.platform ?? "spotify",
      url: link.url ?? "",
      sort_order: link.sort_order ?? 0,
    });

    setNotice("");
  }

  async function saveLink() {
    if (!form.url.trim() || isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            platform: form.platform,
            url: form.url,
            sort_order: Number(form.sort_order || 0),
          },
        });

        setNotice("Enlace actualizado correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          platform: form.platform,
          url: form.url,
          sortOrder: Number(form.sort_order || 0),
        });

        setNotice("Enlace creado correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando enlace:", error);

      if (error?.code === "23505") {
        setNotice(
          "Este artista ya tiene un enlace para esa plataforma. Edita el existente.",
        );

        return;
      }

      setNotice(error?.message || "No fue posible guardar el enlace.");
    }
  }

  async function publishLink(link) {
    try {
      await publishMutation.mutateAsync(link.id);

      await onChanged?.();

      setNotice(
        `${getPlatformLabel(link.platform)} fue publicado correctamente.`,
      );
    } catch {
      setNotice(`No fue posible publicar ${getPlatformLabel(link.platform)}.`);
    }
  }

  async function archiveLink(link) {
    try {
      await archiveMutation.mutateAsync(link.id);

      await onChanged?.();

      setNotice(
        `${getPlatformLabel(link.platform)} fue archivado correctamente.`,
      );
    } catch {
      setNotice(`No fue posible archivar ${getPlatformLabel(link.platform)}.`);
    }
  }

  async function restoreLink(link) {
    try {
      await restoreMutation.mutateAsync(link.id);

      await onChanged?.();

      setNotice(
        `${getPlatformLabel(link.platform)} fue recuperado como borrador.`,
      );
    } catch {
      setNotice(`No fue posible recuperar ${getPlatformLabel(link.platform)}.`);
    }
  }

  const orderedLinks = [...links].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-links-editor">
      <h3>Plataformas y redes</h3>

      <p>
        Agrega los canales oficiales del artista: música, redes sociales y sitio
        web.
      </p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="artist-link-platform">Plataforma *</label>

          <select
            id="artist-link-platform"
            value={form.platform}
            onChange={(event) => updateForm("platform", event.target.value)}
          >
            {PLATFORM_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="artist-link-order">Orden</label>

          <input
            id="artist-link-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="artist-link-url">Enlace *</label>

          <input
            id="artist-link-url"
            type="url"
            value={form.url}
            placeholder="https://..."
            onChange={(event) => updateForm("url", event.target.value)}
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
          onClick={saveLink}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar cambios"
              : "Agregar enlace"}
        </button>
      </div>

      {orderedLinks.length > 0 && (
        <div className="artist-links-editor__list">
          {orderedLinks.map((link) => (
            <article key={link.id} className="artist-links-editor__item">
              <div>
                <strong>{getPlatformLabel(link.platform)}</strong>

                <p>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.url}
                  </a>
                </p>

                <small>
                  {link.publication_status === "published"
                    ? "Publicado"
                    : link.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-links-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(link)}
                >
                  Editar
                </button>

                {link.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishLink(link)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {link.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveLink(link)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {link.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreLink(link)}
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

export default ArtistLinksEditor;
