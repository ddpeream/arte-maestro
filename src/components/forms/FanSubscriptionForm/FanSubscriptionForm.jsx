import { useId, useState } from "react";
import { Mail, Smartphone } from "lucide-react";
import SocialIcon from "../../media/SocialIcon/SocialIcon";
import "./FanSubscriptionForm.css";

// onSubscribe receives the registration when a persistence service is connected.
// This component does not store personal information in the browser.
function FanSubscriptionForm({ artistId, artistName, onSubscribe }) {
  const id = useId();
  const [contactMethod, setContactMethod] = useState("email");
  const [socialPlatform, setSocialPlatform] = useState("instagram");
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [socialUsernames, setSocialUsernames] = useState({ instagram: "", tiktok: "" });
  const today = new Date();
  const maxBirthDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const invitations = data.get("invitations") === "on";
    const celebrations = data.get("celebrations") === "on";

    if (!invitations && !celebrations) {
      setStatus({ type: "error", text: "Elige al menos un tipo de mensaje que quieras recibir." });
      form.elements.namedItem("invitations")?.focus();
      return;
    }

    if (typeof onSubscribe !== "function") {
      setStatus({
        type: "info",
        text: "Las inscripciones aún no están disponibles. Tus datos no se han enviado ni guardado.",
      });
      return;
    }

    const registration = {
      artistId,
      firstName: data.get("firstName").trim(),
      lastName: data.get("lastName").trim(),
      contact: {
        method: contactMethod,
        value: data.get(contactMethod).trim(),
      },
      birthDate: data.get("birthDate") || null,
      gender: data.get("gender") || null,
      city: data.get("city").trim() || null,
      social: data.get("socialUsername").trim()
        ? { platform: socialPlatform, username: data.get("socialUsername").trim() }
        : null,
      consent: { invitations, celebrations, version: "1" },
    };

    setSubmitting(true);
    setStatus(null);
    try {
      // The service must resolve only after persisting the record.
      // It must assign registeredAt/consentedAt on the server for anniversaries.
      await onSubscribe(registration);
      form.reset();
      setContactMethod("email");
      setSocialPlatform("instagram");
      setSocialUsernames({ instagram: "", tiktok: "" });
      setStatus({ type: "success", text: "Tu suscripción se ha registrado. Gracias por ser parte de la comunidad." });
    } catch {
      setStatus({ type: "error", text: "No pudimos completar tu suscripción. Inténtalo nuevamente." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="fan-subscription" onSubmit={handleSubmit}
      aria-label={`Suscripción a ${artistName}`} aria-busy={submitting}
      onChange={() => setStatus(null)}>
      <fieldset className="fan-subscription__fields" disabled={submitting}>
        <legend className="fan-subscription__sr-only">Datos del seguidor</legend>
        <div className="fan-subscription__field">
          <label className="fan-subscription__label" htmlFor={id + "-" + contactMethod}>
            {contactMethod === "email" ? "Correo electrónico" : "Teléfono"} <small>(obligatorio)</small>
          </label>
          <div className="fan-subscription__switch" role="group" aria-label="Medio de contacto">
            <button type="button" aria-label="Correo electrónico" title="Correo electrónico"
              aria-pressed={contactMethod === "email"} onClick={() => { setContactMethod("email"); setStatus(null); }}>
              <Mail aria-hidden="true" />
            </button>
            <button type="button" aria-label="Teléfono" title="Teléfono"
              aria-pressed={contactMethod === "phone"} onClick={() => { setContactMethod("phone"); setStatus(null); }}>
              <Smartphone aria-hidden="true" />
            </button>
          </div>
          <input hidden={contactMethod !== "email"} disabled={contactMethod !== "email"}
            id={id + "-email"} name="email" type="email" autoComplete="email"
            placeholder="nombre@correo.com" maxLength={254} required={contactMethod === "email"} />
          <input hidden={contactMethod !== "phone"} disabled={contactMethod !== "phone"}
            id={id + "-phone"} name="phone" type="tel" autoComplete="tel"
            placeholder="+573001234567" pattern="\+[1-9][0-9]{6,14}"
            title="Incluye + y el indicativo del país, sin espacios. Ejemplo: +573001234567"
            required={contactMethod === "phone"} />
        </div>

        <fieldset className="fan-subscription__field">
          <legend className="fan-subscription__label">Nombre y apellido <small>(obligatorios)</small></legend>
          <div className="fan-subscription__row">
            <label className="fan-subscription__sr-only" htmlFor={id + "-first-name"}>Nombre</label>
            <input id={id + "-first-name"} name="firstName" type="text" autoComplete="given-name"
              placeholder="Nombre" required maxLength={100} pattern=".*\S.*" />
            <label className="fan-subscription__sr-only" htmlFor={id + "-last-name"}>Apellido</label>
            <input id={id + "-last-name"} name="lastName" type="text" autoComplete="family-name"
              placeholder="Apellido" required maxLength={100} pattern=".*\S.*" />
          </div>
        </fieldset>

        <div className="fan-subscription__field">
          <label className="fan-subscription__label" htmlFor={id + "-birthday"}>Fecha de nacimiento</label>
          <input id={id + "-birthday"} name="birthDate" type="date" autoComplete="bday" max={maxBirthDate} />
        </div>
        <div className="fan-subscription__field">
          <label className="fan-subscription__label" htmlFor={id + "-gender"}>Género</label>
          <div className="fan-subscription__select">
            <select id={id + "-gender"} name="gender" defaultValue="">
              <option value="">— Selecciona —</option>
              <option value="woman">Mujer</option>
              <option value="man">Hombre</option>
              <option value="non-binary">No binario</option>
              <option value="self-described">Otra identidad</option>
              <option value="prefer-not-to-say">Prefiero no decirlo</option>
            </select>
          </div>
        </div>
        <div className="fan-subscription__field">
          <label className="fan-subscription__label" htmlFor={id + "-city"}>Ciudad</label>
          <input id={id + "-city"} name="city" type="text" autoComplete="address-level2" placeholder="Tu ciudad" maxLength={120} />
        </div>
        <div className="fan-subscription__field">
          <label className="fan-subscription__label" htmlFor={id + "-social"}>
            Usuario de {socialPlatform === "instagram" ? "Instagram" : "TikTok"}
          </label>
          <div className="fan-subscription__switch fan-subscription__switch--social" role="group" aria-label="Red social">
            <button type="button" aria-label="Instagram" title="Instagram" aria-pressed={socialPlatform === "instagram"}
              onClick={() => { setSocialPlatform("instagram"); setStatus(null); }}><SocialIcon platform="instagram" aria-hidden="true" /></button>
            <button type="button" aria-label="TikTok" title="TikTok" aria-pressed={socialPlatform === "tiktok"}
              onClick={() => { setSocialPlatform("tiktok"); setStatus(null); }}>
              <svg className="fan-subscription__tiktok" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.6 3c.3 2.4 1.7 3.9 4 4.1v3.1c-1.5.1-2.8-.4-4-1.2v6.1c0 3.9-3.2 6.1-6.2 5.6-2.7-.5-4.6-3.1-4-5.9.6-2.8 3.2-4.3 5.8-3.8v3.2c-1.4-.4-2.9.3-3 1.8-.1 1.6 1.4 2.6 2.7 2.2 1-.3 1.4-1 1.4-2.1V3h3.3z" />
              </svg>
            </button>
          </div>
          <input id={id + "-social"} name="socialUsername" type="text" value={socialUsernames[socialPlatform]}
            onChange={(event) => {
              const value = event.target.value;
              setSocialUsernames((current) => ({ ...current, [socialPlatform]: value }));
            }} placeholder="@usuario" autoCapitalize="none" spellCheck={false} maxLength={100} />
        </div>

        <fieldset className="fan-subscription__consent">
          <legend className="fan-subscription__sr-only">Mensajes que autorizas recibir</legend>
          <label><input type="checkbox" name="invitations" />
            <span>Quiero recibir novedades e invitaciones de {artistName} por el medio que elegí.</span>
          </label>
          <label><input type="checkbox" name="celebrations" />
            <span>Quiero recibir felicitaciones de cumpleaños y del aniversario de mi suscripción a {artistName}.</span>
          </label>
        </fieldset>
        <p className="fan-subscription__legal">Elige al menos una opción. Arte Maestro usará tus datos para las comunicaciones que autorices. Los demás campos son opcionales, excepto nombre, apellido y medio de contacto.</p>
        <button className="fan-subscription__submit" type="submit">{submitting ? "Registrando…" : "Suscribirme"}</button>
        {typeof onSubscribe !== "function" && (
          <p className="fan-subscription__foot">Inscripciones próximamente. Este formulario aún no envía ni guarda tus datos.</p>
        )}
      </fieldset>
      {status && (
        <p className={"fan-subscription__status fan-subscription__status--" + status.type}
          role={status.type === "error" ? "alert" : "status"}>{status.text}</p>
      )}
    </form>
  );
}

export default FanSubscriptionForm;
