import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function UserLayout() {
  return (
    <div className="flex h-screen">
      <div className="z-50 flex w-80 justify-center rounded-sm bg-tertiary shadow-right">
        <NavBar />
      </div>
      <div className="scrollbar-hide w-full overflow-y-auto bg-primary">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
