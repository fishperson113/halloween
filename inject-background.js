/**
 * Kiroween Background CSS Injection Helper
 * 
 * This script helps inject the Halloween background CSS into VSCode.
 * It can be used with the "Custom CSS and JS Loader" extension.
 * 
 * Installation:
 * 1. Install "Custom CSS and JS Loader" extension (be-5.vscode-custom-css)
 * 2. Add this file path to your VSCode settings.json:
 *    "vscode_custom_css.imports": [
 *      "file:///path/to/kiroween-theme/themes/kiroween-background.css"
 *    ]
 * 3. Run command: "Enable Custom CSS and JS"
 * 4. Restart VSCode
 */

const fs = require('fs');
const path = require('path');

// Get the absolute path to the CSS file
const cssPath = path.join(__dirname, 'themes', 'kiroween-background.css');

// Read the CSS content
const cssContent = fs.readFileSync(cssPath, 'utf8');

console.log('Kiroween Background CSS Path:');
console.log(`file:///${cssPath.replace(/\\/g, '/')}`);
console.log('\nAdd this path to your VSCode settings.json:');
console.log(JSON.stringify({
  "vscode_custom_css.imports": [
    `file:///${cssPath.replace(/\\/g, '/')}`
  ]
}, null, 2));
console.log('\nThen run the command: "Enable Custom CSS and JS" and restart VSCode.');
