import HeroSection from "@/components/HeroSection";
import FeaturedTopics from "@/components/FeaturedTopics";
import LatestPublications from "@/components/LatestPublications";
import DataResources from "@/components/DataResources";
import ContactForm from "@/components/ContactForm";
import { useHomepageSEOConfig } from "@/hooks/useSEO";

const Index = () => {
  // Apply SEO settings from homepage settings API
  useHomepageSEOConfig();

  return (
    <>
      <HeroSection />
      <FeaturedTopics />
      <LatestPublications />
      <DataResources />
      <ContactForm />
    </>
  );
};

export default Index;
