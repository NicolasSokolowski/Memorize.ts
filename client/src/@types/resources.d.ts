interface Resources {
  auth: {
    accountDeletedConfirmationMsg: "Your account has been deleted. You will soon receive a confirmation email concerning this deletion. You are going to be disconnect in {{count}} s.";
    buttons: {
      "delete-user": "Delete my account";
      "edit-email": "Modify my email address";
      "edit-password": "Modify my password";
      "edit-username": "Modify my username";
      logout: "Logout";
      signin: "Sign in";
      signup: "Sign up";
    };
    code: "Please enter the code you received on your mail :";
    connection: "Connection";
    currentPassword: "Current password";
    deleteAccountCheck: "Do you really want to delete your account ?";
    email: "Email address";
    emailChangedConfirmationMsg: "Your email address has been modified. You will soon receive a confirmation email concerning this modification.";
    emailCol: "Email address :";
    forgottenPassword: "Forgot password ?";
    hasAccount: "I already have an account";
    hasNoAccount: "I don't have an account";
    logoutCheck: "Do you really want to disconnect ?";
    myProfile: "My profile";
    newEmail: "New email address";
    newPassword: "New password";
    newUsername: "New username";
    password: "Password";
    passwordChangedConfirmationMsg: "Your password has been modified. You will soon receive a confirmation email concerning this modification. You can already use your new password to sign in !";
    passwordConfirmation: "Password confirmation";
    passwordReset: "Password reset";
    register: "Register";
    resetSuccess: "Success : A confirmation e-mail has been sent to you. You can already sign in with your new password.";
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
  errors: {
    ACCESS_DENIED: "Access denied";
    CREDENTIALS_ERROR: "Invalid Email or password";
    DATABASE_ERROR: "Error while trying to connect to the database";
    DUPLICATE_ENTRY: "{{label}} already exists";
    EMAIL_ALREADY_EXISTS: "Email address is already in use";
    EXPIRED_CODE: "Expired code";
    INVALID_CODE: "Invalid code";
    INVALID_CURRENT_PASSWORD: "Current password is incorrect";
    INVALID_DATA: "Invalid data";
    INVALID_PARAMETER: "Invalid parameter";
    NOT_FOUND: "Not found";
    PASSWORD_ERROR: "Internal error";
    UNAUTHORIZED: "Unauthorized";
    UNKNOWN: "Unknown error";
    VERIFICATION_CODE_SEND_FAILED: "Error while trying to send code";
    allFields: "All fields are required";
    back: "Back side";
    email: "Email address";
    front: "Front side";
    name: "Name";
    newEmail: "New email";
    newPassword: "New password";
    password: "Password";
    passwordMisMatch: "Passwords doesn't match";
    username: "Username";
    validation: {
      "any.only": "New password and it's confirmation are different";
      "any.required": "{{label}} is required";
      empty: "{{label}} cannot be empty";
      noChange: "{{label}} is identical to its current value";
      "string.email": "{{label}} must be a valid email address";
      "string.empty": "{{label}} cannot be empty";
      "string.max": "{{label}} must be at most {{limit}} characters long";
      "string.min": "{{label}} must be at least {{limit}} characters long";
      "string.passwordComplexity": "{{label}} must contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
      "string.pattern.base": "{{label}} does not match the required format";
    };
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
