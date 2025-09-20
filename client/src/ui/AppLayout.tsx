import { Outlet } from "react-router-dom";
import "../flip.css";
import Footer from "./Footer";
import LastPathSaver from "./LastPathSaver";

function AppLayout() {
  return (
    <div className="flex h-screen-dvh flex-col">
      <LastPathSaver />
      <main className="scrollbar-hide flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
