import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();

function compileStaticLandingPage() {
  const gasDir = path.join(__dirname, 'google-apps-script');
  const outDir = path.join(__dirname, 'dist');

  console.log('Starting compilation for GitHub Pages...');

  // Ensure output directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log(`Created directory: ${outDir}`);
  }

  // Read modular files
  const indexContent = fs.readFileSync(path.join(gasDir, 'index.html'), 'utf8');
  const includeContent = fs.readFileSync(path.join(gasDir, 'include.html'), 'utf8');
  const cssContent = fs.readFileSync(path.join(gasDir, 'css.html'), 'utf8');
  const jsContent = fs.readFileSync(path.join(gasDir, 'javascript.html'), 'utf8');

  // Replace Google Apps Script scriptlet template tags
  let bundled = indexContent;
  
  // 1. Replace include
  bundled = bundled.replace(/<\?\!=\s*include\(['"]include['"]\);\s*\?>/g, includeContent);
  
  // 2. Replace css
  bundled = bundled.replace(/<\?\!=\s*include\(['"]css['"]\);\s*\?>/g, cssContent);
  
  // 3. Replace javascript
  bundled = bundled.replace(/<\?\!=\s*include\(['"]javascript['"]\);\s*\?>/g, jsContent);

  // Write compiled single-file index.html
  const destFile = path.join(outDir, 'index.html');
  fs.writeFileSync(destFile, bundled, 'utf8');
  console.log(`Successfully compiled self-contained landing page to: ${destFile}`);
}

compileStaticLandingPage();
