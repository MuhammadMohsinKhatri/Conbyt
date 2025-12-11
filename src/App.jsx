import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const CMSLogin = lazy(() => import("./pages/CMS/Login"));
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
          {/* CMS Routes */}
          <Route path="/cms/login" element={<CMSLogin />} />
          <Route path="/cms/dashboard" element={<CMSDashboard />} />
          <Route path="/cms/blogs" element={<Blogs />} />
          <Route path="/cms/blogs/new" element={<BlogEditor />} />
          <Route path="/cms/blogs/edit/:id" element={<BlogEditor />} />
          <Route path="/cms/contact" element={<ContactSubmissions />} />
          <Route path="/cms/clients" element={<Clients />} />
          <Route path="/cms/clients/new" element={<Clients />} />
          <Route path="/cms/projects" element={<Projects />} />
          <Route path="/cms/projects/new" element={<Projects />} />
          <Route path="/cms/milestones" element={<Milestones />} />
          <Route path="/cms/payments" element={<Payments />} />
          <Route path="/cms/portfolios" element={<Portfolios />} />
          <Route path="/cms/portfolios/new" element={<Portfolios />} />
          <Route path="/cms/tasks" element={<Tasks />} />
          <Route path="/cms/users" element={<Users />} />
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
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;