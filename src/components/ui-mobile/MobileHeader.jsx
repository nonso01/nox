import { lazy } from "react";

const MobileNav = lazy(() => import("./MobileNav"));

export default function MobileHeader({ batteryInfo }) {
  return (
    <header className="m-header flex column between debug">
      <MobileNav />
      <section className="debug">
        <div>
          <p className="font-orbitron">HELLO</p>
          <h1>
            I'm <span>Martin</span>
            <br /> Web Developer
          </h1>
        </div>
        <p>Welcome to mobile version</p>
      </section>
    </header>
  );
}
