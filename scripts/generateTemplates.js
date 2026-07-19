import fs from 'fs';
import path from 'path';

const __dirname = path.resolve();
const gasDir = path.join(__dirname, 'google-apps-script');
const targetFile = path.join(__dirname, 'src/components/gasTemplates.ts');

console.log('Generating gasTemplates.ts from Google Apps Script source files...');

// 1. Read Code.gs
let codeGs = fs.readFileSync(path.join(gasDir, 'Code.gs'), 'utf8');

// Escape backticks in Code.gs
codeGs = codeGs.replace(/`/g, '\\`').replace(/\${/g, '\\${');

// Replace the default data return bodies with templates
codeGs = codeGs.replace(
  /function getDefaultConfig\(\) \{[\s\S]*?\n\}/,
  'function getDefaultConfig() {\n  return ${JSON.stringify(config, null, 2)};\n}'
);

codeGs = codeGs.replace(
  /function getDefaultApps\(\) \{[\s\S]*?\n\}/,
  'function getDefaultApps() {\n  return ${JSON.stringify(apps, null, 2)};\n}'
);

codeGs = codeGs.replace(
  /function getDefaultSchoolData\(\) \{[\s\S]*?\n\}/,
  'function getDefaultSchoolData() {\n  return ${JSON.stringify(schoolData, null, 2)};\n}'
);

codeGs = codeGs.replace(
  /function getDefaultAdminPassword\(\) \{[\s\S]*?\n\}/,
  'function getDefaultAdminPassword() {\n  return "${adminPassword}";\n}'
);

// 2. Read index.html
let indexHtml = fs.readFileSync(path.join(gasDir, 'index.html'), 'utf8');
// Escape backticks
indexHtml = indexHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${');
// Replace title to be dynamic
indexHtml = indexHtml.replace(
  /<title id="metaTitle">SMP AL-HIKAM - Launcher Terpadu<\/title>/,
  '<title id="metaTitle">${config.SCHOOL_NAME || "Portal Digital Sekolah"} - Launcher Terpadu</title>'
);

// 3. Read css.html
let cssHtml = fs.readFileSync(path.join(gasDir, 'css.html'), 'utf8');
cssHtml = cssHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${');

// 4. Read javascript.html
let javascriptHtml = fs.readFileSync(path.join(gasDir, 'javascript.html'), 'utf8');
javascriptHtml = javascriptHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${');

// 5. Read include.html
let includeHtml = fs.readFileSync(path.join(gasDir, 'include.html'), 'utf8');
includeHtml = includeHtml.replace(/`/g, '\\`').replace(/\${/g, '\\${');

// Compose the final gasTemplates.ts file
const templateContent = `import { AppItem, SchoolData } from '../types';
import { ExtendedAppConfig } from '../defaultData';

export function getCodeGsTemplate(
  config: ExtendedAppConfig,
  apps: AppItem[],
  schoolData: SchoolData,
  adminPassword: string
): string {
  return \`${codeGs}\`;
}

export function getIndexHtmlTemplate(config: ExtendedAppConfig): string {
  return \`${indexHtml}\`;
}

export function getCssHtmlTemplate(): string {
  return \`${cssHtml}\`;
}

export function getJavascriptHtmlTemplate(): string {
  return \`${javascriptHtml}\`;
}

export function getIncludeHtmlTemplate(): string {
  return \`${includeHtml}\`;
}
`;

fs.writeFileSync(targetFile, templateContent, 'utf8');
console.log('Successfully generated gasTemplates.ts!');
