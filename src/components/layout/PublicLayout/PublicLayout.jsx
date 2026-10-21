import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import MediaModal from "../../media/MediaModal/MediaModal";
import "./PublicLayout.css";

function PublicLayout() {
  return (
    <div className="public-layout">
      <div className="arte-maestro-grain" aria-hidden="true" />

      <Navbar />

      <Outlet />

      <Footer />

      <MediaModal />
    </div>
  );
}

export default PublicLayout;
