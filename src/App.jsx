import { useEffect, useState, lazy } from "react";

const MobileApp = lazy(() => import("./components/MobileApp"));
const DesktopApp = lazy(() => import("./components/DesktopApp"));

const mobileQuery = window.matchMedia("(width <= 850px)");

function App() {
  const [isMobile, setIsMobile] = useState(mobileQuery.matches);
  const [connected, setConnected] = useState(true); // start true to stop animation

  useEffect(() => {
    const handler = (event) => setIsMobile(c => event.matches);

    mobileQuery.addEventListener("change", handler);

    // cleanup to avoid memory leaks
    return () => {
      mobileQuery.removeEventListener("change", handler);
    };
  }, []);

  function handleSetConnected(c) {
    setConnected(c);
  }

  if (isMobile) {
    return (
      <MobileApp connected={connected} onSetConnected={handleSetConnected} />
    );
  }
  return (
    <DesktopApp connected={connected} onSetConnected={handleSetConnected} />
  );
}

export default App;
