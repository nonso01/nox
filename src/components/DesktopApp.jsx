import {
  createScope,
  createDraggable,
  createSpring,
  animate,
  stagger,
  svg,
  utils,
  onScroll,
} from "animejs";
import { useRef, useEffect, lazy } from "react";

const Connecting = lazy(() => import("./ui-shared/Connecting"));
const Header = lazy(() => import("./ui-desktop/Header"));
const Service = lazy(() => import("./ui-desktop/Service"));
const Experience = lazy(() => import("./ui-desktop/Experience"));
const About = lazy(() => import("./ui-desktop/About"));
const MyRoom = lazy(() => import("./ui-desktop/MyRoom"));
const Testimonial = lazy(() => import("./ui-desktop/Testimonial"));
const ScrollToMessage = lazy(() => import("./ui-desktop/ScrollToMessage"));
const Footer = lazy(() => import("./ui-desktop/Footer"));

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

      (() /** Rating Star animations */ => {
        animate(".lucide-star", {
          duration: 500,
          scale: [0, 1],
          ease: createSpring({ stiffness: 200, mass: 2 }),
          delay: stagger(100, { from: "center" }),
          alternate: true,
          loop: true,
        });
      })();

      (() /** Animate Header Elements and Childrens */ => {
        const headerAnim = animate("header", {
          duration: 900,
          ease: "out(3)",
          autoplay: onScroll({
            container: root.current,
            target: "header",
            debug: true,
            repeat: true, // KEY: Allows animation to retrigger on every enter/leave
            enter: "bottom top+=200",
            leave: "top top+=90%",
            sync: 0.5,
            onEnter(obs) {
              console.log("Entering - every time!");
              animate(obs.target, {
                translateY: [100, 0],
                opacity: [0, 0.5, 1],
                duration: 900,
              });
            },
            onLeave(obs) {
              console.log("Leaving - every time!");
              // console.log(obs)
              animate(obs.target, {
                translateY: [0, -100],
                opacity: [1, 0.5, 0],
              });
            },
            onUpdate(obs) {
              console.log("Progress:", obs.progress);
            },
          }),
        });
      })();

      (() /** d-fly, during the mean time, look for a proper name */ => {
        const [$container] = utils.$(".d-fly");
        const debug = true;
        const duration = 5000;
        const motionPath = svg.createMotionPath(".flying-message-path path");

        // Animate the transforms properties of .message the motion path values
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
            sync: 0.8,
            onEnter() {
              // console.log("entering");
            },
            onLeave() {
              // console.log("leaving");
            },
            onUpdate() {
              // console.log("moving");
            },
          }),
        });
      })();
      // more animations here...
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
      <div className="desktop-app" id="d-app" ref={root}>
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
