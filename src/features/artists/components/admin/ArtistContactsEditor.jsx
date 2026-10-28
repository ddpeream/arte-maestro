import { useState } from "react";

import {
  useCreateArtistContactMutation,
  useUpdateArtistContactMutation,
  usePublishArtistContactMutation,
  useArchiveArtistContactMutation,
  useRestoreArtistContactMutation,
  useSetPrimaryArtistContactMutation,
  useClearPrimaryArtistContactMutation,
} from "../../api/artistContactsMutations";

const EMPTY_FORM = {
  kind: "email",
  value: "",
  label: "",
  sort_order: 0,
};

// Administra correos y teléfonos profesionales del artista.
function ArtistContactsEditor({ artistId, contacts = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistContactMutation();

  const updateMutation = useUpdateArtistContactMutation();

  const publishMutation = usePublishArtistContactMutation();

  const archiveMutation = useArchiveArtistContactMutation();

  const restoreMutation = useRestoreArtistContactMutation();

  const primaryMutation = useSetPrimaryArtistContactMutation();

  const clearPrimaryMutation = useClearPrimaryArtistContactMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  function updateForm(key, value) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEditing(contact) {
    setEditingId(contact.id);

    setForm({
      kind: contact.kind,
      value: contact.value ?? "",
      label: contact.label ?? "",
      sort_order: contact.sort_order ?? 0,
    });

    setNotice("");
  }

  async function saveContact() {
    if (!form.value.trim() || isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            kind: form.kind,
            value: form.value,
            label: form.label,
            sort_order: Number(form.sort_order || 0),
          },
        });

        setNotice("Contacto actualizado correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,
          kind: form.kind,
          value: form.value,
          label: form.label,
          sortOrder: Number(form.sort_order || 0),
        });

        setNotice("Contacto creado correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando contacto:", error);

      if (error?.code === "23505") {
        setNotice("Ese contacto ya está registrado para este artista.");

        return;
      }

      setNotice(error?.message || "No fue posible guardar el contacto.");
    }
  }

  async function publishContact(contact) {
    try {
      await publishMutation.mutateAsync(contact.id);

      await onChanged?.();

      setNotice("Contacto publicado correctamente.");
    } catch {
      setNotice("No fue posible publicar el contacto.");
    }
  }

  async function archiveContact(contact) {
    try {
      await archiveMutation.mutateAsync(contact.id);

      await onChanged?.();

      setNotice("Contacto archivado correctamente.");
    } catch {
      setNotice("No fue posible archivar el contacto.");
    }
  }

  async function restoreContact(contact) {
    try {
      await restoreMutation.mutateAsync(contact.id);

      await onChanged?.();

      setNotice("Contacto recuperado como borrador.");
    } catch {
      setNotice("No fue posible recuperar el contacto.");
    }
  }

  async function makePrimary(contact) {
    try {
      await primaryMutation.mutateAsync(contact.id);

      await onChanged?.();

      setNotice(
        `${
          contact.kind === "email" ? "Correo" : "Teléfono"
        } principal actualizado.`,
      );
    } catch (error) {
      console.error("Error cambiando contacto principal:", error);

      setNotice("No fue posible establecer el contacto principal.");
    }
  }

  async function removePrimary(contact) {
    try {
      await clearPrimaryMutation.mutateAsync(contact.id);

      await onChanged?.();

      setNotice("El contacto dejó de ser principal.");
    } catch {
      setNotice("No fue posible quitar el contacto principal.");
    }
  }

  const orderedContacts = [...contacts].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-contacts-editor">
      <h3>Contacto profesional</h3>

      <p>Agrega correos y teléfonos para Booking, prensa e industria.</p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="contact-kind">Tipo *</label>

          <select
            id="contact-kind"
            value={form.kind}
            disabled={Boolean(editingId)}
            onChange={(event) => updateForm("kind", event.target.value)}
          >
            <option value="email">Correo</option>

            <option value="phone">Teléfono</option>
          </select>

          {editingId && (
            <span className="field__help">
              El tipo no cambia después de crear el contacto.
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="contact-order">Orden</label>

          <input
            id="contact-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="contact-value">
            {form.kind === "email" ? "Correo *" : "Teléfono *"}
          </label>

          <input
            id="contact-value"
            type={form.kind === "email" ? "email" : "tel"}
            value={form.value}
            placeholder={
              form.kind === "email" ? "booking@artista.com" : "+573001234567"
            }
            onChange={(event) => updateForm("value", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="contact-label">Etiqueta</label>

          <input
            id="contact-label"
            type="text"
            value={form.label}
            placeholder="Booking · Prensa · Industria"
            onChange={(event) => updateForm("label", event.target.value)}
          />
        </div>
      </div>

      <div className="panel-actions">
        {editingId && (
          <button
            type="button"
            className="btn btn--outline"
            onClick={resetForm}
            disabled={isSaving}
          >
            Cancelar edición
          </button>
        )}

        <button
          type="button"
          className="btn btn--gold"
          onClick={saveContact}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar contacto"
              : "Agregar contacto"}
        </button>
      </div>

      {orderedContacts.length > 0 && (
        <div className="artist-contacts-editor__list">
          {orderedContacts.map((contact) => (
            <article key={contact.id} className="artist-contacts-editor__item">
              <div>
                <strong>
                  {contact.kind === "email" ? "Correo" : "Teléfono"}
                </strong>

                <p>{contact.value}</p>

                {contact.label && <p>{contact.label}</p>}

                <small>
                  {contact.publication_status === "published"
                    ? "Publicado"
                    : contact.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}

                  {contact.is_primary ? " · Principal" : ""}
                </small>
              </div>

              <div className="artist-contacts-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(contact)}
                >
                  Editar
                </button>

                {contact.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishContact(contact)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {contact.publication_status === "published" &&
                  !contact.is_primary && (
                    <button
                      type="button"
                      className="btn btn--gold"
                      onClick={() => makePrimary(contact)}
                      disabled={primaryMutation.isPending}
                    >
                      Hacer principal
                    </button>
                  )}

                {contact.publication_status === "published" &&
                  contact.is_primary && (
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => removePrimary(contact)}
                      disabled={clearPrimaryMutation.isPending}
                    >
                      Quitar principal
                    </button>
                  )}

                {contact.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveContact(contact)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {contact.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreContact(contact)}
                    disabled={restoreMutation.isPending}
                  >
                    Recuperar
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ArtistContactsEditor;
