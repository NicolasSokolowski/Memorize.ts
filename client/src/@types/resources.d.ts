interface Resources {
  auth: {
    buttons: {
      signin: "Sign in";
      signup: "Sign up";
    };
    code: "Please enter the code you received on your mail :";
    connection: "Connection";
    forgottenPassword: "Forgot password ?";
    hasAccount: "I already have an account";
    hasNoAccount: "I don't have an account";
    "new password": "New password";
    password: "Password";
    "password confirmation": "Password confirmation";
    "password reset": "Password reset";
    register: "Register";
    "reset success": "Success : A confirmation e-mail has been sent to you. You can already sign in with your new password.";
    username: "Username";
  };
  common: {
    create: "Create";
    delete: "Delete";
    modify: "Modify";
  };
  deck: {
    deckDeleteNoCards: "Do you really want to delete this deck ?";
    deckDelete_one: "This will delete {{count}} card. Are you sure ?";
    deckDelete_other: "This will delete {{count}} cards. Are you sure ?";
    deckName: "Deck name";
    myDecks: "My decks";
  };
  home: {
    hero: {
      subtitle: "Study smarter. Remember longer. Build your own flashcard decks in seconds and practice at your own pace. Each session challenges you to recall what’s on the back of a card—then our smart system adapts the difficulty automatically. Quickly see what you’ve mastered and what still needs work, so you can focus on what matters most. Designed to make your progress clear, effective, and lasting—whether you’re preparing for exams, learning a new language, or mastering knowledge for life.";
    };
  };
  training: {
    buttons: {
      quit: "Quit";
      replay: "Replay";
    };
    cardsLeftCount_one: "One card left";
    cardsLeftCount_other: "Cards left : {{count}}";
    chooseDeck: "Choose a deck";
    dailyCards: "Daily cards";
    dailyCardsCount_one: "{{count}} card left";
    dailyCardsCount_other: "{{count}} cards left";
    difficultCards: "Difficult cards";
    difficultCardsCount_one: "{{count}} card";
    difficultCardsCount_other: "{{count}} cards";
    emptyDeck: "Empty deck";
    finished: "Finished !";
    noDecks: "No decks";
    scoreBoard: {
      easyCards: "Number of easy cards :";
      hardCards: "Number of difficult cards :";
      mediumCards: "Number of medium cards :";
      newCards: "Number of new cards :";
      scoreBoard: "Score board";
      studiedCards: "Number of cards studied :";
      successRate: "Success rate :";
      winningStreakCards: "Number of cards in a winning streak :";
    };
    selectDeck: "Select a deck";
    training: "Training";
  };
}

export default Resources;
