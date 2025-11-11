import { ArrowUpRight } from "lucide-react";
import diceVideo from "../../assets/images/dice-390.webm";
// import earthImage from "../../assets/images/earth-390.webp";
import cyber from "../../assets/images/cyber.webp"
import noxPspImage from "../../assets/images/nox-psp.webp";

const cards = [
  {
    title: "Cybersecurity & Analysis",
    subTitle: "Security",
    note: "kali, tcpdump, splunk...",
    fileNumber: 3,
    video: false,
    bgUrl: cyber,
    id: "video-editing",
  },
  {
    title: "3D Animations & Modeling",
    subTitle: "Blender Art",
    note: "final & experimental",
    fileNumber: 8,
    video: true,
    bgUrl: "",
    id: "3d-animation",
  },
  {
    title: "FullStack Websites & Landing Pages",
    subTitle: "Web Development",
    note: "JS,Node.js,amd Rust",
    fileNumber: 11,
    video: false,
    bgUrl: noxPspImage,
    id: "web-development",
  },
];

function Projects() {
  return <div></div>;
}

export default function Service() {
  return (
    <section
      className="d-service flex column evenly limit-screen-large"
      id="service"
    >
      <div className="service-info flex between ">
        <div>
          <p>
            My <span>Services</span>
          </p>
        </div>
        <div>
          <p>
            Specializing in web development, Blender art, and professional video
            editing to bring your vision to life.
          </p>
        </div>
      </div>
      <div className="service-cards flex between">
        {cards.map(
          ({ title, fileNumber, video, bgUrl, subTitle, note, id }, _) => {
            return (
              <div className="card flex center" key={id}>
                <div
                  className="card-main"
                  style={{ backgroundImage: video ? "" : `url(${bgUrl})` }}
                >
                  <div className="card-title ">
                    <p>{title}</p>
                  </div>
                  <div className="card-clip">
                    <div className="card-note">
                      <h2 style={{ fontSize: "1.15rem" }}>{subTitle}</h2>
                      <p>{note}</p>
                    </div>
                    <div className="card-view flex between">
                      <p>
                        <span className="font-orbitron">{fileNumber}</span>
                        {fileNumber > 1 ? "Files" : "File"}
                      </p>
                      <button className="flex between pointer" data-id={id}>
                        <span>View</span> <ArrowUpRight />
                      </button>
                    </div>
                  </div>
                  {video ? (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        zIndex: 3,
                        position: "absolute",
                        top: "-10%",
                      }}
                    >
                      <video
                        autoPlay
                        muted
                        loop
                        preload="auto"
                        width={"100%"}
                        height={"100%"}
                      >
                        <source src={diceVideo} />
                      </video>
                    </div>
                  ) : (
                    void 0
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
