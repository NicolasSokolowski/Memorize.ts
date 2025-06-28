function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 bg-primary">
      <section className="flex h-128 w-128 flex-col justify-end gap-8">
        <div className="flex h-40 w-128 items-center justify-center">
          <img
            src="/logo.png"
            alt="GrowMind Logo"
            className="h-full object-contain"
          />
          <h1 className="mr-10 font-patua text-6xl text-tertiary">growMind</h1>
        </div>
        <div className="flex h-72 w-128 items-center self-end rounded-md border-gray-300 bg-white shadow-inner-strong">
          <article className="m-4 font-patua">
            Apprenez plus intelligemment, pas plus longtemps. <br /> Créez vos
            propres decks de révision, ajoutez-y des cartes en quelques
            secondes, et entraînez-vous à votre rythme. <br /> Lors d'une
            session, la face avant s’affiche : à vous de deviner ce qui se
            trouve au dos. Une fois révélé, notre système analyse vos réponses
            et adapte la difficulté de chaque carte automatiquement. Séparez ce
            qui est assimilé de ce qui ne l’est pas. Vous vous concentrez sur
            l’essentiel, et votre progression devient vraiment visible. <br />
            Simple, efficace, et pensé pour durer — que ce soit pour vos études,
            une nouvelle langue ou un savoir à ancrer durablement.
          </article>
        </div>
      </section>
      <section className="h-128 w-100  rounded-md border-gray-300 bg-white shadow-inner-strong">
        <h2 className="m-5 text-center font-patua text-4xl">Inscription</h2>
        <form className="flex flex-col items-center justify-center gap-2 p-5">
          <div className="flex flex-col items-start gap-2">
            <label className="font-patua text-xl" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="text"
              placeholder="Adresse e-mail"
              className="h-12 w-80 rounded-md border-gray-300 bg-tertiary p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label className="font-patua text-xl" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="text"
              placeholder="Mot de passe"
              className="h-12 w-80 rounded-md border-gray-300 bg-tertiary p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
            />
          </div>
          <div className="flex flex-col items-start gap-2">
            <label className="font-patua text-xl" htmlFor="username">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              type="text"
              placeholder="Nom d'utilisateur"
              className="h-12 w-80 rounded-md border-gray-300 bg-tertiary p-2 pl-3 font-patua text-black shadow-inner-strong placeholder:text-black/20 placeholder:text-opacity-70"
            />
          </div>
          <button className="mt-5 w-80 rounded-md bg-secondary p-3 shadow-xl">
            <span className="rounded-md font-patua text-3xl text-white">
              S'inscrire
            </span>
          </button>
          <div className="flex w-80 justify-between">
            <button className="font-patua text-sm text-secondary underline underline-offset-2">
              J'ai déjà un compte
            </button>
            <p className="font-patua text-sm text-secondary underline underline-offset-2">
              {/* Modify later to a Link */}
              Mot de passe oublié ?
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Home;
