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

export default function Header() {
  return (
    <header className="d-header flex column between limit-screen-large" id="home">
      <nav className="d-nav flex between ">
        <div className=" links flex evenly ">
          <span title="home">
            <a
              href="#home"
              aria-label="move on to the home section"
              className="home-link icon dark"
            >
              <House />
            </a>
          </span>
          <span title="about me">
            <a
              href="#about"
              aria-label="view more about Nonso Martin and his core skills"
              className="icon dark"
            >
              <CircleUser />
            </a>
          </span>
          <span title="service">
            <a
              href="#service"
              aria-label="Browse the different services offered by Nonso Martin"
              className="icon dark"
            >
              <HandPlatter />
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
              <FileDigit />
            </a>
          </span>
          <span title="projects">
            <a
              href="#"
              aria-label="check Nonso Martin's completed and ongoing projects"
              className="icon dark"
            >
              <FolderOpenDot />
            </a>
          </span>
          <span title="let's chat">
            <a
              href="#contact"
              aria-label="chat with Nonso Martin in your next project idea"
              className="icon dark"
            >
              <MessageCircle />
            </a>
          </span>
        </div>
      </nav>
      <section className="say-hello flex column evenly ">
        <div className="intro-name flex column evenly ">
          <p className="p-hello flex center">
            <span className="font-orbitron">HELLO</span>
          </p>
          <h1 className="p-name">
            I'm <span>Martin,</span>
            <p>Web Developer</p>
          </h1>
        </div>

        <div className="intro-rating flex between ">
          <div className=" flex column between">
            <p className="p-quote">❝</p>
            <p className="p-info">
              Martin's proffesionalism and expertise ensured our website and
              brand success. Highly recommended!
            </p>
            <div className="p-client">
              <p className="font-orbitron">30+</p>
              <p>Client Served</p>
            </div>
          </div>

          <div className=" flex column end">
            <p className="p-stars flex evenly">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} />
              ))}
            </p>
            <p className="p-years">
              <span>4</span> Years
            </p>
            <p className="p-ex">Expert</p>
          </div>
        </div>

        <div className="hire-me-link flex evenly ">
          <p className="flex center">
            Hire me <ArrowUpRight />
          </p>
        </div>
      </section>
    </header>
  );
}
