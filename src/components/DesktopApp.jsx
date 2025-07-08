import Text from "./Text";
import Connecting from "./Connecting";
import Logo from "/images/favicon.png";
import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useState, useEffect } from "react";
import { Star, ArrowUpRight } from "lucide-react";

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
          <section className="d-s1 flex column evenly ">
            <div className="intro-name flex column evenly ">
              <p className="p-hello flex center">
                <span>HELLO</span>
              </p>
              <p className="p-name">
                I'm <span>Martin,</span>
                Frontend Developer
              </p>
            </div>

            <div className="intro-rating flex between ">
              <div className=" flex column between">
                <p className="p-quote">❝</p>
                <p className="p-info">
                  Martin's proffesionalism and expertise ensured our website and
                  brand success. Highly recommended!
                </p>
                <div className="p-client">
                  <p>30+</p>
                  <p>Client Served</p>
                </div>
              </div>

              <div className=" flex column end">
                <p className="p-stars flex evenly">
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                  <Star fill="var(--light-green)" stroke="var(--light-green)" />
                </p>
                <p className="p-years">
                  <span>4</span> Years
                </p>
                <p className="p-ex">Expert</p>
              </div>
            </div>

            <div className="intro-links flex evenly ">
              <p className="flex center">
                Portfolio <ArrowUpRight />
              </p>
              <p className="flex center">Hire me</p>
            </div>
          </section>
        </header>

        <style jsx="true">{`
          .d-header {
            height: 1020px;

            a {
              font-size: 1.1rem;
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
                  align-self: center;
                  width: 100px;
                  font-weight: bold;
                  span {
                    font-family: "Orbitron";
                    letter-spacing: 3px;
                  }
                }

                .p-name {
                  /*.p-name p */
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
                // p {
                //   border: 2px solid;
                // }
                div {
                  width: 400px;
                }

                .p-quote {
                  font-size: 3rem;
                }

                .p-info {
                  font-size: 1.3rem;
                  text-wrap: balance;
                  line-height: 1.5;
                }

                .p-client {
                  p:nth-child(1) {
                    font-size: 2rem;
                    font-weight: bold;
                    font-family: "Orbitron";
                  }
                  p:nth-child(2) {
                    margin-top: 0.6rem;
                    font-size: var(--font-sm);
                  }
                }

                .p-stars {
                  width: 50%;
                }

                .p-years {
                  font-size: 2rem;
                  font-weight: bold;
                  margin-block: 2rem;
                  span {
                    font-family: "Orbitron";
                  }
                }

                .p-ex {
                  font-size: 2.5rem;
                  text-align: right;
                  padding-bottom: 1.5rem;
                  width: 80%;
                  border-bottom: 5px solid;
                }
              }

              .intro-links {
                height: 100px;
                width: 500px;
                align-self: center;
                // border-radius: 25px;
                // background-color: var(--light-dark);

                p:nth-child(1) {
                  background-color: var(--light-green);
                }

                p:nth-child(2) {
                  // background-color: var(--light-green);
                  color: var(--light-green);
                  border: 2px solid;
                }

                p {
                  width: 45%;
                  align-self: center;
                  height: 80px;
                  border-radius: 25px;
                  font-size: 1.7rem;
                  gap: 0.625rem;
                  cursor: pointer;
                }
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
