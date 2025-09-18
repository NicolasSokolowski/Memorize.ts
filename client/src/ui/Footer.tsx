import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const isTraining =
    location.pathname.includes("/training") &&
    !location.pathname.includes("/mode") &&
    !location.pathname.includes("/decks");

  const isHome = !location.pathname.includes("user");

  return (
    <footer
      className={`absolute bottom-0 right-0 flex h-10 w-full bg-white ${isTraining && "hidden"} shadow-inner-strong`}
    >
      <div className={`sm:w-96 ${isHome && "hidden"}`} />
      <div className="mx-10 flex w-full items-center justify-center gap-8 font-patua text-sm text-textPrimary sm:mx-20 sm:justify-between sm:gap-0 sm:text-base lg:text-lg">
        <p>CGU</p>
        <p>About us</p>
        <p>Contact</p>
        <p>© 2025 Snapcard</p>
      </div>
    </footer>
  );
}

export default Footer;
