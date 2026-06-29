const fs = require('fs');
const path = require('path');

// Read the file and extract the articles array
const fileContent = fs.readFileSync('./generate_blog.js', 'utf8');

// Find the articles array using a function constructor (safe for migration)
const start = fileContent.indexOf('const articles = [');
const end = fileContent.indexOf('];', start) + 2;
const articlesCode = fileContent.slice(start, end);

// Evaluate to get the array
let articles;
eval(articlesCode.replace('const articles', 'articles'));

const blogDir = './src/content/blog';
if (!fs.existsSync(blogDir)) fs.mkdirSync(blogDir, { recursive: true });

articles.forEach((a, i) => {
  const dateStr = a.date;
  const monthYear = dateStr.match(/(\w+)\s+(\d{4})/);
  const monthNames = {January:'01',February:'02',March:'03',April:'04',May:'05',June:'06',July:'07',August:'08',September:'09',October:'10',November:'11',December:'12'};
  const pubDate = monthYear ? `${monthYear[2]}-${monthNames[monthYear[1]]}-01` : '2024-01-01';

  const frontmatter = [
    '---',
    `title: "${a.title.replace(/"/g, '\\"')}"`,
    `description: "${a.metaDesc.replace(/"/g, '\\"')}"`,
    `pubDate: ${pubDate}`,
    `category: "${a.category}"`,
    `readTime: "${a.readTime}"`,
    `image: "${a.image}"`,
    'tags:',
    ...a.tags.map(t => `  - "${t}"`),
    '---',
    '',
    a.body.trim()
  ].join('\n');

  const filePath = path.join(blogDir, `${a.slug}.md`);
  fs.writeFileSync(filePath, frontmatter, 'utf8');
  console.log(`Created: ${filePath}`);
});

console.log(`\nDone. ${articles.length} blog posts migrated.`);
