import { FlyingMessagePath, FlyingMessage } from "../Svgs";

export default function ScrollToMessage() {
  return (
    <section className="d-fly bd">
      <div className="message-fly-cover flex center  bd">
        <FlyingMessage />
      </div>
      <div className="message-path-cover bd">
        {/* <div className="message-fly-cover flex center  bd">
          <FlyingMessage />
        </div> */}
        {/* if message-fly-cover is inside here, it can move with the path */}
        <FlyingMessagePath />
      </div>
    </section>
  );
}
