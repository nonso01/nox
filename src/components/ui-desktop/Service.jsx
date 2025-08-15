import { ArrowUpRight } from "lucide-react";

export default function Service() {
  return (
    <section className="d-service flex column evenly" id="service">
      <div className="service-info flex between">
        <div>
          <p>
            My <span>Services</span>
          </p>
        </div>
        <div>
          <p>
            Specializing in web development, Blender art, and professional video
            editing to bring your vision to life.
          </p>
        </div>
      </div>
      <div className="service-cards flex between">
        <div className="cards">
          <p className="title">2D/3D Animations</p>
          <div className="folders">
            <div>
              <video autoPlay loop muted playsInline>
                <source src="/images/dice-390.webm" />
              </video>
            </div>
            <div>
              <img src="/images/nox-psp-390.png" alt="nox psp thumbnail" />
            </div>
            <div>
              <img src="/images/earth-390.png" alt="earth thumbnail" />
            </div>
          </div>
          <div className="arrow">
            <ArrowUpRight width={50} height={50} />
          </div>
        </div>
        <div className="cards">
          <p className="title ">Full Stack apps</p>
          <div className="folders">
            <div>
              <img
                src="/images/food-order-page.png"
                alt="food order page thumbnail"
              />
            </div>
            <div>
              <img src="/images/form-full-stack.png" alt="interactive form" />
            </div>
            <div>
              <img
                src="/images/pay-card-full-stack.png"
                alt="payment card page"
              />
            </div>
          </div>
          <div className="arrow">
            <ArrowUpRight width={50} height={50} />
          </div>
        </div>
        <div className="cards">
          <p className="title ">Landing pages</p>
          <div className="folders">
            <div>
              <img
                src="/images/sneaker-landing-page.png"
                alt="sneaker page thumbnail"
              />
            </div>
            <div>
              <img
                src="/images/bookmark-landing-page.png"
                alt="bookmark landing page"
              />
            </div>
            <div>
              <img
                src="/images/blogr-landing-page.png"
                alt="blogr landing page"
              />
            </div>
          </div>
          <div className="arrow">
            <ArrowUpRight width={50} height={50} />
          </div>
        </div>
      </div>
    </section>
  );
}
