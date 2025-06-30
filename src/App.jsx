import MobileApp from "./components/MobileApp";
import DesktopApp from "./components/DesktopApp";
import Text from "./components/Text";
import { useState } from "react";

function App() {
  const [mobileView, setMobileView] = useState(false);

  if (mobileView) {
    return <MobileApp />;
  } else if (!mobileView) {
    return <DesktopApp />;
  } else {
    return <Text text="no value passed" />;
  }
}

export default App;
