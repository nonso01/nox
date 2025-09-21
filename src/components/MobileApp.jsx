import { lazy, useState, useEffect } from "react";

const Connecting = lazy(() => import("./ui-shared/Connecting"));
const MobileHeader = lazy(() => import("./ui-mobile/MobileHeader"));

export default function MobileApp({ connected, onSetConnected }) {
  const [batteryInfo, setBatteryInfo] = useState({
    charging: false,
    level: 0,
  });

  useEffect(() => {
    const _ = navigator.getBattery().then((battery) => {
      // console.log(battery);
    });
  }, []);

  if (!connected) {
    return (
      <div className="mobile-app">
        <Connecting connected={connected} onSetConnected={onSetConnected} />
      </div>
    );
  } else {
    return (
      <div className="mobile-app" id="m-app">
        <MobileHeader />
        {/* <p>Welcome to the mobile version!</p> */}
      </div>
    );
  }
}
