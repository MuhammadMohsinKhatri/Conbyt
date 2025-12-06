import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import CaseStudies from "./pages/CaseStudies";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CMSLogin from "./pages/CMS/Login";
import CMSDashboard from "./pages/CMS/Dashboard";
import BlogEditor from "./pages/CMS/BlogEditor";
import Blogs from "./pages/CMS/Blogs";
import ContactSubmissions from "./pages/CMS/ContactSubmissions";
import Clients from "./pages/CMS/Clients";
import Projects from "./pages/CMS/Projects";
import Milestones from "./pages/CMS/Milestones";
import Payments from "./pages/CMS/Payments";
import Portfolios from "./pages/CMS/Portfolios";


function AppContent() {
  const location = useLocation();
  const isCMSRoute = location.pathname.startsWith('/cms/');

  return (
    <div className="flex flex-col min-h-screen">
      {!isCMSRoute && <Header />}
      <main className="flex-1">
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
        </Routes>
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