import { ArrowUpRight } from "lucide-react";
import { cardData, diceVideo } from "../ui-shared/ServiceCards";

export default function Service({
  handleShowService = (e) => {
    console.log(e.target?.dataset);
  },
}) {
  return (
    <section
      className="d-service flex column evenly limit-large-screen"
      id="service"
    >
      <div className="service-info flex between">
        <div>
          <p>
            My <span>Services</span>
          </p>
        </div>
        <div>
          <p>
            Specializing in web development, Blender art, and Cybersecurity to
            bring your vision to life, while maintaining trust.
          </p>
        </div>
      </div>
      <div className="service-cards flex between">
        {cardData.map(
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
                      <button
                        className="flex between pointer"
                        data-id={id}
                        onClick={handleShowService}
                      >
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
          },
        )}
      </div>
    </section>
  );
}
