import SignupForm from "../features/user/SignupForm";
import LoginForm from "../features/user/LoginForm";
import { useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const hasAccount = useAppSelector((state) => state.user.hasAccount);
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/user/decks");
    }
  });

  return (
    <div className="flex min-h-full flex-col items-center justify-start bg-primary">
      <div className="mx-4 sm:w-2/3">
        <div className="mt-5 flex justify-center sm:gap-6">
          <img
            src="/card.png"
            alt="Memorize Logo"
            className="h-36 object-contain sm:h-44 lg:h-56 xl:h-64"
            draggable={false}
          />
          <h1 className="flex items-center font-patua text-5xl text-tertiary sm:text-6xl lg:text-8xl xl:text-9xl">
            Memorize
          </h1>
        </div>
        <div className="relative flex w-full flex-col justify-start">
          <div className="h-full lg:w-2/4">
            <article className="m-6 flex items-center text-center font-patua text-xl lg:m-2 lg:ml-0 lg:mr-16 lg:h-144 lg:text-lg xl:text-xl 2xl:text-2xl">
              Apprenez plus intelligemment, pas plus longtemps. Créez vos
              propres decks de révision, ajoutez-y des cartes en quelques
              secondes, et entraînez-vous à votre rythme. Lors d'une session, la
              face avant s’affiche : à vous de deviner ce qui se trouve au dos.
              Une fois révélé, notre système analyse vos réponses et adapte la
              difficulté de chaque carte automatiquement. Séparez ce qui est
              assimilé de ce qui ne l’est pas. Vous vous concentrez sur
              l’essentiel, et votre progression devient vraiment visible.
              Simple, efficace, et pensé pour durer — que ce soit pour vos
              études, une nouvelle langue ou un savoir à ancrer durablement.
            </article>
          </div>
          <div
            className={`flip-box mx-auto mb-2 flex h-144 justify-center lg:absolute lg:right-0 lg:top-8 xl:top-6 2xl:top-4 ${hasAccount ? "flip" : ""}`}
          >
            <div className="flip-box-inner">
              <div className="flip-box-a">
                <SignupForm />
              </div>
              <div className="flip-box-b">
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
