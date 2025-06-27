import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <main className="flex min-h-screen w-full flex-col">
      <Outlet />
    </main>
  );
}

export default AppLayout;
