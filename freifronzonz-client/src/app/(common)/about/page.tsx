import Tradition from "@/components/pages/about/Tradition";
import WhyChooseUs from "@/components/pages/about/WhyChooseUs";
import TestimonialsSection from "@/components/pages/home/TestimonialsSection";
import Hero from "@/components/shared/Hero2";
import React from "react";

export default function page() {
  return (
    <div>
      <Hero title="About Us" backgroundImage="/images/h2.png" />

      <Tradition />
      <WhyChooseUs />
      <TestimonialsSection />
    </div>
  );
}
