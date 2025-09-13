import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["deck", "card", "training"]);

  const deckPage =
    location.pathname.includes("/decks") &&
    !location.pathname.includes("/cards") &&
    !location.pathname.includes("/training");
  const cardPage = location.pathname.includes("/cards");
  const profilePage = location.pathname.includes("/profile");
  const trainingPage = location.pathname.includes("/training");

  return (
    <div className="absolute top-0 z-10 flex h-16 w-full justify-center bg-tertiary shadow-inner-strong sm:static sm:size-full sm:flex-col sm:justify-between sm:shadow-none">
      <div className="flex flex-col justify-between">
        <div className="hidden w-full justify-end p-2 sm:flex">
          <button className="mr-4 text-xl text-secondary">&larr;</button>
        </div>
        <div className="flex items-center justify-center">
          <div className="flex items-center justify-center rounded-full bg-primary shadow-inner-strong sm:size-40 lg:size-48">
            <div className="rounded-full bg-white shadow-inner-strong sm:size-32 lg:size-40"></div>
          </div>
        </div>
      </div>
      <nav className="mx-4 my-2 flex h-full justify-between sm:mt-6 sm:flex-col">
        <ol className="flex w-full gap-12 xs:gap-16 sm:h-48 sm:flex-col sm:gap-4">
          <li>
            <button
              onClick={() => navigate("/user/training/mode")}
              className={`relative flex size-12 cursor-pointer items-center justify-center rounded-full sm:h-14 sm:w-full sm:justify-between sm:rounded-lg ${trainingPage ? "bg-primary" : "bg-secondary"} animate-pop p-4 py-2 font-patua text-white shadow-custom-light transition-all duration-500 lg:text-xl`}
            >
              <span className="hidden sm:block">{t("training:training")}</span>
              <img
                src="/training.png"
                alt="Training icon"
                className="absolute sm:right-2 sm:w-12 md:w-16"
                draggable={false}
              />
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/decks")}
              className={`relative flex size-12 cursor-pointer items-center justify-center rounded-full sm:h-14 sm:w-full sm:justify-between sm:rounded-lg ${deckPage ? "bg-primary" : "bg-secondary"} animate-pop px-4 py-2 font-patua text-white shadow-custom-light transition-all duration-500 lg:text-xl`}
            >
              <span className="hidden sm:block">{t("deck:myDecks")} </span>
              <img
                src="/deck.png"
                alt="Deck icon"
                className="absolute w-24 sm:right-[-8px] sm:w-20 md:w-24"
                draggable={false}
              />
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/cards")}
              className={`relative flex size-12 cursor-pointer items-center justify-center rounded-full sm:h-14 sm:w-full sm:justify-between sm:rounded-lg ${cardPage ? "bg-primary" : "bg-secondary"} animate-pop p-2 px-4 font-patua text-white shadow-custom-light transition-all duration-500 lg:text-xl`}
            >
              <span className="hidden sm:block">{t("card:myCards")}</span>
              <img
                src="/card.png"
                alt="Card icon"
                className="absolute sm:right-2 sm:w-12 md:right-3 md:w-14"
                draggable={false}
              />
            </button>
          </li>
          <li>
            <button
              onClick={() => navigate("/user/profile")}
              className={`relative size-12 cursor-pointer items-center justify-center rounded-full sm:flex sm:h-14 sm:w-full sm:justify-between sm:rounded-lg ${profilePage ? "bg-primary" : "bg-secondary"} animate-pop p-2 px-4 font-patua text-white shadow-custom-light transition-all duration-500 lg:text-xl`}
            >
              <span className="hidden sm:block">Mon profil</span>
              <img
                src="/profile.png"
                alt="Deck icon"
                className="absolute inset-0 m-auto w-14 sm:inset-auto sm:right-2 sm:m-0 md:w-16"
                draggable={false}
              />
            </button>
          </li>
        </ol>
      </nav>
    </div>
  );
}

export default NavBar;
