import { AboutHero } from "@/components/aboutPageComponents/AboutHero";
import { OurStorySection } from "@/components/aboutPageComponents/OurStorySection";
import { MissionVisionSection } from "@/components/aboutPageComponents/MissionVisionSection";
import { FaqSection } from "@/components/aboutPageComponents/FaqSection";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurStorySection />
      <MissionVisionSection />
      <FaqSection />
    </>
  );
}
