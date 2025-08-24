import { Outlet } from "react-router-dom";
import "../flip.css";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
