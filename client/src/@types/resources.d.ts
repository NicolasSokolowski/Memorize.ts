interface Resources {
  auth: {
    accountDeletedConfirmationMsg: "Your account has been deleted.<br /><br />You will soon receive a confirmation email concerning this deletion. You are going to be disconnect in {{count}} s.";
    buttons: {
      delete: "Delete my account";
      logout: "Logout";
      modifyEmail: "Modify my email address";
      modifyPassword: "Modify my password";
      modifyUsername: "Modify my username";
      signin: "Sign in";
      signup: "Sign up";
    };
    code: "Please enter the code you received on your mail :";
    connection: "Connection";
    currentPassword: "Current password";
    deleteAccountCheck: "Do you really want to delete your account ?";
    email: "Email address";
    emailChangedConfirmationMsg: "Your email address has been modified.<br /><br />You will soon receive a confirmation email concerning this modification.";
    emailCol: "Email address :";
    forgottenPassword: "Forgot password ?";
    hasAccount: "I already have an account";
    hasNoAccount: "I don't have an account";
    logoutCheck: "Do you really want to disconnect ?";
    myProfile: "My profile";
    "new password": "New password";
    newEmail: "New email address";
    newUsername: "New username";
    password: "Password";
    "password confirmation": "Password confirmation";
    "password reset": "Password reset";
    passwordChangedConfirmationMsg: "Your password has been modified. <br /><br />You will soon receive a confirmation email concerning this modification. You can already use your new password to sign in !";
    register: "Register";
    "reset success": "Success : A confirmation e-mail has been sent to you. You can already sign in with your new password.";
    success: "Success !";
    username: "Username";
    usernameCol: "Username :";
  };
  card: {
    allCards: "All cards";
    backSide: "Back side";
    deleteCard: "Do you really want to delete this card ?";
    frontSide: "Front side";
    myCards: "My cards";
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
