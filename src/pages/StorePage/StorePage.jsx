import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";

import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Gift,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  Minus,
  Music2,
  Plus,
  Radio,
  ShoppingBag,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";

import { artists } from "../../features/artists/data/artists";
import { serviceGroups, services } from "../../features/services/data/services";
import { useServicesStore } from "../../store/useServicesStore";

import "./StorePage.css";

const serviceIcons = { Sparkles, Music2, MessageSquare, Mic, Video, Radio, Gift, Megaphone };

const moneyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function formatMoney(value) {
  return moneyFormatter.format(value);
}

function getInitials(name = "") {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function StorePage() {
  const [activeGroup, setActiveGroup] = useState("todos");
  const [openServiceId, setOpenServiceId] = useState("showcase");
  const [openMerchId, setOpenMerchId] = useState(null);
  const cart = useServicesStore((state) => state.cart);
  const setCart = useServicesStore((state) => state.setCart);
  const [quotePrepared, setQuotePrepared] = useState(false);

  const catalogRef = useRef(null);
  const quoteRef = useRef(null);

  const artistMap = useMemo(
    () => Object.fromEntries(artists.map((artist) => [artist.id, artist])),
    [],
  );

  const visibleServices = useMemo(() => {
    if (activeGroup === "todos") {
      return services;
    }

    return services.filter((service) => service.group === activeGroup);
  }, [activeGroup]);

  const artistCount = useMemo(() => {
    const ids = services.flatMap((service) =>
      service.offers.filter((offer) => artistMap[offer.artistId]).map((offer) => offer.artistId),
    );

    return new Set(ids).size;
  }, [artistMap]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart).map(([key, item]) => ({
        key,
        ...item,
      })),
    [cart],
  );

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.qty, 0),
    [cartItems],
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((total, item) => total + item.price * item.qty, 0),
    [cartItems],
  );

  const toggleService = (serviceId) => {
    setOpenServiceId((current) => (current === serviceId ? null : serviceId));

    setOpenMerchId(null);
  };

  const toggleMerch = (serviceId, artistId) => {
    const key = `${serviceId}:${artistId}`;

    setOpenMerchId((current) => (current === key ? null : key));
  };

  const toggleServiceInCart = (service, offer, artist) => {
    const key = `service:${service.id}:${offer.artistId}`;

    setQuotePrepared(false);

    setCart((current) => {
      const next = { ...current };

      if (next[key]) {
        delete next[key];

        return next;
      }

      next[key] = {
        artistId: artist.id,
        label: service.title,
        sub: artist.name,
        price: offer.price,
        qty: 1,
        kind: "service",
      };

      return next;
    });
  };

  const addMerch = (artistId, item) => {
    const artist = artistMap[artistId];

    if (!artist) return;

    const key = `merch:${artistId}:${item.id}`;

    setQuotePrepared(false);

    setCart((current) => ({
      ...current,
      [key]: current[key] || {
        artistId,
        label: item.name,
        sub: `Merch · ${artist.name}`,
        price: item.price,
        qty: 1,
        kind: "merch",
      },
    }));
  };

  const updateQuantity = (key, delta) => {
    setQuotePrepared(false);

    setCart((current) => {
      const item = current[key];

      if (!item) return current;

      const nextQuantity = Math.min(99, item.qty + delta);
      const next = { ...current };

      if (nextQuantity <= 0) {
        delete next[key];

        return next;
      }

      next[key] = {
        ...item,
        qty: nextQuantity,
      };

      return next;
    });
  };

  const removeItem = (key) => {
    setQuotePrepared(false);

    setCart((current) => {
      const next = { ...current };

      delete next[key];

      return next;
    });
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  const scrollToQuote = () => {
    quoteRef.current?.focus({ preventScroll: true });
    quoteRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  };

  const quoteRecipients = [...new Set(cartItems
    .map((item) => artistMap[item.artistId]?.contact?.emails?.[0])
    .filter(Boolean))];

  const requestQuote = (event) => {
    event.preventDefault();
    if (!cartItems.length || !quoteRecipients.length) return;
    const data = new FormData(event.currentTarget);
    const lines = cartItems.map((item) =>
      item.label + " — " + item.sub + " × " + item.qty + ": " + formatMoney(item.price * item.qty));
    const body = [
      "Solicitud de cotización — Arte Maestro", "",
      "Nombre: " + data.get("name").trim(),
      "Correo: " + data.get("email").trim(),
      "Ciudad: " + data.get("city").trim(),
      "Fecha: " + (data.get("date") || "Por acordar"),
      "", ...lines, "",
      "Total de referencia: " + formatMoney(totalPrice) + " COP",
      "Catálogo de ejemplo: confirmar precios, productos y disponibilidad.", "",
      "Detalles: " + (data.get("details").trim() || "Sin detalles adicionales."),
    ].join("\n");
    window.location.href = "mailto:" + quoteRecipients.join(",")
      + "?subject=" + encodeURIComponent("Solicitud de cotización — Arte Maestro")
      + "&body=" + encodeURIComponent(body);
    setQuotePrepared(true);
  };

  return (
    <main className="services-page">
      {/* =========================
          HERO
      ========================== */}
      <section className="services-page__hero">
        <div className="services-page__hero-copy">
          <span className="eyebrow">
            Contratación · Circulación · Industria
          </span>

          <h1>
            Tienda
            <span>Servicios y productos de nuestros artistas</span>
          </h1>

          <p>
            Shows, conversatorios, campañas, jingles y experiencias con los
            artistas de Arte Maestro. Elige el servicio, escoge al artista, suma
            su merchandising y arma tu cotización en un solo lugar.
          </p>

          <div className="services-page__hero-actions">
            <button
              className="btn btn--gold"
              type="button"
              onClick={scrollToCatalog}
            >
              Explorar catálogo
              <ArrowRight size={16} />
            </button>

            <Link className="btn btn--outline" to="/artistas">
              Conocer artistas
            </Link>
          </div>
        </div>

        <dl className="services-page__stats">
          <div>
            <dt>Servicios</dt>
            <dd>{services.length}</dd>
          </div>

          <div>
            <dt>Artistas</dt>
            <dd>{artistCount}</dd>
          </div>

          <div>
            <dt>Ciudad</dt>
            <dd>MDE</dd>
          </div>
        </dl>
      </section>

      {/* =========================
          PASOS
      ========================== */}
      <section className="services-page__steps" aria-label="Cómo funciona">
        <article className="services-step">
          <span>01</span>
          <strong>Elige el servicio</strong>
          <p>Showcase, concierto, jingle…</p>
        </article>

        <article className="services-step">
          <span>02</span>
          <strong>Escoge artista</strong>
          <p>Revisa formatos y propuestas.</p>
        </article>

        <article className="services-step">
          <span>03</span>
          <strong>Suma su merch</strong>
          <p>Camisetas, discos y productos.</p>
        </article>

        <article className="services-step">
          <span>04</span>
          <strong>Solicita cotización</strong>
          <p>Te respondemos con la propuesta.</p>
        </article>
      </section>

      {/* =========================
          CATÁLOGO
      ========================== */}
      <section
        className="services-page__catalog"
        id="catalogo"
        ref={catalogRef}
      >
        <div className="services-page__content">
          <header className="services-page__heading">
            <div>
              <span className="eyebrow">Catálogo</span>

              <h2>Servicios y merch</h2>
            </div>

            <p>
              Cada servicio muestra los artistas disponibles, el valor base y el
              merchandising asociado. Precios y productos de ejemplo, sujetos a confirmación.
            </p>
          </header>

          {/* FILTROS */}
          <div
            className="services-page__filters"
            role="group"
            aria-label="Filtrar servicios por tipo"
          >
            {serviceGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                aria-pressed={activeGroup === group.id}
                className={activeGroup === group.id ? "is-active" : undefined}
                onClick={() => setActiveGroup(group.id)}
              >
                {group.label}
              </button>
            ))}
          </div>

          {/* LISTA DE SERVICIOS */}
          <div className="services-list">
            {visibleServices.map((service, serviceIndex) => {
              const ServiceIcon = serviceIcons[service.icon] || Music2;

              const isOpen = openServiceId === service.id;

              const existingOffers = service.offers.filter(
                (offer) => artistMap[offer.artistId],
              );

              const minimumPrice =
                existingOffers.length > 0
                  ? Math.min(...existingOffers.map((offer) => offer.price))
                  : null;

              return (
                <article
                  className={`service-card${
                    isOpen ? " service-card--open" : ""
                  }`}
                  key={service.id}
                >
                  <h3 className="service-card__heading">
                    <button
                      className="service-card__toggle"
                      type="button"
                      id={"service-toggle-" + service.id}
                      aria-expanded={isOpen}
                      aria-controls={`service-panel-${service.id}`}
                      onClick={() => toggleService(service.id)}
                    >
                      <span className="service-card__number">
                        {String(serviceIndex + 1).padStart(2, "0")}
                      </span>

                      <span className="service-card__icon">
                        <ServiceIcon size={22} aria-hidden="true" />
                      </span>

                      <span className="service-card__title">
                        <strong>{service.title}</strong>

                        <small>{service.tagline}</small>
                      </span>

                      <span className="service-card__meta">
                        <small>{minimumPrice !== null ? "Desde" : "Estado"}</small>

                        <b>
                          {minimumPrice !== null
                            ? formatMoney(minimumPrice)
                            : "Próximamente"}
                        </b>

                        <em>
                          <Users size={14} aria-hidden="true" />
                          {existingOffers.length}{" "}
                          {existingOffers.length === 1 ? "artista" : "artistas"}
                        </em>
                      </span>

                      <ChevronDown
                        className="service-card__chevron"
                        size={22}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>

                  {isOpen && (
                    <div
                      className="service-card__panel"
                      id={`service-panel-${service.id}`}
                      role="region"
                      aria-labelledby={"service-toggle-" + service.id}
                    >
                      <div className="service-card__details">
                        <div>
                          <span className="eyebrow">Qué incluye</span>

                          <ul className="service-includes">
                            {service.includes.map((item) => (
                              <li key={item}>
                                <Check size={17} aria-hidden="true" />

                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <dl className="service-facts">
                          <div>
                            <dt>
                              <Clock size={14} aria-hidden="true" />
                              Duración
                            </dt>

                            <dd>{service.duration}</dd>
                          </div>

                          <div>
                            <dt>
                              <MapPin size={14} aria-hidden="true" />
                              Formato
                            </dt>

                            <dd>{service.format}</dd>
                          </div>

                          <div>
                            <dt>
                              <Sparkles size={14} aria-hidden="true" />
                              Ideal para
                            </dt>

                            <dd>{service.ideal}</dd>
                          </div>
                        </dl>
                      </div>

                      <span className="eyebrow">Artistas disponibles</span>

                      {existingOffers.length > 0 ? (
                        <ul className="service-offers">
                          {existingOffers.map((offer) => {
                            const artist = artistMap[offer.artistId];

                            const merch = artist.merch || [];

                            const merchKey = `${service.id}:${offer.artistId}`;

                            const isMerchOpen = openMerchId === merchKey;

                            const cartKey = `service:${service.id}:${offer.artistId}`;

                            const isAdded = Boolean(cart[cartKey]);

                            const artistImage =
                              artist.featuredImage || artist.heroImage;

                            return (
                              <li className="artist-offer" key={offer.artistId}>
                                <div className="artist-offer__main">
                                  <div className="artist-offer__avatar">
                                    {artistImage ? (
                                      <img
                                        src={artistImage}
                                        alt=""
                                        loading="lazy"
                                      />
                                    ) : (
                                      <span>{getInitials(artist.name)}</span>
                                    )}
                                  </div>

                                  <div className="artist-offer__info">
                                    <Link
                                      className="artist-offer__name"
                                      to={`/artistas/${artist.slug}`}
                                    >
                                      {artist.name}
                                    </Link>

                                    <span className="artist-offer__tag">
                                      {artist.concept}

                                      {artist.city && ` · ${artist.city}`}
                                    </span>

                                    {offer.note && <p>{offer.note}</p>}
                                  </div>

                                  <div className="artist-offer__price">
                                    <small>Desde</small>

                                    <b>{formatMoney(offer.price)}</b>
                                  </div>

                                  <div className="artist-offer__actions">
                                    {merch.length > 0 && (
                                      <button
                                        type="button"
                                        className="btn btn--outline"
                                        aria-expanded={isMerchOpen}
                                        onClick={() =>
                                          toggleMerch(
                                            service.id,
                                            offer.artistId,
                                          )
                                        }
                                      >
                                        <ShoppingBag
                                          size={15}
                                          aria-hidden="true"
                                        />
                                        Merch ({merch.length})
                                        <ChevronDown
                                          className="artist-offer__merch-chevron"
                                          size={15}
                                          aria-hidden="true"
                                        />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      className={
                                        isAdded
                                          ? "btn services-btn--added"
                                          : "btn btn--gold"
                                      }
                                      aria-pressed={isAdded}
                                      onClick={() =>
                                        toggleServiceInCart(
                                          service,
                                          offer,
                                          artist,
                                        )
                                      }
                                    >
                                      {isAdded ? (
                                        <>
                                          <Check size={15} />
                                          Añadido
                                        </>
                                      ) : (
                                        "Añadir a cotización"
                                      )}
                                    </button>
                                  </div>
                                </div>

                                {isMerchOpen && merch.length > 0 && (
                                  <div className="artist-merch">
                                    <span className="eyebrow">
                                      Merch de {artist.name}
                                    </span>

                                    <div className="artist-merch__grid">
                                      {merch.map((item, merchIndex) => {
                                        const merchCartKey = `merch:${artist.id}:${item.id}`;

                                        const quantity =
                                          cart[merchCartKey]?.qty || 0;

                                        return (
                                          <article
                                            className="merch-card"
                                            key={item.id}
                                          >
                                            <div
                                              className={`merch-card__visual merch-card__visual--${
                                                (merchIndex % 3) + 1
                                              }`}
                                            >
                                              <ShoppingBag
                                                size={30}
                                                aria-hidden="true"
                                              />
                                            </div>

                                            <div className="merch-card__body">
                                              <strong>{item.name}</strong>

                                              <span>{item.detail}</span>

                                              <div className="merch-card__footer">
                                                <b>{formatMoney(item.price)}</b>

                                                {quantity > 0 ? (
                                                  <div
                                                    className="quantity-control"
                                                    role="group"
                                                    aria-label={`Cantidad de ${item.name}`}
                                                  >
                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        updateQuantity(
                                                          merchCartKey,
                                                          -1,
                                                        )
                                                      }
                                                      aria-label="Quitar uno"
                                                    >
                                                      <Minus size={14} />
                                                    </button>

                                                    <span>{quantity}</span>

                                                    <button
                                                      type="button"
                                                      onClick={() =>
                                                        updateQuantity(
                                                          merchCartKey,
                                                          1,
                                                        )
                                                      }
                                                      aria-label="Agregar uno"
                                                    >
                                                      <Plus size={14} />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <button
                                                    type="button"
                                                    className="merch-card__add"
                                                    onClick={() =>
                                                      addMerch(artist.id, item)
                                                    }
                                                  >
                                                    <Plus size={13} />
                                                    Agregar
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </article>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="service-card__empty">
                          Este servicio todavía no tiene artistas disponibles.
                        </p>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>

        {/* =========================
            COTIZACIÓN
        ========================== */}
        <aside
          className="services-quote"
          id="cotizacion"
          tabIndex={-1}
          ref={quoteRef}
          aria-labelledby="services-quote-title"
        >
          <span className="eyebrow">Tu selección</span>

          <h2 id="services-quote-title">Cotización</h2>

          {cartItems.length === 0 ? (
            <p className="services-quote__empty">
              Aún no has añadido nada. Abre un servicio y pulsa{" "}
              <strong>Añadir a cotización</strong>. El merchandising se agrega desde cada
              artista.
            </p>
          ) : (
            <ul className="services-quote__items">
              {cartItems.map((item) => (
                <li key={item.key}>
                  <div>
                    <strong>{item.label}</strong>

                    <span>{item.sub}</span>
                  </div>

                  <div className="services-quote__line">
                    {item.kind === "merch" && (
                      <div className="quantity-control quantity-control--dark">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, -1)}
                          aria-label={`Quitar uno de ${item.label}`}
                        >
                          <Minus size={13} />
                        </button>

                        <span>{item.qty}</span>

                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, 1)}
                          aria-label={`Agregar uno de ${item.label}`}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}

                    <b>{formatMoney(item.price * item.qty)}</b>

                    <button
                      className="services-quote__remove"
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={`Eliminar ${item.label}`}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className="services-quote__total">
            <span>Total estimado</span>

            <strong>{formatMoney(totalPrice)}</strong>
          </div>

          <form className="services-quote__form" onSubmit={requestQuote} onChange={() => setQuotePrepared(false)}>
            <label htmlFor="quote-name">Nombre
              <input id="quote-name" name="name" autoComplete="name" required maxLength={100} pattern=".*\S.*" />
            </label>
            <label htmlFor="quote-email">Correo de respuesta
              <input id="quote-email" name="email" type="email" autoComplete="email" required maxLength={254} />
            </label>
            <label htmlFor="quote-city">Ciudad del evento o entrega
              <input id="quote-city" name="city" autoComplete="address-level2" required maxLength={120} pattern=".*\S.*" />
            </label>
            <label htmlFor="quote-date">Fecha prevista (opcional)
              <input id="quote-date" name="date" type="date" />
            </label>
            <label htmlFor="quote-details">Detalles (opcional)
              <textarea id="quote-details" name="details" rows={3} maxLength={600}
                placeholder="Lugar, aforo, formato, tallas o requerimientos…" />
            </label>
            <button className="btn btn--gold services-quote__submit" type="submit"
              disabled={!cartItems.length || !quoteRecipients.length}>
              Preparar correo <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>
          {quotePrepared && (
            <p className="services-quote__sent" role="status">
              El correo está preparado para abrirse en tu aplicación de correo.
              Revisa la información y pulsa Enviar allí. La web no ha enviado la solicitud.
            </p>
          )}
          {cartItems.length > 0 && quoteRecipients.length === 0 && (
            <p className="services-quote__sent" role="status">Los artistas seleccionados aún no tienen un correo de contacto configurado.</p>
          )}

          <small className="services-quote__note">
            Los precios y productos de este catálogo son de ejemplo. Deben confirmarse con el artista. Necesitas una aplicación de correo configurada para enviar la solicitud; esta web no guarda tus datos ni realiza pagos.
          </small>
        </aside>
      </section>

      {/* =========================
          BARRA MÓVIL
      ========================== */}
      {itemCount > 0 && (
        <button
          className="services-mobile-quote"
          type="button"
          onClick={scrollToQuote}
        >
          <span>
            <ShoppingBag size={17} aria-hidden="true" />
            {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
          </span>

          <strong>{formatMoney(totalPrice)}</strong>

          <span>Ver cotización</span>
        </button>
      )}
    </main>
  );
}

export default StorePage;
