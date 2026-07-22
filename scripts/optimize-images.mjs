import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceExtensions = new Set(['.html', '.css', '.js']);
const ignoredDirectories = new Set(['.git', 'dist', 'node_modules']);
const rasterReference = /\/images\/[^\s"'`()]+?\.(?:png|jpe?g)/gi;

async function collectSourceFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirectories.has(entry.name)) continue;
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(absolutePath));
    } else if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

const sourceFiles = await collectSourceFiles(projectRoot);
const references = new Map();

for (const sourceFile of sourceFiles) {
  const contents = await fs.readFile(sourceFile, 'utf8');
  for (const match of contents.matchAll(rasterReference)) {
    const publicPath = match[0];
    const imagePath = path.join(projectRoot, publicPath.slice(1));
    if (!references.has(imagePath)) references.set(imagePath, publicPath);
  }
}

const replacements = new Map();
let originalBytes = 0;
let optimizedBytes = 0;
let skipped = 0;
let failed = 0;

for (const [imagePath, publicPath] of references) {
  let sourceStat;
  try {
    sourceStat = await fs.stat(imagePath);
  } catch {
    console.warn(`Missing source image: ${publicPath}`);
    continue;
  }

  const webpPath = imagePath.replace(/\.(?:png|jpe?g)$/i, '.webp');
  const extension = path.extname(imagePath).toLowerCase();
  const options = extension === '.png'
    ? { quality: 88, nearLossless: true, effort: 4, smartSubsample: true }
    : { quality: 82, effort: 4, smartSubsample: true };

  try {
    await sharp(imagePath, { limitInputPixels: 268402689 })
      .rotate()
      .webp(options)
      .toFile(webpPath);
  } catch (error) {
    failed += 1;
    console.warn(`Skipped ${publicPath}: ${error.message}`);
    continue;
  }
  const webpStat = await fs.stat(webpPath);

  if (webpStat.size >= sourceStat.size * 0.95) {
    await fs.unlink(webpPath);
    skipped += 1;
    continue;
  }

  originalBytes += sourceStat.size;
  optimizedBytes += webpStat.size;
  replacements.set(publicPath, publicPath.replace(/\.(?:png|jpe?g)$/i, '.webp'));
}

for (const sourceFile of sourceFiles) {
  const original = await fs.readFile(sourceFile, 'utf8');
  let updated = original;

  for (const [before, after] of replacements) {
    updated = updated.replaceAll(before, after);
  }

  if (updated !== original) await fs.writeFile(sourceFile, updated);
}

const savedBytes = originalBytes - optimizedBytes;
const percent = originalBytes ? ((savedBytes / originalBytes) * 100).toFixed(1) : '0.0';
const mb = (bytes) => (bytes / 1024 / 1024).toFixed(2);

console.log(`Converted ${replacements.size} referenced images; skipped ${skipped} without meaningful savings and ${failed} conversion failures.`);
console.log(`Referenced image weight: ${mb(originalBytes)} MB -> ${mb(optimizedBytes)} MB (${percent}% smaller).`);
