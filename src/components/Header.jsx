import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/newlogo14.png";

const navItems = [
  { to: "/hero", label: "Home", isSection: true },
  { to: "/aboutus", label: "About Us", isSection: true },
  { to: "/services", label: "Services", isSection: true },
  { to: "/case-studies", label: "Case Studies", isSection: true },
  { to: "/blogs", label: "Blog", isSection: true },
  { to: "/contact", label: "Contact", isSection: true },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update active section using IntersectionObserver (more performant than scroll handlers)
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection('');
      return;
    }

    const sectionIds = ['hero', 'aboutus', 'services', 'case-studies', 'contact', 'blogs'];
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    let frameRequested = false;
    let latestEntries = [];

    const processEntries = () => {
      frameRequested = false;
      let mostVisible = { id: null, ratio: 0 };
      latestEntries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= mostVisible.ratio) {
          mostVisible = { id: entry.target.id, ratio: entry.intersectionRatio };
        }
      });
      if (mostVisible.id) {
        setActiveSection(prev => (prev !== mostVisible.id ? mostVisible.id : prev));
      }
    };

    const observer = new IntersectionObserver((entries) => {
      latestEntries = entries;
      if (!frameRequested) {
        frameRequested = true;
        window.requestAnimationFrame(processEntries);
      }
    }, {
      root: null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-10% 0px -60% 0px"
    });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname]);

  const handleNavClick = (item, e) => {
    if (item.isSection) {
      e.preventDefault();
      console.log('handleNavClick called for:', item.label, 'from path:', location.pathname); // Debug log
      
      // If we're not on the home page, navigate to home first
      if (location.pathname !== "/") {
        console.log('Navigating from', location.pathname, 'to home, then scrolling to:', item.to.slice(1)); // Debug log
        navigate("/");
        // Wait for navigation to complete, then scroll to the specific section
        setTimeout(() => {
          const targetSectionId = item.to.slice(1); // Remove the leading slash
          console.log('Scrolling to section:', targetSectionId); // Debug log
          
          // Retry mechanism to ensure element is available
          const scrollToSection = (retryCount = 0) => {
            const element = document.getElementById(targetSectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
              console.log('Successfully scrolled to:', targetSectionId); // Debug log
            } else if (retryCount < 5) {
              console.log('Element not found, retrying... (attempt', retryCount + 1, ')'); // Debug log
              setTimeout(() => scrollToSection(retryCount + 1), 200);
            } else {
              console.log('Element not found after 5 attempts for section:', targetSectionId); // Debug log
            }
          };
          
          scrollToSection();
        }, 200); // Increased timeout to 200ms
      } else {
        // If we're already on home page, just scroll to the specific section
        const targetSectionId = item.to.slice(1); // Remove the leading slash
        console.log('Already on home, scrolling to section:', targetSectionId); // Debug log
        const element = document.getElementById(targetSectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          console.log('Successfully scrolled to:', targetSectionId); // Debug log
        } else {
          console.log('Element not found for section:', targetSectionId); // Debug log
        }
      }
      setMenuOpen(false);
    }
  };

  // Function to check if a section is currently active
  const isSectionActive = (sectionId) => {
    if (location.pathname !== "/") return false;
    return activeSection === sectionId;
  };

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${
        scrolled
          ? "bg-secondary/95 shadow"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full flex items-center px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-2 sm:py-3 md:py-4 min-h-[56px] sm:min-h-[60px] md:min-h-[64px] lg:min-h-[72px] xl:min-h-[80px]">
        {/* Left: Logo */}
        <div className="flex-shrink-0 hidden md:block">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Conbyt Logo"
              className="h-8 md:h-10 lg:h-12 xl:h-14 2xl:h-16 w-auto max-w-[100px] md:max-w-[120px] lg:max-w-[140px] xl:max-w-[160px] 2xl:max-w-[180px] drop-shadow-lg"
            />
          </Link>
        </div>
        {/* Center: Nav menu (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="hidden md:flex gap-6 lg:gap-8 xl:gap-10 text-text text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl items-center">
            {navItems.map((item) => (
              <li key={item.to}>
                {item.isSection ? (
                  <button
                    onClick={(e) => handleNavClick(item, e)}
                    className={`transition-all duration-300 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl relative group ${
                      isSectionActive(item.to.slice(1)) 
                        ? "text-accent font-semibold" 
                        : "text-text hover:text-accent"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                        isSectionActive(item.to.slice(1)) 
                          ? "w-full" 
                          : "w-0 group-hover:w-full"
                      }`}></span>
                    </span>
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `transition-all duration-300 text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl relative group ${
                        isActive
                          ? "text-accent font-semibold"
                          : "text-text hover:text-accent"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <span className="relative">
                        {item.label}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}></span>
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Right: Book a Meeting button (desktop only) */}
        <div className="flex-shrink-0">
          <a
            href="https://calendly.com/muneerhanif7/free-consultation"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-block px-4 md:px-6 lg:px-7 xl:px-8 py-1.5 md:py-2 lg:py-2.5 xl:py-3 rounded-full text-white shadow-xl transition text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl
              bg-gradient-to-r from-accent to-accent2 hover:from-accent2 hover:to-accent"
          >
            Book a Meeting
          </a>
        </div>
        {/* Mobile: flex row with logo, hamburger, and menu */}
        <div className="flex md:hidden items-center justify-between px-2 w-screen max-w-full">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src={logo}
              alt="Conbyt Logo"
              className="h-8 sm:h-9 md:h-10 w-auto max-w-[80px] sm:max-w-[90px] md:max-w-[100px] drop-shadow-lg"
            />
          </Link>
          
          {/* Mobile: Center Book a Meeting button */}
          <div className="flex-1 flex justify-center">
            <a
              href="https://calendly.com/muneerhanif7/free-consultation"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-semibold shadow-lg hover:scale-105 transition text-xs sm:text-sm"
            >
              Book a Meeting
            </a>
          </div>
          
          <button
            className="text-accent ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" className="sm:w-6 sm:h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                d={
                  menuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-secondary/95 absolute top-full left-0 w-full shadow-2xl">
          <ul className="flex flex-col items-start gap-1 py-4 sm:py-5 md:py-6 px-6">
            {navItems.map((item) => (
              <li key={item.to} className="w-full">
                {item.isSection ? (
                  <button
                    onClick={(e) => handleNavClick(item, e)}
                    className={`transition-all duration-300 text-sm sm:text-base md:text-lg relative group w-full text-left py-2 ${
                      isSectionActive(item.to.slice(1)) 
                        ? "text-accent font-semibold" 
                        : "text-text hover:text-accent"
                    }`}
                  >
                    <span className="relative">
                      {item.label}
                      <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                        isSectionActive(item.to.slice(1)) 
                          ? "w-full" 
                          : "w-0 group-hover:w-full"
                      }`}></span>
                    </span>
                  </button>
                ) : (
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `transition-all duration-300 text-sm sm:text-base md:text-lg relative group w-full text-left py-2 ${
                        isActive ? "text-accent font-semibold" : "text-text hover:text-accent"
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {({ isActive }) => (
                      <span className="relative">
                        {item.label}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        }`}></span>
                      </span>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;