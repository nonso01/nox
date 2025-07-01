import Text from "./Text";
import Connecting from "./Connecting";
import { useState } from "react";

export default function DesktopApp({ connected }) {
  if (!connected) {
    return (
      <div className="desktop-app">
        <Connecting />
      </div>
    );
  } else {
    return (
      <div className="desktop-app">
        <Text text="Desktop App" />
      </div>
    );
  }
}
