// routeChecker.js - add any route files you mount in index.js
const express = require('express');

const routeFiles = [
  './routes/auth.js',
  './routes/api.js',
  './routes/student.js',
  './routes/digitalTwinRoutes.js' // <- add this
];

console.log('Checking route files for errors...\n');

routeFiles.forEach(routeFile => {
  console.log(`Checking ${routeFile}...`);
  try {
    const router = require(routeFile);
    console.log(`✓ ${routeFile} loaded successfully`);
    const testApp = express();
    testApp.use('/test', router);
    console.log(`✓ ${routeFile} can be mounted successfully\n`);
  } catch (error) {
    console.error(`✗ Error in ${routeFile}:`);
    console.error(`  ${error.stack}\n`);
  }
});

console.log('Route check complete.');
