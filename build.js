import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import Handlebars from 'handlebars';
import { MongoClient } from 'mongodb';

// Full paths to your template and output files
const templatePath = 'C:/Users/user/Desktop/JavaScript/app/views/index.hbs';
const outputPath = 'C:/Users/user/Desktop/JavaScript/app/dist/index.html';

// MongoDB connection URI and database details
const uri = process.env.MONGO_URI;
const dbName = 'test';

const compileTemplate = async (templatePath, outputPath) => {
  // Read and compile the Handlebars template
  const template = readFileSync(templatePath, 'utf8');
  const templateScript = Handlebars.compile(template);

  // Connect to MongoDB and fetch data from users and products collections
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const database = client.db(dbName);
    const usersCollection = database.collection('users');
    const productsCollection = database.collection('products');

    // Fetch data from users and products collections
    const usersData = await usersCollection.find({}).toArray();
    const productsData = await productsCollection.find({}).toArray();

    // Combine data from both collections or use it separately as needed
    const data = {
      users: usersData,
      products: productsData
    };

    // Compile the template with the fetched data
    const html = templateScript(data);

    // Ensure the output directory exists
    const outputDir = dirname(outputPath);
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write the compiled HTML to the output file
    writeFileSync(outputPath, html);
    console.log('Template compiled and saved successfully.');
  } finally {
    await client.close();
  }
};

// Example usage
compileTemplate(templatePath, outputPath).catch(console.error);
