import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaUsers, FaLightbulb, FaChartLine, FaCheckCircle } from "react-icons/fa";
import portfolio1 from "../assets/portfolio/1.webp";
import portfolio2 from "../assets/portfolio/2.webp";
import portfolio3 from "../assets/portfolio/3.webp";
import portfolio4 from "../assets/portfolio/4.webp";
import portfolio5 from "../assets/portfolio/5.webp";
import portfolio6 from "../assets/portfolio/6.webp";

const caseStudyData = {
  hiresense: {
    title: "HireSense",
    subtitle: "AI-Powered Technical Hiring Platform",
    heroImage: portfolio1,
    category: "AI Automation",
    tech: ["React", "Python", "AI", "Machine Learning"],
    client: "Tech Recruitment Agency",
    duration: "6 months",
    team: "3 developers",
    
    introduction: {
      title: "Introduction",
      content: "HireSense is an innovative AI-powered platform designed to streamline technical hiring processes. The platform leverages advanced machine learning algorithms to conduct automated interviews, evaluate candidate skills, and provide insightful analytics for hiring decisions.",
      challenge: "Traditional hiring processes were time-consuming, subjective, and often led to poor candidate matches. Companies struggled with screening large volumes of applications and identifying the best technical talent efficiently."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "Manual screening of hundreds of applications per position",
        "Subjective evaluation criteria leading to inconsistent hiring decisions",
        "Long hiring cycles (3-6 months) affecting business growth",
        "Difficulty in assessing technical skills remotely",
        "Lack of standardized evaluation metrics across different roles"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "AI-Powered Interview System",
          content: "Developed an intelligent interview platform that conducts automated technical assessments using natural language processing and machine learning algorithms. The system evaluates candidates based on predefined criteria and generates comprehensive reports.",
          icon: "🤖"
        },
        {
          title: "Automated Skill Evaluation",
          content: "Implemented advanced algorithms that assess technical skills through coding challenges, problem-solving scenarios, and real-world project simulations. The system provides objective scoring and detailed feedback.",
          icon: "📊"
        },
        {
          title: "Analytics Dashboard",
          content: "Created a comprehensive analytics dashboard that provides insights into hiring trends, candidate performance metrics, and optimization recommendations for recruitment strategies.",
          icon: "📈"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "Reduced hiring time", value: "70%", description: "From 3-6 months to 2-4 weeks" },
        { label: "Improved candidate quality", value: "85%", description: "Better skill-job match accuracy" },
        { label: "Cost savings", value: "$2.5M", description: "Annual savings for enterprise clients" },
        { label: "Client satisfaction", value: "94%", description: "Positive feedback from hiring managers" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our comprehensive AI solution transformed HireSense's vision into a powerful reality. By implementing cutting-edge machine learning algorithms, automated evaluation systems, and insightful analytics, we enabled the platform to revolutionize technical hiring processes. The result is a scalable, efficient, and intelligent recruitment solution that delivers measurable business impact."
    }
  },
  
  trykicks: {
    title: "TryKicks",
    subtitle: "Virtual Try-On Shoe Shopping Platform",
    heroImage: portfolio2,
    category: "Machine Learning",
    tech: ["Python", "ML", "Dashboard", "Computer Vision"],
    client: "E-commerce Startup",
    duration: "4 months",
    team: "3 developers",
    
    introduction: {
      title: "Introduction",
      content: "TryKicks is a revolutionary e-commerce platform that allows customers to virtually try on shoes before making a purchase. Using advanced computer vision and machine learning, the platform provides realistic 3D visualization of shoes on users' feet.",
      challenge: "Online shoe shopping faced high return rates due to customers being unable to visualize how shoes would look and fit. Traditional e-commerce lacked the interactive experience needed for confident purchasing decisions."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "High return rates (30-40%) due to poor fit visualization",
        "Limited customer confidence in online shoe purchases",
        "Complex 3D modeling and rendering requirements",
        "Real-time image processing and analysis needs",
        "Integration with existing e-commerce platforms"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "Virtual Try-On Technology",
          content: "Developed advanced computer vision algorithms that create realistic 3D models of shoes and accurately map them onto users' feet using smartphone cameras. The technology provides real-time visualization with high accuracy.",
          icon: "👟"
        },
        {
          title: "AI-Powered Fit Prediction",
          content: "Implemented machine learning models that predict shoe fit based on foot measurements, user preferences, and historical data. The system provides personalized recommendations and reduces return rates.",
          icon: "📏"
        },
        {
          title: "Interactive Shopping Experience",
          content: "Created an intuitive user interface that allows customers to rotate, zoom, and interact with virtual shoes. The platform integrates seamlessly with existing e-commerce systems.",
          icon: "🖱️"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "Reduced return rates", value: "65%", description: "From 35% to 12%" },
        { label: "Increased conversion", value: "40%", description: "Higher purchase confidence" },
        { label: "Customer satisfaction", value: "92%", description: "Positive user feedback" },
        { label: "Revenue growth", value: "28%", description: "Year-over-year increase" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our innovative virtual try-on solution transformed TryKicks into a market-leading e-commerce platform. By combining cutting-edge computer vision technology with intuitive user experience design, we created a solution that significantly reduces return rates while increasing customer confidence and sales conversion."
    }
  },
  
  flowagent: {
    title: "FlowAgent",
    subtitle: "Custom AI Agent Creation Platform",
    heroImage: portfolio3,
    category: "AI Automation",
    tech: ["NLP", "Healthcare", "AI", "Machine Learning"],
    client: "AI Startup",
    duration: "8 months",
    team: "4 developers",
    
    introduction: {
      title: "Introduction",
      content: "FlowAgent is a revolutionary platform that enables users to create custom AI agents, assistants, and automated workflows without any coding knowledge. The platform democratizes AI technology by providing intuitive tools for building intelligent automation solutions.",
      challenge: "Businesses and individuals wanted to leverage AI automation but lacked the technical expertise to build custom solutions. Existing platforms were either too complex or too limited in functionality."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "Complex AI development requirements for non-technical users",
        "Need for intuitive drag-and-drop interface",
        "Integration with multiple third-party services",
        "Scalable architecture for handling multiple AI agents",
        "Real-time processing and response capabilities"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "Visual Agent Builder",
          content: "Developed an intuitive drag-and-drop interface that allows users to create AI agents by connecting pre-built components. The system includes templates and guided workflows for common use cases.",
          icon: "🎨"
        },
        {
          title: "AI Model Integration",
          content: "Integrated multiple AI models and APIs to provide diverse capabilities including natural language processing, image recognition, and data analysis. Users can mix and match capabilities as needed.",
          icon: "🧠"
        },
        {
          title: "Workflow Automation Engine",
          content: "Built a powerful automation engine that can handle complex workflows, conditional logic, and real-time decision making. The system supports both scheduled and event-triggered automation.",
          icon: "⚙️"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "User adoption", value: "15K+", description: "Active users within 6 months" },
        { label: "Agents created", value: "50K+", description: "Custom AI agents built" },
        { label: "Time savings", value: "80%", description: "Average automation efficiency" },
        { label: "Customer satisfaction", value: "96%", description: "Platform usability rating" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our comprehensive AI platform democratized access to artificial intelligence technology. By creating an intuitive, powerful, and scalable solution, we enabled thousands of users to build custom AI agents that automate their workflows and enhance productivity."
    }
  },
  
  "vocalis-ai": {
    title: "Vocalis AI",
    subtitle: "AI Voice Agent Platform",
    heroImage: portfolio4,
    category: "Speech Recognition",
    tech: ["React", "Python", "AI", "Speech Synthesis"],
    client: "Call Center Solutions",
    duration: "7 months",
    team: "3 developers",
    
    introduction: {
      title: "Introduction",
      content: "Vocalis AI is a comprehensive platform for creating AI voice agents that can automate calls, boost sales, and provide customer support. The platform leverages advanced text-to-speech technology and natural language processing to create human-like voice interactions.",
      challenge: "Call centers and sales teams needed to scale their operations while maintaining personal touch. Traditional automation solutions were robotic and lacked the natural conversation flow that customers expect."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "Robotic-sounding voice automation",
        "Limited natural language understanding",
        "Complex integration with existing systems",
        "Scalability for high-volume calling",
        "Compliance with call recording regulations"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "Natural Voice Synthesis",
          content: "Developed advanced text-to-speech technology that produces human-like voices with natural intonation, emotion, and conversational flow. The system supports multiple languages and accents.",
          icon: "🎤"
        },
        {
          title: "Intelligent Conversation Engine",
          content: "Built a sophisticated NLP engine that understands context, handles interruptions, and maintains natural conversation flow. The system can adapt responses based on customer reactions and preferences.",
          icon: "💬"
        },
        {
          title: "Sales Optimization Tools",
          content: "Created intelligent tools for lead qualification, appointment scheduling, and follow-up automation. The system integrates with CRM platforms and provides detailed analytics on call performance.",
          icon: "📈"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "Call volume increase", value: "300%", description: "Automated call handling capacity" },
        { label: "Sales conversion", value: "45%", description: "Improved conversion rates" },
        { label: "Cost reduction", value: "60%", description: "Operational cost savings" },
        { label: "Customer satisfaction", value: "88%", description: "Positive call experience ratings" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our AI voice platform revolutionized how businesses handle customer interactions. By combining natural voice synthesis with intelligent conversation capabilities, we created a solution that scales operations while maintaining the personal touch that customers value."
    }
  },
  
  "rizzko-tech-store": {
    title: "Rizzko Tech Store",
    subtitle: "AI-Powered E-commerce Platform",
    heroImage: portfolio5,
    category: "Machine Learning",
    tech: ["React", "ML", "AI", "E-commerce"],
    client: "Technology Retailer",
    duration: "5 months",
    team: "3 developers",
    
    introduction: {
      title: "Introduction",
      content: "Rizzko Tech Store is an innovative e-commerce platform that leverages artificial intelligence to provide personalized shopping experiences, advanced product recommendations, and intelligent search functionality for technology products.",
      challenge: "Traditional e-commerce platforms offered generic experiences that didn't adapt to individual customer preferences. Product discovery was difficult, and customers often struggled to find the right technology products for their needs."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "Generic product recommendations",
        "Poor search functionality",
        "Limited personalization",
        "Complex product comparison",
        "Low customer engagement"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "AI-Powered Recommendations",
          content: "Developed sophisticated recommendation algorithms that analyze user behavior, purchase history, and product preferences to suggest relevant products. The system continuously learns and improves recommendations.",
          icon: "🎯"
        },
        {
          title: "Intelligent Search Engine",
          content: "Built an advanced search system that understands natural language queries, handles typos, and provides contextual results. The search includes semantic understanding and product categorization.",
          icon: "🔍"
        },
        {
          title: "Personalized Shopping Experience",
          content: "Created dynamic product pages, personalized dashboards, and smart comparison tools that adapt to individual user preferences and shopping patterns.",
          icon: "👤"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "Conversion rate", value: "35%", description: "Increase in sales conversion" },
        { label: "Average order value", value: "28%", description: "Higher purchase amounts" },
        { label: "Customer retention", value: "42%", description: "Improved repeat purchases" },
        { label: "Search accuracy", value: "92%", description: "Relevant search results" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our AI-powered e-commerce solution transformed Rizzko Tech Store into a personalized shopping destination. By implementing intelligent recommendations, advanced search, and personalized experiences, we significantly improved customer engagement and sales performance."
    }
  },
  
  neuroresume: {
    title: "NeuroResume",
    subtitle: "AI-Powered Resume Builder",
    heroImage: portfolio6,
    category: "NLP",
    tech: ["NLP", "AI", "React", "Machine Learning"],
    client: "Career Services Platform",
    duration: "6 months",
    team: "3 developers",
    
    introduction: {
      title: "Introduction",
      content: "NeuroResume is an intelligent resume builder that uses artificial intelligence to create compelling, optimized resumes tailored to specific job requirements. The platform analyzes job descriptions and suggests content improvements to increase interview chances.",
      challenge: "Job seekers struggled to create resumes that stood out to employers and passed through Applicant Tracking Systems (ATS). Generic resume templates didn't adapt to specific job requirements or industry standards."
    },
    
    challenges: {
      title: "Challenges They Faced",
      points: [
        "Generic resume templates",
        "Poor ATS optimization",
        "Lack of industry-specific guidance",
        "Difficulty highlighting relevant skills",
        "Limited customization options"
      ]
    },
    
    solutions: {
      title: "Our Impactful Solutions",
      sections: [
        {
          title: "AI Content Analysis",
          content: "Developed NLP algorithms that analyze job descriptions and suggest relevant skills, keywords, and content improvements. The system ensures resumes are optimized for ATS systems and human reviewers.",
          icon: "📝"
        },
        {
          title: "Intelligent Template System",
          content: "Created adaptive templates that automatically adjust formatting, content structure, and keyword placement based on job requirements and industry standards.",
          icon: "📄"
        },
        {
          title: "Performance Tracking",
          content: "Built analytics tools that track resume performance, provide feedback on improvements, and suggest optimization strategies based on application success rates.",
          icon: "📊"
        }
      ]
    },
    
    results: {
      title: "Results",
      metrics: [
        { label: "Interview rate", value: "68%", description: "Increase in interview invitations" },
        { label: "ATS success", value: "94%", description: "Resumes passing ATS screening" },
        { label: "User satisfaction", value: "91%", description: "Positive user feedback" },
        { label: "Job placement", value: "45%", description: "Successful job placements" }
      ]
    },
    
    closing: {
      title: "Closing the Loop: How We Facilitated Success",
      content: "Our AI-powered resume builder revolutionized how job seekers approach their applications. By combining intelligent content analysis with ATS optimization, we created a tool that significantly improves interview success rates and career outcomes."
    }
  }
};

