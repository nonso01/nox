import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";
import { useState } from "react";


function App() {
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const [isMobile, setIsMobile] = useState(mobileQuery.matches);

  mobileQuery.addEventListener("change", (event) => {
    setIsMobile((m) => event.matches);
    // console.log(event.matches);
  });

  const [connected, setConnected] = useState(false);
  // set back to true to stop animation

  // Simulate a delay for connection, this state
  // is updated in the Connecting Component
  function handleSetConnected(c) {
    setConnected(c);
  }

  if (isMobile) {
    return (
      <MobileApp connected={connected} onSetConnected={handleSetConnected} />
    );
  } else if (!isMobile) {
    return (
      <DesktopApp connected={connected} onSetConnected={handleSetConnected} />
    );
  } else {
    return <h1>An error occured!, Please refresh</h1>;
  }
}

export default App;
