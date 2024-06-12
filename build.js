import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import Handlebars from 'handlebars';

const compileTemplate = (templatePath, dataPath, outputPath) => {
  const template = readFileSync(templatePath, 'utf8');
  const templateScript = Handlebars.compile(template);
  const data = JSON.parse(readFileSync(dataPath, 'utf8'));
  const html = templateScript(data);

  // Ensure the output directory exists
  const outputDir = dirname(outputPath);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(outputPath, html);
};

// Example usage
const templatePath = new URL('./views/index.hbs', import.meta.url).pathname;
const dataPath = new URL('./data/index.json', import.meta.url).pathname;
const outputPath = new URL('./dist/index.html', import.meta.url).pathname;

compileTemplate(templatePath, dataPath, outputPath);
