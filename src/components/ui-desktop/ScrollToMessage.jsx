import { FlyingMessagePath, FlyingMessage } from "../Svgs";

export default function ScrollToMessage() {
  return (
    <section className="d-fly bd">
      <div className="message-img">
        <FlyingMessage />
      </div>
      <div className="bd">
        <FlyingMessagePath />
      </div>
      <div className="debbug">test</div>
    </section>
  );
}
