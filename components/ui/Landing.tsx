"use client";

import Hero from "../HeroSection";
import Advertisment from "../Advertisment";

export default function Landing() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <Hero />
      <Advertisment />
    </div>
  );
}
