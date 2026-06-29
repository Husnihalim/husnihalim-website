// schema-inject.cjs – adds WebSite & Organization JSON‑LD to every HTML file
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://husnihalim.com/",
  "name": "Husni Halim",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://husnihalim.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "url": "https://husnihalim.com/",
  "name": "Husni Halim",
  "logo": "https://husnihalim.com/assets/logo.png"
}
</script>`;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      // skip admin and thank‑you (they already have custom head)
      if (full.includes('/admin/') || full.includes('/thank-you/')) continue;
      injectSchema(full);
    }
  }
}

function injectSchema(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('type="application/ld+json"')) return; // already present
  // Insert just before </head>
  const closingHead = content.search(/<\/head>/i);
  if (closingHead === -1) return;
  const newContent = content.slice(0, closingHead) + '\n' + SCHEMA + '\n' + content.slice(closingHead);
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Schema added to ${filePath}`);
}

walk(ROOT);
console.log('Schema injection completed.');
