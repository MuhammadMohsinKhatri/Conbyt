import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ToastProvider from "./contexts/ToastContext";
import CMSRouteGuard from "./components/CMSRouteGuard";

const Home = lazy(() => import("./pages/Home"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const PrivacyPolicy = lazy(() => import("./pages/StaticContent/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/StaticContent/TermsOfService"));
const CMSLogin = lazy(() => import("./pages/CMS/Login"));
const CMSRegister = lazy(() => import("./pages/CMS/Register"));
const CMSDashboard = lazy(() => import("./pages/CMS/Dashboard"));
const BlogEditor = lazy(() => import("./pages/CMS/BlogEditor"));
const Blogs = lazy(() => import("./pages/CMS/Blogs"));
const ContactSubmissions = lazy(() => import("./pages/CMS/ContactSubmissions"));
const Clients = lazy(() => import("./pages/CMS/Clients"));
const Projects = lazy(() => import("./pages/CMS/Projects"));
const Milestones = lazy(() => import("./pages/CMS/Milestones"));
const Payments = lazy(() => import("./pages/CMS/Payments"));
const Portfolios = lazy(() => import("./pages/CMS/Portfolios"));
const Tasks = lazy(() => import("./pages/CMS/Tasks"));
const Users = lazy(() => import("./pages/CMS/Users"));
const Sitemap = lazy(() => import("./pages/Sitemap"));

// New dynamic pages
const Services = lazy(() => import("./pages/StaticContent/Services"));
const About = lazy(() => import("./pages/StaticContent/About"));
const Contact = lazy(() => import("./pages/StaticContent/Contact"));
const Pricing = lazy(() => import("./pages/StaticContent/Pricing"));
const FAQ = lazy(() => import("./pages/StaticContent/FAQ"));
const AISolutions = lazy(() => import("./pages/StaticContent/AISolutions"));
const MachineLearning = lazy(() => import("./pages/StaticContent/MachineLearning"));
const DataAnalytics = lazy(() => import("./pages/StaticContent/DataAnalytics"));
const WebDevelopment = lazy(() => import("./pages/StaticContent/WebDevelopment"));
const Careers = lazy(() => import("./pages/StaticContent/Careers"));


function AppContent() {
  const location = useLocation();
  const isCMSRoute = location.pathname.startsWith('/cms/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isCMSRoute && <Header />}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-screen bg-primary flex items-center justify-center text-white">Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-study/:slug" element={<CaseStudyDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/ai-solutions" element={<AISolutions />} />
          <Route path="/machine-learning" element={<MachineLearning />} />
          <Route path="/data-analytics" element={<DataAnalytics />} />
          <Route path="/web-development" element={<WebDevelopment />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/portfolio/:slug" element={<CaseStudyDetail />} />
          <Route path="/sitemap.xml" element={<Sitemap />} />
          {/* CMS Routes */}
          <Route path="/cms/login" element={<CMSLogin />} />
          <Route path="/cms/register" element={<CMSRegister />} />
          <Route path="/cms/dashboard" element={<CMSRouteGuard><CMSDashboard /></CMSRouteGuard>} />
          <Route path="/cms/blogs" element={<CMSRouteGuard><Blogs /></CMSRouteGuard>} />
          <Route path="/cms/blogs/new" element={<CMSRouteGuard><BlogEditor /></CMSRouteGuard>} />
          <Route path="/cms/blogs/edit/:id" element={<CMSRouteGuard><BlogEditor /></CMSRouteGuard>} />
          <Route path="/cms/contact" element={<CMSRouteGuard><ContactSubmissions /></CMSRouteGuard>} />
          <Route path="/cms/clients" element={<CMSRouteGuard><Clients /></CMSRouteGuard>} />
          <Route path="/cms/clients/new" element={<CMSRouteGuard><Clients /></CMSRouteGuard>} />
          <Route path="/cms/projects" element={<CMSRouteGuard><Projects /></CMSRouteGuard>} />
          <Route path="/cms/projects/new" element={<CMSRouteGuard><Projects /></CMSRouteGuard>} />
          <Route path="/cms/milestones" element={<CMSRouteGuard><Milestones /></CMSRouteGuard>} />
          <Route path="/cms/payments" element={<CMSRouteGuard><Payments /></CMSRouteGuard>} />
          <Route path="/cms/portfolios" element={<CMSRouteGuard><Portfolios /></CMSRouteGuard>} />
          <Route path="/cms/portfolios/new" element={<CMSRouteGuard><Portfolios /></CMSRouteGuard>} />
          <Route path="/cms/tasks" element={<CMSRouteGuard><Tasks /></CMSRouteGuard>} />
          <Route path="/cms/users" element={<CMSRouteGuard><Users /></CMSRouteGuard>} />
        </Routes>
        </Suspense>
      </main>
      {!isCMSRoute && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
}

export default App;