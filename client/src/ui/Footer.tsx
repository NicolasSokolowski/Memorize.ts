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
      <div className={`w-96 ${isHome && "hidden"}`} />
      <div className="mx-20 flex w-full items-center justify-between font-patua text-lg text-textPrimary">
        <p>CGU</p>
        <p>About us</p>
        <p>Contact</p>
        <p>© 2025 Memorize. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
