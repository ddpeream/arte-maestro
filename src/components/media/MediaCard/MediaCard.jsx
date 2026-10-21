import { Play } from "lucide-react";
import { useMediaStore } from "../../../store/useMediaStore";
import "./MediaCard.css";

function MediaCard({ media }) {
  const openMedia = useMediaStore((state) => state.openMedia);

  const hasPlayableMedia =
    media?.source === "youtube" || media?.source === "file";

  const handleClick = () => {
    if (hasPlayableMedia) {
      openMedia(media);
    }
  };

  return (
    <article className="media-card">
      <button
        className="media-card__visual"
        type="button"
        onClick={handleClick}
        aria-label={media?.title || "Contenido multimedia"}
      >
        {media?.thumbnail && (
          <img
            src={media.thumbnail}
            alt={media.title}
            className="media-card__image"
            loading="lazy"
          />
        )}

        {!media?.thumbnail && (
          <div className="media-card__placeholder">
            <span className="media-card__placeholder-brand">Arte Maestro</span>

            <span className="media-card__placeholder-type">
              {media?.meta || "Contenido audiovisual"}
            </span>
          </div>
        )}

        <div className="media-card__overlay" />

        <span className="media-card__play">
          <Play size={20} fill="currentColor" />
        </span>
      </button>

      <div className="media-card__body">
        <span className="media-card__type">{media?.type || "Video"}</span>

        <h3>{media?.title || "Contenido por publicar"}</h3>

        <p>{media?.meta || "Próximamente en Arte Maestro"}</p>
      </div>
    </article>
  );
}

export default MediaCard;
