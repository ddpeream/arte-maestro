import { Link } from "react-router";
import "./Footer.css";

function Footer() {
  return (
    <footer className="arte-maestro-footer">
      <div>© Arte Maestro — Medellín, Colombia</div>

      <div className="arte-maestro-footer__manifesto">
        <span>Memoria</span>
        <span>·</span>
        <span>Territorio</span>
        <span>·</span>
        <span>Música</span>
        <span>·</span>
        <span>Futuro</span>
      </div>

      <Link to="/admin" className="arte-maestro-footer__admin">
        Acceso administración →
      </Link>
    </footer>
  );
}

export default Footer;
