export interface CheckResult {
  rightPosition: number;
  rightMissplaced: number;
  wrong: number;
}

export function generateAnswer(len: number): string {
  return Math.floor(Math.random() * 10000)
    .toString()
    .padStart(len, "0");
}

export function checkGuess(guess: string, answer: string): CheckResult {
  // возможно для перестаровки стоит добавить проверку, что длины guess и answer совпадают
  let leftInAnswer: string = "";
  let leftInGuess: string = "";
  // сперва соберем rightPosition
  let rightPosition: number = 0;
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === guess[i]) {
      rightPosition++;
    } else {
      leftInAnswer += answer[i];
      leftInGuess += guess[i];
    }
  }

  // теперь соберем неправильные позиции
  let rightMissplaced: number = 0;
  for (let i = 0; i < leftInGuess.length; i++) {
    if (leftInAnswer.includes(leftInGuess[i])) {
      rightMissplaced++;
      leftInAnswer = leftInAnswer.replace(leftInGuess[i], "");
    }
  }

  const wrong: number = answer.length - rightPosition - rightMissplaced;

  return {
    rightPosition: rightPosition,
    rightMissplaced: rightMissplaced,
    wrong: wrong,
  };
}
