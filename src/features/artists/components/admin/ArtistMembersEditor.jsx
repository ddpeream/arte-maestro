import { useState } from "react";

import ArtistImagePicker from "./ArtistImagePicker";

import {
  useCreateArtistMemberMutation,
  useUpdateArtistMemberMutation,
  usePublishArtistMemberMutation,
  useArchiveArtistMemberMutation,
  useRestoreArtistMemberMutation,
} from "../../api/artistMembersMutations";

const EMPTY_FORM = {
  name: "",
  alias: "",
  roles: "",
  sort_order: 0,
  photo_file: null,
};

// Administra integrantes y colaboradores del artista.
function ArtistMembersEditor({ artistId, members = [], onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [notice, setNotice] = useState("");

  const createMutation = useCreateArtistMemberMutation();

  const updateMutation = useUpdateArtistMemberMutation();

  const publishMutation = usePublishArtistMemberMutation();

  const archiveMutation = useArchiveArtistMemberMutation();

  const restoreMutation = useRestoreArtistMemberMutation();

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const editingMember = members.find((member) => member.id === editingId);

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

  function startEditing(member) {
    setEditingId(member.id);

    setForm({
      name: member.name ?? "",
      alias: member.alias ?? "",

      roles: Array.isArray(member.roles) ? member.roles.join(", ") : "",

      sort_order: member.sort_order ?? 0,

      photo_file: null,
    });

    setNotice("");
  }

  function getRoles() {
    return form.roles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  async function saveMember() {
    const name = form.name.trim();

    if (!name || isSaving) {
      return;
    }

    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,

          changes: {
            name,
            alias: form.alias,
            roles: getRoles(),

            sort_order: Number(form.sort_order || 0),

            photo_file: form.photo_file,
          },
        });

        setNotice("Integrante actualizado correctamente.");
      } else {
        await createMutation.mutateAsync({
          artistId,

          name,

          alias: form.alias,

          roles: getRoles(),

          sortOrder: Number(form.sort_order || 0),

          photoFile: form.photo_file,
        });

        setNotice("Integrante creado correctamente como borrador.");
      }

      await onChanged?.();

      resetForm();
    } catch (error) {
      console.error("Error guardando integrante:", error);

      setNotice(
        editingId
          ? "No fue posible actualizar el integrante."
          : "No fue posible crear el integrante.",
      );
    }
  }

  async function publishMember(member) {
    try {
      await publishMutation.mutateAsync(member.id);

      await onChanged?.();

      setNotice(`"${member.name}" fue publicado correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${member.name}".`);
    }
  }

  async function archiveMember(member) {
    try {
      await archiveMutation.mutateAsync(member.id);

      await onChanged?.();

      setNotice(`"${member.name}" fue archivado correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${member.name}".`);
    }
  }

  async function restoreMember(member) {
    try {
      await restoreMutation.mutateAsync(member.id);

      await onChanged?.();

      setNotice(`"${member.name}" fue recuperado como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${member.name}".`);
    }
  }

  const orderedMembers = [...members].sort(
    (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
  );

  return (
    <section className="artist-members-editor">
      <h3>Integrantes</h3>

      <p>
        Agrega integrantes, músicos o colaboradores que formen parte del
        portafolio del artista.
      </p>

      {notice && <p>{notice}</p>}

      <div className="field-grid">
        <div className="field">
          <label htmlFor="member-name">Nombre *</label>

          <input
            id="member-name"
            type="text"
            value={form.name}
            placeholder="Leyson Bejarano"
            onChange={(event) => updateForm("name", event.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="member-alias">Alias</label>

          <input
            id="member-alias"
            type="text"
            value={form.alias}
            placeholder="Leysong"
            onChange={(event) => updateForm("alias", event.target.value)}
          />
        </div>

        <div className="field field--full">
          <label htmlFor="member-roles">Roles</label>

          <input
            id="member-roles"
            type="text"
            value={form.roles}
            placeholder="Voz, composición, producción"
            onChange={(event) => updateForm("roles", event.target.value)}
          />

          <span className="field__help">Separa los roles con comas.</span>
        </div>

        <div className="field">
          <label htmlFor="member-sort-order">Orden</label>

          <input
            id="member-sort-order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => updateForm("sort_order", event.target.value)}
          />
        </div>
      </div>

      <ArtistImagePicker
        label="Foto del integrante"
        file={form.photo_file}
        currentUrl={editingMember?.photo_url ?? ""}
        onChange={(file) => updateForm("photo_file", file)}
      />

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
          onClick={saveMember}
          disabled={isSaving}
        >
          {isSaving
            ? "Guardando..."
            : editingId
              ? "Guardar integrante"
              : "Agregar integrante"}
        </button>
      </div>

      {orderedMembers.length > 0 && (
        <div className="artist-members-editor__list">
          {orderedMembers.map((member) => (
            <article key={member.id} className="artist-members-editor__item">
              {member.photo_url && (
                <img
                  src={member.photo_url}
                  alt={member.alias || member.name}
                  width="80"
                  height="80"
                />
              )}

              <div>
                <strong>{member.name}</strong>

                {member.alias && <span> · {member.alias}</span>}

                {member.roles?.length > 0 && <p>{member.roles.join(", ")}</p>}

                <small>
                  {member.publication_status === "published"
                    ? "Publicado"
                    : member.publication_status === "archived"
                      ? "Archivado"
                      : "Borrador"}
                </small>
              </div>

              <div className="artist-members-editor__actions">
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={() => startEditing(member)}
                >
                  Editar
                </button>

                {member.publication_status === "draft" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => publishMember(member)}
                    disabled={publishMutation.isPending}
                  >
                    Publicar
                  </button>
                )}

                {member.publication_status === "published" && (
                  <button
                    type="button"
                    className="btn btn--outline"
                    onClick={() => archiveMember(member)}
                    disabled={archiveMutation.isPending}
                  >
                    Archivar
                  </button>
                )}

                {member.publication_status === "archived" && (
                  <button
                    type="button"
                    className="btn btn--gold"
                    onClick={() => restoreMember(member)}
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

export default ArtistMembersEditor;
