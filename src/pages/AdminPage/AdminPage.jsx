import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import AdminSidebar from "../../features/admin/components/AdminSidebar";
import AdminNotice from "../../features/admin/components/AdminNotice";
import AdminTeam from "../../features/admin/components/AdminTeam";

import AdminArtists from "../../features/artists/components/admin/AdminArtists";
import ArtistModal from "../../features/artists/components/admin/ArtistModal";

import {
  adminArtistsQueryOptions,
  adminArtistByIdQueryOptions,
} from "../../features/artists/api/artistsQueries";

import {
  useCreateArtistMutation,
  useUpdateArtistMutation,
  usePublishArtistMutation,
  useArchiveArtistMutation,
  useRestoreArtistMutation,
} from "../../features/artists/api/artistsMutations";

import "./AdminPage.css";

// Coordina la navegación y las operaciones principales del panel.
function AdminPage() {
  const [section, setSection] = useState("artists");
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [editingArtist, setEditingArtist] = useState(null);

  const queryClient = useQueryClient();

  // Trae todos los artistas visibles para administración.
  const {
    data: artists = [],
    isLoading: isLoadingArtists,
    isError: isArtistsError,
  } = useQuery(adminArtistsQueryOptions);

  // Crea artistas reales en Supabase.
  const createArtistMutation = useCreateArtistMutation();

  // Actualiza artistas existentes en Supabase.
  const updateArtistMutation = useUpdateArtistMutation();

  // Publica un artista y actualiza el catálogo.
  const publishArtistMutation = usePublishArtistMutation();

  // Archiva un artista y lo retira del catálogo público.
  const archiveArtistMutation = useArchiveArtistMutation();

  // Restaura un artista previamente archivado.
  const restoreArtistMutation = useRestoreArtistMutation();

  // Cierra el modal y limpia el artista seleccionado.
  function closeArtistModal() {
    setModalOpen(false);
    setEditingArtist(null);
  }

  // Guarda un nuevo artista como borrador.
  async function handleCreateArtist(artist) {
    try {
      await createArtistMutation.mutateAsync(artist);

      closeArtistModal();

      setNotice("Artista creado correctamente como borrador.");
    } catch {
      setNotice("No fue posible crear el artista.");
    }
  }

  // Actualiza un artista existente.
  async function handleUpdateArtist(id, changes) {
    try {
      await updateArtistMutation.mutateAsync({
        id,
        changes,
      });

      closeArtistModal();

      setNotice("Artista actualizado correctamente.");
    } catch {
      setNotice("No fue posible actualizar el artista.");
    }
  }

  // Abre el formulario vacío para crear un artista.
  function handleAddArtist() {
    setEditingArtist(null);
    setModalOpen(true);
  }

  // Trae la ficha completa y abre el formulario.
  async function handleEditArtist(artist) {
    try {
      const fullArtist = await queryClient.fetchQuery(
        adminArtistByIdQueryOptions(artist.id),
      );

      setEditingArtist(fullArtist);
      setModalOpen(true);
    } catch {
      setNotice(`No fue posible cargar "${artist.name}" para edición.`);
    }
  }

  // Recarga la ficha completa del artista abierto.
  // Se usa cuando cambia una sección relacionada,
  // por ejemplo artist_stats.
  async function refreshEditingArtist() {
    if (!editingArtist?.id) {
      return;
    }

    try {
      await queryClient.invalidateQueries({
        queryKey: ["artists", "admin", "detail", editingArtist.id],
      });

      const fullArtist = await queryClient.fetchQuery(
        adminArtistByIdQueryOptions(editingArtist.id),
      );

      setEditingArtist(fullArtist);
    } catch {
      setNotice("No fue posible refrescar la información del artista.");
    }
  }

  // Publica un artista previamente creado como borrador.
  async function handlePublishArtist(artist) {
    try {
      await publishArtistMutation.mutateAsync(artist.id);

      setNotice(`"${artist.name}" fue publicado correctamente.`);
    } catch {
      setNotice(`No fue posible publicar "${artist.name}".`);
    }
  }

  // Archiva un artista publicado.
  async function handleArchiveArtist(artist) {
    try {
      await archiveArtistMutation.mutateAsync(artist.id);

      setNotice(`"${artist.name}" fue archivado correctamente.`);
    } catch {
      setNotice(`No fue posible archivar "${artist.name}".`);
    }
  }

  // Recupera un artista archivado y lo devuelve a borrador.
  async function handleRestoreArtist(artist) {
    try {
      await restoreArtistMutation.mutateAsync(artist.id);

      setNotice(`"${artist.name}" fue recuperado como borrador.`);
    } catch {
      setNotice(`No fue posible recuperar "${artist.name}".`);
    }
  }

  return (
    <div className="admin-shell">
      <div className="admin">
        <AdminSidebar section={section} onSectionChange={setSection} />

        <main className="admin__main">
          {section === "artists" ? (
            <>
              {isLoadingArtists && (
                <p className="admin__status">Cargando artistas...</p>
              )}

              {isArtistsError && (
                <p className="admin__status">
                  No fue posible cargar los artistas.
                </p>
              )}

              {!isLoadingArtists && !isArtistsError && (
                <AdminArtists
                  artists={artists}
                  onAdd={handleAddArtist}
                  onEdit={handleEditArtist}
                  onPublish={handlePublishArtist}
                  onArchive={handleArchiveArtist}
                  onRestore={handleRestoreArtist}
                  isPublishing={publishArtistMutation.isPending}
                  isArchiving={archiveArtistMutation.isPending}
                  isRestoring={restoreArtistMutation.isPending}
                />
              )}
            </>
          ) : (
            <AdminTeam />
          )}
        </main>
      </div>

      <AdminNotice message={notice} onClose={() => setNotice("")} />

      {modalOpen && (
        <ArtistModal
          open
          artist={editingArtist}
          onClose={closeArtistModal}
          onCreate={handleCreateArtist}
          onUpdate={handleUpdateArtist}
          onRefreshArtist={refreshEditingArtist}
          isLoading={
            createArtistMutation.isPending || updateArtistMutation.isPending
          }
        />
      )}
    </div>
  );
}

export default AdminPage;
