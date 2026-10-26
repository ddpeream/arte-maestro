import { useEffect, useId, useState } from "react";

const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const EMPTY_ARTIST = {
  name: "", slug: "", city: "", country_code: "", founded_year: "", sort_order: 0,
  short_description: "", concept: "", tagline: "", quote: "", description: "",
  genres: [], biography: [""], is_featured: false, hero_file: null, featured_file: null,
};

function slugify(text) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function AdminArtists({ artists, onAdd }) {
  return (
    <section className="admin-section is-active">
      <div className="admin-section__head">
        <div><span className="eyebrow">Gestión de contenido</span><h1>Artistas</h1>
          <p>Cada artista se crea como borrador. Publicarlo es una acción aparte, una vez tenga al menos una descripción corta.</p>
        </div>
        <button type="button" className="btn btn--gold" onClick={onAdd}>+ Agregar artista</button>
      </div>
      <div className="admin-note"><span>ⓘ</span><span>Vista local de prueba: los registros agregados no se envían a Supabase y se perderán al recargar la página.</span></div>
      <div className="artists-table-wrap">
        <div className="artists-table-head"><span>Artista</span><span>Slug</span><span>Estado</span><span>Destacado</span><span>Creado</span></div>
        {artists.map((artist) => (
          <div className="artist-row" key={artist.id}>
            <div className="artist-row__name"><div className="artist-row__thumb" /><div><strong>{artist.name}</strong><span>{artist.city || "Sin ciudad"}</span></div></div>
            <span className="muted">/{artist.slug}</span><span className="status-pill status-pill--draft">Borrador</span>
            <span className="muted">{artist.is_featured ? "Sí" : "No"}</span>
            <span className="muted">{new Date(artist.created_at).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}</span>
          </div>
        ))}
        {artists.length === 0 && <div className="empty-state">Todavía no hay artistas cargados. Usa «Agregar artista» para crear el primero.</div>}
      </div>
    </section>
  );
}

export function AdminTeam() {
  return (
    <section className="admin-section is-active">
      <div className="admin-section__head"><div><span className="eyebrow">Solo super admin</span><h1>Equipo</h1>
        <p>Gestión de administradores y editores de Arte Maestro. Esta sección es una maqueta sin autorización de usuarios real.</p></div></div>
      <div className="admin-note"><span>⚠</span><span>Antes de autorizar a alguien, debe existir una identidad en <code>Supabase Auth</code>. Los cambios reales de roles se gestionarán de forma segura en <code>staff_accounts</code>, no desde esta maqueta.</span></div>
      <div className="staff-table-wrap"><div className="staff-table-head"><span>Nombre</span><span>Rol</span><span>Estado</span><span>Acciones</span></div>
        <div className="empty-state">El equipo se mostrará cuando conectemos la sesión y los permisos.</div></div>
      <div className="form-panel"><h2>Autorizar administrador</h2><p>Vista previa del formulario. La autorización se habilitará al integrar las operaciones seguras del servidor.</p>
        <div className="field-grid">
          <Field label="ID de usuario de Supabase Auth" full><input type="text" placeholder="00000000-0000-0000-0000-000000000000" disabled /><small>UUID de auth.users.id, no correo electrónico.</small></Field>
          <Field label="Nombre para mostrar" full><input type="text" placeholder="Ej. Camilo Restrepo" disabled /></Field>
          <Field label="Rol"><select disabled><option>Admin</option><option>Editor</option></select></Field>
          <Field label="Estado inicial"><select disabled><option>Activo</option><option>Inactivo</option></select></Field>
        </div><div className="panel-actions"><button type="button" className="btn btn--gold" disabled>Autorizar acceso</button></div>
      </div>
    </section>
  );
}

function Field({ label, full = false, children, error = false }) {
  const id = useId();
  return <div className={`field${full ? " field--full" : ""}${error ? " has-error" : ""}`}>
    <label htmlFor={id}>{label}</label>
    {Array.isArray(children) ? children.map((child, i) => child && typeof child === "object" && child.type !== "small" ? <child.type {...child.props} id={id} key={i} /> : child) : children && typeof children === "object" ? <children.type {...children.props} id={id} /> : children}
  </div>;
}

function ImagePicker({ label, file, onChange }) {
  const [preview, setPreview] = useState("");
  useEffect(() => {
    if (!file) { setPreview(""); return; }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function selectFile(event) {
    const selected = event.target.files?.[0];
    if (!selected) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type) || selected.size > 10 * 1024 * 1024) {
      event.target.value = "";
      window.alert("Selecciona una imagen JPG, PNG o WebP de máximo 10 MiB.");
      return;
    }
    onChange(selected);
  }
  return <div className="field field--full"><label>{label}</label><div className="image-field">
    <div className="image-field__preview">{preview ? <img src={preview} alt="Vista previa" /> : "Sin imagen"}</div>
    <div className="image-field__controls"><input type="file" accept="image/jpeg,image/png,image/webp" onChange={selectFile} /><span className="image-field__meta">JPG, PNG o WebP · máx. 10 MiB</span></div>
  </div></div>;
}

