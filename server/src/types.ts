export interface MastermindRoom {
  id: string;
  player1: string;
  player2: string | null;
  answer: string | null;
  currentAttempt: number;
  currentRound: {
    player1Guess: string | null;
    player1Result: CheckResult | null;
    player2Guess: string | null;
    player2Result: CheckResult | null;
  };
}

export interface CheckResult {
  rightPosition: number;
  rightMissplaced: number;
  wrong: number;
}
