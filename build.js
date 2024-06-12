import fs from 'fs'
const Handlebars = require('handlebars');

const compileTemplate = (templatePath, dataPath, outputPath) => {
  const template = fs.readFileSync(templatePath, 'utf8');
  const templateScript = Handlebars.compile(template);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const html = templateScript(data);

  fs.writeFileSync(outputPath, html);
};

// Example usage
compileTemplate('views/index.hbs', 'data/index.json', 'dist/index.html');
