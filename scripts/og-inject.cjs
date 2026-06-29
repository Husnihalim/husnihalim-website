// og-inject.cjs – ensures each HTML file has a complete set of Open Graph tags
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..'); // project root
const DEFAULT_IMAGE = 'https://husnihalim.com/assets/og-image.png?v=20260427';

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // skip pages we already handled (admin and thank-you) – they have custom tags
      if (full.includes('/admin/') || full.includes('/thank-you/')) continue;
      processFile(full);
    }
  }
}

function ensureTag(content, tag, insertion) {
  const regex = new RegExp(`<meta\\s+property=["']${tag}["']`, 'i');
  if (regex.test(content)) return content; // tag already present
  // insert just after the first <meta name="description" ...> if it exists, otherwise after <title>
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*>/i);
  if (descMatch) {
    const idx = descMatch.index + descMatch[0].length;
    return content.slice(0, idx) + '\n' + insertion + content.slice(idx);
  }
  const titleMatch = content.match(/<title>[^<]*<\/title>/i);
  if (titleMatch) {
    const idx = titleMatch.index + titleMatch[0].length;
    return content.slice(0, idx) + '\n' + insertion + content.slice(idx);
  }
  // fallback: prepend to <head>
  return content.replace(/<head>/i, `<head>\n${insertion}`);
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  // og:type (default website)
  content = ensureTag(content, 'og:type', '<meta property="og:type" content="website">');
  // og:url – derived from path
  const relPath = path.relative(ROOT, filePath).replace(/\\/g, '/');
  const url = `https://husnihalim.com/${relPath.replace(/index\.html$/, '')}`;
  content = ensureTag(content, 'og:url', `<meta property="og:url" content="${url}">`);
  // og:title – use the <title> text if available
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    const titleText = titleMatch[1].trim();
    content = ensureTag(content, 'og:title', `<meta property="og:title" content="${titleText}">`);
  }
  // og:description – use meta description (truncated to 160)
  const descMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']\s*>/i);
  if (descMatch) {
    const desc = descMatch[1].trim();
    const truncated = desc.length > 160 ? desc.slice(0, 157) + '...' : desc;
    content = ensureTag(content, 'og:description', `<meta property="og:description" content="${truncated}">`);
  }
  // og:image – default if missing
  content = ensureTag(content, 'og:image', `<meta property="og:image" content="${DEFAULT_IMAGE}">`);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`OG tags added/updated: ${filePath}`);
  }
}

walk(ROOT);
console.log('OG injection completed.');
