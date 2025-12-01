import { Lightbulb, NotebookPen, DraftingCompass } from "lucide-react";

export function UserFlowOne() {
  const cardData = [
    {
      name: "Strategy",
      timeline: "3 Days",
      icon: Lightbulb,
      todo: ["Goals", "Functional", "Adiation Stage"],
    },
    { name: "Discovery", timeline: "15 Days", icon: NotebookPen, todo: [] },
    { name: "Solution", timeline: "50 Days", icon: DraftingCompass, todo: [] },
  ];
  return (
    <div className="user-flow one flex column between debug" data-flow="one">
      <div className="description flex between">
        <p className="font-orbitron number debug">00</p>
        <div className="title flex column evenly debug">
          <h3>UI Development Process</h3>
          <p>
            Crafting the visual and interactive elements step by step transforms
            raw code into an immersive experience, echoing themes of aesthetic
            innovation, user-centric design, and the passionate quest for
            elegance with React, tailwindcss, and more.
          </p>
        </div>
      </div>

      <div className="illustration debug">
        <div className="illustration-ui-dev flex evenly">
          {cardData.map(({ name, timeline, icon, todo }) => {
            return (
              <div className={`${name.toLocaleLowerCase()} card debug`} key={name}></div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function UserFlowTwo() {
  return (
    <div className="user-flow flex column between  two" data-flow="two">
      <div className="description flex between ">
        <p className="font-orbitron number">01</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}

export function UserFlowThree() {
  return (
    <div className="user-flow  three flex column between" data-flow="three">
      <div className="description flex between ">
        <p className="font-orbitron number">03</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}
export function UserFlowFour() {
  return (
    <div className="user-flow  four flex column between" data-flow="four">
      <div className="description flex between ">
        <p className="font-orbitron number">04</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}
export function UserFlowFive() {
  return (
    <div className="user-flow  five flex column between" data-flow="five">
      <div className="description flex between ">
        <p className="font-orbitron number">05</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}
export function UserFlowSix() {
  return (
    <div className="user-flow  six flex column between" data-flow="six">
      <div className="description flex between ">
        <p className="font-orbitron number">06</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}
export function UserFlowSeven() {
  return (
    <div className="user-flow  seven flex column between" data-flow="seven">
      <div className="description flex between ">
        <p className="font-orbitron number">07</p>
        <div className="title flex column evenly">
          <h3>Responsive Design</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            Voluptatibus natus dicta autem sint corrupti hic, laboriosam
            perferendis necessitatibus ullam voluptatem, omnis mollitia commodi
            ex repellendus esse nemo et at. Asperiores.
          </p>
        </div>
      </div>
      <div className="illustration "></div>
    </div>
  );
}
