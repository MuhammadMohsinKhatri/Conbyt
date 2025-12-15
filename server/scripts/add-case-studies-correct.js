import pool from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

const caseStudies = [
  {
    slug: 'ai-customer-support-chatbot',
    title: 'AI Customer Support Chatbot',
    subtitle: 'Intelligent chatbot that reduced response time by 80% and improved satisfaction by 45%',
    category: 'AI Automation',
    tech: JSON.stringify(['React', 'Python', 'NLP', 'OpenAI']),
    client: 'E-commerce Platform',
    duration: '3 months',
    team: '4 developers',
    hero_image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&h=600&fit=crop',
    is_published: 1
  },
  {
    slug: 'smart-inventory-management',
    title: 'Smart Inventory Management System',
    subtitle: 'AI-powered inventory optimization that reduced stockouts by 70% and cut costs by 25%',
    category: 'Machine Learning',
    tech: JSON.stringify(['Python', 'TensorFlow', 'React', 'MongoDB']),
    client: 'Retail Chain',
    duration: '4 months',
    team: '5 developers',
    hero_image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    is_published: 1
  },
  {
    slug: 'computer-vision-quality-control',
    title: 'Computer Vision Quality Control',
    subtitle: 'Automated quality inspection system with 99.5% accuracy and 85% faster processing',
    category: 'Computer Vision',
    tech: JSON.stringify(['Python', 'OpenCV', 'TensorFlow', 'IoT']),
    client: 'Manufacturing Company',
    duration: '5 months',
    team: '6 developers',
    hero_image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=600&fit=crop',
    is_published: 1
  },
  {
    slug: 'predictive-analytics-dashboard',
    title: 'Predictive Analytics Dashboard',
    subtitle: 'Business intelligence platform that increased revenue by 30% through data insights',
    category: 'Data Analytics',
    tech: JSON.stringify(['React', 'D3.js', 'Python', 'AWS']),
    client: 'SaaS Company',
    duration: '6 months',
    team: '7 developers',
    hero_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    is_published: 1
  }
];

async function addCaseStudies() {
  try {
    console.log('🚀 Adding case studies with correct schema...\n');
    
    for (const study of caseStudies) {
      try {
        const [result] = await pool.execute(
          `INSERT INTO case_studies (slug, title, subtitle, category, tech, client, duration, team, hero_image, is_published) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
           title=VALUES(title), 
           subtitle=VALUES(subtitle),
           category=VALUES(category),
           tech=VALUES(tech),
           client=VALUES(client),
           duration=VALUES(duration),
           team=VALUES(team),
           hero_image=VALUES(hero_image),
           is_published=VALUES(is_published)`,
          [study.slug, study.title, study.subtitle, study.category, study.tech, study.client, study.duration, study.team, study.hero_image, study.is_published]
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
    const [rows] = await pool.execute('SELECT id, title, slug, category, is_published FROM case_studies ORDER BY created_at DESC');
    
    console.log(`🎯 Total case studies in database: ${rows.length}`);
    console.log('\nAll case studies:');
    rows.forEach((study, index) => {
      const status = study.is_published ? '✅ Published' : '❌ Unpublished';
      console.log(`${index + 1}. ${study.title} (${study.slug}) - ${study.category} - ${status}`);
    });

    console.log('\n✅ Case studies added successfully!');
    console.log('🌐 These will now automatically appear in your sitemap at /sitemap.xml');

  } catch (error) {
    console.error('❌ Error adding case studies:', error.message);
  } finally {
    await pool.end();
  }
}

addCaseStudies();
