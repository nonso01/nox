import experienceSvg from "../../assets/images/experience.svg";

export default function Experience() {
  return (
    <section className="desktop-experience flex column evenly limit-large-screen">
      <img src={experienceSvg} alt="experience component" />
    </section>
  );
}
