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
const ONE_HUNDRED = 100;
const log = console.log;

export default function Connecting({ connected, onSetConnected }) {
  const hundredth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const tenth = [...hundredth];
  const unith = [0, 1];

  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // animate(".connecting svg .cube-plus path", {
      // });
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
