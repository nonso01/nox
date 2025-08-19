import Connecting from "./Connecting";
import Header from "./ui-desktop/Header";
import Service from "./ui-desktop/Service";
import Experience from "./ui-desktop/Experience";
import About from "./ui-desktop/About";
import MyRoom from "./ui-desktop/MyRoom";
import Testimonial from "./ui-desktop/Testimonial";
import ScrollToMessage from "./ui-desktop/ScrollToMessage";
import Footer from "./ui-desktop/Footer";

// import Logo from "/images/favicon.png";
import {
  createScope,
  createDraggable,
  createSpring,
  animate,
  stagger,
  svg,
  createAnimatable,
  utils,
  onScroll,
} from "animejs";
import { useRef, useState, useEffect } from "react";

export default function DesktopApp({ connected, onSetConnected }) {
  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    if (!connected) return;
    scope.current = createScope({ root }).add((self) => {
      createDraggable(".logo img", {
        container: [0, 0, 0, 0],
        releaseEase: createSpring({ stiffness: 200 }),
      });

      animate(".lucide-star", {
        duration: 500,
        scale: [0, 1],
        ease: createSpring({ stiffness: 200, mass: 2 }),
        delay: stagger(100, { from: "center" }),
        alternate: true,
        loop: true,
      });

      {
        // initiate scroll on d-fly
        const [$container] = utils.$(".d-fly");
        const debug = true;
        const duration = 5000;
        const motionPath = svg.createMotionPath(".flying-message-path path");

        // Animate the transforms properties of .car the motion path values
        const a = animate(".d-fly .message-fly-cover", {
          ease: "linear",
          duration,
          // loop: true,
          ...motionPath,
          autoplay: onScroll({
            container: $container,
            target: ".flying-message-path",
            debug,
            // enter: top top, leave: bottom bottom works ;D
            enter: "top+=50 100",
            leave: "bottom bottom",
            sync: .8,
            onEnter() {
              console.log("entering");
            },
            onLeave() {
              console.log("leaving");
            },
            onUpdate() {
              console.log("moving");
            },
          }),
        });

        //   // Line drawing animation following the motion path values
        //   // For demo aesthetic only
        //   animate(svg.createDrawable(".flying-message-path path"), {
        //     draw: "0 1",
        //     opacity: [0, 1],
        //     ease: "linear",
        //     duration,
        //     loop: true,
        //   });
      }
    });

    // console.log(connected);

    return () => scope.current && scope.current.revert();
  }, [connected]);

  if (!connected) {
    return (
      <div className="desktop-app" ref={root}>
        <Connecting connected={connected} onSetConnected={onSetConnected} />
      </div>
    );
  } else {
    return (
      <div className="desktop-app" ref={root}>
        <Header />
        <Service />
        <Experience />
        <About />
        <MyRoom />
        <Testimonial />
        <ScrollToMessage />
        <Footer />
      </div>
    );
  }
}
