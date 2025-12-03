import HeroSection from "../components/HeroSection";
// import PatternInterrupt from "../components/PatternInterrupt";
import TrustedBySection from "../components/TrustedBySection";
import CaseStudiesSection from "../components/CaseStudiesSection";
import Testimonials from "../components/Testimonials";
// import WorkProcedure from "../components/WorkProcedure";
import ContactForm from "../components/ContactForm";
import AboutUs from "../components/AboutUsModern";
import CircularService from "../components/CircularService";
import TechStack from "../components/TechStack";
import SectionDivider from "../components/SectionDivider";
import BlogSection from "../components/BlogSection";

const Home = () => (
  <>
    <HeroSection />
    <TrustedBySection />
    <SectionDivider />
    <AboutUs />
    <SectionDivider />
    <CircularService />
    <SectionDivider />
    <TechStack />
    <SectionDivider />
    <CaseStudiesSection />
    <SectionDivider />
    <Testimonials />
    <SectionDivider />
    <BlogSection />
    <SectionDivider />
    {/* <WorkProcedure /> */}
    <ContactForm />
  </>
);

export default Home;