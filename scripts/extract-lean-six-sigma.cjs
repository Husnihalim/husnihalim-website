const fs = require('fs');
const path = require('path');

const html = fs.readFileSync('./blog/lean-six-sigma-malaysia/index.html', 'utf8');

const title = html.match(/<meta property="og:title"[^>]+content="([^"]+)"/)?.[1] || 'Lean Six Sigma Malaysia';
const description = html.match(/<meta property="og:description"[^>]+content="([^"]+)"/)?.[1] || '';
const image = (html.match(/<meta property="og:image"[^>]+content="([^"]+)"/) || [])[1] || '';
const pubDate = html.match(/"datePublished":"([^"]+)"/)?.[1] || '2025-01-20';
const category = 'Lean Manufacturing';

const tags = ['Lean Six Sigma', 'DMAIC', 'Continuous Improvement', 'Waste Reduction', 'Malaysia'];

const readTime = '9 min read';

// Extract body from article with class
const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/);
let body = '';
if (articleMatch) {
  body = articleMatch[1]
    .replace(/<a class="back-btn"[^<]*<\/a>/, '')
    .replace(/<div class="tags">[\s\S]*?<\/div>/, '')
    .replace(/<p class="post-subtitle">[^<]*<\/p>/, '')
    .replace(/<div class="author-bio">[\s\S]*?<\/div>/, '')
    .replace(/<div class="hh-share[^>]*>[\s\S]*?<\/div>/s, '')
    .replace(/<div class="(quick|faq-container)">[\s\S]*?<\/div>/s, '')
    .replace(/<h2>Frequently Asked Questions<\/h2>[\s\S]*/s, '')
    .replace(/<div class="cta-strip">[\s\S]*?<\/div>/s, '')
    .trim();
}

const frontmatter = [
  '---',
  `title: "${title.replace(/"/g, '\\"')}"`,
  `description: "${description.replace(/"/g, '\\"')}"`,
  `pubDate: ${pubDate}`,
  `category: "${category}"`,
  `readTime: "${readTime}"`,
  `image: "${image}"`,
  'tags:',
  ...tags.map(t => `  - "${t}"`),
  '---',
  '',
  body
].join('\n');

fs.writeFileSync('./src/content/blog/lean-six-sigma-malaysia.md', frontmatter, 'utf8');
console.log('Created lean-six-sigma-malaysia.md');
