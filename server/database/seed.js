import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Seed Case Studies
    const caseStudies = [
      {
        title: "HireSense",
        description: "A platform that streamlines technical hiring with AI-powered interviews, automated evaluations, and insightful candidate analytics.",
        image_url: "/src/assets/portfolio/1.webp",
        tech_stack: JSON.stringify(["React", "Python", "AI"]),
        category: "AI Automation",
        slug: "hiresense",
        content: "Full case study content for HireSense..."
      },
      {
        title: "TryKicks",
        description: "A shoe shopping app with virtual try-on functionality.",
        image_url: "/src/assets/portfolio/2.webp",
        tech_stack: JSON.stringify(["Python", "ML", "Dashboard"]),
        category: "Machine Learning",
        slug: "trykicks",
        content: "Full case study content for TryKicks..."
      },
      {
        title: "FlowAgent",
        description: "A platform where users can create custom AI agents, assistants, and workflows to automate their tasks effortlessly.",
        image_url: "/src/assets/portfolio/3.webp",
        tech_stack: JSON.stringify(["NLP", "Healthcare", "AI"]),
        category: "AI Automation",
        slug: "flowagent",
        content: "Full case study content for FlowAgent..."
      },
      {
        title: "Vocalis AI",
        description: "A platform to create AI voice agents, automate calls, boost sales, and leverage text-to-speech technology.",
        image_url: "/src/assets/portfolio/4.webp",
        tech_stack: JSON.stringify(["React", "Python", "AI"]),
        category: "Speech Recognition",
        slug: "vocalis-ai",
        content: "Full case study content for Vocalis AI..."
      },
      {
        title: "Rizzko Tech Store",
        description: "An e-commerce platform with advanced product recommendations and AI-powered search functionality.",
        image_url: "/src/assets/portfolio/5.webp",
        tech_stack: JSON.stringify(["React", "ML", "AI"]),
        category: "Machine Learning",
        slug: "rizzko-tech-store",
        content: "Full case study content for Rizzko Tech Store..."
      },
      {
        title: "NeuroResume",
        description: "AI-powered resume builder with intelligent content suggestions and optimization.",
        image_url: "/src/assets/portfolio/6.webp",
        tech_stack: JSON.stringify(["NLP", "AI", "React"]),
        category: "NLP",
        slug: "neuroresume",
        content: "Full case study content for NeuroResume..."
      }
    ];

    for (const study of caseStudies) {
      await pool.execute(
        `INSERT INTO case_studies (title, description, image_url, tech_stack, category, slug, content) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description)`,
        [study.title, study.description, study.image_url, study.tech_stack, study.category, study.slug, study.content]
      );
    }
    console.log('✅ Case studies seeded');

    // Seed Blog Posts
    const blogPosts = [
      {
        title: "The Future of AI in Business: 2024 Trends and Predictions",
        excerpt: "Explore the latest developments in artificial intelligence and how they're reshaping business operations across industries.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog1.webp",
        category: "AI Trends",
        author_name: "Sarah Johnson",
        author_avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        date: "2024-03-15",
        read_time: 8,
        slug: "future-of-ai-business-2024"
      },
      {
        title: "Machine Learning vs Deep Learning: Understanding the Differences",
        excerpt: "A comprehensive guide to understanding the key differences between machine learning and deep learning approaches.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog2.webp",
        category: "Machine Learning",
        author_name: "Michael Chen",
        author_avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        date: "2024-03-10",
        read_time: 12,
        slug: "machine-learning-vs-deep-learning"
      },
      {
        title: "Building Scalable AI Solutions: Best Practices for Enterprise",
        excerpt: "Learn the essential strategies and best practices for developing scalable AI solutions in enterprise environments.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog3.webp",
        category: "Enterprise AI",
        author_name: "David Rodriguez",
        author_avatar: "https://randomuser.me/api/portraits/men/76.jpg",
        date: "2024-03-05",
        read_time: 15,
        slug: "building-scalable-ai-solutions"
      },
      {
        title: "Natural Language Processing: Revolutionizing Customer Service",
        excerpt: "Discover how NLP is transforming customer service and creating more intelligent, responsive support systems.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog4.webp",
        category: "NLP",
        author_name: "Emily Watson",
        author_avatar: "https://randomuser.me/api/portraits/women/65.jpg",
        date: "2024-02-28",
        read_time: 10,
        slug: "nlp-revolutionizing-customer-service"
      },
      {
        title: "Computer Vision Applications in Modern Industries",
        excerpt: "Explore real-world applications of computer vision technology across various industries and sectors.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog5.webp",
        category: "Computer Vision",
        author_name: "Alex Thompson",
        author_avatar: "https://randomuser.me/api/portraits/men/45.jpg",
        date: "2024-02-20",
        read_time: 14,
        slug: "computer-vision-applications-industries"
      },
      {
        title: "The Rise of Conversational AI: Chatbots and Beyond",
        excerpt: "Understanding the evolution of conversational AI and its impact on user experience and business automation.",
        content: "Full blog content...",
        image_url: "/src/assets/blogs/blog6.webp",
        category: "Conversational AI",
        author_name: "Lisa Park",
        author_avatar: "https://randomuser.me/api/portraits/women/28.jpg",
        date: "2024-02-15",
        read_time: 11,
        slug: "rise-of-conversational-ai"
      }
    ];

    for (const post of blogPosts) {
      await pool.execute(
        `INSERT INTO blog_posts (title, excerpt, content, image_url, category, author_name, author_avatar, date, read_time, slug) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title=VALUES(title), excerpt=VALUES(excerpt)`,
        [post.title, post.excerpt, post.content, post.image_url, post.category, post.author_name, post.author_avatar, post.date, post.read_time, post.slug]
      );
    }
    console.log('✅ Blog posts seeded');

    // Seed Testimonials
    const testimonials = [
      {
        name: "Peter Devaney",
        company: "Proclaim Inc",
        text: "Their Meta Ads automation system significantly enhanced our campaign performance. Deep understanding of AI and practical execution stood out.",
        avatar_url: null
      },
      {
        name: "Aden Lee",
        company: "oryany",
        text: "Conbyt's chatbot solution increased our sales dramatically. They are the best developers I have worked with.",
        avatar_url: null
      },
      {
        name: "Babacar NDIAYE",
        company: "Performance Consulting Group",
        text: "Working with Conbyt was seamless. They fixed key issues in our AI system and enhanced its performance significantly.",
        avatar_url: null
      },
      {
        name: "Harold Otto",
        company: "FinTech Startup",
        text: "They delivered our MVP in record time. Their expertise in AI and ML is unmatched!",
        avatar_url: null
      }
    ];

    for (const testimonial of testimonials) {
      await pool.execute(
        `INSERT INTO testimonials (name, company, text, avatar_url) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE text=VALUES(text)`,
        [testimonial.name, testimonial.company, testimonial.text, testimonial.avatar_url]
      );
    }
    console.log('✅ Testimonials seeded');

    // Seed Services
    const services = [
      {
        name: "AI Automations",
        description: "We help businesses automate time-consuming, human-like tasks such as customer support, document handling, and data analysis, allowing your team to focus on high-impact work. Replace manual operations with intelligent systems that work around the clock.",
        icon_name: "FaBolt",
        color: "accent",
        border_class: "ring-accent/80 shadow-accent/40",
        glow_class: "shadow-[0_0_48px_0_#00ffc6aa]",
        display_order: 1
      },
      {
        name: "Generative Intelligence",
        description: "We build solutions that generate content, insights, and communication, just like a human would. Ideal for teams looking to scale customer engagement, streamline communication, or power content-heavy operations. Unlock efficiency with smart, generative systems.",
        icon_name: "FaRobot",
        color: "accent3",
        border_class: "ring-accent3/80 shadow-accent3/40",
        glow_class: "shadow-[0_0_48px_0_#d4ff37aa]",
        display_order: 2
      },
      {
        name: "Conversational AI",
        description: "We build AI systems that can understand and respond through voice and text, including chatbots, voice agents, and virtual assistants. Whether it's customer support, lead qualification, or internal automation, our solutions help businesses communicate at scale with human-like intelligence.",
        icon_name: "FaCogs",
        color: "accent2",
        border_class: "ring-accent2/80 shadow-accent2/40",
        glow_class: "shadow-[0_0_48px_0_#7c3aedaa]",
        display_order: 3
      },
      {
        name: "AI Product Development",
        description: "We bring your AI product idea to life, from concept to launch. Whether you're solving a specific business problem or creating something entirely new, we help you design and build software that delivers clear, measurable results. End-to-end development for automation-first digital products.",
        icon_name: "FaBullhorn",
        color: "accent",
        border_class: "ring-accent/80 shadow-accent/40",
        glow_class: "shadow-[0_0_48px_0_#00ffc6aa]",
        display_order: 4
      },
      {
        name: "MVPs",
        description: "We help founders and businesses rapidly turn concepts into working MVPs that prove value, attract funding, or onboard early customers. Fast, focused execution for bold, AI-first visions.",
        icon_name: "FaBullhorn",
        color: "accent2",
        border_class: "ring-accent2/80 shadow-accent2/40",
        glow_class: "shadow-[0_0_48px_0_#7c3aedaa]",
        display_order: 5
      }
    ];

    for (const service of services) {
      await pool.execute(
        `INSERT INTO services (name, description, icon_name, color, border_class, glow_class, display_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name=VALUES(name), description=VALUES(description)`,
        [service.name, service.description, service.icon_name, service.color, service.border_class, service.glow_class, service.display_order]
      );
    }
    console.log('✅ Services seeded');

    // Seed Stats
    const stats = [
      {
        icon_name: "FaCalendarAlt",
        value: 5,
        label: "Years",
        display_order: 1
      },
      {
        icon_name: "FaRocket",
        value: 100,
        label: "Projects",
        display_order: 2
      },
      {
        icon_name: "FaSmile",
        value: 10,
        label: "Happy clients",
        display_order: 3
      },
      {
        icon_name: "FaGlobeAmericas",
        value: 3,
        label: "Continents",
        display_order: 4
      }
    ];

    for (const stat of stats) {
      await pool.execute(
        `INSERT INTO stats (icon_name, value, label, display_order) 
         VALUES (?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE value=VALUES(value), label=VALUES(label)`,
        [stat.icon_name, stat.value, stat.label, stat.display_order]
      );
    }
    console.log('✅ Stats seeded');

    console.log('🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

