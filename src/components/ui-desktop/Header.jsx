import {
  Star,
  ArrowUpRight,
  House,
  CircleUser,
  HandPlatter,
  FileDigit,
  MessageCircle,
  FolderOpenDot,
} from "lucide-react";
import Logo from "../../assets/images/favicon.png";
import { FourYearsExpert } from "../ui-shared/Svgs";

export default function Header({ handleHireMe = () => console.log("hire") }) {
  return (
    <header
      className="desktop-header flex column between limit-large-screen "
      id="home"
    >
      <nav className="desktop-navigation flex between pos-relative">
        <div className=" links flex evenly ">
          <span title="home">
            <a
              href="#home"
              aria-label="move on to the home section"
              className="home-link icon dark color-primary"
            >
              <House aria-hidden="true" />
            </a>
          </span>
          <span title="about me">
            <a
              href="#about"
              aria-label="view more about Nonso Martin and his core skills"
              className="icon dark"
            >
              <CircleUser aria-hidden="true" />
            </a>
          </span>
          <span title="service">
            <a
              href="#service"
              aria-label="Browse the different services offered by Nonso Martin"
              className="icon dark"
            >
              <HandPlatter aria-hidden="true" />
            </a>
          </span>
        </div>

        <div className="logo flex center" title="Martin">
          <img src={Logo} alt="Martin's logo" width={60} height={60} />
        </div>

        <div className="links flex evenly ">
          <span title="resume">
            <a
              href="#"
              aria-label="Download and Read Nonso Martin's Resume"
              className="icon dark"
            >
              <FileDigit aria-hidden="true" />
            </a>
          </span>
          <span title="projects">
            <a
              href="#"
              aria-label="check Nonso Martin's completed and ongoing projects"
              className="icon dark"
            >
              <FolderOpenDot aria-hidden="true" />
            </a>
          </span>
          <span title="let's chat">
            <a
              href="#contact"
              aria-label="chat with Nonso Martin in your next project idea"
              className="icon dark"
            >
              <MessageCircle aria-hidden="true" />
            </a>
          </span>
        </div>
      </nav>
      <section className="say-hello flex column evenly ">
        <div className="intro-name flex column evenly ">
          <p className="p-hello flex center">
            <span className="font-orbitron">HELLO</span>
          </p>
          <h1 className="martin">
            I'm <span className="color-primary">Martin,</span>
            <br />
            <span>Web Developer</span>
          </h1>
        </div>

        <div className="intro-rating flex between ">
          <div className=" flex column between ">
            <blockquote className="p-quote">❝</blockquote>
            <p className="martin-info">
              Martin's proffesionalism and expertise ensured our website and
              brand success. Highly recommended!
            </p>
            <div className="martin-client-count">
              <p className="font-orbitron">30+</p>
              <p>Client Served</p>
            </div>
          </div>

          <div className=" flex column  between end ">
            <p className="header-stars flex evenly ">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} />
              ))}
            </p>

            <div className="four-years ">
              <FourYearsExpert fill="whitesmoke" />
            </div>
          </div>
        </div>

        <div className="hire-me-link flex evenly ">
          <p className="flex center" onClick={handleHireMe}>
            Hire me <ArrowUpRight aria-hidden="true" />
          </p>
        </div>
      </section>
    </header>
  );
}
