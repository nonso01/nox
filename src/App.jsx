import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";
import Text from "./components/Text";
import { useState } from "react";

const CONNECT_DELAY_TIME = 6e3;

function App() {
  const mobileQuery = window.matchMedia("(max-width: 768px)");
  const [isMobile, setIsMobile] = useState(mobileQuery.matches);

  mobileQuery.addEventListener("change", (event) => {
    setIsMobile((m) => event.matches);
    // console.log(event.matches);
  });

  const [connected, setConnected] = useState(false); // set back to true to test

  // Simulate a delay for connection, this state
  // is updated in the Connecting Component
  function handleSetConnected(c) {
    setConnected(c);
  }

  if (isMobile) {
    return <MobileApp connected={connected} />;
  } else if (!isMobile) {
    return (
      <DesktopApp connected={connected} onSetConnected={handleSetConnected} />
    );
  } else {
    return <Text text="An error occured!, Please refresh" />;
  }
}

export default App;
