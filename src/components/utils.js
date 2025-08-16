import { animate, stagger, utils } from "animejs";

export function splitTextToTspan(textEl) {
  const textContent = textEl.textContent;
  textEl.textContent = "";

  const tspans = Array.from(textContent).map((char, index) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan"
    );
    tspan.setAttribute("dy", "0");
    tspan.textContent = char;
    textEl.append(tspan);
    return tspan;
  });

  return tspans;
}

export function animateGlitchText(
  tspans = [],
  finalText = "CONNECTING...",
  duration = 400
) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const totalChars = tspans.length;
  const lockSteps = Array(totalChars).fill(false);

  const instance = animate(tspans, {
    opacity: [0.1, 1],
    dy: [0, -1, 1, 0],
    duration,
    delay: stagger(100),
    ease: "outSine",
    loop: 6,
    onUpdate({ progress }) {
      // progress changes from 0 -1 based on the loop count
      tspans.forEach((tspan, i) => {
        const lockThreshold = (i + 1) / totalChars;

        if (progress >= lockThreshold) {
          // Lock in original character
          tspan.textContent = finalText[i];
          lockSteps[i] = true;
        } else if (!lockSteps[i] && finalText[i] !== " ") {
          // Show random char temporarily
          const randChar = charset[Math.floor(Math.random() * charset.length)];
          tspan.textContent = randChar;
        }
      });
    },
    onComplete() {
      utils.cleanInlineStyles(instance);
    },
  });
}

export function scrollProgress(dom = window) {}
