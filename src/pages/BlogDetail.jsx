import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaCalendar, FaUser, FaClock, FaTag, FaShare, FaFacebook, FaTwitter, FaLinkedin, FaImage } from "react-icons/fa";
import { fetchBlogBySlug } from "../utils/api";

import blog1 from "../assets/blogs/blog1.webp";
import blog2 from "../assets/blogs/blog2.webp";
import blog3 from "../assets/blogs/blog3.webp";
import blog4 from "../assets/blogs/blog4.webp";
import blog5 from "../assets/blogs/blog5.webp";
import blog6 from "../assets/blogs/blog6.webp";

const blogData = {
  "future-of-ai-business-2024": {
    title: "The Future of AI in Business: 2024 Trends and Predictions",
    subtitle: "Exploring the transformative impact of artificial intelligence on modern business operations",
    heroImage: blog1,
    category: "AI Trends",
    author: "Sarah Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    authorBio: "AI Research Lead with 8+ years of experience in machine learning and business intelligence",
    date: "March 15, 2024",
    readTime: "8 min read",
    tags: ["AI Trends", "Business", "Technology", "Innovation"],
    
    introduction: {
      content: "As we move through 2024, artificial intelligence continues to reshape the business landscape at an unprecedented pace. From automated customer service to predictive analytics, AI is becoming an integral part of every industry. This comprehensive guide explores the key trends and predictions that will define the future of AI in business.",
      keyPoints: [
        "AI adoption rates are accelerating across all industries",
        "Machine learning is becoming more accessible to businesses",
        "Ethical AI and responsible development are gaining importance",
        "AI-powered automation is transforming traditional workflows"
      ]
    },
    
    content: {
      sections: [
        {
          title: "The Rise of Generative AI in Business Applications",
          content: "Generative AI has emerged as one of the most transformative technologies of 2024. Businesses are leveraging these tools for content creation, product design, and customer interaction. The ability to generate human-like text, images, and even code is revolutionizing how companies approach creativity and productivity.",
          subsections: [
            {
              title: "Content Creation and Marketing",
              content: "AI-powered content creation tools are helping businesses produce high-quality marketing materials, social media posts, and product descriptions at scale. These tools not only save time but also maintain brand consistency across all channels."
            },
            {
              title: "Product Design and Development",
              content: "Generative AI is accelerating product development cycles by enabling rapid prototyping and design iteration. Companies can now explore thousands of design variations in minutes, leading to more innovative and user-centric products."
            }
          ]
        },
        {
          title: "AI-Powered Customer Experience",
          content: "Customer experience is being revolutionized by AI technologies that provide personalized, 24/7 support. From intelligent chatbots to predictive customer behavior analysis, AI is creating more engaging and efficient customer interactions.",
          subsections: [
            {
              title: "Intelligent Chatbots and Virtual Assistants",
              content: "Modern chatbots are capable of handling complex customer queries, providing instant responses, and learning from each interaction to improve future conversations. This leads to higher customer satisfaction and reduced support costs."
            },
            {
              title: "Predictive Customer Analytics",
              content: "AI algorithms can now predict customer behavior, preferences, and potential issues before they arise. This proactive approach allows businesses to anticipate customer needs and provide better service."
            }
          ]
        },
        {
          title: "Automation and Process Optimization",
          content: "AI-driven automation is streamlining business processes across all departments. From HR to finance, companies are using AI to eliminate repetitive tasks and focus human resources on strategic initiatives.",
          subsections: [
            {
              title: "Workflow Automation",
              content: "Intelligent automation systems can handle complex workflows, decision-making processes, and data analysis tasks that previously required significant human intervention."
            },
            {
              title: "Predictive Maintenance",
              content: "AI-powered predictive maintenance systems are helping manufacturing and service industries reduce downtime and optimize operational efficiency."
            }
          ]
        }
      ]
    },
    
    conclusion: {
      title: "Looking Ahead: The AI-Driven Business Landscape",
      content: "As we look toward the future, it's clear that AI will continue to be a driving force in business transformation. Companies that embrace these technologies while maintaining a focus on ethical implementation will be best positioned for success. The key is to start small, learn quickly, and scale thoughtfully."
    },
    
    relatedPosts: [
      {
        title: "Machine Learning vs Deep Learning: Understanding the Differences",
        excerpt: "A comprehensive guide to understanding the key differences between machine learning and deep learning approaches.",
        image: "https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg",
        slug: "machine-learning-vs-deep-learning"
      },
      {
        title: "Building Scalable AI Solutions: Best Practices for Enterprise",
        excerpt: "Learn the essential strategies and best practices for developing scalable AI solutions in enterprise environments.",
        image: "https://images.pexels.com/photos/5686023/pexels-photo-5686023.jpeg",
        slug: "building-scalable-ai-solutions"
      }
    ]
  },
  
  "machine-learning-vs-deep-learning": {
    title: "Machine Learning vs Deep Learning: Understanding the Differences",
    subtitle: "A comprehensive guide to understanding the key differences between machine learning and deep learning approaches",
    heroImage: blog2,
    category: "Machine Learning",
    author: "Michael Chen",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    authorBio: "Senior ML Engineer specializing in neural networks and deep learning architectures",
    date: "March 10, 2024",
    readTime: "12 min read",
    tags: ["Machine Learning", "Deep Learning", "AI", "Neural Networks"],
    
    introduction: {
      content: "Machine learning and deep learning are often used interchangeably, but they represent distinct approaches to artificial intelligence. Understanding these differences is crucial for choosing the right approach for your AI projects and understanding the current state of AI technology.",
      keyPoints: [
        "Machine learning is a broader field that includes deep learning",
        "Deep learning uses neural networks with multiple layers",
        "Each approach has specific use cases and advantages",
        "Understanding the differences helps in technology selection"
      ]
    },
    
    content: {
      sections: [
        {
          title: "What is Machine Learning?",
          content: "Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn for themselves.",
          subsections: [
            {
              title: "Traditional Machine Learning Approaches",
              content: "Traditional ML includes algorithms like linear regression, decision trees, support vector machines, and clustering methods. These approaches work well with structured data and smaller datasets."
            },
            {
              title: "Feature Engineering in ML",
              content: "Feature engineering is crucial in traditional ML, where domain experts manually select and create features that are relevant to the problem at hand."
            }
          ]
        },
        {
          title: "What is Deep Learning?",
          content: "Deep learning is a subset of machine learning that uses artificial neural networks with multiple layers to model and understand complex patterns in data. It's particularly effective for unstructured data like images, text, and audio.",
          subsections: [
            {
              title: "Neural Network Architecture",
              content: "Deep learning uses neural networks with multiple hidden layers, allowing the system to automatically learn hierarchical representations of data."
            },
            {
              title: "Automatic Feature Learning",
              content: "One of the key advantages of deep learning is its ability to automatically learn features from raw data, reducing the need for manual feature engineering."
            }
          ]
        },
        {
          title: "Key Differences and Use Cases",
          content: "Understanding when to use machine learning versus deep learning depends on your data, computational resources, and specific requirements. Each approach has its strengths and ideal applications.",
          subsections: [
            {
              title: "Data Requirements",
              content: "Deep learning typically requires large amounts of data to perform well, while traditional ML can work with smaller datasets and may generalize better with limited data."
            },
            {
              title: "Computational Resources",
              content: "Deep learning models require significant computational power and often benefit from GPU acceleration, while traditional ML can run efficiently on standard hardware."
            }
          ]
        }
      ]
    },
    
    conclusion: {
      title: "Choosing the Right Approach",
      content: "The choice between machine learning and deep learning depends on your specific use case, available data, and computational resources. Traditional ML is often more interpretable and requires less data, while deep learning excels at complex pattern recognition tasks with large datasets."
    },
    
    relatedPosts: [
      {
        title: "The Future of AI in Business: 2024 Trends and Predictions",
        excerpt: "Exploring the transformative impact of artificial intelligence on modern business operations.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        slug: "future-of-ai-business-2024"
      },
      {
        title: "Building Scalable AI Solutions: Best Practices for Enterprise",
        excerpt: "Learn the essential strategies and best practices for developing scalable AI solutions in enterprise environments.",
        image: "https://images.pexels.com/photos/5686023/pexels-photo-5686023.jpeg",
        slug: "building-scalable-ai-solutions"
      }
    ]
  },
  
  "nlp-customer-service": {
    title: "NLP in Customer Service: Revolutionizing Support with AI",
    subtitle: "How natural language processing is transforming customer service and support operations",
    heroImage: "https://images.pexels.com/photos/5686023/pexels-photo-5686023.jpeg",
    category: "NLP",
    author: "Sarah Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=150&q=80",
    authorBio: "AI Research Lead with 8+ years of experience in machine learning and business intelligence",
    date: "March 5, 2024",
    readTime: "10 min read",
    tags: ["NLP", "Customer Service", "AI", "Automation"],
    
    introduction: {
      content: "Natural Language Processing (NLP) is revolutionizing customer service by enabling more intelligent, responsive, and personalized support experiences. From chatbots to sentiment analysis, NLP technologies are transforming how businesses interact with their customers.",
      keyPoints: [
        "NLP enables more natural customer interactions",
        "Sentiment analysis helps understand customer emotions",
        "Automated support reduces response times",
        "Personalization improves customer satisfaction"
      ]
    },
    
    content: {
      sections: [
        {
          title: "Intelligent Chatbots and Virtual Assistants",
          content: "Modern NLP-powered chatbots can understand context, handle complex queries, and provide human-like responses. These systems are becoming increasingly sophisticated in understanding customer intent and providing relevant solutions.",
          subsections: [
            {
              title: "Context Understanding",
              content: "Advanced NLP models can maintain conversation context, allowing for more natural and coherent interactions that feel more human-like."
            },
            {
              title: "Intent Recognition",
              content: "NLP systems can accurately identify customer intent, even when expressed in different ways, leading to more accurate responses and solutions."
            }
          ]
        },
        {
          title: "Sentiment Analysis for Customer Insights",
          content: "NLP enables businesses to analyze customer sentiment in real-time, providing valuable insights into customer satisfaction and identifying potential issues before they escalate.",
          subsections: [
            {
              title: "Real-time Monitoring",
              content: "Sentiment analysis can monitor customer interactions across multiple channels, providing immediate feedback on customer satisfaction levels."
            },
            {
              title: "Proactive Issue Resolution",
              content: "By identifying negative sentiment early, businesses can proactively address issues and prevent customer churn."
            }
          ]
        },
        {
          title: "Personalized Customer Experiences",
          content: "NLP technologies enable highly personalized customer experiences by understanding individual preferences, history, and communication patterns.",
          subsections: [
            {
              title: "Customer Profiling",
              content: "NLP can analyze customer interactions to build detailed profiles that inform personalized service approaches."
            },
            {
              title: "Adaptive Communication",
              content: "Systems can adapt their communication style and approach based on individual customer preferences and history."
            }
          ]
        }
      ]
    },
    
    conclusion: {
      title: "The Future of Customer Service",
      content: "NLP is fundamentally changing the customer service landscape, enabling more intelligent, efficient, and personalized support experiences. As these technologies continue to evolve, we can expect even more sophisticated and human-like customer interactions."
    },
    
    relatedPosts: [
      {
        title: "The Future of AI in Business: 2024 Trends and Predictions",
        excerpt: "Exploring the transformative impact of artificial intelligence on modern business operations.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        slug: "future-of-ai-business-2024"
      },
      {
        title: "Machine Learning vs Deep Learning: Understanding the Differences",
        excerpt: "A comprehensive guide to understanding the key differences between machine learning and deep learning approaches.",
        image: "https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg",
        slug: "machine-learning-vs-deep-learning"
      }
    ]
  },
  
  "computer-vision-applications": {
    title: "Computer Vision Applications in Modern Business",
    subtitle: "Exploring practical applications of computer vision technology across various industries",
    heroImage: "https://images.pexels.com/photos/5428833/pexels-photo-5428833.jpeg",
    category: "Computer Vision",
    author: "Michael Chen",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    authorBio: "Senior ML Engineer specializing in neural networks and deep learning architectures",
    date: "February 28, 2024",
    readTime: "11 min read",
    tags: ["Computer Vision", "AI", "Automation", "Industry Applications"],
    
    introduction: {
      content: "Computer vision is transforming industries by enabling machines to interpret and understand visual information. From quality control in manufacturing to autonomous vehicles, computer vision applications are becoming increasingly prevalent in modern business.",
      keyPoints: [
        "Computer vision enables automated visual inspection",
        "Quality control processes are being revolutionized",
        "Security and surveillance systems are becoming smarter",
        "Retail and healthcare are adopting computer vision solutions"
      ]
    },
    
    content: {
      sections: [
        {
          title: "Manufacturing and Quality Control",
          content: "Computer vision is revolutionizing manufacturing processes by enabling automated quality control, defect detection, and process optimization. These systems can work 24/7 with consistent accuracy.",
          subsections: [
            {
              title: "Automated Inspection",
              content: "Computer vision systems can inspect products with higher accuracy and speed than human inspectors, identifying defects that might be missed by the human eye."
            },
            {
              title: "Process Optimization",
              content: "Real-time monitoring of manufacturing processes allows for immediate adjustments and optimization, leading to improved efficiency and reduced waste."
            }
          ]
        },
        {
          title: "Retail and Customer Experience",
          content: "In retail, computer vision is enhancing customer experiences through smart checkout systems, inventory management, and personalized shopping experiences.",
          subsections: [
            {
              title: "Smart Checkout Systems",
              content: "Computer vision enables cashier-less checkout experiences, where customers can simply walk out with their items and be automatically charged."
            },
            {
              title: "Inventory Management",
              content: "Automated inventory tracking using computer vision helps retailers maintain accurate stock levels and reduce losses."
            }
          ]
        },
        {
          title: "Healthcare and Medical Imaging",
          content: "Computer vision is making significant contributions to healthcare through medical imaging analysis, patient monitoring, and diagnostic assistance.",
          subsections: [
            {
              title: "Medical Image Analysis",
              content: "AI-powered computer vision can analyze medical images to assist in diagnosis, often detecting patterns that human radiologists might miss."
            },
            {
              title: "Patient Monitoring",
              content: "Computer vision systems can monitor patients for safety and health indicators, providing continuous care without constant human supervision."
            }
          ]
        }
      ]
    },
    
    conclusion: {
      title: "The Expanding Role of Computer Vision",
      content: "Computer vision is becoming an essential technology across multiple industries, driving automation, improving accuracy, and creating new possibilities for business innovation. As the technology continues to advance, we can expect even more sophisticated applications."
    },
    
    relatedPosts: [
      {
        title: "The Future of AI in Business: 2024 Trends and Predictions",
        excerpt: "Exploring the transformative impact of artificial intelligence on modern business operations.",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
        slug: "future-of-ai-business-2024"
      },
      {
        title: "NLP in Customer Service: Revolutionizing Support with AI",
        excerpt: "How natural language processing is transforming customer service and support operations.",
        image: "https://images.pexels.com/photos/5686023/pexels-photo-5686023.jpeg",
        slug: "nlp-customer-service"
      }
    ]
  }
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        // First try to fetch from API
        const blogData = await fetchBlogBySlug(slug);
        setBlog(blogData);
      } catch (err) {
        // If API fails, try hardcoded data as fallback
        const hardcodedData = blogData[slug];
        if (hardcodedData) {
          setBlog(hardcodedData);
        } else {
          setError('Blog post not found');
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadBlog();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-white/70">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-primary text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-white/70 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link to="/blog" className="text-accent hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to get full image URL
  const getImageUrl = (imagePath) => {
    // Return null if no image path (we'll handle this separately)
    if (!imagePath || imagePath.trim() === '') {
      return null;
    }
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // If it's a relative path starting with /uploads, return as is (will be served by server)
    if (imagePath.startsWith('/uploads/')) {
      return imagePath;
    }
    // Otherwise, assume it's a relative path and prepend /uploads
    return imagePath.startsWith('/') ? imagePath : `/uploads/${imagePath}`;
  };

  // Format blog data from API or use hardcoded structure
  const heroImageUrl = getImageUrl(blog.image_url);
  const hasImageUrl = !!blog.image_url && blog.image_url.trim() !== '';
  const authorImageUrl = blog.author_avatar ? getImageUrl(blog.author_avatar) : null;
  const hasAuthorImage = !!blog.author_avatar && blog.author_avatar.trim() !== '';
  
  // Debug logging
  if (blog.id) {
    console.log('📸 Blog Image Debug:', {
      'image_url from DB': blog.image_url,
      'processed URL': heroImageUrl,
      'hasImageUrl': hasImageUrl,
      'author_avatar from DB': blog.author_avatar,
      'authorImageUrl': authorImageUrl,
      'hasAuthorImage': hasAuthorImage
    });
  }
  
  const data = blog.id ? {
    title: blog.title,
    subtitle: blog.excerpt || '',
    heroImage: heroImageUrl,
    hasImageUrl: hasImageUrl,
    category: blog.category || 'Uncategorized',
    author: blog.author_name || 'Admin',
    authorImage: authorImageUrl,
    hasAuthorImage: hasAuthorImage,
    authorBio: blog.author_name ? `${blog.author_name} - Author` : 'Content creator and writer',
    date: blog.date ? new Date(blog.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString(),
    readTime: blog.read_time ? `${blog.read_time} min read` : '5 min read',
    tags: blog.category ? [blog.category] : [],
    introduction: {
      content: blog.excerpt || (blog.content ? blog.content.substring(0, 200) + '...' : ''),
      keyPoints: []
    },
    content: {
      sections: blog.content ? [
        {
          title: '',
          content: blog.content,
          subsections: []
        }
      ] : []
    },
    conclusion: {
      title: 'Conclusion',
      content: ''
    },
    relatedPosts: [],
    rawContent: blog.content // Store raw content for rendering
  } : blog;

  return (
    <div className="min-h-screen bg-primary text-white">
      {/* Header */}
      <div className="w-full bg-secondary pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <Link to="/blog" className="inline-flex items-center text-accent hover:text-white transition-colors mb-6">
            <FaArrowLeft className="mr-2" />
            Back to Blog
          </Link>
          <div className="max-w-4xl">
            <span className="text-accent text-sm font-semibold uppercase tracking-wider">{data.category}</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 font-sans">{data.title}</h1>
            <p className="text-xl text-white/80 mb-6">{data.subtitle}</p>
            
            {/* Author and Meta Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                {data.hasAuthorImage && data.authorImage ? (
                  <img 
                    src={data.authorImage} 
                    alt={data.author}
                    className="w-10 h-10 rounded-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load author avatar:', data.authorImage);
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center ${data.hasAuthorImage && data.authorImage ? 'hidden' : ''}`}>
                  <FaUser className="text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-white">{data.author}</p>
                  <p className="text-white/60 text-sm">{data.authorBio}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-white/60">
                <div className="flex items-center">
                  <FaCalendar className="mr-1" />
                  {data.date}
                </div>
                <div className="flex items-center">
                  <FaClock className="mr-1" />
                  {data.readTime}
                </div>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag, idx) => (
                <span key={idx} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="w-full h-64 md:h-80 bg-gradient-to-br from-secondary/30 to-surface rounded-xl overflow-hidden">
          {data.hasImageUrl && data.heroImage ? (
            <img 
              key={data.heroImage} 
              src={data.heroImage} 
              alt={data.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Failed to load uploaded blog image:', data.heroImage);
                // Hide the image and show placeholder instead
                e.target.style.display = 'none';
                const placeholder = e.target.parentElement.querySelector('.image-placeholder');
                if (placeholder) placeholder.style.display = 'flex';
              }}
              onLoad={() => {
                console.log('✅ Successfully loaded blog image:', data.heroImage);
              }}
            />
          ) : null}
          {(!data.hasImageUrl || !data.heroImage) && (
            <div className="image-placeholder w-full h-full flex items-center justify-center">
              <div className="text-center">
                <FaImage className="text-4xl text-white/30 mx-auto mb-2" />
                <p className="text-white/50 text-sm">No featured image</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Introduction */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="prose prose-invert max-w-none">
          <p className="text-white/80 text-lg leading-relaxed mb-6">{data.introduction.content}</p>
          
          <div className="bg-surface rounded-xl p-6 border border-accent/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Key Takeaways</h3>
            <ul className="space-y-2">
              {data.introduction.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span className="text-white/80">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="prose prose-invert max-w-none">
          {data.rawContent ? (
            <div 
              className="text-white/80 text-lg leading-relaxed prose prose-invert max-w-none blog-content"
              dangerouslySetInnerHTML={{ __html: data.rawContent }}
            />
          ) : (
            data.content.sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="mb-12">
                {section.title && <h2 className="text-2xl font-bold text-white mb-6">{section.title}</h2>}
                <div className="text-white/80 text-lg leading-relaxed mb-6">
                  {section.content.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  ) : (
                    <p>{section.content}</p>
                  )}
                </div>
                
                {section.subsections && section.subsections.map((subsection, subIdx) => (
                  <div key={subIdx} className="mb-6">
                    <h3 className="text-xl font-semibold text-white mb-3">{subsection.title}</h3>
                    <p className="text-white/80 leading-relaxed">{subsection.content}</p>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Conclusion */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-surface rounded-xl p-8 border border-accent/20">
          <h2 className="text-2xl font-bold text-white mb-4">{data.conclusion.title}</h2>
          <p className="text-white/80 text-lg leading-relaxed">{data.conclusion.content}</p>
        </div>
      </section>

      {/* Share Section */}
      <section className="max-w-4xl mx-auto px-6 py-8">
        <div className="border-t border-surface/60 pt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Share this article</h3>
            <div className="flex space-x-4">
              <button className="text-accent hover:text-white transition-colors">
                <FaFacebook size={20} />
              </button>
              <button className="text-accent hover:text-white transition-colors">
                <FaTwitter size={20} />
              </button>
              <button className="text-accent hover:text-white transition-colors">
                <FaLinkedin size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-white mb-8 text-center">Related Articles</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {data.relatedPosts.map((post, idx) => (
            <div key={idx} className="bg-surface rounded-xl overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-secondary/30 to-surface flex items-center justify-center">
                <span className="text-secondary/60 text-sm">Blog Image</span>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-bold text-white mb-3">{post.title}</h4>
                <p className="text-white/80 text-sm mb-4">{post.excerpt}</p>
                <Link 
                  to={`/blog/${post.slug}`}
                  className="inline-flex items-center text-accent hover:text-white transition-colors font-semibold text-sm"
                >
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Stay Updated with AI Insights</h3>
        <p className="text-white/80 mb-8">Subscribe to our newsletter for the latest AI trends, case studies, and industry insights delivered to your inbox.</p>
        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-accent/20 text-white placeholder-white/60 focus:outline-none focus:border-accent"
          />
          <button className="bg-gradient-to-r from-accent to-accent2 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
            Subscribe
          </button>
        </div>
      </section>
      
      {/* Styles for blog content links and formatting */}
      <style>{`
        .blog-content a {
          color: #7c3aed !important;
          text-decoration: underline !important;
          cursor: pointer !important;
          transition: color 0.2s;
        }
        .blog-content a:hover {
          color: #a78bfa !important;
        }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6 {
          font-weight: bold;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: white;
        }
        .blog-content h1 { font-size: 2.5em; line-height: 1.2; }
        .blog-content h2 { font-size: 2em; line-height: 1.3; }
        .blog-content h3 { font-size: 1.75em; line-height: 1.4; }
        .blog-content h4 { font-size: 1.5em; line-height: 1.4; }
        .blog-content h5 { font-size: 1.25em; line-height: 1.5; }
        .blog-content h6 { font-size: 1em; line-height: 1.5; }
        /* Text size classes from Quill */
        .blog-content .ql-size-small { font-size: 0.75em; }
        .blog-content .ql-size-large { font-size: 1.5em; }
        .blog-content .ql-size-huge { font-size: 2.5em; }
        .blog-content ul, .blog-content ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .blog-content li {
          margin: 0.5em 0;
        }
        .blog-content p {
          margin: 1em 0;
          line-height: 1.7;
        }
        .blog-content strong, .blog-content b {
          font-weight: bold;
        }
        .blog-content em, .blog-content i {
          font-style: italic;
        }
        .blog-content u {
          text-decoration: underline;
        }
        .blog-content s, .blog-content strike {
          text-decoration: line-through;
        }
        .blog-content [style*="text-align"] {
          display: block;
        }
        .blog-content [style*="text-align: center"] {
          text-align: center;
        }
        .blog-content [style*="text-align: right"] {
          text-align: right;
        }
        .blog-content [style*="text-align: justify"] {
          text-align: justify;
        }
        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1em 0;
        }
        .blog-content blockquote {
          border-left: 4px solid #7c3aed;
          padding-left: 1em;
          margin: 1em 0;
          font-style: italic;
          color: rgba(255, 255, 255, 0.7);
        }
        .blog-content code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: monospace;
        }
        .blog-content pre {
          background: rgba(255, 255, 255, 0.1);
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
        }
        .blog-content pre code {
          background: none;
          padding: 0;
        }
        /* Text colors and backgrounds from Quill */
        .blog-content [style*="color"] {
          /* Preserve inline color styles */
        }
        .blog-content [style*="background-color"] {
          padding: 0.1em 0.2em;
          border-radius: 3px;
        }
        /* Ensure proper spacing for all formatted elements */
        .blog-content * {
          max-width: 100%;
        }
      `}</style>
    </div>
  );
};

export default BlogDetail; 