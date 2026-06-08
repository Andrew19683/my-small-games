import { generateAnswer, checkGuess } from "./logic.ts";
import {
  getGuess,
  renderInputError,
  renderResult,
  renderPopup,
  renderNewLine,
} from "./render.ts";
import type { CheckResult } from "./logic.ts";

const answerLength = 4;
const answer: string = generateAnswer(answerLength);
const finalAttempt: number = 10;
let attempt: number = 1;

const submitBtn = document.getElementById("submit") as HTMLButtonElement;
submitBtn.addEventListener("click", () => {
  const guess: string | null = getGuess(answerLength, attempt);
  if (guess === null) {
    renderInputError(attempt, "missingFields");
  } else {
    const result: CheckResult = checkGuess(guess, answer);
    renderResult(answerLength, attempt, result);
    attempt++;

    if (result.rightPosition === answerLength) {
      renderPopup("win");
    } else if (attempt > finalAttempt) {
      renderPopup("lose", answer);
    } else {
      renderNewLine(answerLength, attempt);
    }
  }
});
