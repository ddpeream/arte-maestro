import { useEffect, useState } from "react";

import ArtistFormField from "./ArtistFormField";
import ArtistImagePicker from "./ArtistImagePicker";
import ArtistStatsEditor from "./ArtistStatsEditor";
import { SLUG_REGEX, getArtistFormValues, slugify } from "../../utils/artistFormUtils";

// Presenta el formulario para crear o editar artistas.
function ArtistModal({
  open,
  artist,
  onClose,
  onCreate,
  onUpdate,
  onRefreshArtist,
  isLoading = false,
}) {
  const [form, setForm] = useState(() => getArtistFormValues(artist));
  const [slugTouched, setSlugTouched] = useState(() => Boolean(artist));
  const [genreInput, setGenreInput] = useState("");
  const isEditing = Boolean(artist);

  // Actualiza un campo del formulario.
  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  // Cierra el formulario con Escape.
  useEffect(() => {
    if (!open) return;

    function onEscape(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", onEscape);

    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);

  // Agrega un género sin duplicados.
  function addGenre() {
    const genre = genreInput.trim();

    if (
      genre &&
      !form.genres.some((item) => item.toLowerCase() === genre.toLowerCase())
    ) {
      update("genres", [...form.genres, genre]);
    }

    setGenreInput("");
  }

  // Prepara y guarda el artista según esté creando o editando.
  async function submit(event) {
    event.preventDefault();

    if (!SLUG_REGEX.test(form.slug) || isLoading) {
      return;
    }

    const payload = {
      ...form,

      name: form.name.trim(),
      slug: form.slug.trim(),

      founded_year: form.founded_year === "" ? null : Number(form.founded_year),

      sort_order: Number(form.sort_order || 0),

      biography: form.biography
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    };

    if (isEditing) {
      await onUpdate(artist.id, payload);
    } else {
      await onCreate(payload);
    }
  }

  if (!open) return null;

  return (
    <div className="modal is-open" role="presentation">
      <button
        type="button"
        className="modal__scrim"
        onClick={onClose}
        aria-label="Cerrar formulario"
      />

      <div
        className="modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-artist-title"
      >
        <div className="modal__header">
          <div>
            <span className="eyebrow">
              {isEditing ? "Editar registro" : "Nuevo registro"}
            </span>

            <h2 id="admin-artist-title">
              {isEditing ? "Editar artista" : "Agregar artista"}
            </h2>
          </div>

          <button
            type="button"
            className="modal__close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        <form className="form-sections" onSubmit={submit}>
          <section>
            <h3>Identidad</h3>

            <div className="field-grid">
              <ArtistFormField label="Nombre *">
                <input
                  required
                  maxLength={160}
                  value={form.name}
                  onChange={(event) => {
                    const name = event.target.value;

                    setForm((current) => ({
                      ...current,
                      name,
                      slug: slugTouched ? current.slug : slugify(name),
                    }));
                  }}
                />
              </ArtistFormField>

              <ArtistFormField
                label="Slug *"
                error={Boolean(form.slug) && !SLUG_REGEX.test(form.slug)}
              >
                <input
                  required
                  maxLength={160}
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  value={form.slug}
                  onChange={(event) => {
                    setSlugTouched(true);
                    update("slug", event.target.value);
                  }}
                />
                <small>Solo minúsculas, números y guiones simples.</small>
              </ArtistFormField>

              <ArtistFormField label="Ciudad">
                <input
                  placeholder="Medellín"
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                />
              </ArtistFormField>

              <ArtistFormField label="País (código, 2 letras)">
                <input
                  maxLength={2}
                  placeholder="CO"
                  value={form.country_code}
                  onChange={(event) =>
                    update("country_code", event.target.value.toUpperCase())
                  }
                />
              </ArtistFormField>

              <ArtistFormField label="Año de formación">
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={form.founded_year}
                  onChange={(event) =>
                    update("founded_year", event.target.value)
                  }
                />
              </ArtistFormField>

              <ArtistFormField label="Orden de aparición">
                <input
                  type="number"
                  min="0"
                  value={form.sort_order}
                  onChange={(event) => update("sort_order", event.target.value)}
                />
              </ArtistFormField>
            </div>
          </section>

          <section>
            <h3>Presentación</h3>

            <div className="field-grid">
              <ArtistFormField label="Descripción corta" full>
                <textarea
                  rows={2}
                  placeholder="Una línea que resuma al artista"
                  value={form.short_description}
                  onChange={(event) =>
                    update("short_description", event.target.value)
                  }
                />
                <small>
                  Obligatoria para publicar más adelante, no para guardar el
                  borrador.
                </small>
              </ArtistFormField>

              <ArtistFormField label="Concepto" full>
                <input
                  placeholder="Ej. Trap de barrio con raíz popular"
                  value={form.concept}
                  onChange={(event) => update("concept", event.target.value)}
                />
              </ArtistFormField>

              <ArtistFormField label="Tagline" full>
                <input
                  placeholder="Frase corta de impacto"
                  value={form.tagline}
                  onChange={(event) => update("tagline", event.target.value)}
                />
              </ArtistFormField>

              <ArtistFormField label="Cita destacada" full>
                <input
                  placeholder="Una frase del propio artista"
                  value={form.quote}
                  onChange={(event) => update("quote", event.target.value)}
                />
              </ArtistFormField>

              <ArtistFormField label="Descripción larga" full>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                />
              </ArtistFormField>
            </div>
          </section>

          <section>
            <h3>Géneros</h3>

            <div className="field">
              <div className="chip-input">
                {form.genres.map((genre) => (
                  <span className="chip" key={genre}>
                    {genre}

                    <button
                      type="button"
                      onClick={() =>
                        update(
                          "genres",
                          form.genres.filter((item) => item !== genre),
                        )
                      }
                      aria-label={`Quitar ${genre}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  value={genreInput}
                  placeholder="Escribe un género y Enter"
                  onChange={(event) => setGenreInput(event.target.value)}
                  onBlur={addGenre}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === ",") {
                      event.preventDefault();
                      addGenre();
                    }
                  }}
                />
              </div>

              <small>Enter o coma para agregar cada género.</small>
            </div>
          </section>

          <section>
            <h3>Biografía</h3>

            <div className="repeater">
              {form.biography.map((paragraph, index) => (
                <div className="repeater__item" key={index}>
                  <textarea
                    rows={3}
                    aria-label={`Párrafo ${index + 1}`}
                    value={paragraph}
                    onChange={(event) =>
                      update(
                        "biography",
                        form.biography.map((item, i) =>
                          i === index ? event.target.value : item,
                        ),
                      )
                    }
                  />

                  <button
                    type="button"
                    className="repeater__remove"
                    disabled={form.biography.length === 1}
                    onClick={() =>
                      update(
                        "biography",
                        form.biography.filter((_, i) => i !== index),
                      )
                    }
                    aria-label="Quitar párrafo"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="repeater__add"
              onClick={() => update("biography", [...form.biography, ""])}
            >
              + Agregar párrafo
            </button>
          </section>

          <section>
            <h3>Imágenes</h3>

            <div className="field-grid">
              <ArtistImagePicker
                label="Imagen principal (Hero)"
                file={form.hero_file}
                currentUrl={artist?.hero_url ?? ""}
                onChange={(file) => update("hero_file", file)}
              />

              <ArtistImagePicker
                label="Imagen destacada (Home)"
                file={form.featured_file}
                currentUrl={artist?.featured_url ?? ""}
                onChange={(file) => update("featured_file", file)}
              />
            </div>
          </section>

          <section>
            <h3>Publicación</h3>

            <div className="field-grid">
              <ArtistFormField label="Marcar como destacado">
                <select
                  value={String(form.is_featured)}
                  onChange={(event) =>
                    update("is_featured", event.target.value === "true")
                  }
                >
                  <option value="false">No</option>
                  <option value="true">Sí</option>
                </select>
              </ArtistFormField>
            </div>

            <p className="admin-draft-hint">
              {isEditing ? (
                <>Los cambios actualizarán la información actual del artista.</>
              ) : (
                <>
                  El artista se crea como <b>borrador</b>. La publicación es un
                  paso posterior.
                </>
              )}
            </p>
          </section>
          {isEditing && (
            <ArtistStatsEditor
              artistId={artist.id}
              stats={artist.stats ?? []}
              onChanged={onRefreshArtist}
            />
          )}
          <div className="panel-actions">
            <button
              type="button"
              className="btn btn--outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="btn btn--gold"
              disabled={isLoading}
            >
              {isLoading
                ? "Guardando..."
                : isEditing
                  ? "Guardar cambios"
                  : "Guardar borrador"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ArtistModal;
