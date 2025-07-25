function DeckModeSelection() {
  return (
    <div className="flex size-full flex-col">
      <h1 className="flex h-1/3 items-center justify-center font-patua text-8xl text-textPrimary">
        Sélectionnez un deck
      </h1>
      <div className="flex h-80 w-full justify-center">
        <div className="flex size-80 flex-col justify-between rounded-lg bg-tertiary bg-[url('/deck.png')] bg-cover shadow-xl">
          <div className="flex h-16 w-full items-center justify-center font-patua text-2xl">
            Choisir un deck
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeckModeSelection;
