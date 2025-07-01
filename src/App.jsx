import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";
import Text from "./components/Text";
import { useState } from "react";

const CONNECT_DELAY_TIME = 6e3;

function App() {
  const [mobileView, setMobileView] = useState(false);
  const [connected, setConnected] = useState(false);

  if (mobileView) {
    return <MobileApp connected={connected} />;
  } else if (!mobileView) {
    return <DesktopApp connected={connected} />;
  } else {
    return <Text text="no value passed" />;
  }
}

export default App;
