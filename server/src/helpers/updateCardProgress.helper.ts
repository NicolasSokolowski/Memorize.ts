const updateCardProgress = (cards) => {
  for (const card of cards) {
    const userAnswer = card.user_answer;

    if (card.difficulty === 0) {
      card.difficulty = 1;
    }

    if (card.next_occurrence === 0) {
      switch (userAnswer) {
        case "easy":
          card.win_streak += 1;
          card.difficulty = Math.ceil(card.difficulty * card.win_streak);
          card.next_occurrence = card.difficulty;

          // Met à jour le plafond d'anticipation
          card.max_early = card.difficulty + 3;
          break;

        case "medium":
          card.win_streak = 0;
          card.difficulty = Math.ceil(card.difficulty / 2);
          card.next_occurrence = card.difficulty;

          card.max_early = card.difficulty + 3;
          break;

        case "hard":
          card.win_streak = 0;
          card.difficulty = 1;
          card.next_occurrence = 1;
          card.max_early = 4;
          break;
      }
    } else {
      switch (userAnswer) {
        case "easy":
          if (card.difficulty < card.max_early) {
            card.difficulty += 1;
          }
          break;

        case "medium":
          card.difficulty = Math.max(1, card.difficulty - 1);
          card.win_streak = 0;
          break;

        case "hard":
          card.difficulty = 1;
          card.win_streak = 0;
          card.next_occurrence = 1;
          card.max_early = 4;
          break;
      }
    }
  }

  return cards;
};

export { updateCardProgress };
