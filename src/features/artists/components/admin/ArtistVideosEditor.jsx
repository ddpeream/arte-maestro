import { useState } from "react";

import {
  extractYouTubeId,
  getYouTubeThumbnail,
} from "../../api/artistVideosService";

import {
  useCreateArtistVideoMutation,
  useUpdateArtistVideoMutation,
  usePublishArtistVideoMutation,
  useArchiveArtistVideoMutation,
  useRestoreArtistVideoMutation,
} from "../../api/artistVideosMutations";

const EMPTY_FORM = {
  category: "live",
  title: "",
  meta: "",
  youtube_value: "",
  sort_order: 0,
};

// Administra videos en vivo y videoclips del artista.
function ArtistVideosEditor({ artistId, videos = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistVideoMutation();

  const updateMutation = useUpdateArtistVideoMutation();

  const publishMutation = usePublishArtistVideoMutation();

  const archiveMutation = useArchiveArtistVideoMutation();

  const restoreMutation = useRestoreArtistVideoMutation();

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

  function startEditing(video) {
    setEditingId(video.id);

    setForm({
      category: video.category ?? "live",
      title: video.title ?? "",
      meta: video.meta ?? "",

      youtube_value: video.media_asset?.external_id ?? video.youtube_id ?? "",

      sort_order: video.sort_order ?? 0,
    });

    setNotice("");
  }

  async function saveVideo() {
    const title = form.title.trim();

    const youtubeId = extractYouTubeId(form.youtube_value);

    if (!title || !youtubeId || isSaving) {
      if (!youtubeId) {
        setNotice("Ingresa un enlace o ID válido de YouTube.");
      }

      return;
    }

    try {
      if (editingId) {
        const currentVideo = videos.find((video) => video.id === editingId);

        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            category: form.category,
            title,
            meta: form.meta,

            youtube_value: form.youtube_value,

            current_youtube_id:
              currentVideo?.media_asset?.external_id ??
              currentVideo?.youtube_id ??
              "",

            sort_order: Number(form.sort_order || 0),
          },
        });

        setNotice("Video actualizado correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          category: form.category,
          title,
          meta: form.meta,

          youtubeValue: form.youtube_value,

          sortOrder: Number(form.sort_order || 0),
        });

        setNotice("Video creado correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando video:", error);

      setNotice(error?.message || "No fue posible guardar el video.");
    }
  }

  async function publishVideo(video) {
    try {
      await publishMutation.mutateAsync(video.id);

      await onChanged?.();

      setNotice(`"${video.title}" fue publicado correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${video.title}".`);
    }
  }

  async function archiveVideo(video) {
    try {
      await archiveMutation.mutateAsync(video.id);

      await onChanged?.();

      setNotice(`"${video.title}" fue archivado correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${video.title}".`);
    }
  }

  async function restoreVideo(video) {
    try {
      await restoreMutation.mutateAsync(video.id);

      await onChanged?.();

      setNotice(`"${video.title}" fue recuperado como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${video.title}".`);
    }
  }

  const orderedVideos = [...videos].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  const previewYoutubeId = extractYouTubeId(form.youtube_value);

  return (
    <section className="artist-videos-editor">
      <h3>Videos</h3>

      <p>Agrega presentaciones en vivo o videoclips publicados en YouTube.</p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="artist-video-category">Tipo</label>

          <select
            id="artist-video-category"
            value={form.category}
            onChange={(event) => updateForm("category", event.target.value)}
          >
            <option value="live">En vivo</option>

            <option value="clip">Videoclip</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="artist-video-order">Orden</label>

          <input
            id="artist-video-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="artist-video-title">Título *</label>

          <input
            id="artist-video-title"
            type="text"
            value={form.title}
            placeholder="Nombre del video"
            onChange={(event) => updateForm("title", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="artist-video-meta">Información adicional</label>

          <input
            id="artist-video-meta"
            type="text"
            value={form.meta}
            placeholder="Medellín · 2026"
            onChange={(event) => updateForm("meta", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="artist-video-youtube">YouTube *</label>

          <input
            id="artist-video-youtube"
            type="text"
            value={form.youtube_value}
            placeholder="https://www.youtube.com/watch?v=..."
            onChange={(event) =>
              updateForm("youtube_value", event.target.value)
            }
          />

          <span className="field__help">
            Puedes pegar el enlace completo o directamente el ID del video.
          </span>
        </div>
      </div>

      {previewYoutubeId && (
        <div className="artist-videos-editor__preview">
          <img
            src={getYouTubeThumbnail(previewYoutubeId)}
            alt="Vista previa del video"
            loading="lazy"
          />
        </div>
      )}

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
          onClick={saveVideo}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar video"
              : "Agregar video"}
        </button>
      </div>

      {orderedVideos.length > 0 && (
        <div className="artist-videos-editor__list">
          {orderedVideos.map((video) => {
            const youtubeId =
              video.media_asset?.external_id ?? video.youtube_id ?? "";

            return (
              <article key={video.id} className="artist-videos-editor__item">
                {youtubeId && (
                  <img
                    src={getYouTubeThumbnail(youtubeId)}
                    alt={video.title}
                    width="160"
                    loading="lazy"
                  />
                )}

                <div>
                  <strong>{video.title}</strong>

                  <p>
                    {video.category === "live" ? "En vivo" : "Videoclip"}

                    {video.meta ? ` · ${video.meta}` : ""}
                  </p>

                  <small>
                    {video.publication_status === "published"
                      ? "Publicado"
                      : video.publication_status === "archived"
                        ? "Archivado"
                        : "Borrador"}
                  </small>
                </div>

                <div className="artist-videos-editor__actions">
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => startEditing(video)}
                  >
                    Editar
                  </button>

                  {video.publication_status === "draft" && (
                    <button
                      type="button"
                      className="btn btn--gold"
                      onClick={() => publishVideo(video)}
                      disabled={publishMutation.isPending}
                    >
                      Publicar
                    </button>
                  )}

                  {video.publication_status === "published" && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => archiveVideo(video)}
                      disabled={archiveMutation.isPending}
                    >
                      Archivar
                    </button>
                  )}

                  {video.publication_status === "archived" && (
                    <button
                      type="button"
                      className="btn btn--gold"
                      onClick={() => restoreVideo(video)}
                      disabled={restoreMutation.isPending}
                    >
                      Recuperar
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ArtistVideosEditor;
