import { MessageCircle, Crown, PhoneCall } from "lucide-react";
import {
  Xlogo,
  YTlgo,
  UpworkLogo,
  // TGlogo,
  LinkedInLogo,
} from "../ui-shared/Svgs";
import Contact from "./Contact";

import Logo from "../../assets/images/favicon.png";

let iconSize = 30;
let iconColor = "var(--sc)";

const footerChatContent = [
  {
    icon: MessageCircle,
    size: iconSize,
    stroke: iconColor,
    h3: "Wanna chat ?",
    p: "Well i don't bite, i have some cookies",
    a: "Nonso Martin",
    link: "mailto:chukwunonsomartin01@gmail.com",
    title: "chat",
  },
  {
    icon: Crown,
    size: iconSize,
    stroke: iconColor,
    h3: "Let's play chess",
    p: "let's get to know each other, over our game strategies",
    a: "chess-0X",
    link: "https://chess-0x.vercel.app",
    title: "play chess",
  },
  {
    icon: PhoneCall,
    size: iconSize,
    stroke: iconColor,
    h3: "Call me",
    p: "My voice is definitely worth hearing :D",
    a: "(+234) 0814-770-0214",
    link: "tel:+2348147700214",
    title: "call me",
  },
];

export default function Footer() {
  return (
    <div className="d-footer flex column evenly limit-screen-large">
      <div className="footer-content" id="contact">
        <div className="footer-content-words flex column between  ">
          <div className="footer-word flex column between ">
            <div className="footer-logo ">
              <img src={Logo} width={30} height={30} title="Nonso Martin" />
            </div>
            {footerChatContent.map(
              ({ icon, size, stroke, h3, p, a, link, title }, i) => {
                const Icon = icon;
                return (
                  <div className="fc " key={title}>
                    <div
                      className="icon dark"
                      title={title}
                      style={{ "--i": i + 1 }}
                    >
                      <Icon width={size} height={size} stroke={stroke} />
                    </div>
                    <div className="w">
                      <h3>{h3}</h3>
                      <p>{p}</p>
                      <a href={link} target="_blank">
                        {a}
                      </a>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <div className="footer-links flex between ">
            <a
              href="https://x.com/nonso0X"
              aria-label="connect with me on X"
              className="icon dark"
              target="_blank"
            >
              <Xlogo />
            </a>
            <a
              href="https://www.linkedin.com/in/nonso-martin-80b221238"
              aria-label="Connect with me on LinkedIn"
              target="_blank"
              className="icon dark"
              style={{ "--i": 2 }}
            >
              <LinkedInLogo />
            </a>
            <a
              href="#"
              aria-label="Hire me on Upwork"
              target="_blank"
              className="icon dark"
              style={{ "--i": 3 }}
            >
              <UpworkLogo />
            </a>
            <a
              href="https://youtube.com/@nox_lab"
              aria-label="Browse my Youtube contents"
              target="_blank"
              className="icon dark"
              style={{ "--i": 4 }}
            >
              <YTlgo />
            </a>
          </div>
        </div>
        {/*  */}
        <Contact />
      </div>

      <div className="copyright flex center ">
        <span>
          All CopyRight &copy; Reserved - {new Date().getUTCFullYear()}
        </span>
      </div>
    </div>
  );
}
