import { Copyright, MessageCircle, Crown, PhoneMissed } from "lucide-react";
import { Xlogo, YTlgo, DiscordLogo, TGlogo } from "../Svgs";
import Contact from "./Contact";

import Logo from "/images/favicon.png";

let iconSize = 30;
let iconColor = "var(--sc)";

export default function Footer() {
  return (
    <div className="d-footer flex column evenly ">
      <div className="footer-content">
        <div className="footer-content-words flex column between  ">
          <div className="footer-word flex column between ">
            <div className="footer-logo ">
              <img src={Logo} width={30} height={30} title="Nonso Martin" />
            </div>
            <div className="footer-chat fc">
              <div className="i" title="chat with me">
                <MessageCircle
                  width={iconSize}
                  height={iconSize}
                  stroke={iconColor}
                />
              </div>
              <div className="w">
                <h3>Wanna chat ?</h3>
                <p>Well i don't bite, i have some cookies</p>
                <a href="#">my@email.com</a>
              </div>
            </div>
            <div className="footer-chess fc">
              <div className="i" title="play chess">
                <Crown width={iconSize} height={iconSize} stroke={iconColor} />
              </div>
              <div className="w">
                <h3>Let's play chess</h3>
                <p>let's get to know each other </p>
                <a href="#">chess-0X</a>
              </div>
            </div>
            <div className="footer-call fc">
              <div className="i" title="call me">
                <PhoneMissed
                  width={iconSize}
                  height={iconSize}
                  stroke={iconColor}
                />
              </div>
              <div className="w">
                <h3>Call me</h3>
                <p>You are not my GF so i won't pick up</p>
                <a href="#">(+234) 0814-770-0214</a>
              </div>
            </div>
          </div>
          <div className="footer-links flex between ">
            <a href="https://x.com/nonso0X" target="_blank">
              <Xlogo />
            </a>
            <a href="#">
              <TGlogo />
            </a>
            <a href="#">
              <DiscordLogo />
            </a>
            <a href="#">
              <YTlgo />
            </a>
          </div>
        </div>
        {/*  */}
        <Contact />
      </div>

      <div className="copyright flex center ">
        <span>All CopyRight</span> <Copyright />{" "}
        <span>Reserved - {new Date().getUTCFullYear()}</span>
      </div>
    </div>
  );
}
