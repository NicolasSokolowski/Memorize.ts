import { useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const deckPage =
    location.pathname.includes("/decks") &&
    !location.pathname.includes("/cards") &&
    !location.pathname.includes("/training");
  const cardPage = location.pathname.includes("/cards");
  const profilePage = location.pathname.includes("/profile");
  const trainingPage = location.pathname.includes("/training");

  return (
    <div className="flex h-full w-60 flex-col justify-between bg-tertiary">
      <div className="flex flex-col justify-between">
        <div className="flex w-full justify-end p-2">
          <button className="text-xl text-secondary">&larr;</button>
        </div>
        <div className="flex h-52 items-center justify-center">
          <div className="flex size-48 items-center justify-center rounded-full bg-primary shadow-inner-strong">
            <div className="size-40 rounded-full bg-white text-center shadow-inner-strong"></div>
          </div>
        </div>
      </div>
      <nav className="mt-6 flex h-full flex-col justify-between">
        <ol className="flex h-48 w-full flex-col gap-4">
          <li>
            <button
              onClick={() => navigate("/user/training/mode")}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-lg ${trainingPage ? "bg-primary" : "bg-secondary"} p-2 px-4 font-patua text-xl text-white shadow-custom-light`}
            >
              <span>Entraînement</span>
              <div className="flex items-center">
                <img
                  src="/training.png"
                  alt="Training icon"
                  className="w-16 translate-x-2"
                  draggable={false}
                />
              </div>
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/decks")}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-lg ${deckPage ? "bg-primary" : "bg-secondary"} p-2 px-4 font-patua text-xl text-white shadow-custom-light`}
            >
              <span>Mes decks</span>
              <img
                src="/deck.png"
                alt="Deck icon"
                className="w-24 translate-x-6"
                draggable={false}
              />
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/cards")}
              className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-lg ${cardPage ? "bg-primary" : "bg-secondary"} p-2 px-4 font-patua text-xl text-white shadow-custom-light`}
            >
              <span>Mes cartes</span>
              <img
                src="/card.png"
                alt="Card icon"
                className="ml-1 w-14 translate-x-1"
                draggable={false}
              />
            </button>
          </li>
        </ol>
        <div className="mb-5 flex h-36 w-full items-end">
          <button
            onClick={() => navigate("/user/profile")}
            className={`flex h-14 w-full cursor-pointer items-center justify-between rounded-lg ${profilePage ? "bg-primary" : "bg-secondary"} p-2 px-4 font-patua text-xl text-white shadow-custom-light`}
          >
            <span>Mon profil</span>
            <img
              src="/profile.png"
              alt="Deck icon"
              className="w-16 translate-x-3"
              draggable={false}
            />
          </button>
        </div>
      </nav>
    </div>
  );
}

export default NavBar;
