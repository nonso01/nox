import diceVideo from "../../assets/images/dice-390.webm";
import cyber from "../../assets/images/cyber.webp";
import noxPspImage from "../../assets/images/nox-psp.webp";

const cardData = [
  {
    title: "Cybersecurity & Analysis",
    subTitle: "Security",
    note: "kali, tcpdump, splunk...",
    fileNumber: 3,
    linksToFile: [],
    video: false,
    bgUrl: cyber,
    id: "cyber-security",
  },
  {
    title: "3D Animations & Modeling",
    subTitle: "Blender Art",
    note: "final & experimental",
    fileNumber: 8,
    linksToFile: [],
    video: true,
    bgUrl: "",
    id: "3d-modeling",
  },
  {
    title: "FullStack Websites & Landing Pages",
    subTitle: "Web Development",
    note: "JS,Node.js,amd Rust",
    fileNumber: 11,
    linksToFile: [],
    video: false,
    bgUrl: noxPspImage,
    id: "web-development",
  },
];

export { cardData, diceVideo, cyber, noxPspImage };
