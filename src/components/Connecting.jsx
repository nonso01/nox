import {
  createScope,
  // createSpring,
  stagger,
  animate,
  utils,
  // createTimeline,
} from "animejs";
import { useRef, useEffect, useState } from "react";
import { splitTextToTspan, animateGlitchText } from "./utils";
import { ConnectSVG } from "./Svgs";

const ONESEC = 1000;
const HUNDRED = 100;

const log = console.log;

export default function Connecting({ connected, onSetConnected }) {
  const root = useRef(null);
  const scope = useRef(null);

  let t = "";

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      const [$percentText] = utils.$(".connecting  g.percent text");
      const [$connectTextParent] = utils.$(".connecting g.con text");
      const $connectTexts = splitTextToTspan($connectTextParent);

      // loading bars
      animate(".connecting svg .loading-bars path", {
        fillOpacity: [0.1, 0.5, 1],
        filter: "url(#shadow)",
        delay: stagger(HUNDRED * 3),
        ease: "inBounce",
        onComplete({ duration }) {
          const dt = duration / ONESEC;
          log(`completed after: ${dt}sec`);
          onSetConnected(true);
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
      {/* <style jsx="true">{``}</style> */}
    </div>
  );
}
