import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import AdminSidebar from "../../features/admin/components/AdminSidebar";
import AdminNotice from "../../features/admin/components/AdminNotice";
import AdminTeam from "../../features/admin/components/AdminTeam";

import AdminArtists from "../../features/artists/components/admin/AdminArtists";
import ArtistModal from "../../features/artists/components/admin/ArtistModal";

import { adminArtistsQueryOptions } from "../../features/artists/api/artistsQueries";
import {
  useCreateArtistMutation,
  usePublishArtistMutation,
  useArchiveArtistMutation,
} from "../../features/artists/api/artistsMutations";

import "./AdminPage.css";

// Coordina la navegación y las operaciones principales del panel.
function AdminPage() {
  const [section, setSection] = useState("artists");
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  // Trae todos los artistas visibles para administración.
  const {
    data: artists = [],
    isLoading: isLoadingArtists,
    isError: isArtistsError,
  } = useQuery(adminArtistsQueryOptions);

  // Crea artistas reales en Supabase.
  const createArtistMutation = useCreateArtistMutation();

  // Publica un artista y actualiza el catálogo.
  const publishArtistMutation = usePublishArtistMutation();

  // Archiva un artista y lo retira del catálogo público.
  const archiveArtistMutation = useArchiveArtistMutation();

  // Guarda un nuevo artista como borrador.
  async function handleCreateArtist(artist) {
    try {
      await createArtistMutation.mutateAsync(artist);

      setModalOpen(false);
      setNotice("Artista creado correctamente como borrador.");
    } catch {
      setNotice("No fue posible crear el artista.");
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
                  onAdd={() => setModalOpen(true)}
                  onPublish={handlePublishArtist}
                  onArchive={handleArchiveArtist}
                  isPublishing={publishArtistMutation.isPending}
                  isArchiving={archiveArtistMutation.isPending}
                />
              )}
            </>
          ) : (
            <AdminTeam />
          )}
        </main>
      </div>

      <AdminNotice message={notice} onClose={() => setNotice("")} />

      <ArtistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateArtist}
        isLoading={createArtistMutation.isPending}
      />
    </div>
  );
}

export default AdminPage;
