const fs = require('fs');
const path = require('path');

function convertFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Convert import statements to require
    content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]\s*;/g, 'const {$1} = require("$2");');
    content = content.replace(/import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;/g, 'const $1 = require("$2");');
    content = content.replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;/g, 'const $1 = require("$2");');

    // Convert export statements to module.exports
    content = content.replace(/export\s+default\s+(\w+)\s*;/g, 'module.exports = $1;');
    content = content.replace(/export\s+const\s+(\w+)\s*=/g, 'const $1 =');
    content = content.replace(/export\s+function\s+(\w+)/g, 'function $1');
    content = content.replace(/export\s+{([^}]+)}\s*;/g, 'module.exports = {$1};');

    // Remove any remaining export keywords
    content = content.replace(/export\s+/g, '');

    fs.writeFileSync(filePath, content);
    console.log(`Converted: ${filePath}`);
  } catch (err) {
    console.error(`Error converting ${filePath}:`, err.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && file !== 'node_modules' && file !== 'coverage') {
      walkDirectory(filePath);
    } else if (file.endsWith('.js')) {
      convertFile(filePath);
    }
  }
}

console.log('Starting bulk conversion...');
walkDirectory('c:\\Users\\ADEWALE\\skillafrik-app\\backend');
console.log('Conversion complete!');