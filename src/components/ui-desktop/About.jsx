import aboutMe from "../../assets/images/about-me.svg";
export default function About() {
  return (
    <section className="desktop-about limit-large-screen " id="about">
      <img src={aboutMe} alt="about me" />
    </section>
  );
}
