import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const location = useLocation();
  const [openLocation, setOpenLocation] = useState(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const isOpen = openLocation === location.key;
  const closeMenu = () => setOpenLocation(null);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenLocation(null);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpenLocation(null);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className="arte-maestro-nav"
      ref={headerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <Link to="/" className="arte-maestro-brand" onClick={closeMenu}>
        <div className="arte-maestro-brand__mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <span>Arte Maestro</span>
      </Link>

      <button
        className="arte-maestro-nav__toggle"
        type="button"
        ref={toggleRef}
        aria-expanded={isOpen}
        aria-controls="arte-maestro-navigation"
        aria-label={isOpen ? "Cerrar menú principal" : "Abrir menú principal"}
        onClick={() => setOpenLocation(isOpen ? null : location.key)}
      >
        {isOpen ? (
          <X size={21} aria-hidden="true" />
        ) : (
          <Menu size={21} aria-hidden="true" />
        )}
        <span>Menú</span>
      </button>

      <div
        id="arte-maestro-navigation"
        className={`arte-maestro-nav__navigation${isOpen ? " is-open" : ""}`}
        onClick={(event) => {
          if (event.target.closest("a")) closeMenu();
        }}
      >
        <nav className="arte-maestro-nav__links" aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/artistas">Artistas</NavLink>
          <NavLink to="/noticias">Noticias</NavLink>
          <NavLink to="/tienda">Tienda</NavLink>
        </nav>

        <Link
          to="/artistas/school-mc"
          className="btn btn--gold arte-maestro-nav__cta"
        >
          Descubrir artista
        </Link>
      </div>
    </header>
  );
}

export default Navbar;
