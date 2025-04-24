"use client";

import React from "react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

export default function InfiniteMovingCardsDemo() {
  const testimonials = [
    {
      quote:
        "The goal of life is to make your heartbeat match the beat of the universe, to match your nature with Nature.",
      name: "Joseph Campbell",
      title: "Mythologist",
    },
    {
      quote: "Religion is a way of walking, not a way of talking.",
      name: "William Ralph Inge",
      title: "Anglican Priest & Professor",
    },
    {
      quote:
        "What we know is a drop; what we don’t know is an ocean.",
      name: "Sir Isaac Newton",
      title: "Physicist",
    },
    {
      quote:
        "Between stimulus and response there is a space. In that space is our power to choose our response. In our response lies our growth and our freedom.",
      name: "Victor Frankl",
      title: "Psychologist",
    },
    {
      quote:
        "Nothing in life is to be feared, it is only to be understood. Now is the time to understand more, so that we may fear less.",
      name: "Marie Curie",
      title: "Physicist",
    },
    {
      quote:
        "We are not human beings having a spiritual experience. We are spiritual beings having a human experience.",
      name: "Pierre Teilhard de Chardin",
      title: "Philosopher & Jesuit Priest",
    },
  ];

  return (
    <div className="py-50">
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        pauseOnHover={true}
      />
    </div>
  );
}
