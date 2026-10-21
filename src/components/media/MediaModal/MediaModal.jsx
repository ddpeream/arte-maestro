import { useEffect } from "react";
import { X } from "lucide-react";
import { useMediaStore } from "../../../store/useMediaStore";
import "./MediaModal.css";

function MediaModal() {
  const activeMedia = useMediaStore((state) => state.activeMedia);
  const closeMedia = useMediaStore((state) => state.closeMedia);

  useEffect(() => {
    if (!activeMedia) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMedia();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeMedia, closeMedia]);

  if (!activeMedia) {
    return null;
  }

  return (
    <div
      className="media-modal"
      role="dialog"
      aria-modal="true"
      aria-label={activeMedia.title}
    >
      <button
        className="media-modal__backdrop"
        type="button"
        aria-label="Cerrar video"
        onClick={closeMedia}
      />

      <div className="media-modal__content">
        <div className="media-modal__header">
          <div>
            <span className="eyebrow">Arte Maestro · Multimedia</span>
            <h2>{activeMedia.title}</h2>
          </div>

          <button
            className="media-modal__close"
            type="button"
            onClick={closeMedia}
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
        </div>

        <div className="media-modal__player">
          {activeMedia.source === "youtube" && (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeMedia.youtubeId}?autoplay=1&rel=0`}
              title={activeMedia.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}

          {activeMedia.source === "file" && (
            <video src={activeMedia.src} controls autoPlay playsInline />
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaModal;
