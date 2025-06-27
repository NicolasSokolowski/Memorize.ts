function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-10 bg-primary">
      <div className="flex h-128 w-128 flex-col justify-end gap-8">
        <div className="flex h-40 w-128 items-center justify-center">
          <img
            src="/logo.png"
            alt="GrowMind Logo"
            className="h-full object-contain"
          />
          <h1 className="mr-10 font-patua text-6xl text-tertiary">growMind</h1>
        </div>
        <div className="flex h-72 w-128 items-center self-end rounded-md border-gray-300 bg-white shadow-inner-strong">
          <div className="m-4 font-patua">
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
          </div>
        </div>
      </div>
      <div className="h-128 w-100  rounded-md border-gray-300 bg-white shadow-inner-strong"></div>
    </div>
  );
}

export default Home;