const CaseStudyDetail = () => {
  const { slug } = useParams();
  const data = caseStudyData[slug];

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Case Study Not Found</h1>
          <Link to="/case-studies" className="text-accent hover:underline">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="w-full bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/case-studies" className="inline-flex items-center text-accent hover:text-white transition-colors mb-6">
            <FaArrowLeft className="mr-2" />
            Back to CaseStudies
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">{data.category}</span>
              <h1 className="text-5xl font-extrabold text-white mb-4 font-sans">{data.title}</h1>
              <p className="text-xl text-white/80 mb-6">{data.subtitle}</p>
              <div className="flex flex-wrap gap-4 mb-6">
                {data.tech.map((tech, idx) => (
                  <span key={idx} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm">
                <div>
                  <span className="text-white/60">Client</span>
                  <p className="font-semibold">{data.client}</p>
                </div>
                <div>
                  <span className="text-white/60">Duration</span>
                  <p className="font-semibold">{data.duration}</p>
                </div>
                <div>
                  <span className="text-white/60">Team</span>
                  <p className="font-semibold">{data.team}</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={data.heroImage}
                alt={data.title}
                className="w-full h-auto max-h-96 object-contain rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Introduction Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">{data.introduction.title}</h2>
            <p className="text-white/80 text-lg leading-relaxed mb-8">{data.introduction.content}</p>
            <h3 className="text-2xl font-bold text-white mb-4">The Challenge</h3>
            <p className="text-white/80 text-lg leading-relaxed">{data.introduction.challenge}</p>
          </div>
          <div className="bg-surface rounded-xl p-8 border border-accent/20">
            <div className="flex items-center mb-6">
              <FaLightbulb className="text-accent text-2xl mr-3" />
              <h3 className="text-xl font-bold text-white">Project Overview</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaUsers className="text-accent mr-3" />
                <span className="text-white/80">Client: {data.client}</span>
              </div>
              <div className="flex items-center">
                <FaChartLine className="text-accent mr-3" />
                <span className="text-white/80">Category: {data.category}</span>
              </div>
              <div className="flex items-center">
                <FaCheckCircle className="text-accent mr-3" />
                <span className="text-white/80">Status: Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-surface/20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">{data.challenges.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.challenges.points.map((point, idx) => (
            <div key={idx} className="bg-surface rounded-xl p-6 border border-accent/20">
              <div className="flex items-start">
                <span className="text-accent text-lg mr-3">•</span>
                <p className="text-white/80">{point}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">{data.solutions.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.solutions.sections.map((section, idx) => (
            <div key={idx} className="bg-surface rounded-xl p-8 border border-accent/20 hover:border-accent/40 transition-all duration-300">
              <div className="text-4xl mb-4">{section.icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{section.title}</h3>
              <p className="text-white/80 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 bg-surface/20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">{data.results.title}</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.results.metrics.map((metric, idx) => (
            <div key={idx} className="bg-surface rounded-xl p-6 border border-accent/20 text-center">
              <div className="text-3xl font-bold text-accent mb-2">{metric.value}</div>
              <div className="text-white font-semibold mb-2">{metric.label}</div>
              <div className="text-white/60 text-sm">{metric.description}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Closing Section */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">{data.closing.title}</h2>
          <p className="text-white/80 text-lg leading-relaxed">{data.closing.content}</p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Ready to Transform Your Business?</h3>
        <p className="text-white/80 mb-8">Let's discuss how we can help you achieve similar results with AI-powered solutions.</p>
        <a 
          href="https://calendly.com/muneerhanif7/free-consultation"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-accent to-accent2 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity font-semibold font-sans inline-block"
        >
          Start Your Project
        </a>
      </section>
    </div>
  );
};

export default CaseStudyDetail; 