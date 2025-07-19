import Connecting from "./Connecting";
import HouseScene from "./HouseScene";
import LineFollowCircle from "./LineFollowCircle";
import Logo from "/images/favicon.png";
import {
  createScope,
  createDraggable,
  createSpring,
  animate,
  stagger,
  svg,
  createAnimatable,
  utils,
} from "animejs";
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
        delay: stagger(100, { from: "center" }),
        ease: createSpring({ stiffness: 200, mass: 2 }),
        alternate: true,
        loop: true,
      });

      animate(".cards .folders div:nth-child(3)", {
        y: ["0%", "-20%", "-40%"],
        delay: stagger(200, { from: "first" }),
        ease: createSpring({ stiffness: 200, mass: 2 }),
        alternate: true,
        loop: true,
      });

      // animate follow-dot
      const [$nav] = utils.$(".desktop-app .d-nav");
      const navBounds = $nav.getBoundingClientRect();

      const animatableFollowDot = createAnimatable(
        ".desktop-app .d-nav .follow-dot",
        {
          x: 500,
          y: 500,
          ease: "out(3)",
        }
      );

      const onMouseMove = (e) => {
        const { width, height, left, top } = navBounds;
        // const hw = width / 2;
        const hh = height / 2;
        const x = e.clientX - left;
        const y = e.clientY - top - hh;
        animatableFollowDot.x(x);
        animatableFollowDot.y(y);

        console.log({ x, y });
      };

      window.addEventListener("mousemove", onMouseMove);
      console.log($nav);
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
        <header className="d-header flex column between " id="home">
          <nav className="d-nav flex between ">
            <div className=" links flex evenly ">
              <span>
                <a href="#home" className="home-link">
                  Home
                </a>
              </span>
              <span>
                <a href="#about">About</a>
              </span>
              <span>
                <a href="#service">Service</a>
              </span>
            </div>

            <div className="logo flex center">
              <img src={Logo} alt="Martin's logo" />
            </div>

            <div className="links flex evenly ">
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

            <div className="follow-dot"></div>
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
                  <Star
                    fill="var(--primary-color)"
                    stroke="var(--primary-color)"
                  />
                  <Star
                    fill="var(--primary-color)"
                    stroke="var(--primary-color)"
                  />
                  <Star
                    fill="var(--primary-color)"
                    stroke="var(--primary-color)"
                  />
                  <Star
                    fill="var(--primary-color)"
                    stroke="var(--primary-color)"
                  />
                  <Star
                    fill="var(--primary-color)"
                    stroke="var(--primary-color)"
                  />
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

        <section className="d-about flex center" id="service">
          <p className="text-effect gradient-white ">WHAT I DO!</p>
        </section>

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
                  <img src="/images/nox-psp-390.png" alt="nox psp thumbnail" />
                </div>
                <div>
                  <img src="/images/earth-390.png" alt="earth thumbnail" />
                </div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={50} height={50} />
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
                <div>
                  <img
                    src="/images/form-full-stack.png"
                    alt="interactive form"
                  />
                </div>
                <div>
                  <img
                    src="/images/pay-card-full-stack.png"
                    alt="payment card page"
                  />
                </div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={50} height={50} />
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
                <div>
                  <img
                    src="/images/bookmark-landing-page.png"
                    alt="bookmark landing page"
                  />
                </div>
                <div>
                  <img
                    src="/images/blogr-landing-page.png"
                    alt="blogr landing page"
                  />
                </div>
              </div>
              <div className="arrow">
                <ArrowUpRight width={50} height={50} />
              </div>
            </div>
          </div>
        </section>

        <section className="d-experience flex column evenly ">
          <div className="flex center p-work ">
            <p>My Work Experience</p>
          </div>
          <div className="d-work flex between ">
            <div className="d-work-time flex column between ">
              <div className="">
                <h2>Upwork</h2>
                <p>
                  Dec <span>2023</span> - July <span>2025</span>
                </p>
              </div>
              <div className="">
                <h2>Digital Dream,Lagos</h2>
                <p>
                  Mar <span>2021</span> - Sep <span>2022</span>
                </p>
              </div>
              <div className="">
                <h2>Self-Employed,Yaounde</h2>
                <p>
                  Feb <span>2020</span> - Dec <span>2020</span>
                </p>
              </div>
            </div>

            <div className="d-work-info flex between ">
              <div className="lines flex center ">
                <LineFollowCircle />
              </div>
              <div className="info-detail flex column between ">
                <div className="">
                  <h2>Web Dev/Animator</h2>
                  <p>
                    I've been building engaging web experiences and compelling
                    animations. My work combines front-end development skills
                    with 3D design to deliver visually rich and interactive
                    digital content.
                  </p>
                </div>
                <div className="">
                  <h2>Frontend Developer</h2>
                  <p>
                    I helped developed responsive user interfaces for a B2B SaaS
                    dashboard, focusing on data visualization and intuitive user
                    experience. I translated complex data into clear,
                    interactive charts using React and TypeScript, ensuring
                    optimal performance.
                  </p>
                </div>
                <div className="">
                  <h2>Apprentice</h2>
                  <p>
                    During this phase, i was simply fuckin around till i found
                    out, and i never left :D
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="d-about flex center " id="about">
          <p className="text-effect gradient-white animate ">WHO AM I ?</p>
        </section>

        <section className="d-3d-hire">
          <HouseScene />
        </section>

        <style jsx="true">{`
          .d-about {
            height: 500px;
            overflow-x: hidden;

            p {
              font-size: clamp(14vw, 15vw, 18rem);
              font-family: "Orbitron";
              font-weight: 600;
              // text-shadow: 50px 50px 10px #fff1;
            }
          }
        `}</style>
      </div>
    );
  }
}
