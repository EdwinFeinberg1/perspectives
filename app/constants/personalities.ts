import TheRabbi from "../assets/TheRabbi.png";
import ThePastor from "../assets/ThePastor.png";
import TheBuddha from "../assets/TheBuddha.png";
import TheImam from "../assets/Imam.png";
import { ModelName } from "../types";
import { StaticImageData } from "next/image";

export interface Personality {
  model: NonNullable<ModelName>;
  image: StaticImageData;
  emoji: string;
  title: string;
  description: string;
}

export const PERSONALITIES: Personality[] = [
  {
    model: "RabbiGPT",
    image: TheRabbi,
    emoji: "✡️",
    title: "RabbiGPT",
    description:
      "Rooted in Torah and Jewish thought, RabbiGPT offers thoughtful answers shaped by thousands of years of Jewish wisdom.",
  },
  {
    model: "PastorGPT",
    image: ThePastor,
    emoji: "✝️",
    title: "PastorGPT",
    description:
      "Grounded in Christian scripture and tradition, PastorGPT provides compassionate guidance informed by Biblical teachings and theological reflection.",
  },
  {
    model: "BuddhaGPT",
    image: TheBuddha,
    emoji: "☸️",
    title: "BuddhaGPT",
    description:
      "Inspired by the Buddha's teachings, this perspective draws from the Dhammapada and sutras to offer mindful, reflective insight.",
  },
  {
    model: "ImamGPT",
    image: TheImam,
    emoji: "☪️",
    title: "ImamGPT",
    description:
      "Grounded in Islamic tradition and the teachings of the Quran, ImamGPT provides thoughtful guidance from the perspective of Islamic wisdom.",
  },
];
