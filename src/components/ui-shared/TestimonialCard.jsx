import { Star } from "lucide-react";

const TData = [
  {
    name: "David Clark",
    role: "Software Engineer",
    image: "https://avatars.githubusercontent.com/u/156743576?v=4",
    rating: 4,
    testimonial:
      "The project was delivered ahead of schedule and the code quality exceeded our expectations. Collaboration was smooth and communication was always clear.",
  },
  {
    name: "Maxim Kirby",
    role: "ML Researcher",
    image: "https://avatars.githubusercontent.com/u/132941561?v=4",
    rating: 4,
    testimonial:
      "Our data visualizations became much more engaging after integrating the 3D models and Blender animations. The technical support throughout was excellent.",
  },
  {
    name: "S. Shahriar",
    role: "Scientist at the basement",
    image: "https://avatars.githubusercontent.com/u/79012744?v=4",
    rating: 3,
    testimonial:
      "The web platform was functional and reliable, though a bit more attention to scientific detail would have made it perfect for our research needs.",
  },
  {
    name: "Catherine Mitagvaria",
    role: "Frontend Dev",
    image: "https://avatars.githubusercontent.com/u/63928803?v=4",
    rating: 5,
    testimonial:
      "UI/UX improvements were spot on, and the responsiveness across devices was impressive. Our users noticed the difference immediately.",
  },
  {
    name: "Eduardo Robles",
    role: "System Admin",
    image: "https://avatars.githubusercontent.com/u/8143735?v=4",
    rating: 4,
    testimonial:
      "Setup and deployment were straightforward, and the documentation made ongoing maintenance a breeze.",
  },
  {
    name: "Joshua Mo",
    role: "DevRel Engineer",
    image: "https://avatars.githubusercontent.com/u/102877324?v=4",
    rating: 4,
    testimonial:
      "The video tutorials provided were clear and concise, making it easy for our developer community to get started quickly.",
  },
  {
    name: "Charles Chrismann",
    role: "Étudiant en 4e année de Développement Web à l'IIM",
    image: "https://avatars.githubusercontent.com/u/78157563?v=4",
    rating: 3,
    testimonial:
      "Le site web était bien conçu et facile à utiliser. Quelques animations supplémentaires auraient été appréciées.",
  },
  {
    name: "Cyro Cunha",
    role: "Developer",
    image: "https://avatars.githubusercontent.com/u/61237292?v=4",
    rating: 5,
    testimonial:
      "Problem-solving skills and attention to detail stood out throughout the project. Would definitely collaborate again.",
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
          <img src={data?.image} alt={data?.name} loading="lazy" />
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
    </>
  );
}

export { TData, TestimonialCard };
