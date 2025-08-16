import { Star, ArrowUpRight } from "lucide-react";
import Logo from "/images/favicon.png";

export default function Header() {
  return (
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
              <Star />
              <Star />
              <Star />
              <Star />
              <Star />
            </p>
            <p className="p-years">
              <span>4</span> Years
            </p>
            <p className="p-ex">Expert</p>
          </div>
        </div>

        <div className="intro-links flex evenly ">
          {/* <p className="flex center">
            Portfolio <ArrowUpRight strokeWidth={3} />
          </p> */}
          <p className="flex center">Hire me</p>
        </div>
      </section>
    </header>
  );
}
