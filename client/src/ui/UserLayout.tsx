import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div className="flex h-screen">
      <div className="z-10 w-60 bg-red-500 shadow-right">
        Replace with navbar component
      </div>
      <div className="w-full grow overflow-hidden bg-primary">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
