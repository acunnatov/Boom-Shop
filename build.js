import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import Handlebars from 'handlebars';

// Full paths to your files
const templatePath = 'C:/Users/user/Desktop/JavaScript/app/views/index.hbs';
const dataPath = 'C:/Users/user/Desktop/JavaScript/app/data/index.json';
const outputPath = 'C:/Users/user/Desktop/JavaScript/app/dist/index.html';

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
compileTemplate(templatePath, dataPath, outputPath);
