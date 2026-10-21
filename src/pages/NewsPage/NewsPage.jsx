import { useEffect, useMemo, useRef, useState } from "react";
import { Plus } from "lucide-react"

import { NEWS, CATEGORIES, ROTATIONS, AGENDA_ROTATIONS, AGENDA_ORDER } from "./NewsFake";

import { STAR_POINTS, useCountdown } from "./NewsUtils";

import NewsPosterContent from "./NewsPosterContent";

import NewsCreateModal from "./NewsCreateModal";

import "./NewsPage.css";

function NewsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [customNews, setCustomNews] = useState(() => {
    try {
      const saved = localStorage.getItem("arte-maestro-custom-news");

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const newsItems = useMemo(() => [...NEWS, ...customNews], [customNews]);
  const [activeCategory, setActiveCategory] = useState("todo");

  const [activeNews, setActiveNews] = useState(null);

  const closeButtonRef = useRef(null);
  const lastFocusRef = useRef(null);

  const countdown = useCountdown("2026-11-07T19:00:00-05:00");

  const featuredNews = useMemo(
    () => NEWS.find((news) => news.featured),
    [newsItems],
  );

  const wallNews = useMemo(
    () => NEWS.filter((news) => !news.featured),
    [newsItems],
  );

  const newsById = useMemo(
    () => Object.fromEntries(newsItems.map((news) => [news.id, news])),
    [newsItems],
  );

  const agendaNews = useMemo(
    () =>
      AGENDA_ORDER.map((id) => newsById[id]).filter(
        (news) => news && Array.isArray(news.leaf),
      ),
    [newsById],
  );

  const filteredNews = useMemo(() => {
    if (activeCategory === "todo") {
      return wallNews;
    }

    return wallNews.filter((news) => news.cat === activeCategory);
  }, [activeCategory, wallNews]);

  const todayLabel = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const value = formatter.format(new Date());

    return value.charAt(0).toUpperCase() + value.slice(1);
  }, []);

  const stickerDate = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("es-CO", {
      day: "2-digit",
      month: "2-digit",
    });

    return formatter.format(new Date()).replace("/", "·");
  }, []);

  const openNews = (news) => {
    if (!news) return;

    lastFocusRef.current = document.activeElement;

    setActiveNews(news);
  };

  const closeNews = () => {
    setActiveNews(null);

    window.setTimeout(() => {
      lastFocusRef.current?.focus?.();
    }, 0);
  };

  useEffect(() => {
    if (!activeNews) {
      document.body.style.overflow = "";

      return undefined;
    }

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeNews();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeNews]);

  useEffect(() => {
    localStorage.setItem(
      "arte-maestro-custom-news",
      JSON.stringify(customNews),
    );
  }, [customNews]);

  if (!featuredNews) {
    return null;
  }

  const createNews = (news) => {
    setCustomNews((current) => [news, ...current]);

    setActiveCategory("todo");
  };

  return (
    <main className="news-page">
      {/* =========================
          CABECERA / EL MURO
      ========================== */}
      <header className="news-mast">
        <div className="news-mast__top">
          <span className="eyebrow">Arte Maestro · Medellín</span>

          <span className="eyebrow">{todayLabel}</span>
        </div>

        <h1 className="news-mast__title" aria-label="El Muro">
          <span className="news-mast__el" aria-hidden="true">
            EL
          </span>

          <span className="news-mast__word" aria-hidden="true">
            <span className="news-mast__m">M</span>

            <span className="news-mast__u">U</span>

            <span className="news-mast__r">R</span>

            <span className="news-mast__vinyl" />
          </span>
        </h1>

        <p className="news-mast__subtitle">
          Fechas, estrenos, crónicas, convocatorias y avisos de los artistas de
          Arte Maestro, pegados en un solo muro. Toca cualquier afiche para
          leerlo completo.
          <span className="news-scribble">¡se actualiza cada semana!</span>
        </p>

        <div
          className="news-mast__sticker"
          aria-label={`Última hora, ${stickerDate}`}
        >
          <span>ÚLTIMA HORA</span>
          <strong>{stickerDate}</strong>
        </div>
      </header>

      {/* =========================
          TICKER
      ========================== */}
      <section className="news-ticker" aria-label="Titulares">
        <div className="news-ticker__track">
          {[0, 1].map((copyIndex) => (
            <div
              className="news-ticker__set"
              key={copyIndex}
              aria-hidden={copyIndex === 1 ? "true" : undefined}
            >
              {NEWS.map((news) => (
                <span key={news.id}>{news.ticker}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      <div className="news-stage">
        {/* =========================
            NOTICIA DESTACADA
        ========================== */}
        <section className="news-feature" aria-labelledby="news-feature-title">
          <article className="news-flyer">
            <div className="news-flyer__main">
              <span className="news-kicker">{featuredNews.kicker}</span>

              <h2 id="news-feature-title">
                Noche de
                <br />
                Tambores
              </h2>

              <p className="news-flyer__lineup">
                <span>School MC</span>
                <span>Yurumí</span>
                <span>Lucía Cuama</span>
              </p>

              <p className="news-flyer__meta">
                Sábado 7 de noviembre · 7:00 p. m.
                <br />
                Casa Arte Maestro · barrio Prado
              </p>

              <p className="news-scribble">
                ¡llega temprano, el aforo es de 600!
              </p>
            </div>

            <aside className="news-flyer__side">
              <div className="news-flyer__date" aria-hidden="true">
                <b>07</b>
                <span>NOV</span>
              </div>

              <p className="news-countdown__label">Faltan</p>

              <div
                className="news-countdown"
                role="timer"
                aria-label="Cuenta regresiva para Noche de Tambores"
              >
                <div>
                  <b>{countdown.days}</b>
                  <small>días</small>
                </div>

                <div>
                  <b>{countdown.hours}</b>
                  <small>horas</small>
                </div>

                <div>
                  <b>{countdown.minutes}</b>
                  <small>min</small>
                </div>

                <div>
                  <b>{countdown.seconds}</b>
                  <small>seg</small>
                </div>
              </div>

              <button
                className="btn btn--gold"
                type="button"
                onClick={() => openNews(featuredNews)}
              >
                Ver detalles
              </button>
            </aside>

            <div
              className="news-flyer__price"
              style={{
                "--news-star": STAR_POINTS,
              }}
            >
              Entradas
              <b>$45.000</b>
              desde
            </div>
          </article>
        </section>

        {/* =========================
            AGENDA
        ========================== */}
        <section className="news-agenda" aria-labelledby="news-agenda-title">
          <div className="news-section-head">
            <div>
              <span className="eyebrow">Agenda</span>

              <h2 id="news-agenda-title">Lo que viene</h2>
            </div>

            <span className="news-scribble">desliza, hay más fechas →</span>
          </div>

          <ol className="news-agenda__list">
            {agendaNews.map((news, index) => {
              const [month, day, weekday, title] = news.leaf;

              return (
                <li key={news.id}>
                  <button
                    className="news-agenda-card"
                    type="button"
                    onClick={() => openNews(news)}
                    style={{
                      "--news-rotate": `${
                        AGENDA_ROTATIONS[index % AGENDA_ROTATIONS.length]
                      }deg`,
                    }}
                  >
                    <span className="news-agenda-card__month">{month}</span>

                    <b>{day}</b>

                    <span className="news-agenda-card__weekday">{weekday}</span>

                    <em>{title}</em>
                  </button>
                </li>
              );
            })}
          </ol>
        </section>

        {/* =========================
            MURO
        ========================== */}
        <section className="news-wall-head" aria-labelledby="news-wall-title">
          <div className="news-section-head">
            <div>
              <span className="eyebrow">Pegado esta semana</span>

              <h2 id="news-wall-title">El muro</h2>
            </div>

            <span className="news-scribble">
              todo lo que pasa, pasó o va a pasar
            </span>
            <button
              className="btn btn--gold news-add-button"
              type="button"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus size={16} />
              Nueva noticia
            </button>
          </div>

          <div
            className="news-filters"
            role="group"
            aria-label="Filtrar noticias por tipo"
          >
            {CATEGORIES.map(([id, label]) => {
              const count =
                id === "todo"
                  ? wallNews.length
                  : wallNews.filter((news) => news.cat === id).length;

              return (
                <button
                  className="news-filter"
                  type="button"
                  key={id}
                  aria-pressed={activeCategory === id}
                  onClick={() => setActiveCategory(id)}
                >
                  {label}

                  <sup>{count}</sup>
                </button>
              );
            })}
          </div>
        </section>

        <section className="news-wall" aria-label="Noticias de Arte Maestro">
          {filteredNews.map((news, index) => (
            <article
              className={`news-poster news-poster--${news.type}${
                news.tape ? " news-poster--taped" : ""
              }`}
              key={news.id}
              style={{
                "--news-rotate": `${ROTATIONS[index % ROTATIONS.length]}deg`,
                "--news-tape-rotate": `${index % 2 ? 5 : -5}deg`,
              }}
            >
              <NewsPosterContent news={news} />

              <button
                className="news-poster__open"
                type="button"
                onClick={() => openNews(news)}
                aria-label={`Leer: ${news.title}`}
              />
            </article>
          ))}
        </section>

        <p className="news-page__note">
          Contenido de ejemplo para la maqueta de Noticias de Arte Maestro. Más
          adelante estas publicaciones podrán venir desde datos reales o desde
          backend.
        </p>
      </div>

      {/* =========================
          MODAL
      ========================== */}
      {activeNews && (
        <div
          className="news-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
        >
          <button
            className="news-modal__scrim"
            type="button"
            aria-label="Cerrar noticia"
            onClick={closeNews}
          />

          <article className="news-modal__sheet">
            <button
              ref={closeButtonRef}
              className="news-modal__close"
              type="button"
              onClick={closeNews}
              aria-label="Cerrar"
            >
              ×
            </button>

            {activeNews.kicker && (
              <span className="news-kicker">{activeNews.kicker}</span>
            )}

            <h2 id="news-modal-title">{activeNews.title}</h2>

            {activeNews.meta && (
              <p className="news-modal__meta">{activeNews.meta}</p>
            )}

            {Array.isArray(activeNews.body) && activeNews.body.length > 0 && (
              <div className="news-modal__body">
                {activeNews.body.map((paragraph, index) => (
                  <p key={`${activeNews.id}-body-${index}`}>{paragraph}</p>
                ))}
              </div>
            )}

            {Array.isArray(activeNews.facts) && activeNews.facts.length > 0 && (
              <dl className="news-modal__facts">
                {activeNews.facts.map(([label, value]) => (
                  <div key={`${label}-${value}`}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <p className="news-modal__note">
              Contenido de ejemplo para la maqueta de Arte Maestro.
            </p>
          </article>
        </div>
      )}

      <NewsCreateModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createNews}
      />
    </main>
  );
}

export default NewsPage;
