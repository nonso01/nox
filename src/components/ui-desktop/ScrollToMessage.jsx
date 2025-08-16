import { FlyingMessagePath, FlyingMessage } from "../Svgs";

export default function ScrollToMessage() {
  return (
    <section className="d-fly bd">
      <div className="message-fly-cover flex center">
        <FlyingMessage />
      </div>
      <div className="message-path-cover bd">
        <FlyingMessagePath />
      </div>
    </section>
  );
}
