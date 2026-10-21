import { STAR_POINTS, RECEIPT_ZIG } from "./NewsUtils";

function Waveform() {
  const bars = Array.from({ length: 48 }, (_, index) => {
    const value =
      8 + Math.abs(Math.sin(index * 0.7) * Math.cos(index * 0.23)) * 28;

    return {
      x: (index * 4.2).toFixed(1),
      y: ((40 - value) / 2).toFixed(1),
      height: value.toFixed(1),
    };
  });

  return (
    <svg viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((bar, index) => (
        <rect
          key={index}
          x={bar.x}
          y={bar.y}
          width="2.4"
          height={bar.height}
          rx="1"
        />
      ))}
    </svg>
  );
}

export default function NewsPosterContent({ news }) {
  switch (news.type) {
    case "clip":
      return (
        <div className="news-poster__inner news-clip">
          <span className="news-kicker">{news.kicker}</span>

          <div className="news-photo-placeholder">
            <b>{news.mono}</b>
            <span className="news-stamp">{news.stamp}</span>
          </div>

          <h3>{news.title}</h3>

          {news.dek && <p className="news-clip__dek">{news.dek}</p>}

          {Array.isArray(news.stats) && (
            <dl className="news-clip__stats">
              {news.stats.map(([value, label]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {news.pull && <blockquote>{news.pull}</blockquote>}
        </div>
      );

    case "vinyl":
      return (
        <div className="news-poster__inner news-vinyl">
          <span className="news-kicker">{news.kicker}</span>

          <div className="news-vinyl__record" aria-hidden="true">
            <div className="news-vinyl__disc" />

            <div className="news-vinyl__sleeve">
              <span>{news.mono} · EP</span>
            </div>
          </div>

          <h3>{news.title}</h3>

          {news.by && <p className="news-vinyl__by">{news.by}</p>}

          {Array.isArray(news.tracks) && (
            <ol className="news-vinyl__tracks">
              {news.tracks.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ol>
          )}

          {news.when && <p className="news-vinyl__when">{news.when}</p>}
        </div>
      );

    case "video":
      return (
        <div className="news-poster__inner news-video">
          <div className="news-video__frame">
            <span className="news-video__badge">ESTRENO</span>

            <span className="news-video__play" aria-hidden="true" />
          </div>

          <h3>{news.title}</h3>

          <p className="news-video__by">{news.by} · Videoclip</p>

          <p className="news-video__when">{news.when}</p>
        </div>
      );

    case "sticky":
      return (
        <div className="news-poster__inner news-sticky">
          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          <p>{news.short}</p>

          {news.price && (
            <span className="news-sticky__price">{news.price}</span>
          )}
        </div>
      );

    case "ticket":
      return (
        <div className="news-ticket">
          <div className="news-ticket__top">
            <span className="news-kicker">{news.kicker}</span>

            <h3>{news.title}</h3>

            {news.deadline && (
              <span className="news-ticket__deadline">{news.deadline}</span>
            )}
          </div>

          <div className="news-ticket__stub">
            {Array.isArray(news.reqs) && (
              <ul>
                {news.reqs.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}

            <div className="news-barcode" aria-hidden="true" />
          </div>
        </div>
      );

    case "medal":
      return (
        <div className="news-poster__inner news-medal">
          <div className="news-medal__badge" aria-hidden="true">
            ★
          </div>

          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          {news.sub && <p>{news.sub}</p>}
        </div>
      );

    case "route":
      return (
        <div className="news-poster__inner news-route">
          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          {Array.isArray(news.stops) && (
            <ol>
              {news.stops.map(([city, date]) => (
                <li key={`${city}-${date}`}>
                  <b>{city}</b>
                  <span>{date}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      );

    case "collab":
      return (
        <div className="news-collab">
          <div className="news-collab__split">
            <div className="news-collab__artist">
              <span className="news-kicker">Rap consciente</span>

              <h3>School MC</h3>
            </div>

            <div className="news-collab__artist news-collab__artist--dark">
              <span className="news-kicker">Trap tropical</span>

              <h3>Mar de Leva</h3>
            </div>

            <span className="news-collab__x" aria-hidden="true">
              ×
            </span>
          </div>

          <div className="news-collab__footer">
            <h4>{news.song}</h4>

            <p>{news.line}</p>

            <div className="news-wave" aria-hidden="true">
              <Waveform />
            </div>
          </div>
        </div>
      );

    case "press":
      return (
        <div className="news-poster__inner news-press">
          <h3>Salieron en…</h3>

          {Array.isArray(news.items) &&
            news.items.map(([media, headline], index) => (
              <div
                className="news-press__slip"
                key={`${media}-${headline}`}
                style={{
                  "--news-slip-rotate": `${[-1.6, 1.2, -0.8][index % 3]}deg`,
                }}
              >
                <small>{media}</small>

                <p>«{headline}»</p>
              </div>
            ))}

          <p className="news-press__note">Medios de ejemplo.</p>
        </div>
      );

    case "big":
      return (
        <div className="news-poster__inner news-big">
          <span className="news-kicker">{news.kicker}</span>

          <span className="news-big__number">{news.num}</span>

          <span className="news-big__label">{news.label}</span>

          <svg
            className="news-big__underline"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M2 8 C40 2, 80 11, 120 5 S180 8, 198 3" />
          </svg>

          <p>{news.track}</p>

          <svg
            className="news-big__spark"
            viewBox="0 0 200 46"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M0 44 C30 43, 50 40, 80 33 S130 22, 160 12 S190 5, 196 3" />
          </svg>
        </div>
      );

    case "hazard":
      return (
        <div className="news-hazard">
          <div className="news-poster__inner">
            <span className="news-kicker">{news.kicker}</span>

            <h3>{news.title}</h3>

            <div className="news-hazard__dates">
              <span className="news-hazard__old">{news.oldD}</span>

              <span aria-hidden="true">→</span>

              <span className="news-hazard__new">{news.newD}</span>
            </div>

            <p>{news.note}</p>
          </div>
        </div>
      );

    case "polaroid":
      return (
        <div className="news-poster__inner news-polaroid">
          <div className="news-photo-placeholder news-polaroid__photo">
            <b>{news.year}</b>

            <span className="news-stamp">ARCHIVO</span>
          </div>

          <p className="news-polaroid__caption">{news.cap}</p>

          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>
        </div>
      );

    case "tag":
      return (
        <div className="news-poster__inner news-tag">
          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          <div className="news-tag__price">{news.price}</div>

          <p className="news-tag__tagline">{news.tagline}</p>

          {Array.isArray(news.units) && (
            <div className="news-tag__units">
              {news.units.map((unit) => (
                <span key={unit}>{unit}</span>
              ))}
            </div>
          )}
        </div>
      );

    case "notebook":
      return (
        <div className="news-poster__inner news-notebook">
          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          {Array.isArray(news.lines) &&
            news.lines.map((line) => <p key={line}>{line}</p>)}

          {news.when && (
            <p>
              <span className="news-notebook__highlight">{news.when}</span>
            </p>
          )}
        </div>
      );

    case "quote":
      return (
        <div className="news-poster__inner news-quote">
          <blockquote>{news.text}</blockquote>

          <cite>{news.who}</cite>
        </div>
      );

    case "burst":
      return (
        <div className="news-poster__inner news-burst">
          <div
            className="news-burst__star"
            style={{
              "--news-star": STAR_POINTS,
            }}
          >
            Nuevo
          </div>

          <div>
            <span className="news-kicker">{news.kicker}</span>

            <h3>{news.title}</h3>
          </div>

          <p>{news.short}</p>
        </div>
      );

    case "live":
      return (
        <div className="news-poster__inner news-live">
          <span className="news-live__badge">
            <i aria-hidden="true" />
            EN VIVO
          </span>

          <h3>{news.title}</h3>

          <div className="news-live__dial" aria-hidden="true" />

          <div className="news-live__frequency" aria-hidden="true">
            <span>88</span>
            <span>92</span>
            <span>96</span>
            <span>100</span>
            <span>104</span>
            <span>108</span>
          </div>

          <p className="news-live__when">
            <small>{news.station}</small>
            {news.when}
          </p>
        </div>
      );

    case "memorial":
      return (
        <div className="news-poster__inner news-memorial">
          <div className="news-memorial__candles" aria-hidden="true">
            <i style={{ height: 36 }} />
            <i style={{ height: 52 }} />
            <i style={{ height: 30 }} />
          </div>

          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>

          <p>{news.when}</p>
        </div>
      );

    case "receipt":
      return (
        <div
          className="news-poster__inner news-receipt"
          style={{
            "--news-zig": RECEIPT_ZIG,
          }}
        >
          <span>ARTE MAESTRO · CASA ARTE MAESTRO</span>

          <h3>{news.title}</h3>

          <p className="news-receipt__sub">3 oct 2026 · Ronda #1</p>

          <hr />

          {Array.isArray(news.lines) && (
            <ul>
              {news.lines.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <i aria-hidden="true" />
                  <b>{value}</b>
                </li>
              ))}
            </ul>
          )}

          <hr />

          {Array.isArray(news.total) && (
            <p className="news-receipt__total">
              <span>{news.total[0]}</span>

              <b>{news.total[1]}</b>
            </p>
          )}

          <div className="news-barcode" aria-hidden="true" />

          <p className="news-receipt__thanks">*** GRACIAS POR ESCUCHAR ***</p>
        </div>
      );

    default:
      return (
        <div className="news-poster__inner news-sticky">
          <span className="news-kicker">{news.kicker}</span>

          <h3>{news.title}</h3>
        </div>
      );
  }
}
