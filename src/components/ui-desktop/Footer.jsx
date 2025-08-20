import { Copyright, MessageCircle, Crown, PhoneCall } from "lucide-react";
import { Xlogo, YTlgo, UpworkLogo, TGlogo } from "../Svgs";
import Contact from "./Contact";

import Logo from "/images/favicon.png";

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
    <div className="d-footer flex column evenly ">
      <div className="footer-content">
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
                      <a href={link} target="_blank">{a}</a>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <div className="footer-links flex between ">
            <a
              href="https://x.com/nonso0X"
              className="icon dark"
              target="_blank"
            >
              <Xlogo />
            </a>
            <a href="#" className="icon dark" style={{ "--i": 2 }}>
              <TGlogo />
            </a>
            <a href="#" className="icon dark" style={{ "--i": 3 }}>
              <UpworkLogo />
            </a>
            <a href="#" className="icon dark" style={{ "--i": 4 }}>
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
