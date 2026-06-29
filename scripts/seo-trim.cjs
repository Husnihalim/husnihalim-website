// seo-trim.cjs – trims long <title> and <meta name="description"> tags (CommonJS)
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..'); // project root (husnihalim-website)

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      processFile(full);
    }
  }
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const sub = text.slice(0, max);
  const lastSpace = sub.lastIndexOf(' ');
  const cut = lastSpace > 0 ? sub.slice(0, lastSpace) : sub;
  return cut.trim() + '…';
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const title = titleMatch[1].trim();
    const newTitle = truncate(title, 60);
    if (newTitle !== title) {
      content = content.replace(titleMatch[0], `<title>${newTitle}</title>`);
    }
  }

  // Meta description
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*>/i);
  if (descMatch) {
    const desc = descMatch[1].trim();
    const newDesc = truncate(desc, 160);
    if (newDesc !== desc) {
      const newTag = `<meta name="description" content="${newDesc}">`;
      content = content.replace(descMatch[0], newTag);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

walk(ROOT);
console.log('SEO trimming completed.');
