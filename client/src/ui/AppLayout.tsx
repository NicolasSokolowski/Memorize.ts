import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="flex h-screen flex-col">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
