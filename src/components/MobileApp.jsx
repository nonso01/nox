import Connecting from "./ui-shared/Connecting";
import MobileNav from "./ui-mobile/MobileNav";

export default function MobileApp({ connected, onSetConnected }) {
  if (!connected) {
    return (
      <div className="mobile-app">
        <Connecting connected={connected} onSetConnected={onSetConnected} />
      </div>
    );
  } else {
    return (
      <div className="mobile-app" id="m-app">
        <MobileNav />
        <p>Welcome to the mobile version!</p>
      </div>
    );
  }
}
