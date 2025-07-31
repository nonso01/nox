import ConnectSVG from "./ConnectSVG";

import {
  createScope,
  createDraggable,
  createSpring,
  stagger,
  animate,
  utils,
  svg,
} from "animejs";
import { useRef, useEffect, useState } from "react";

const ONE_SECOND = 1000;
const HUNDRED = 100;
const log = console.log;

export default function Connecting({ connected, onSetConnected }) {
  const root = useRef(null);
  const scope = useRef(null);

  let t = "";

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // loading bars

      const [$percentText] = utils.$(".connecting  g.percent text");
      // log(percentText);

      animate(".connecting svg .loading-bars path", {
        fillOpacity: [0.1, 0.5, 1],
        filter: "url(#shadow)",
        delay: stagger(HUNDRED * 3),
        ease: "inBounce",
        onComplete({ duration }) {
          const dt = duration / ONE_SECOND;
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
