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
      "Rooted in Torah and Jewish thought.",
  },
  {
    model: "PastorGPT",
    image: ThePastor,
    emoji: "✝️",
    title: "PastorGPT",
    description:
      "Wisdom informed by The New Testament.",
  },
  {
    model: "BuddhaGPT",
    image: TheBuddha,
    emoji: "☸️",
    title: "BuddhaGPT",
    description:
      "Inspired by core teachings of Buddhism.",
  },
  {
    model: "ImamGPT",
    image: TheImam,
    emoji: "☪️",
    title: "ImamGPT",
    description:
      "Built on the principles of the Quran.",
  },
];
