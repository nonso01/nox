import { ArrowUpRight } from "lucide-react";

const cards = [
  {
    title: "Video Editing For YouTube & Social Media",
    subTitle: "Editing",
    note: "Video & Audio",
    fileNumber: 1,
    video: true,
    bgUrl: "",
    id: "video-editing",
  },
  {
    title: "3D Animations & Modeling",
    subTitle: "Blender Art",
    note: "final & experimental",
    fileNumber: 8,
    video: false,
    bgUrl: "/images/earth-390.jpg",
    id: "3d-animation",
  },
  {
    title: "FullStack Websites & Landing Pages",
    subTitle: "Web Development",
    note: "JS,React,etc",
    fileNumber: 11,
    video: false,
    bgUrl: "/images/nox-psp-390.jpg",
    id: "web-development",
  },
];

function Projects() {
  return <div></div>;
}

export default function Service() {
  return (
    <section className="d-service flex column evenly" id="service">
      <div className="service-info flex between">
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
      <div className="service-cards flex between ">
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
                      <h3>{subTitle}</h3>
                      <p>{note}</p>
                    </div>
                    <div className="card-view flex between">
                      <p>
                        <span>{fileNumber}</span>{" "}
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
                        <source src="/images/dice-390.webm" />
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
