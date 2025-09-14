import { lazy } from "react";

const MobileNav = lazy(() => import("./MobileNav"));

export default function MobileHeader({batteryInfo}) {
  return (
    <header className="m-header debbug">
      <MobileNav />
      <p>Welcome to mobile version</p>
    </header>
  );
}
