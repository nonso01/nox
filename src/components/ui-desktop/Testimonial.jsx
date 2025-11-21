import { TestimonialCard, TData } from "../ui-shared/TestimonialCard";

export default function Testimonial() {
  return (
    <section className="d-testimonial flex column evenly limit-large-screen">
      <div className="words flex column evenly ">
        <p className="large">Testimonials that</p>
        <p className="large">
          Speak to <span>My Results</span>
        </p>
        <p className="small">
          weaving seamless web experiences, sculpting vivid Blender worlds, and
          editing dynamic videos to spark your imagination.
        </p>
      </div>

      <div className="cards flex column evenly ">
        <div className="marquee flex center ">
          {TData.map((_data, index) => {
            return <TestimonialCard data={_data} key={index} />;
          })}
        </div>
        <p className="join flex center ">
          Waiting for <span>Yours!</span>
        </p>
      </div>
    </section>
  );
}
