import React from "react";
import Hero from "./Hero/page";
import Container from "@/components/Shared/Container";
import { PromoBanner } from "./promo-banner/page";
import { FeaturedCakes } from "@/components/Shared/FeaturedCakes";
import { Features } from "@/components/Shared/Features";
import { Reviews } from "./Reviews/page";

const page = () => {
  return (
    <div className="flex flex-col">
      <Hero></Hero>
      <div>
        <Container>
          <FeaturedCakes></FeaturedCakes>
        </Container>
        <Features></Features>
        <Container>
          <Reviews></Reviews>
        </Container>
        <Container>
          <PromoBanner></PromoBanner>
        </Container>
      </div>
    </div>
  );
};

export default page;
