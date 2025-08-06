import { Star } from "lucide-react";

const TData = [
  {
    name: "David Clark",
    role: "Software Engineer",
    image: "https://avatars.githubusercontent.com/u/156743576?v=4",
    rating: 4,
    testimonial:
      "Martin's web development skills and Blender animations made our software interface both functional and visually stunning, saving us hours of design work.",
  },
  {
    name: "Maxim Kirby",
    role: "ML Researcher",
    image: "https://avatars.githubusercontent.com/u/132941561?v=4",
    rating: 4,
    testimonial:
      "Martin's video edits and 3D models brought our ML data visualizations to life, enhancing our presentations with a 25% better audience response.",
  },
  {
    name: "S. Shahriar",
    role: "Scientist at the basement",
    image: "https://avatars.githubusercontent.com/u/79012744?v=4",
    rating: 3,
    testimonial:
      "Martin's web and video work was decent, but the Blender designs needed more polish to meet our scientific standards.",
  },
  {
    name: "Catherine Mitagvaria",
    role: "Frontend Dev",
    image: "https://avatars.githubusercontent.com/u/63928803?v=4",
    rating: 5,
    testimonial:
      "Martin's seamless web integration, Blender creativity, and video editing elevated our frontend to perfection—our users love it!",
  },
  {
    name: "Eduardo Robles",
    role: "system Admin",
    image: "https://avatars.githubusercontent.com/u/8143735?v=4",
    rating: 4,
    testimonial:
      "Martin's video tutorials and web tools streamlined our system training, making my job as an admin much easier.",
  },
  {
    name: "Joshua Mo",
    role: "DevRel Engineer ",
    image: "https://avatars.githubusercontent.com/u/102877324?v=4",
    rating: 4,
    testimonial:
      "Martin's engaging videos and Blender demos boosted our dev community's interest, doubling our event turnout.",
  },
  {
    name: "Charles Chrismann",
    role: "Étudiant en 4e année de Développement Web à l'IIM",
    image: "https://avatars.githubusercontent.com/u/78157563?v=4",
    rating: 3,
    testimonial:
      "Martin a créé un site web et des vidéos corrects, mais ses animations Blender pourraient être améliorées avec plus de détails.",
  },
  {
    name: "Cyro Cunha",
    role: "Developer",
    image: "https://avatars.githubusercontent.com/u/61237292?v=4",
    rating: 5,
    testimonial:
      "Martin's web expertise, Blender mastery, and video skills turned our app into a standout success—truly exceptional work!",
  },
];

function TestimonialCard({ data }) {
  const stars = Array.from({ length: data?.rating }, (_, index) => (
    <Star key={index} />
  ));

  return (
    <>
      <div className="t-card flex column evenly">
        <div className="detail flex ">
          <img src={data?.image} alt={data?.name} />
          <div className="flex column evenly ">
            <p className="name"> {data?.name}</p>
            <p className="role">{data?.role}</p>
          </div>
        </div>
        <div className="info ">{data?.testimonial}</div>
        <div className="rate flex ">
          <div className="flex center">{stars}</div>
          <p className="flex center">{data?.rating}.0</p>
        </div>
      </div>
      <style jsx="true">{`
        .t-card {
          //   border: 2px solid var(--sc);
          background-color: #222;
          width: 500px;
          height: 250px;
          border-radius: 0.625rem;
          padding-inline: 1rem;

          .detail {
            height: 25%;
            gap: 1rem;
            img {
              height: 100%;
              aspect-ratio: 1;
              border-radius: 50%;
              /*border: 2px solid blue;*/
            }

            .name {
              font-weight: 600;
            }

            .role {
              opacity: 0.7;
            }
          }

          .info {
            height: 40%;
          }

          .rate {
            height: 15%;
            gap: 1rem;
            p {
              font-family: "Orbitron", sans-serif;
              font-weight: 500;
            }
          }
        }
      `}</style>
    </>
  );
}

export { TData, TestimonialCard };
