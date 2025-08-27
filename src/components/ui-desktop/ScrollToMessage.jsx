import { FlyingMessagePath, FlyingMessage } from "../ui-shared/Svgs";
import {
  UserFlowOne,
  UserFlowTwo,
  UserFlowThree,
  UserFlowFour,
  UserFlowFive,
  UserFlowSix,
  UserFlowSeven,
} from "../ui-shared/UserFlow";

export default function ScrollToMessage() {
  return (
    <section className="d-fly debbug">
      <div className="message-fly-cover flex center  debbug">
        <FlyingMessage />
      </div>
      <div className="message-path-cover debbug">
        {/* if message-fly-cover is inside here, it can move with the path */}
        <FlyingMessagePath />
      </div>
      {/* user-flow */}
      <UserFlowOne />
      <UserFlowTwo />
      <UserFlowThree />
      <UserFlowFour />
      <UserFlowFive />
      <UserFlowSix />
      <UserFlowSeven />
    </section>
  );
}
