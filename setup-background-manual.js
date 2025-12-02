/**
 * Manual Background Setup Helper
 * 
 * This script helps you manually configure the Halloween background
 * by providing the exact steps and configuration needed.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('='.repeat(70));
console.log('Kiroween Halloween Background - Manual Setup Guide');
console.log('='.repeat(70));

// Get the CSS file path
const cssPath = path.join(__dirname, 'themes', 'kiroween-background.css');
const cssUri = `file:///${cssPath.replace(/\\/g, '/')}`;

console.log('\n📋 STEP 1: Install Custom CSS Extension');
console.log('-'.repeat(70));
console.log('1. Open Extensions (Ctrl+Shift+X)');
console.log('2. Search for: "Custom CSS and JS Loader"');
console.log('3. Install the extension by "be5invis"');
console.log('4. Restart VSCode/Kiro IDE');

console.log('\n📋 STEP 2: Add CSS Path to Settings');
console.log('-'.repeat(70));
console.log('1. Open Command Palette (Ctrl+Shift+P)');
console.log('2. Type: "Preferences: Open User Settings (JSON)"');
console.log('3. Add this configuration:\n');

const config = {
  "vscode_custom_css.imports": [cssUri]
};

console.log(JSON.stringify(config, null, 2));

console.log('\n📋 STEP 3: Enable Custom CSS');
console.log('-'.repeat(70));
console.log('1. Open Command Palette (Ctrl+Shift+P)');
console.log('2. Type: "Enable Custom CSS and JS"');
console.log('3. Click "Reload" when prompted');
console.log('4. Restart VSCode/Kiro IDE');

console.log('\n📋 STEP 4: Activate Kiroween Theme');
console.log('-'.repeat(70));
console.log('1. Open Command Palette (Ctrl+Shift+P)');
console.log('2. Type: "Preferences: Color Theme"');
console.log('3. Select "KiroTheme"');
console.log('4. The background should now be visible!');

console.log('\n' + '='.repeat(70));
console.log('📄 Quick Copy - CSS Path:');
console.log('='.repeat(70));
console.log(cssUri);

console.log('\n' + '='.repeat(70));
console.log('📄 Quick Copy - Full Settings JSON:');
console.log('='.repeat(70));
console.log(JSON.stringify(config, null, 2));

// Try to find VSCode settings file
const possibleSettingsPaths = [
  path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'settings.json'),
  path.join(os.homedir(), 'AppData', 'Roaming', 'Code - Insiders', 'User', 'settings.json'),
  path.join(os.homedir(), '.config', 'Code', 'User', 'settings.json'),
  path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User', 'settings.json'),
];

console.log('\n' + '='.repeat(70));
console.log('🔍 Searching for VSCode settings file...');
console.log('='.repeat(70));

let settingsFound = false;
for (const settingsPath of possibleSettingsPaths) {
  if (fs.existsSync(settingsPath)) {
    console.log(`✓ Found: ${settingsPath}`);
    settingsFound = true;
    
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      
      if (settings['vscode_custom_css.imports']) {
        console.log('\n⚠ You already have Custom CSS imports configured:');
        console.log(JSON.stringify(settings['vscode_custom_css.imports'], null, 2));
        
        if (settings['vscode_custom_css.imports'].includes(cssUri)) {
          console.log('\n✓ Kiroween CSS is already in your settings!');
          console.log('  Just run "Enable Custom CSS and JS" and restart VSCode.');
        } else {
          console.log('\n→ Add the Kiroween CSS path to your existing imports:');
          const updatedImports = [...settings['vscode_custom_css.imports'], cssUri];
          console.log(JSON.stringify({ "vscode_custom_css.imports": updatedImports }, null, 2));
        }
      } else {
        console.log('\n→ No Custom CSS imports found. Add the configuration above.');
      }
    } catch (error) {
      console.log(`  (Could not read settings file: ${error.message})`);
    }
    break;
  }
}

if (!settingsFound) {
  console.log('✗ Settings file not found in common locations');
  console.log('  Open settings manually: Ctrl+Shift+P → "Open User Settings (JSON)"');
}

console.log('\n' + '='.repeat(70));
console.log('🎃 Troubleshooting');
console.log('='.repeat(70));
console.log('If the background still doesn\'t show:');
console.log('1. Make sure Custom CSS extension is installed and enabled');
console.log('2. Verify the CSS path is correct in settings.json');
console.log('3. Run "Enable Custom CSS and JS" command');
console.log('4. Restart VSCode completely (close all windows)');
console.log('5. Check Developer Tools console for errors (Help → Toggle Developer Tools)');

console.log('\n' + '='.repeat(70));
console.log('📚 More Help');
console.log('='.repeat(70));
console.log('See BACKGROUND_TROUBLESHOOTING.md for detailed troubleshooting steps');
console.log('See EXTENSION_SETUP.md for complete setup instructions');

console.log('\n✨ Setup guide complete!\n');
