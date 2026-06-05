const fs = require('fs');
const path = require('path');

const key = process.env.POSTHOG_KEY;
if (!key) {
  console.error('ERROR: POSTHOG_KEY environment variable is not set.');
  console.error('Set it in Vercel Dashboard: Project Settings > Environment Variables');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public');

fs.mkdirSync(outDir, { recursive: true });

fs.cpSync(path.join(root, 'img'), path.join(outDir, 'img'), { recursive: true, force: true });

const files = [
  'index.html',
  'products.html',
  'orders.html',
  'stats.html',
  'search-results.html',
];

for (const file of files) {
  const srcPath = path.join(root, file);
  const outPath = path.join(outDir, file);
  let content = fs.readFileSync(srcPath, 'utf-8');
  const replaced = content.replace(/__POSTHOG_KEY__/g, key);

  if (content === replaced) {
    console.warn(`WARNING: No placeholder found in ${file}`);
  }

  fs.writeFileSync(outPath, replaced);
  console.log(`OK: ${file}`);
}

console.log('Done. PostHog key injected into public/');
