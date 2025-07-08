import Text from "./Text";
import Connecting from "./Connecting";
import Logo from "/images/favicon.png";
import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useState, useEffect } from "react";
import { Star } from "lucide-react";

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
        <header className="d-header flex column between" id="home">
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
          <section className="d-s1 flex column evenly debbug">
            <div className="intro-name flex column evenly debbug">
              <p className="p-hello flex center">
                <span>HELLO</span>
              </p>
              <p className="p-name">
                I'm <span>Martin,</span>
                <p>Frontend Developer</p>
              </p>
            </div>

            <div className="intro-rating flex between debbug">
              <div className="debbug">
                <p>''</p>
                <p>
                  Martin's proffesionalism and expertise ensured our website and
                  brand success. Highly recommended!
                </p>
                <p>
                  <span>30+</span>
                  <span>Client Served</span>
                </p>
              </div>

              <div className="debbug">
                <p>
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                </p>
                <p>4 Years</p>
                <p>In The Making!</p>
              </div>
            </div>

            <div className="intro-links debbug">
              <p>Portfolio</p>
              <p>Hire me</p>
            </div>
          </section>
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

              .intro-name {
                align-self: center;
                height: 300px;
                width: 72%;

                .p-hello {
                  // border: 2px solid;
                  align-self: center;
                  width: 100px;
                  font-weight: bold;
                  span {
                    font-family: "Orbitron";
                    letter-spacing: 3px;
                  }
                }

                .p-name {
                  font-size: 5.5rem;
                  text-align: center;
                  font-weight: bold;

                  span {
                    color: var(--light-green);
                  }
                }
              }

              .intro-rating {
                height: 300px;
                div {
                  width: 400px;
                }
              }

              .intro-links {
                height: 100px;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
