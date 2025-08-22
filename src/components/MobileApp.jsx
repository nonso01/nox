import Connecting from "./ui-shared/Connecting";

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
        <p>Welcome to the mobile version!</p>
      </div>
    );
  }
}
