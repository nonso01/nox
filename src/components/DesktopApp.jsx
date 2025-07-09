import Text from "./Text";
import Connecting from "./Connecting";
import Logo from "/images/favicon.png";
import { createScope, createDraggable, createSpring } from "animejs";
import { useRef, useState, useEffect } from "react";
import { Star, ArrowUpRight } from "lucide-react";
import { animate } from "animejs";
import { stagger } from "animejs";

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

      animate(".cards .folders div:nth-child(2)", {
        y: ["0%", "-10%", "-30%"],
        duration: 500,
        delay: stagger(100, { from: "center" }),
        ease: createSpring({ stiffness: 200, mass: 2 }),
        alternate: true,
        loop: true,
      });

      animate(".cards .folders div:nth-child(3)", {
        y: ["0%", "-20%", "-40%"],
        duration: 400,
        delay: stagger(100, { from: "first" }),
        ease: createSpring({ stiffness: 200, mass: 2 }),
        alternate: true,
        loop: true,
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
                <a href="#">About</a>
              </span>
              <span>
                <a href="#">Service</a>
              </span>
            </div>

            <div className="logo flex center">
              <img src={Logo} alt="Martin's logo" />
            </div>

            <div className="links flex evenly">
              <span>
                <a href="#">Resume</a>
              </span>
              <span>
                <a href="#">Projects</a>
              </span>
              <span>
                <a href="#">Let's chat</a>
              </span>
            </div>
          </nav>
          <section className="d-s1 flex column evenly ">
            <div className="intro-name flex column evenly ">
              <p className="p-hello flex center">
                <span>HELLO</span>
              </p>
              <div className="p-name">
                I'm <span>Martin,</span>
                <p>Frontend Developer</p>
              </div>
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
                Portfolio <ArrowUpRight strokeWidth={3} />
              </p>
              <p className="flex center">Hire me</p>
            </div>
          </section>
        </header>

        <section className="d-service flex column evenly">
          <div className="service-info flex between">
            <div>
              <p>
                My <span>Services</span>
              </p>
            </div>
            <div>
              <p>
                Specializing in web development, Blender art, and professional
                video editing to bring your vision to life.
              </p>
            </div>
          </div>
          <div className="service-cards flex between">
            <div className="cards">
              <p className="title">2D/3D Animations</p>
              <div className="folders">
                <div>
                  <video autoPlay loop muted playsInline>
                    <source src="/images/dice-390.webm" />
                  </video>
                </div>
                <div>
                  <img
                    src="/images/nox-psp-390.png"
                    alt="nox psp thumbnail"
                  />
                </div>
                <div>
                  <img
                    src="/images/earth-390.png"
                    alt="earth thumbnail"
                  />
                </div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={72} height={72} />
              </div>
            </div>
            <div className="cards">
              <p className="title ">Full Stack apps</p>
              <div className="folders">
                <div>
                  <img
                    src="/images/food-order-page.png"
                    alt="food order page thumbnail"
                  />
                </div>
                <div></div>
                <div></div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={72} height={72} />
              </div>
            </div>
            <div className="cards">
              <p className="title ">Landing pages</p>
              <div className="folders">
                <div>
                  <img
                    src="/images/sneaker-landing-page.png"
                    alt="sneaker page thumbnail"
                  />
                </div>
                <div></div>
                <div></div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={72} height={72} />
              </div>
            </div>
          </div>
        </section>

        <style jsx="true">{`
          .d-header {
            height: 1020px;
            padding: 30px 130px;

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
                  font-size: 1.5rem;
                  font-weight: bold;
                  gap: 0.625rem;
                  cursor: pointer;
                }
              }
            }
          }

          .d-service {
            height: 830px;
            padding: 30px 130px;
            background-color: var(--light-dark);
            border-radius: 50px;

            .service-info {
              height: 100px;
              padding-bottom: 1rem;
              border-bottom: 2px solid var(--dark);

              div {
                width: 30%;
                // font-weight: 500;
              }

              div:nth-child(1) p {
                font-size: 3.5rem;

                span {
                  color: var(--light-green);
                }
              }

              div:nth-child(2) p {
                font-size: 1.3rem;
                line-height: 1.5;
              }
            }

            .service-cards {
              height: 600px;

              .cards {
                position: relative;
                width: min(30.5%, 500px);
                height: 600px;
                align-self: center;
                background-color: #222;
                clip-path: path(
                  "M450 0C477.614 6.4426e-06 500 22.3858 500 50V389C500 416.614 477.614 439 450 439H387C359.386 439 337 461.386 337 489V550C337 577.614 314.614 600 287 600H50C22.3858 600 8.0543e-07 577.614 0 550V50C0 22.3858 22.3858 4.02663e-07 50 0H450ZM430 460C468.66 460 500 491.34 500 530C500 568.66 468.66 600 430 600C391.34 600 360 568.66 360 530C360 491.34 391.34 460 430 460Z"
                );

                transition-duration: 200ms;

                &:hover {
                  background-color: var(--light-green);
                  .arrow {
                    background-color: var(--light-green);
                  }
                }

                .title {
                  height: 20%;
                  padding: 1.5rem;
                  font-size: 2rem;
                  font-weight: 500;
                  border-bottom: 2px solid var(--light-dark);
                }

                .folders {
                  height: 80%;
                  position: relative;
                  // background-color: white;

                  div {
                    position: absolute;
                    bottom: 0;
                    height: 60%;
                    width: 100%;
                    border-radius: 25px;
                    overflow: hidden;
                  }

                  div:nth-child(1) {
                    background-color: #222b;
                    z-index: 8;
                  }

                  div:nth-child(2) {
                    width: 90%;
                    margin-inline: 5%;
                    transform: translateY(-10%);
                    background-color: #000a;
                    z-index: 4;
                  }

                  div:nth-child(3) {
                    width: 80%;
                    margin-inline: 10%;
                    transform: translateY(-20%);
                    background-color: #0009;
                    z-index: 2;
                  }
                }

                .arrow {
                  width: 29%;
                  height: 150px;
                  display: grid;
                  place-items: center;
                  background-color: var(--dark);
                  position: absolute;
                  z-index: 10;
                  bottom: -5px;
                  right: -1px;
                  transition-duration: 200ms;
                }
              }
            }
          }
        `}</style>
      </div>
    );
  }
}
