import Spinner from "./Spinner";
import { animate } from "animejs";

import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useEffect, useState } from "react";

export default function Connecting() {
  const hundredth = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const tenth = [...hundredth];
  const unith = [0, 1];

  const root = useRef(null);
  const scope = useRef(null);

  useEffect(() => {
    scope.current = createScope({ root }).add((self) => {
      // createDraggable(".info", {
      //   container: [0, 0, 0, 0],
      //   releaseEase: createSpring({ stiffness: 200 }),
      // });

      // animate the numbers in the Y axis
      animate(".hundredth", {
        y: ["45.5%", "-45.5%"],
        duration: 2e3,
        // loop: true,
      });

      animate(".tenth", {
        y: ["45.5%", "-45.5%"],
        duration: 3e3,
        ease: "outExpo",
      });

      animate(".unith", {
        y: ["25%", "-25%"],
        duration: 4e3,
      });

      //animating the progress element
      animate("progress", {
        value: [0, 100],
        duration: 4.5e3,
        ease: "outExpo",
      });
    });

    return () => scope.current.revert();
  }, []);

  return (
    <div className="connecting  flex column between" ref={root}>
      <div className="progress flex column">
        <div className="flex center">
          <progress max={100} value={50} />
        </div>
        <div>
          <p className="info">
            connecting
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </p>
        </div>
      </div>

      <div className="num flex  center ">
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
            height: 40%;
            align-items: center;
            justify-content: flex-end;
            gap: 1rem;

            progress {
              appearance: none;
              width: 350px;
              height: 10px;

              &::-webkit-progress-value {
                background-color: #34db69;
                border-radius: 3px;
              }

              &::-webkit-progress-bar {
                background-color: rgba(12, 12, 12, 0.36);
                border-radius: 3px;
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
