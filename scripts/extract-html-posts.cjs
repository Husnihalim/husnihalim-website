const fs = require('fs');
const path = require('path');

const blogDir = './blog';
const contentDir = './src/content/blog';

// Get all post directories (exclude index.html itself)
const posts = fs.readdirSync(blogDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

console.log(`Found ${posts.length} blog post directories`);

for (const slug of posts) {
  const htmlPath = path.join(blogDir, slug, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.log(`  SKIP ${slug} — no index.html`);
    continue;
  }

  // Skip if already migrated
  const mdPath = path.join(contentDir, `${slug}.md`);
  if (fs.existsSync(mdPath)) {
    console.log(`  EXISTS ${slug}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');

  // Extract metadata from meta tags and JSON-LD
  const title = (html.match(/<meta property="og:title"[^>]+content="([^"]+)"/) || [])[1]
    || (html.match(/<title>([^<]+)<\/title>/) || [])[1]
    || slug;
  const description = (html.match(/<meta property="og:description"[^>]+content="([^"]+)"/) || [])[1]
    || (html.match(/<meta name="description"[^>]+content="([^"]+)"/) || [])[1]
    || '';
  const image = (html.match(/<meta property="og:image"[^>]+content="([^"]+)"/) || [])[1] || '';
  const pubDate = (html.match(/<meta property="article:published_time"[^>]+content="([^"]+)"/) || [])[1]
    || (html.match(/"datePublished":"([^"]+)"/) || [])[1]
    || '2026-01-01';
  const isoDate = pubDate.slice(0, 10);

  // Category from article:section meta
  let category = (html.match(/<meta property="article:section"[^>]+content="([^"]+)"/) || [])[1] || 'Lean Manufacturing';

  // Tags from article:tag meta
  const tags = [...html.matchAll(/<meta property="article:tag"[^>]+content="([^"]+)"/g)].map(m => m[1]);
  if (tags.length === 0) {
    // Extract from JSON-LD keywords
    const kw = (html.match(/"keywords":"([^"]+)"/) || [])[1];
    if (kw) tags.push(...kw.split(',').map(t => t.trim()));
  }

  // Read time and date from the hero meta section
  const readTime = (html.match(/(\d+)\s*min\s*read/) || [])[1] ? `${(html.match(/(\d+)\s*min\s*read/) || [])[1]} min read` : '8 min read';
  const displayDate = (html.match(/<span>(\w+\s+\d{1,2},\s*\d{4})<\/span>/) || [])[1]
    || (html.match(/<span>(\w+\s+\d{4})<\/span>/) || [])[1]
    || 'May 2026';

  // Extract the subtitle (post-subtitle class)
  const subtitle = (html.match(/class="post-subtitle">([^<]+)</) || [])[1]
    || (html.match(/<p class="post-subtitle">([^<]+)</) || [])[1]
    || '';

  // Extract body: everything between <article>...</article> minus nav/header/footer stuff
  // Strategy: find the article tag, extract its inner content
  const articleMatch = html.match(/<article>([\s\S]*?)<\/article>/);
  let body = '';
  if (articleMatch) {
    body = articleMatch[1]
      // Remove back button
      .replace(/<a class="back-btn"[^<]*<\/a>/, '')
      // Remove tags section
      .replace(/<div class="tags">[\s\S]*?<\/div>/, '')
      // Remove subtitle
      .replace(/<p class="post-subtitle">[^<]*<\/p>/, '')
      // Remove author bio
      .replace(/<div class="author-bio">[\s\S]*?<\/div>/, '')
      // Remove share section
      .replace(/<div class="hh-share[^>]*>[\s\S]*?<\/div>/, '')
      // Remove quick answer divs
      .replace(/<div style="background:[^>]*>[\s\S]*?<\/div>/, '')
      .replace(/<div class="quick">[\s\S]*?<\/div>/, '')
      // Remove FAQ sections at the end
      .replace(/<h2>Frequently Asked Questions<\/h2>[\s\S]*/, '')
      // Remove promo CTA strips
      .replace(/<div class="cta-strip">[\s\S]*?<\/div>/, '')
      .trim();
  }

  if (!body) {
    console.log(`  WARN ${slug} — no article body found`);
    continue;
  }

  const dateForPub = isoDate;
  const monthYear = displayDate;
  const monthNames = {January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',July:'07',August:'08',September:'09',October:'10',November:'11',December:'12'};

  const frontmatter = [
    '---',
    `title: "${title.replace(/"/g, '\\"')}"`,
    `description: "${description.replace(/"/g, '\\"')}"`,
    `pubDate: ${dateForPub}`,
    `category: "${category}"`,
    `readTime: "${readTime}"`,
    `image: "${image}"`,
    'tags:',
    ...tags.map(t => `  - "${t}"`),
    '---',
    '',
    body
  ].join('\n');

  fs.writeFileSync(mdPath, frontmatter, 'utf8');
  console.log(`  CREATED ${slug}.md`);
}

console.log('\nDone!');
