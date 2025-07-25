import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();

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
          <li className="flex h-14 w-full items-center rounded-lg bg-primary p-2 px-4 font-patua text-xl text-white shadow-xl">
            <p className="w-full">Entraînement</p>
            <div className="flex items-center">
              <img
                src="/training.png"
                alt="Training icon"
                className="ml-2 w-20"
                draggable={false}
              />
            </div>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/decks")}
              className="flex h-14 w-full cursor-pointer items-center justify-between rounded-lg bg-secondary p-2 px-4 font-patua text-xl text-white shadow-xl"
            >
              <p>Mes decks</p>
              <img
                src="/deck.png"
                alt="Deck icon"
                className="w-24 translate-x-6"
                draggable={false}
              />
            </button>
          </li>
          <li className="flex h-14 w-full items-center rounded-lg bg-secondary p-2 px-4 font-patua text-xl text-white shadow-xl">
            <p className="w-full">Mes cartes</p>
            <div className="flex items-center">
              <img
                src="/card.png"
                alt="Card icon"
                className="ml-1 w-16"
                draggable={false}
              />
            </div>
          </li>
        </ol>
        <ol className="flex h-36 w-full flex-col gap-4">
          <li className="flex h-14 w-full items-center rounded-lg bg-secondary p-2 px-4 font-patua text-xl text-white shadow-xl">
            <p className="w-full">Mon profil</p>
            <div className="flex items-center">
              <img
                src="/profile.png"
                alt="Profile icon"
                className="ml-2 w-20"
                draggable={false}
              />
            </div>
          </li>
          <li className="flex h-14 w-full items-center rounded-lg bg-secondary p-2 px-4 font-patua text-xl text-white shadow-xl">
            <p className="w-full">Déconnexion</p>
            <div className="flex items-center">
              <img
                src="/logout.png"
                alt="Logout icon"
                className="ml-2 w-20"
                draggable={false}
              />
            </div>
          </li>
        </ol>
      </nav>
    </div>
  );
}

export default NavBar;
