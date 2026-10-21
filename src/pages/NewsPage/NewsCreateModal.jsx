import { useState } from "react";

import { CARD_TYPES, CATEGORY_OPTIONS, INITIAL_FORM } from "./NewsFake";

function getInitials(value = "") {
  if (!value.trim()) {
    return "AM";
  }

  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function buildNewsByType(form) {
  const currentYear = String(new Date().getFullYear());

  const common = {
    id: `custom-news-${Date.now()}`,

    custom: true,

    cat: form.cat,
    type: form.type,

    title: form.title.trim(),

    kicker: form.kicker.trim() || "Noticias · Arte Maestro",

    ticker: form.ticker.trim() || form.title.trim(),

    meta: form.meta.trim() || "Publicado en Arte Maestro",

    body: [form.body1.trim() || form.summary.trim(), form.body2.trim()].filter(
      Boolean,
    ),

    facts: [
      [
        "Categoría",
        CATEGORY_OPTIONS.find(([id]) => id === form.cat)?.[1] || form.cat,
      ],
      ["Artista", form.artist.trim() || "Arte Maestro"],
    ],
  };

  const artist = form.artist.trim() || "Arte Maestro";

  const summary = form.summary.trim() || form.title.trim();

  switch (form.type) {
    case "clip":
      return {
        ...common,

        mono: getInitials(artist),

        stamp: "NUEVO",

        dek: summary,

        stats: [
          ["—", "fecha"],
          ["—", "dato"],
          ["AM", "archivo"],
        ],

        pull: `«${summary}»`,
      };

    case "vinyl":
      return {
        ...common,

        mono: getInitials(artist),

        by: artist,

        when: form.meta || "Próximamente",

        tracks: ["Tema 01", "Tema 02", "Tema 03"],
      };

    case "video":
      return {
        ...common,

        by: artist,

        when: form.meta || "Estreno próximamente",
      };

    case "sticky":
      return {
        ...common,

        short: summary,

        price: "Más información",
      };

    case "ticket":
      return {
        ...common,

        deadline: "NUEVO",

        reqs: [
          summary,
          "Consulta todos los detalles",
          "Información en Arte Maestro",
        ],
      };

    case "medal":
      return {
        ...common,

        sub: summary,
      };

    case "route":
      return {
        ...common,

        stops: [[artist, form.meta || "Fecha por confirmar"]],
      };

    case "collab":
      return {
        ...common,

        song: form.title,

        line: summary || "Nueva colaboración",
      };

    case "press":
      return {
        ...common,

        items: [[artist, summary]],
      };

    case "big":
      return {
        ...common,

        num: "NUEVO",

        label: "en Arte Maestro",

        track: summary,
      };

    case "hazard":
      return {
        ...common,

        oldD: "Antes",

        newD: "Ahora",

        note: summary,
      };

    case "polaroid":
      return {
        ...common,

        year: currentYear,

        cap: summary,
      };

    case "tag":
      return {
        ...common,

        price: "Próximamente",

        tagline: summary,

        units: ["Edición especial", "Arte Maestro"],
      };

    case "notebook":
      return {
        ...common,

        lines: [summary],

        when: form.meta || "Fecha por anunciar",
      };

    case "quote":
      return {
        ...common,

        text: summary,

        who: artist,
      };

    case "burst":
      return {
        ...common,

        short: summary,
      };

    case "live":
      return {
        ...common,

        station: artist,

        when: form.meta || "Próximamente",
      };

    case "memorial":
      return {
        ...common,

        when: form.meta || "Memoria Arte Maestro",
      };

    case "receipt":
      return {
        ...common,

        lines: [
          ["Noticia", form.title],
          ["Artista", artist],
        ],

        total: ["Estado", "Publicada"],
      };

    default:
      return common;
  }
}

function NewsCreateModal({ open, onClose, onCreate }) {
  const [form, setForm] = useState(INITIAL_FORM);

  if (!open) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,

      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    const news = buildNewsByType(form);

    onCreate(news);

    setForm(INITIAL_FORM);

    onClose();
  };

  return (
    <div
      className="news-create"
      role="dialog"
      aria-modal="true"
      aria-labelledby="news-create-title"
    >
      <button
        className="news-create__scrim"
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
      />

      <form className="news-create__panel" onSubmit={handleSubmit}>
        <header className="news-create__header">
          <div>
            <span className="eyebrow">Administración</span>

            <h2 id="news-create-title">Nueva noticia</h2>
          </div>

          <button
            className="news-create__close"
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>

        <div className="news-create__field">
          <label htmlFor="news-type">Tipo de card</label>

          <select
            id="news-type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {CARD_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>

          <small>
            El tipo seleccionado determina automáticamente el diseño que se verá
            en el muro.
          </small>
        </div>

        <div className="news-create__field">
          <label htmlFor="news-category">Categoría</label>

          <select
            id="news-category"
            name="cat"
            value={form.cat}
            onChange={handleChange}
          >
            {CATEGORY_OPTIONS.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-title">Título *</label>

          <input
            id="news-title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej. School MC estrena nuevo sencillo"
            required
          />
        </div>

        <div className="news-create__field">
          <label htmlFor="news-kicker">Etiqueta superior</label>

          <input
            id="news-kicker"
            name="kicker"
            type="text"
            value={form.kicker}
            onChange={handleChange}
            placeholder="Ej. Estreno · Música"
          />
        </div>

        <div className="news-create__field">
          <label htmlFor="news-artist">Artista / proyecto</label>

          <input
            id="news-artist"
            name="artist"
            type="text"
            value={form.artist}
            onChange={handleChange}
            placeholder="School MC"
          />
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-summary">Resumen</label>

          <textarea
            id="news-summary"
            name="summary"
            value={form.summary}
            onChange={handleChange}
            rows="3"
            placeholder="Texto corto que aparecerá en la card."
          />
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-meta">Fecha / lugar / dato complementario</label>

          <input
            id="news-meta"
            name="meta"
            type="text"
            value={form.meta}
            onChange={handleChange}
            placeholder="15 de noviembre · Medellín"
          />
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-ticker">Titular para la franja</label>

          <input
            id="news-ticker"
            name="ticker"
            type="text"
            value={form.ticker}
            onChange={handleChange}
            placeholder="Si lo dejas vacío se usa el título."
          />
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-body-1">Contenido de la noticia</label>

          <textarea
            id="news-body-1"
            name="body1"
            value={form.body1}
            onChange={handleChange}
            rows="4"
            placeholder="Primer párrafo."
          />
        </div>

        <div className="news-create__field news-create__field--full">
          <label htmlFor="news-body-2">Segundo párrafo</label>

          <textarea
            id="news-body-2"
            name="body2"
            value={form.body2}
            onChange={handleChange}
            rows="4"
            placeholder="Segundo párrafo opcional."
          />
        </div>

        <footer className="news-create__actions">
          <button className="btn btn--outline" type="button" onClick={onClose}>
            Cancelar
          </button>

          <button className="btn btn--gold" type="submit">
            Publicar noticia
          </button>
        </footer>
      </form>
    </div>
  );
}

export default NewsCreateModal;
