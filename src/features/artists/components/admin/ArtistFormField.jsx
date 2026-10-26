import { cloneElement, isValidElement, useId } from "react";

// Presenta un campo con etiqueta, contenido y validación visual.
function ArtistFormField({ label, full = false, error = false, children }) {
  const id = useId();

  // Asocia la etiqueta con el control principal.
  const content = isValidElement(children)
    ? cloneElement(children, { id })
    : Array.isArray(children)
      ? children.map((child, index) =>
          isValidElement(child) && child.type !== "small"
            ? cloneElement(child, { id, key: index })
            : child,
        )
      : children;

  return (
    <div
      className={`field${full ? " field--full" : ""}${error ? " has-error" : ""}`}
    >
      <label htmlFor={id}>{label}</label>
      {content}
    </div>
  );
}

export default ArtistFormField;
