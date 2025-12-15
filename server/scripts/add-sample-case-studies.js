#!/usr/bin/env node

/**
 * Add sample case studies to test automatic sitemap indexing
 */

import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleCaseStudies = [
  {
    title: "AI Customer Support Chatbot",
    description: "Intelligent chatbot that reduced customer service response time by 80% and improved satisfaction scores by 45%.",
    image_url: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop",
    tech_stack: JSON.stringify(["React", "Python", "NLP", "OpenAI", "PostgreSQL"]),
    category: "AI Automation",
    slug: "ai-customer-support-chatbot",
    content: `
      <h2>Project Overview</h2>
      <p>We developed an intelligent customer support chatbot for a major e-commerce platform that handles 10,000+ customer inquiries daily.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Natural language understanding with 95% accuracy</li>
        <li>Multi-language support (English, Spanish, French)</li>
        <li>Integration with existing CRM systems</li>
        <li>Real-time sentiment analysis</li>
        <li>Seamless handoff to human agents when needed</li>
      </ul>
      
      <h3>Results</h3>
      <ul>
        <li><strong>80% reduction</strong> in average response time</li>
        <li><strong>45% improvement</strong> in customer satisfaction</li>
        <li><strong>60% cost savings</strong> on support operations</li>
        <li><strong>24/7 availability</strong> with consistent quality</li>
      </ul>
      
      <h3>Technologies Used</h3>
      <p>Built with React for the admin dashboard, Python backend with FastAPI, OpenAI GPT for natural language processing, and PostgreSQL for data storage.</p>
    `
  },
  {
    title: "Smart Inventory Management System",
    description: "AI-powered inventory optimization that reduced stockouts by 70% and cut inventory costs by 25% using predictive analytics.",
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    tech_stack: JSON.stringify(["Python", "Machine Learning", "TensorFlow", "React", "MongoDB"]),
    category: "Machine Learning",
    slug: "smart-inventory-management-system",
    content: `
      <h2>Challenge</h2>
      <p>A retail chain with 200+ stores was struggling with inventory management, leading to frequent stockouts and overstock situations.</p>
      
      <h2>Solution</h2>
      <p>We developed a machine learning system that predicts demand patterns and optimizes inventory levels across all locations.</p>
      
      <h3>Key Features</h3>
      <ul>
        <li>Demand forecasting with seasonal adjustments</li>
        <li>Automated reorder point calculations</li>
        <li>Multi-location inventory optimization</li>
        <li>Real-time alerts and notifications</li>
        <li>Integration with existing POS systems</li>
      </ul>
      
      <h3>Impact</h3>
      <ul>
        <li><strong>70% reduction</strong> in stockout incidents</li>
        <li><strong>25% decrease</strong> in inventory holding costs</li>
        <li><strong>15% increase</strong> in sales due to better availability</li>
        <li><strong>90% accuracy</strong> in demand predictions</li>
      </ul>
    `
  },
  {
    title: "Computer Vision Quality Control",
    description: "Automated quality inspection system using computer vision that achieved 99.5% accuracy and reduced inspection time by 85%.",
    image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop",
    tech_stack: JSON.stringify(["Python", "OpenCV", "TensorFlow", "Computer Vision", "IoT"]),
    category: "Computer Vision",
    slug: "computer-vision-quality-control",
    content: `
      <h2>Project Background</h2>
      <p>A manufacturing company needed to automate their quality control process to improve accuracy and reduce inspection time.</p>
      
      <h2>Technical Implementation</h2>
      <p>We implemented a computer vision system using deep learning models trained on thousands of product images.</p>
      
      <h3>System Components</h3>
      <ul>
        <li>High-resolution camera setup with proper lighting</li>
        <li>Custom CNN model for defect detection</li>
        <li>Real-time image processing pipeline</li>
        <li>Integration with production line systems</li>
        <li>Quality metrics dashboard and reporting</li>
      </ul>
      
      <h3>Results Achieved</h3>
      <ul>
        <li><strong>99.5% accuracy</strong> in defect detection</li>
        <li><strong>85% reduction</strong> in inspection time</li>
        <li><strong>40% decrease</strong> in false positives</li>
        <li><strong>24/7 operation</strong> without human fatigue</li>
      </ul>
    `
  },
  {
    title: "Predictive Analytics Dashboard",
    description: "Business intelligence platform with predictive analytics that helped increase revenue by 30% through data-driven insights.",
    image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    tech_stack: JSON.stringify(["React", "D3.js", "Python", "Pandas", "AWS", "PostgreSQL"]),
    category: "Data Analytics",
    slug: "predictive-analytics-dashboard",
    content: `
      <h2>Business Challenge</h2>
      <p>A growing SaaS company needed better insights into customer behavior and revenue patterns to make informed business decisions.</p>
      
      <h2>Our Approach</h2>
      <p>We built a comprehensive analytics platform that combines historical data analysis with predictive modeling.</p>
      
      <h3>Dashboard Features</h3>
      <ul>
        <li>Real-time KPI monitoring and alerts</li>
        <li>Customer churn prediction models</li>
        <li>Revenue forecasting with confidence intervals</li>
        <li>Interactive data visualization with drill-down capabilities</li>
        <li>Automated report generation and distribution</li>
      </ul>
      
      <h3>Business Impact</h3>
      <ul>
        <li><strong>30% increase</strong> in revenue through better targeting</li>
        <li><strong>25% reduction</strong> in customer churn</li>
        <li><strong>50% faster</strong> decision-making process</li>
        <li><strong>ROI of 400%</strong> within the first year</li>
      </ul>
    `
  }
];

async function addSampleCaseStudies() {
  try {
    console.log('🚀 Adding sample case studies to database...\n');

    for (const study of sampleCaseStudies) {
      try {
        const [result] = await pool.execute(
          `INSERT INTO case_studies (title, description, image_url, tech_stack, category, slug, content) 
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           title=VALUES(title), 
           description=VALUES(description),
           image_url=VALUES(image_url),
           tech_stack=VALUES(tech_stack),
           category=VALUES(category),
           content=VALUES(content)`,
          [study.title, study.description, study.image_url, study.tech_stack, study.category, study.slug, study.content]
        );
        
        console.log(`✅ Added: ${study.title}`);
        console.log(`   URL: https://conbyt.com/case-study/${study.slug}`);
        console.log(`   Category: ${study.category}`);
        console.log('');
      } catch (error) {
        console.error(`❌ Error adding ${study.title}:`, error.message);
      }
    }

    // Verify what was added
    const [rows] = await pool.execute('SELECT id, title, slug, category FROM case_studies ORDER BY created_at DESC');
    
    console.log(`🎯 Total case studies in database: ${rows.length}`);
    console.log('\nAll case studies:');
    rows.forEach((study, index) => {
      console.log(`${index + 1}. ${study.title} (${study.slug}) - ${study.category}`);
    });

    console.log('\n✅ Sample case studies added successfully!');
    console.log('🌐 These will now automatically appear in your sitemap at /sitemap.xml');
    console.log('📱 Visit /case-studies to see them on your website');

  } catch (error) {
    console.error('❌ Error adding sample case studies:', error.message);
  } finally {
    await pool.end();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  addSampleCaseStudies();
}

export default addSampleCaseStudies;
