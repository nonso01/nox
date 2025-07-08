import GreenWhiteLine from "./GreenwhiteLine";

import {
  createScope,
  createDraggable,
  createSpring,
  stagger,
  animate,
  utils,
  svg,
} from "animejs";
import { useRef, useEffect, useState } from "react";

const ONE_SECOND = 1000;
const ONE_HUNDRED = 100;

export default function Connecting({ connected, onSetConnected }) {
  const hundredth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const tenth = [...hundredth];
  const unith = [0, 1];

  const [connectingText, setConnectingText] = useState([
    "C",
    "O",
    "N",
    "N",
    "E",
    "C",
    "T",
    "I",
    "N",
    "G",
    ".",
    ".",
    ".",
  ]);

  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      const [
        $connected,
        $fontsDownloaded,
        $assetsDownloaded,
        $ViewInitialized,
      ] = utils.$(".connecting .statuses p");
     

      // animate the main heading
      animate(".connecting .info h1 span", {
        y: ["-25px", "0px", "25px"],
        opacity: [0, 1, 0, 1],
        delay: stagger(50),
        duration: 50,
        alternate: true,
        loop: 2,
        ease: createSpring({ stiffness: 200, mass: 3 }),
        onUpdate(self) {
          if (self.currentTime > ONE_SECOND * 7) {
            setConnectingText((x) => [
              "C",
              "O",
              "N",
              "N",
              "E",
              "C",
              "T",
              "E",
              "D",
              ".",
              ".",
              ".",
            ]);
          }
          // console.log(self.currentTime);
        },
        onComplete() {
          onSetConnected(true); // updates the state
          // console.log(connected);
        },
      });

      // animate the numbers in the Y axis
      animate(".connecting .hundredth", {
        y: ["45.5%", "-45.5%"],
        duration: ONE_SECOND + ONE_HUNDRED,
        ease: "steps(10)",
        loop: 7,
      });

      animate(".connecting .tenth", {
        y: ["45.5%", "-45.5%"],
        duration: ONE_SECOND * 9,
        ease: "steps(5)",
      });

      animate(".connecting .unith", {
        y: ["25%", "-25%"],
        duration: ONE_SECOND * 9,
        ease: "steps(1)",
      });

      // Animate each progress element with a delay
      animate(".connecting progress", {
        value: [0, ONE_HUNDRED],
        y: ["-10px", "0px"],
        opacity: [0, 1],
        delay: stagger(ONE_SECOND),
        duration: (el, i) => i * (ONE_HUNDRED * 5) + ONE_SECOND,
        ease: "outExpo",
        onComplete: (el) => {
          $connected.textContent = "connected";
          $fontsDownloaded.textContent = "fonts downloaded";
          $assetsDownloaded.textContent = "assets downloaded";
          $ViewInitialized.textContent = "2d/3d view initialized";
        },
      });

      animate(".connecting .statuses p", {
        opacity: [0, 1],
        y: ["-10px", "0px"],
        delay: (el, i) => i * ONE_SECOND,
        duration: (el, i) => i * (ONE_HUNDRED * 5) + ONE_SECOND,
      });
    });

    //animate the lines path
    animate(svg.createDrawable(".connecting .lines path"), {
      draw: ["0 0", "0 1", "1 1"],
      opacity: [0.1, 0.8],
      ease: "inCubic",
      duration: ONE_SECOND * 8,
      delay: stagger(ONE_SECOND * 2),
      // alternate: true,
      // loop: 1,
    });

    return () => scope.current.revert();
  }, []);

  return (
    <div className="connecting  flex column between" ref={root}>
      <div className="progress flex between ">
        <div className="info flex center ">
          <h1>
            {connectingText.map((el, i) => (
              <span key={i}>{el}</span>
            ))}
          </h1>
        </div>

        <div className="statuses flex column evenly ">
          <div>
            <p>connecting..</p>
            <progress max={100} value={0}></progress>
          </div>
          <div>
            <p>downloading fonts..</p>
            <progress max={100} value={0}></progress>
          </div>
          <div>
            <p>downloading assets..</p>
            <progress max={100} value={0}></progress>
          </div>

          <div>
            <p>initailizing 2d/3d view..</p>
            <progress max={100} value={0}></progress>
          </div>
        </div>
      </div>

      <div className="num flex center ">
        <div className=" unith th ">
          {unith.map((el, i) => (
            <p key={i} className="flex center ">
              {el}
            </p>
          ))}
        </div>
        <div className="tenth th">
          {tenth.map((el, i) => (
            <p key={i} className="flex center ">
              {el}
            </p>
          ))}
        </div>
        <div className="hundredth th ">
          {hundredth.map((el, i) => (
            <p key={i} className="flex center ">
              {el}
            </p>
          ))}
        </div>
        <div>%</div>
      </div>

      <div className="lines">
        <GreenWhiteLine />
      </div>

      <style jsx="true">
        {`
          .progress {
            height: 30%;
            gap: 1rem;

            progress {
              appearance: none;
              width: 300px;
              height: 5px;

              &::-webkit-progress-value {
                background-color: #34db69;
                border-radius: 1px;
              }

              &::-webkit-progress-bar {
                background-color: rgba(12, 12, 12, 0.36);
                border-radius: 1px;
              }
            }
          }

          .info {
            width: max(100px, 40%);
            backdrop-filter: blur(1rem);
            span {
              display: inline-block;
            }
          }

          .statuses {
            width: max(250px, 25%);
            backdrop-filter: blur(1rem);
            div {
              // border: 2px solid;
              height: 18%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                font-size: var(--font-sm);
              }
            }
          }

          .num {
            height: 35%;
            width: 30%;
            overflow: hidden;
            backdrop-filter: blur(1rem);
            div {
              width: 25%;
              font-size: clamp(2rem, 13rem, 13.2rem);
            }
          }

          .th p {
            margin-block: 1rem;
            // added margins
          }

          .unith {
            transform: translateY(25%);
          }
          .tenth {
            transform: translateY(45.5%);
          }

          .hundredth {
            transform: translateY(45.5%);
          }

          .lines {
            position: absolute;
            overflow: hidden;
            top: 0;
            height: inherit;
            width: inherit;
            z-index: -1;

            // background-color: #000c;
          }

          @media screen and (max-width: 600px) {
            #root {
              .num {
                width: 90%;
                height: 20%;
                div {
                  width: 25%;
                  font-size: 8rem;
                  // border: 2px solid;
                }
              }
            }
          }
        `}
      </style>
    </div>
  );
}
