import { Outlet } from "react-router-dom";

function SearchBarLayout() {
  return (
    <>
      <div className="relative h-12 bg-white shadow-bottom"></div>
      <Outlet />
    </>
  );
}

export default SearchBarLayout;
