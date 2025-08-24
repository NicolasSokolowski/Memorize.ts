import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function UserLayout() {
  return (
    <div className="relative h-screen w-full sm:flex">
      <div className="flex w-full justify-center rounded-sm bg-tertiary shadow-right sm:z-50 sm:w-72 sm:max-w-80 md:w-80">
        <NavBar />
      </div>
      <div className="scrollbar-hide size-full overflow-y-auto bg-primary">
        <Outlet />
      </div>
    </div>
  );
}

export default UserLayout;
