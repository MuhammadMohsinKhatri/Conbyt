import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import ContactSubmissions from "./pages/CMS/ContactSubmissions";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
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
            <Route path="/cms/blogs/new" element={<BlogEditor />} />
            <Route path="/cms/blogs/edit/:id" element={<BlogEditor />} />
            <Route path="/cms/contact" element={<ContactSubmissions />} />
          </Routes>
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
}

export default App;