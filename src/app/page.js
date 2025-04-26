import { Header } from "@/components/Header";
import { Menu } from "@/components/Menu";
import { BeneficiosSection } from "@/components/sections/BeneficiosSection";
import { ContactUsSection } from "@/components/sections/ContactUsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowWorksSection } from "@/components/sections/HowWorksSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { WhatIsSection } from "@/components/sections/WhatIsSection";

export default function Home() {
  return (
    <>
      <Menu/>
      <Header/>
      <HeroSection/>
      <WhatIsSection/>
      <BeneficiosSection/>
      <HowWorksSection/>
      <VideoSection/>
      <ContactUsSection/>
    </>
  );
}
