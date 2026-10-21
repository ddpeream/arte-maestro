import { useEffect, useState, useSyncExternalStore } from "react";
import { Link } from "react-router";
import { Pause, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ImageCarousel.css";

const motionQuery = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(callback) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

const getMotionPreference = () => window.matchMedia(motionQuery).matches;
const getServerMotionPreference = () => true;

// Reuse in an artist page with images={artist.gallery} and variant="artist".
function ImageCarousel({
  images = [],
  label = "Galería de artistas",
  variant = "home",
}) {
  const [swiper, setSwiper] = useState(null);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    getMotionPreference,
    getServerMotionPreference,
  );
  const slides = images.filter((image) => image?.src);
  const hasMultiple = slides.length > 1;
  const autoplayEnabled = hasMultiple && !paused && !reducedMotion;

  useEffect(() => {
    if (!swiper || swiper.destroyed) return;
    if (autoplayEnabled) {
      swiper.autoplay.start();
    } else {
      swiper.autoplay.stop();
    }
  }, [swiper, autoplayEnabled]);

  if (!slides.length) return null;

  return (
    <div
      className={`image-carousel image-carousel--${variant === "artist" ? "artist" : "home"}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
    >
      {hasMultiple && !reducedMotion && (
        <div className="image-carousel__controls">
          <button
            type="button"
            className="image-carousel__pause"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Reanudar carrusel" : "Pausar carrusel"}
          >
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
            {paused ? "Reanudar" : "Pausar"}
          </button>
        </div>
      )}

      <Swiper
        modules={[A11y, Autoplay, Navigation, Pagination]}
        onSwiper={setSwiper}
        slidesPerView={1}
        spaceBetween={18}
        breakpoints={{
          640: { slidesPerView: Math.min(2, slides.length) },
          1100: { slidesPerView: Math.min(variant === "artist" ? 2 : 3, slides.length) },
        }}
        navigation={hasMultiple}
        pagination={hasMultiple ? { type: "fraction" } : false}
        rewind={hasMultiple}
        watchOverflow
        speed={reducedMotion ? 0 : 600}
        autoplay={hasMultiple ? {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        } : false}
        a11y={{
          prevSlideMessage: "Imagen anterior",
          nextSlideMessage: "Imagen siguiente",
          firstSlideMessage: "Primera imagen",
          lastSlideMessage: "Última imagen",
          slideLabelMessage: "Imagen {{index}} de {{slidesLength}}",
        }}
      >
        {slides.map((image) => (
          <SwiperSlide key={image.id || image.src}>
            <figure className="image-carousel__slide">
              <div className="image-carousel__frame">
                <img
                  src={image.src}
                  alt={image.alt || image.artistName || "Fotografía del artista"}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              {(image.caption || image.artistName) && (
                <figcaption>
                  {image.artistHref ? (
                    <Link to={image.artistHref}>{image.caption || image.artistName}</Link>
                  ) : (
                    image.caption || image.artistName
                  )}
                </figcaption>
              )}
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ImageCarousel;
