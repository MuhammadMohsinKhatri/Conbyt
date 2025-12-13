const https = require('https');

/**
 * Ping Google to notify about sitemap updates
 */
const pingGoogleSitemap = async () => {
  const sitemapUrl = encodeURIComponent('https://conbyt.com/sitemap.xml');
  const pingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;
  
  return new Promise((resolve, reject) => {
    https.get(pingUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Successfully pinged Google about sitemap update');
        resolve(true);
      } else {
        console.log(`⚠️ Google ping returned status: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error pinging Google:', err.message);
      reject(err);
    });
  });
};

/**
 * Ping Bing to notify about sitemap updates
 */
const pingBingSitemap = async () => {
  const sitemapUrl = encodeURIComponent('https://conbyt.com/sitemap.xml');
  const pingUrl = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;
  
  return new Promise((resolve, reject) => {
    https.get(pingUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Successfully pinged Bing about sitemap update');
        resolve(true);
      } else {
        console.log(`⚠️ Bing ping returned status: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.error('❌ Error pinging Bing:', err.message);
      reject(err);
    });
  });
};

/**
 * Notify all search engines about sitemap updates
 */
const notifySearchEngines = async () => {
  try {
    await Promise.all([
      pingGoogleSitemap(),
      pingBingSitemap()
    ]);
    console.log('🚀 Search engines notified about sitemap update');
  } catch (error) {
    console.error('❌ Error notifying search engines:', error);
  }
};

module.exports = {
  pingGoogleSitemap,
  pingBingSitemap,
  notifySearchEngines
};
