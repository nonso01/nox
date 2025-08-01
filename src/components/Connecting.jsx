import ConnectSVG from "./ConnectSVG";

import {
  createScope,
  createSpring,
  stagger,
  animate,
  utils,
  createTimeline,
} from "animejs";
import { useRef, useEffect, useState } from "react";

const ONESEC = 1000;
const HUNDRED = 100;

const log = console.log;

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

export default function Connecting({ connected, onSetConnected }) {
  const root = useRef(null);
  const scope = useRef(null);

  let t = "";

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      const [$percentText] = utils.$(".connecting  g.percent text");
      const [$conText] = utils.$(".connecting g.con text");
      const $connectTexts = splitTextToTspan($conText);

      // loading bars
      animate(".connecting svg .loading-bars path", {
        fillOpacity: [0.1, 0.5, 1],
        filter: "url(#shadow)",
        delay: stagger(HUNDRED * 3),
        ease: "inBounce",
        onComplete({ duration }) {
          const dt = duration / ONESEC;
          log(`completed after: ${dt}sec`);
          // onSetConnected(true);
        },
        onUpdate({ currentTime, duration }) {
          const dt = Math.round((currentTime / duration) * HUNDRED);
          dt < 10 && dt < HUNDRED
            ? (t = `00${dt}`)
            : dt > 10 && dt < HUNDRED
            ? (t = `0${dt}`)
            : (t = `${dt}`);

          // log(t)
          $percentText.textContent = t;
        },
      });

      //connecting.. texts
      animateGlitchText($connectTexts);

      // animate first tris
      // {
      //   const tl = createTimeline({ defaults: { ease: "inElastic", duration: ONESEC *2 } });
      //   const [circle, rect, line, triangle] = utils.$(
      //     ".connecting svg g.tris-1 *"
      //   );

      //   tl.add(
      //     circle,
      //     {
      //       x: "300px",
      //       y: "100px",
      //       loop: 4,
      //       reversed: true,
      //       alternate: true,
      //     },
      //     0
      //   ).add(
      //     rect,
      //     {
      //       rotate: 360,
      //       loop: 4,
      //     },
      //     0
      //   );
      // }
    });

    return () => scope.current.revert();
  }, []);

  return (
    <div className="connecting flex center" ref={root}>
      <ConnectSVG />
      <style jsx="true">{``}</style>
    </div>
  );
}
