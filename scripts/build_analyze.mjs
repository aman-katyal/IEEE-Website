import * as fs from 'fs';
import * as path from 'path';
import * as zlib from 'zlib';

const distDir = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

function getFiles(dir) {
  const subdirs = fs.readdirSync(dir);
  const files = subdirs.map((subdir) => {
    const res = path.resolve(dir, subdir);
    return fs.statSync(res).isDirectory() ? getFiles(res) : res;
  });
  return files.reduce((a, f) => a.concat(f), []);
}

const allFiles = getFiles(distDir);
const assetFiles = allFiles.filter((f) => /\.(js|css|html|json)$/.test(f));

console.log('\n================== Production Bundle Analysis ==================');
console.log(
  'File'.padEnd(50) +
    'Size (KB)'.padStart(12) +
    'Gzip (KB)'.padStart(12)
);
console.log('-'.repeat(74));

let totalRaw = 0;
let totalGzip = 0;

for (const file of assetFiles) {
  const relative = path.relative(distDir, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file);
  const rawSize = content.length / 1024;
  const gzipSize = zlib.gzipSync(content).length / 1024;

  totalRaw += rawSize;
  totalGzip += gzipSize;

  console.log(
    relative.padEnd(50) +
      rawSize.toFixed(2).padStart(12) +
      gzipSize.toFixed(2).padStart(12)
  );
}

console.log('='.repeat(74));
console.log(
  'TOTAL ASSETS'.padEnd(50) +
    totalRaw.toFixed(2).padStart(12) +
    totalGzip.toFixed(2).padStart(12)
);
console.log('================================================================\n');
