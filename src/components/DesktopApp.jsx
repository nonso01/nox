import Text from "./Text";
import Connecting from "./Connecting";
// import { useState } from "react";
import { createScope } from "animejs";
import { useRef, useState, useEffect } from "react";

export default function DesktopApp({ connected, onSetConnected }) {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {});

    return () => scope.current.revert();
  }, []);

  if (!connected) {
    return (
      <div className="desktop-app">
        <Connecting connected={connected} onSetConnected={onSetConnected} />
      </div>
    );
  } else {
    return (
      <div className="desktop-app" ref={root}>
        <Text text="Desktop App, bravo!" />
      </div>
    );
  }
}
