const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const dist = path.resolve(__dirname, '../dist');
const files = fs.readdirSync(dist).filter(name => /sitemap\.xml$/.test(name));
let checked = 0;
const urls = new Set();
for (const name of files) {
 const xml = fs.readFileSync(path.join(dist, name), 'utf8');
 for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  assert(!urls.has(loc), `Duplicate sitemap URL: ${loc}`); urls.add(loc);
  const url = new URL(loc);
  const rel = decodeURIComponent(url.pathname).replace(/^\//, '');
  const candidates = [path.join(dist, rel), path.join(dist, rel, 'index.html'), path.join(dist, rel + '.html')];
  const file = candidates.find(f => fs.existsSync(f) && fs.statSync(f).isFile());
  assert(file, `Sitemap URL has no built page: ${loc}`);
  const html = fs.readFileSync(file, 'utf8');
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/g)].map(m=>m[0]).find(t=>/rel=["']canonical["']/.test(t));
  assert(canonicalTag, `Missing canonical: ${loc}`);
  assert.equal(canonicalTag.match(/href=["']([^"']+)/)?.[1], loc, `Canonical differs from sitemap: ${loc}`);
  assert(!/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html), `Noindex page in sitemap: ${loc}`);
  assert.equal((html.match(/<h1\b/g)||[]).length, 1, `Expected one main heading: ${loc}`);
  for(const [, json] of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) JSON.parse(json);
  checked++;
 }
}
console.log(`${checked} sitemap URLs: built pages, matching canonicals, one H1, indexability and JSON-LD checked.`);
