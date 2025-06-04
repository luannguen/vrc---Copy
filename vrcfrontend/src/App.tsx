import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './i18n/config'; // Initialize i18n

// Public pages
import MainLayout from "./components/layouts/MainLayout";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Projects from "./pages/Projects";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Installation from "./pages/Installation";
import Maintenance from "./pages/Maintenance";
import Repair from "./pages/Repair";
import Consulting from "./pages/Consulting";
import ServiceSupport from "./pages/ServiceSupport";
import Technologies from "./pages/Technologies";
import EnergyEfficiency from "./pages/technologies/EnergyEfficiency";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import { TagPage } from "./pages/TagPage";
import Contact from "./pages/Contact";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import NotFound from "./pages/NotFound";

// Legal pages
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Cookies from "./pages/legal/Cookies";
import Sitemap from "./pages/legal/Sitemap";

// Data & Resources pages
import Statistics from "./pages/data/Statistics";
import Tools from "./pages/data/Tools";

// Publication pages
import Publications from "./pages/publications/Index";
import InverterTechnology from "./pages/publications/InverterTechnology";
import HeatRecoverySolutions from "./pages/publications/HeatRecoverySolutions";
import GreenBuildingStandards from "./pages/publications/GreenBuildingStandards";
import EnergyEfficiencyReport from "./pages/publications/EnergyEfficiencyReport";

// Product pages
import IndustrialProducts from "./pages/products/Industrial";
import CommercialProducts from "./pages/products/Commercial";
import ResidentialProducts from "./pages/products/Residential";
import ColdStorageProducts from "./pages/products/ColdStorage";
import AuxiliaryProducts from "./pages/products/Auxiliary";

// Project pages
import IndustrialProjects from "./pages/projects/Industrial";
import CommercialProjects from "./pages/projects/Commercial";
import SpecializedProjects from "./pages/projects/Specialized";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectCategory from "./pages/ProjectCategory";
import AllProjects from "./pages/AllProjects";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="about" element={<About />} />
          <Route path="products" element={<Products />} />
          <Route path="products/industrial" element={<IndustrialProducts />} />
          <Route path="products/commercial" element={<CommercialProducts />} />
          <Route path="products/residential" element={<ResidentialProducts />} />
          <Route path="products/cold-storage" element={<ColdStorageProducts />} />
          <Route path="products/auxiliary" element={<AuxiliaryProducts />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/all" element={<AllProjects />} />
          <Route path="projects/industrial" element={<IndustrialProjects />} />
          <Route path="projects/commercial" element={<CommercialProjects />} />
          <Route path="projects/specialized" element={<SpecializedProjects />} />
          <Route path="projects/category/:categorySlug" element={<ProjectCategory />} />
          <Route path="projects/detail/:slug" element={<ProjectDetail />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetail />} />
          <Route path="installation" element={<Installation />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="repair" element={<Repair />} />
          <Route path="consulting" element={<Consulting />} />
          <Route path="service-support" element={<ServiceSupport />} />
          <Route path="technologies" element={<Technologies />} />
          <Route path="technologies/energy-efficiency" element={<EnergyEfficiency />} />
          <Route path="technology" element={<Navigate to="/technologies" replace />} />
          <Route path="news" element={<News />} />
          <Route path="news/tag/:tagSlug" element={<TagPage />} />
          <Route path="news/:slug" element={<NewsDetail />} />
          <Route path="tags/:tag" element={<TagPage />} />
          <Route path="events" element={<Events />} />
          <Route path="events/tag/:tag" element={<Events />} />
          <Route path="event-details/:id" element={<EventDetail />} />
          <Route path="publications" element={<Publications />} />
          <Route path="publications/inverter-technology" element={<InverterTechnology />} />
          <Route path="publications/heat-recovery-solutions" element={<HeatRecoverySolutions />} />
          <Route path="publications/green-building-standards" element={<GreenBuildingStandards />} />
          <Route path="publications/energy-efficiency-report" element={<EnergyEfficiencyReport />} />
          <Route path="contact" element={<Contact />} />
          <Route path="legal/privacy" element={<Privacy />} />
          <Route path="legal/terms" element={<Terms />} />
          <Route path="legal/cookies" element={<Cookies />} />
          <Route path="legal/sitemap" element={<Sitemap />} />
          <Route path="data/statistics" element={<Statistics />} />
          <Route path="data/tools" element={<Tools />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
    <ReactQueryDevtools initialIsOpen={false} />
  </TooltipProvider>
  </QueryClientProvider>
);

export default App;
