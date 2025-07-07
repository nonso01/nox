import Text from "./Text";
import Connecting from "./Connecting";
import Logo from "/images/favicon.png";
import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useState, useEffect } from "react";
// import { animate } from "animejs";

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
    });

    console.log(connected);

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
        <header className="d-header flex column between " id="home">
          <nav className="d-nav flex between">
            <div className=" links flex evenly">
              <span>
                <a href="#home" className="home-link">
                  Home
                </a>
              </span>
              <span>
                <a href="">About</a>
              </span>
              <span>
                <a href="">Service</a>
              </span>
            </div>

            <div className="logo flex center">
              <img src={Logo} alt="Martin's logo" />
            </div>

            <div className="links flex evenly">
              <span>
                <a href="">Resume</a>
              </span>
              <span>
                <a href="">Projects</a>
              </span>
              <span>
                <a href="">Let's chat</a>
              </span>
            </div>
          </nav>
          <section className="d-s1 "></section>
        </header>

        <style jsx="true">{`
          .d-header {
            height: 1020px;

            a {
              // font-size: 1.1rem;
              font-weight: bolder;
              &:hover {
                color: var(--light-green);
              }
            }

            .d-nav {
              height: 100px;
              padding: 1%;
              border-radius: 25px;
              background-color: var(--light-dark);

              a.home-link {
                color: var(--light-green);
              }

              .logo {
                width: 10%;
                img {
                  width: 40%;
                  aspect-ratio: 1;
                }
              }

              .links {
                width: 35%;
                align-items: center;
              }
            }

            .d-s1 {
              height: 830px;
            }
          }
        `}</style>
      </div>
    );
  }
}