export function ArtistModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(EMPTY_ARTIST);
  const [slugTouched, setSlugTouched] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    if (!open) return;
    function onEscape(event) { if (event.key === "Escape") onClose(); }
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open, onClose]);
  if (!open) return null;

  function addGenre() {
    const genre = genreInput.trim();
    if (genre && !form.genres.some((g) => g.toLowerCase() === genre.toLowerCase())) {
      update("genres", [...form.genres, genre]);
    }
    setGenreInput("");
  }
  function submit(event) {
    event.preventDefault();
    if (!SLUG_REGEX.test(form.slug)) return;
    onCreate({ ...form, name: form.name.trim(), slug: form.slug.trim(),
      founded_year: form.founded_year === "" ? null : Number(form.founded_year),
      sort_order: Number(form.sort_order || 0),
      biography: form.biography.map((p) => p.trim()).filter(Boolean),
      hero_file: undefined, featured_file: undefined });
    setForm(EMPTY_ARTIST);
    setSlugTouched(false);
    setGenreInput("");
  }

  return <div className="modal is-open" role="presentation">
    <button type="button" className="modal__scrim" onClick={onClose} aria-label="Cerrar formulario" />
    <div className="modal__panel" role="dialog" aria-modal="true" aria-labelledby="admin-artist-title">
      <div className="modal__header"><div><span className="eyebrow">Nuevo registro</span><h2 id="admin-artist-title">Agregar artista</h2></div>
        <button type="button" className="modal__close" onClick={onClose} aria-label="Cerrar">×</button></div>
      <form className="form-sections" onSubmit={submit}>
        <section><h3>Identidad</h3><div className="field-grid">
          <Field label="Nombre *"><input required maxLength={160} value={form.name} onChange={(e) => { const name = e.target.value; setForm((current) => ({ ...current, name, slug: slugTouched ? current.slug : slugify(name) })); }} /></Field>
          <Field label="Slug *" error={Boolean(form.slug) && !SLUG_REGEX.test(form.slug)}><input required maxLength={160} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(e) => { setSlugTouched(true); update("slug", e.target.value); }} /><small>Solo minúsculas, números y guiones simples.</small></Field>
          <Field label="Ciudad"><input placeholder="Medellín" value={form.city} onChange={(e) => update("city", e.target.value)} /></Field>
          <Field label="País (código, 2 letras)"><input maxLength={2} placeholder="CO" value={form.country_code} onChange={(e) => update("country_code", e.target.value.toUpperCase())} /></Field>
          <Field label="Año de formación"><input type="number" min="1" max="9999" value={form.founded_year} onChange={(e) => update("founded_year", e.target.value)} /></Field>
          <Field label="Orden de aparición"><input type="number" min="0" value={form.sort_order} onChange={(e) => update("sort_order", e.target.value)} /></Field>
        </div></section>
        <section><h3>Presentación</h3><div className="field-grid">
          <Field label="Descripción corta" full><textarea rows={2} placeholder="Una línea que resuma al artista" value={form.short_description} onChange={(e) => update("short_description", e.target.value)} /><small>Obligatoria para publicar más adelante, no para guardar el borrador.</small></Field>
          <Field label="Concepto" full><input placeholder="Ej. Trap de barrio con raíz popular" value={form.concept} onChange={(e) => update("concept", e.target.value)} /></Field>
          <Field label="Tagline" full><input placeholder="Frase corta de impacto" value={form.tagline} onChange={(e) => update("tagline", e.target.value)} /></Field>
          <Field label="Cita destacada" full><input placeholder="Una frase del propio artista" value={form.quote} onChange={(e) => update("quote", e.target.value)} /></Field>
          <Field label="Descripción larga" full><textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></Field>
        </div></section>
        <section><h3>Géneros</h3><div className="field"><div className="chip-input">
          {form.genres.map((genre) => <span key={genre} className="chip">{genre}<button type="button" onClick={() => update("genres", form.genres.filter((g) => g !== genre))} aria-label={`Quitar ${genre}`}>×</button></span>)}
          <input value={genreInput} placeholder="Escribe un género y Enter" onChange={(e) => setGenreInput(e.target.value)} onBlur={addGenre} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addGenre(); } }} />
        </div><small>Enter o coma para agregar cada género.</small></div></section>
        <section><h3>Biografía</h3><div className="repeater">{form.biography.map((paragraph, index) => <div className="repeater__item" key={index}>
          <textarea rows={3} aria-label={`Párrafo ${index + 1}`} value={paragraph} onChange={(e) => update("biography", form.biography.map((p, i) => i === index ? e.target.value : p))} />
          <button type="button" className="repeater__remove" disabled={form.biography.length === 1} onClick={() => update("biography", form.biography.filter((_, i) => i !== index))} aria-label="Quitar párrafo">×</button>
        </div>)}</div><button type="button" className="repeater__add" onClick={() => update("biography", [...form.biography, ""])}>+ Agregar párrafo</button></section>
        <section><h3>Imágenes</h3><div className="field-grid"><ImagePicker label="Imagen principal (hero)" file={form.hero_file} onChange={(file) => update("hero_file", file)} /><ImagePicker label="Imagen destacada (home)" file={form.featured_file} onChange={(file) => update("featured_file", file)} /></div></section>
        <section><h3>Publicación</h3><div className="field-grid"><Field label="Marcar como destacado"><select value={String(form.is_featured)} onChange={(e) => update("is_featured", e.target.value === "true")}><option value="false">No</option><option value="true">Sí</option></select></Field></div>
          <p className="admin-draft-hint">El artista se crea como <b>borrador</b>. La publicación es un paso posterior.</p></section>
        <div className="panel-actions"><button type="button" className="btn btn--outline" onClick={onClose}>Cancelar</button><button type="submit" className="btn btn--gold">Guardar borrador (local)</button></div>
      </form>
    </div>
  </div>;
}
