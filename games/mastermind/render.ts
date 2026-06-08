import type { CheckResult } from "./logic.ts";

export function getGuess(answerLength: number, attempt: number): string | null {
  let guess: string = "";
  for (let i = 1; i <= answerLength; i++) {
    const input = document.querySelector<HTMLInputElement>(
      `#input-${attempt}-${i}`,
    );
    const inputValue: string | undefined = input?.value;
    if (!inputValue) {
      return null;
    } else {
      guess += inputValue;
    }
  }
  return guess;
}

export function renderInputError(
  attempt: number,
  errorType: "missingFields",
): void {
  const infoNode = document.getElementById(`info-${attempt}`) as HTMLElement;

  switch (errorType) {
    case "missingFields":
      const message: string = "Что-то не заполнено";
      infoNode.textContent = message;
      infoNode.classList.add("info-error");
  }
}

export function renderResult(
  answerLength: number,
  attempt: number,
  result: CheckResult,
): void {
  for (let i = 0; i <= answerLength; i++) {
    const input = document.querySelector<HTMLInputElement>(
      `#input-${attempt}-${i}`,
    );
    if (input) {
      input.disabled = true;
    }
  }

  const infoNode = document.getElementById(`info-${attempt}`) as HTMLElement;
  infoNode.classList.remove("info-error"); // на случай если ранее была ошибка
  infoNode.textContent = `🟩: ${result.rightPosition}, 🟨: ${result.rightMissplaced}, ⬜️: ${result.wrong}`;
}

export function renderNewLine(answerLength: number, attempt: number): void {
  const gameDiv = document.querySelector("#game") as HTMLElement;
  const nextAttemptDiv = document.createElement("div");
  nextAttemptDiv.id = `attempt-${attempt}`;
  gameDiv.appendChild(nextAttemptDiv);
  for (let i = 1; i <= answerLength; i++) {
    const input = document.createElement("input");
    input.type = "number";
    input.min = "0";
    input.max = "9";
    input.oninput = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.value.length > 1) {
        target.value = target.value.slice(0, 1);
      }
    };
    input.id = `input-${attempt}-${i}`;
    nextAttemptDiv.appendChild(input);
  }

  const span = document.createElement("span");
  span.classList.add("info-message");
  span.id = `info-${attempt}`;
  nextAttemptDiv.appendChild(span);
}

export function renderPopup(state: "win" | "lose", answer?: string): void {
  const submitBtn = document.querySelector("#submit") as HTMLButtonElement;
  if (submitBtn) {
    submitBtn.hidden = true;
  }

  const popup = document.querySelector(".popup") as HTMLDialogElement;
  popup.showModal();
  const popupHeadline = document.querySelector("#popup-headline");
  if (popupHeadline && state === "lose") {
    popupHeadline.textContent = "Вы проиграли :(";
  } else if (popupHeadline && state === "win") {
    popupHeadline.textContent = "Поздравляем! Вы разгадали код!";
  }
  const popupInfo = document.querySelector("#popup-info");
  if (popupInfo && state === "lose") {
    popupInfo.textContent = `Правильный ответ был: ${answer}.\nПопробуем ещё раз?`;
  } else if (popupInfo && state === "win") {
    popupInfo.textContent = "Сыграем еще?";
  }
  const reloadBtn = document.querySelector("#reload");
  reloadBtn?.addEventListener("click", () => {
    window.location.reload();
  });
  const closeBtn = document.querySelector("#close");
  closeBtn?.addEventListener("click", () => {
    popup.close();
  });
}
