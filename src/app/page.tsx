import MainNav from "@/components/MainNav";
import HeroSection from "@/components/HeroSection";
import SpecsSection from "@/components/SpecsSection";
import ManifestoSection from "@/components/ManifestoSection";
import AudienceSection from "@/components/AudienceSection";
import SmartPaperSection from "@/components/SmartPaperSection";
import InsideBoxSection from "@/components/InsideBoxSection";
import DetailsSection from "@/components/DetailsSection";
import ColorsSection from "@/components/ColorsSection";
import Footer from "@/components/Footer";
import ScrollTriggerRefresh from "@/components/ScrollTriggerRefresh";
import {
  getAudienceSection,
  getColorsSection,
  getDetailsSection,
  getFooter,
  getHeroSection,
  getInsideBoxSection,
  getMainNav,
  getNotifyPopup,
  getManifestoSection,
  getSmartPaperSection,
  getSpecsSection,
} from "@/lib/strapi";

// This is a Server Component: it runs on the server, talks to Strapi,
// then sends finished HTML to the browser.
export default async function Home() {
  // Ask Strapi for all sections at the same time (faster than one after another)
  const [nav, popup, hero, specs, manifesto, audience, smartPaper, insideBox, details, colors, footer] = await Promise.all([
    getMainNav(),
    getNotifyPopup(),
    getHeroSection(),
    getSpecsSection(),
    getManifestoSection(),
    getAudienceSection(),
    getSmartPaperSection(),
    getInsideBoxSection(),
    getDetailsSection(),
    getColorsSection(),
    getFooter(),
  ]);

  return (
    <main>
      {/* Fixed at the top of the screen, above every section */}
      <MainNav data={nav} popup={popup} />

      <HeroSection data={hero} />
      <SpecsSection data={specs} />
      <ManifestoSection data={manifesto} />
      <AudienceSection data={audience} />
      <SmartPaperSection data={smartPaper} />
      <InsideBoxSection data={insideBox} />
      <DetailsSection data={details} />
      <ColorsSection data={colors} />
      <Footer data={footer} />

      {/* Re-measure all scroll animations once the fonts have loaded */}
      <ScrollTriggerRefresh />
    </main>
  );
}
