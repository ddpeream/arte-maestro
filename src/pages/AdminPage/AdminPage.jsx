import { useState } from "react";

import AdminSidebar from "../../features/admin/components/AdminSidebar";
import AdminNotice from "../../features/admin/components/AdminNotice";
import AdminTeam from "../../features/admin/components/AdminTeam";

import AdminArtists from "../../features/artists/components/admin/AdminArtists";
import ArtistModal from "../../features/artists/components/admin/ArtistModal";

import "./AdminPage.css";

// Coordina la navegación y el estado local del panel.
function AdminPage() {
  const [section, setSection] = useState("artists");
  const [artists, setArtists] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState("");

  // Agrega un borrador temporal sin enviarlo a Supabase.
  function createArtist(artist) {
    setArtists((current) => [
      {
        ...artist,
        id: crypto.randomUUID(),
        publication_status: "draft",
        created_at: new Date().toISOString(),
      },
      ...current,
    ]);

    setModalOpen(false);
    setNotice(
      "Borrador agregado a la vista local. Aún no se ha guardado en Supabase.",
    );
  }

  return (
    <div className="admin-shell">
      <div className="admin">
        <AdminSidebar section={section} onSectionChange={setSection} />

        <main className="admin__main">
          {section === "artists" ? (
            <AdminArtists artists={artists} onAdd={() => setModalOpen(true)} />
          ) : (
            <AdminTeam />
          )}
        </main>
      </div>

      <AdminNotice message={notice} onClose={() => setNotice("")} />

      <ArtistModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={createArtist}
      />
    </div>
  );
}

export default AdminPage;
