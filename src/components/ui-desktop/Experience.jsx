import { LineFollowCircle } from "../Svgs";

export default function Experience() {
  return (
    <section className="d-experience flex column evenly ">
      <div className="flex center p-work ">
        <p>My Work Experience</p>
      </div>
      <div className="d-work flex between ">
        <div className="d-work-time flex column between ">
          <div className="">
            <h2>Upwork</h2>
            <p>
              Dec <span>2023</span> - July <span>2025</span>
            </p>
          </div>
          <div className="">
            <h2>Digital Dream,Lagos</h2>
            <p>
              Mar <span>2021</span> - Sep <span>2022</span>
            </p>
          </div>
          <div className="">
            <h2>Self-Employed,Yaounde</h2>
            <p>
              Feb <span>2020</span> - Dec <span>2020</span>
            </p>
          </div>
        </div>

        <div className="d-work-info flex between ">
          <div className="lines flex center ">
            <LineFollowCircle />
          </div>
          <div className="info-detail flex column between ">
            <div className="">
              <h2>Web Dev/Animator</h2>
              <p>
                I've been building engaging web experiences and compelling
                animations. My work combines front-end development skills with
                3D design to deliver visually rich and interactive digital
                content.
              </p>
            </div>
            <div className="">
              <h2>Frontend Developer</h2>
              <p>
                I helped developed responsive user interfaces for a B2B SaaS
                dashboard, focusing on data visualization and intuitive user
                experience. I translated complex data into clear, interactive
                charts using React and TypeScript, ensuring optimal performance.
              </p>
            </div>
            <div className="">
              <h2>Apprentice</h2>
              <p>
                During this phase, i was simply fuckin around till i found out,
                and i never left :D
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
