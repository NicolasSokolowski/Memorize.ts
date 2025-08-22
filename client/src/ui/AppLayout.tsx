import { Outlet } from "react-router-dom";
import "../flip.css";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div className="relative h-screen flex-col">
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
