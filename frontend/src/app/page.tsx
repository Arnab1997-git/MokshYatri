import BackgroundEffects from "@/components/animations/BackgroundEffects";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/sections/home/Hero";
import Destinations from "@/sections/home/Destinations";
import StorySection from "@/sections/home/StorySection";
import Experiences from "@/sections/home/Experiences";
import HiddenGems from "@/sections/home/HiddenGems";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/animations/ScrollProgress";
import CursorGlow from "@/components/animations/CursorGlow";
import LoadingScreen from "@/components/animations/LoadingScreen";
import TestimonialsSection
from "@/components/home/TestimonialsSection";
export default function Home() {
  return (
    <main className="relative overflow-hidden bg-[#050816] text-white">
      <LoadingScreen />
      <ScrollProgress />
      <CursorGlow />
      <BackgroundEffects />
      <Navbar />
      <Hero />
      <Destinations />
      <StorySection />
      <Experiences />
      <HiddenGems />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}