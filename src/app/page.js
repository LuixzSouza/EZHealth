import { Beneficio } from "@/components/Beneficio";
import { CircleOrangeIcon } from "@/components/CircleOrangeIcon";
import { Header } from "@/components/Header";
import { HeadingDarkBlue } from "@/components/HeadingDarkBlue";
import { HeadingOrange } from "@/components/HeadingOrange";
import { ParagraphBlue } from "@/components/ParagraphBlue";
import { BeneficiosSection } from "@/components/sections/BeneficiosSection";
import { ContactUsSection } from "@/components/sections/ContactUsSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowWorksSection } from "@/components/sections/HowWorksSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { WhatIsSection } from "@/components/sections/WhatIsSection";
import { SpanParagraph } from "@/components/SpanParagraph";
import Image from "next/image";

export default function Home() {
  return (
    <>
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
