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
    <section className="d-fly limit-large-screen">
      <div className="message-fly-cover flex center ">
        <FlyingMessage />
      </div>
      <div className="message-path-cover">
        {/* if message-fly-cover is inside here, it can move with the path */}
        <FlyingMessagePath />
      </div>
      {/* user-flow */}
      <div>
        <UserFlowOne />
        <UserFlowTwo />
        <UserFlowThree />
        <UserFlowFour />
        <UserFlowFive />
        <UserFlowSix />
        <UserFlowSeven />
      </div>
    </section>
  );
}
