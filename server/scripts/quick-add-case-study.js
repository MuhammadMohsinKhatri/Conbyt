import pool from '../config/database.js';
import dotenv from 'dotenv';
dotenv.config();

const study = {
  title: 'AI Customer Support Chatbot',
  description: 'Intelligent chatbot that reduced response time by 80%',
  image_url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
  tech_stack: JSON.stringify(['React', 'Python', 'NLP']),
  category: 'AI Automation',
  slug: 'ai-customer-support-chatbot',
  content: '<h2>AI-powered customer support solution</h2><p>Reduced response time by 80%</p>'
};

try {
  const [result] = await pool.execute(
    `INSERT INTO case_studies (title, description, image_url, tech_stack, category, slug, content) 
     VALUES (?, ?, ?, ?, ?, ?, ?) 
     ON DUPLICATE KEY UPDATE title=VALUES(title)`,
    [study.title, study.description, study.image_url, study.tech_stack, study.category, study.slug, study.content]
  );
  console.log('✅ Added case study:', study.title);
  
  const [rows] = await pool.execute('SELECT COUNT(*) as count FROM case_studies');
  console.log('📊 Total case studies:', rows[0].count);
  
  await pool.end();
} catch (error) {
  console.error('❌ Error:', error.message);
  await pool.end();
}
