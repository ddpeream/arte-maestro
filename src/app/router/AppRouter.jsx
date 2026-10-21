import { Navigate, Route, Routes } from "react-router";

import PublicLayout from "../../components/layout/PublicLayout/PublicLayout";

import HomePage from "../../pages/HomePage/HomePage";
import ArtistsPage from "../../pages/ArtistsPage/ArtistsPage";
import ArtistDetailPage from "../../pages/ArtistDetailPage/ArtistDetailPage";
import StorePage from "../../pages/StorePage/StorePage";
import NewsPage from "../../pages/NewsPage/NewsPage";
import AdminPage from "../../pages/AdminPage/AdminPage";

function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/artistas" element={<ArtistsPage />} />
        <Route path="/tienda" element={<StorePage />} />
        <Route path="/servicios" element={<Navigate to="/tienda" replace />} />
        <Route path="/noticias" element={<NewsPage />} />

        <Route path="/artistas/:slug" element={<ArtistDetailPage />} />
      </Route>

      <Route path="/admin" element={<AdminPage />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;
