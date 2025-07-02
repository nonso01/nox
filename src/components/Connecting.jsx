import Spinner from "./Spinner";
import { animate, utils } from "animejs";

import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useEffect, useState } from "react";

const ONE_SECOND = 1000;
const ONE_HUNDRED = 100;

export default function Connecting() {
  const hundredth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const tenth = [...hundredth];
  const unith = [0, 1];

  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      const [
        connected,
        fontsDownloaded,
        assetsDownloaded,
        fruitJuiceActivated,
        ViewInitialized,
      ] = utils.$(".connecting .statuses p");
      // createDraggable(".info", {
      //   container: [0, 0, 0, 0],
      //   releaseEase: createSpring({ stiffness: 200 }),
      // });

      // animate the numbers in the Y axis
      animate(".connecting .hundredth", {
        y: ["45.5%", "-45.5%"],
        duration: ONE_SECOND + ONE_HUNDRED,
        ease: "outExpo",
        loop: 5,
      });

      animate(".connecting .tenth", {
        y: ["45.5%", "-45.5%"],
        duration: ONE_SECOND * 10,
        ease: "outExpo",
      });

      animate(".connecting .unith", {
        y: ["25%", "-25%"],
        duration: ONE_SECOND * 10,
      });

      // Animate each progress element with a delay
      animate(".connecting progress", {
        value: [0, ONE_HUNDRED],
        y: ["-10px", "0px"],
        opacity: [0, 1],
        delay: (el, i) => i * (ONE_SECOND / 2),
        // Each progress bar starts 500ms after the previous one
        duration: (el, i) => i * (ONE_HUNDRED * 5) + ONE_SECOND,
        ease: "outExpo",
        onComplete: (el) => {
          connected.textContent = "connected";
          fontsDownloaded.textContent = "fonts downloaded";
          assetsDownloaded.textContent = "assets downloaded";
          fruitJuiceActivated.textContent = "fruit juice activated";
          ViewInitialized.textContent = "2d/3d view initialized";
        },
      });

      animate(".connecting .statuses p", {
        opacity: [0, 1],
        y: ["-10px", "0px"],
        delay: (el, i) => i * (ONE_SECOND / 2),
        duration: (el, i) => i * (ONE_HUNDRED * 5) + ONE_SECOND,
      });
    });

    return () => scope.current.revert();
  }, []);

  return (
    <div className="connecting  flex column between" ref={root}>
      <div className="progress flex between ">
        <div className="info flex center ">
          <h1>Connecting...</h1>
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
            <p>activating fruit juice..</p>
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
            <p key={i} className="flex center">
              {el}
            </p>
          ))}
        </div>
        <div className="tenth th">
          {tenth.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
        <div className="hundredth th">
          {hundredth.map((el, i) => (
            <p key={i}>{el}</p>
          ))}
        </div>
        <div>%</div>
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
          }

          .statuses {
            width: max(250px, 25%);
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
            div {
              width: 25%;
              font-size: 13rem;
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
