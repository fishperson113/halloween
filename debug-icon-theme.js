const fs = require('fs');
const path = require('path');

console.log('=== Product Icon Theme Debug Report ===\n');

// 1. Check package.json
console.log('1. Checking package.json configuration...');
try {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  if (!pkg.contributes) {
    console.error('❌ No "contributes" section in package.json');
  } else if (!pkg.contributes.productIconThemes) {
    console.error('❌ No "productIconThemes" in contributes');
  } else {
    console.log('✓ productIconThemes found:', pkg.contributes.productIconThemes);
    
    const theme = pkg.contributes.productIconThemes[0];
    if (theme.id !== 'kiroween-icons') {
      console.warn('⚠️  Theme ID is not "kiroween-icons"');
    }
    
    // Check if path exists
    const themePath = theme.path;
    if (!fs.existsSync(themePath)) {
      console.error(`❌ Theme file not found at: ${themePath}`);
    } else {
      console.log(`✓ Theme file exists at: ${themePath}`);
    }
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

// 2. Check product-icon-theme.json
console.log('\n2. Checking product-icon-theme.json...');
try {
  const themeJson = JSON.parse(fs.readFileSync('product-icons/product-icon-theme.json', 'utf8'));
  
  // Check for required structure
  if (!themeJson.iconDefinitions) {
    console.error('❌ Missing "iconDefinitions" section');
  } else {
    console.log(`✓ iconDefinitions has ${Object.keys(themeJson.iconDefinitions).length} icons`);
  }
  
  // Check icon mappings
  const requiredMappings = [
    'explorer-view-icon',
    'search-view-icon',
    'scm-view-icon',
    'debug-view-icon',
    'extensions-view-icon',
    'settings-view-icon',
    'terminal-view-icon',
    'error-icon',
    'info-icon',
    'warning-icon'
  ];
  
  const missingMappings = requiredMappings.filter(m => !themeJson[m]);
  if (missingMappings.length > 0) {
    console.error('❌ Missing icon mappings:', missingMappings);
  } else {
    console.log('✓ All required icon mappings present');
  }
  
  // Check if mapped icons exist in definitions
  for (const [key, value] of Object.entries(themeJson)) {
    if (key !== 'iconDefinitions' && typeof value === 'string') {
      if (!themeJson.iconDefinitions[value]) {
        console.error(`❌ Icon mapping "${key}" references undefined icon "${value}"`);
      }
    }
  }
  
} catch (error) {
  console.error('❌ Error reading product-icon-theme.json:', error.message);
}

// 3. Check SVG files
console.log('\n3. Checking SVG files...');
try {
  const themeJson = JSON.parse(fs.readFileSync('product-icons/product-icon-theme.json', 'utf8'));
  const iconDefs = themeJson.iconDefinitions || {};
  
  for (const [iconName, iconDef] of Object.entries(iconDefs)) {
    const iconPath = path.join('product-icons', iconDef.iconPath);
    
    if (!fs.existsSync(iconPath)) {
      console.error(`❌ SVG file missing: ${iconPath}`);
      continue;
    }
    
    const svgContent = fs.readFileSync(iconPath, 'utf8');
    
    // Check for potential issues
    const issues = [];
    
    // Check for XML comments (might cause issues)
    if (svgContent.includes('<!--')) {
      issues.push('Contains XML comments');
    }
    
    // Check for required attributes
    if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
      issues.push('Missing xmlns attribute');
    }
    
    if (!svgContent.includes('viewBox')) {
      issues.push('Missing viewBox');
    }
    
    if (!svgContent.includes('stroke="currentColor"')) {
      issues.push('Missing stroke="currentColor"');
    }
    
    // Check for fills (should be none)
    if (svgContent.includes('fill="') && !svgContent.includes('fill="none"')) {
      issues.push('Has fill color (should be none)');
    }
    
    // Check file size (too large might be an issue)
    const stats = fs.statSync(iconPath);
    if (stats.size > 10000) {
      issues.push(`Large file size: ${stats.size} bytes`);
    }
    
    if (issues.length > 0) {
      console.log(`⚠️  ${iconName}: ${issues.join(', ')}`);
    } else {
      console.log(`✓ ${iconName}: OK`);
    }
  }
} catch (error) {
  console.error('❌ Error checking SVG files:', error.message);
}

// 4. Check for common VS Code product icon identifiers
console.log('\n4. Checking VS Code compatibility...');
const knownVSCodeIcons = [
  'explorer-view-icon',
  'search-view-icon',
  'scm-view-icon',
  'debug-view-icon',
  'extensions-view-icon',
  'remote-explorer-view-icon',
  'settings-view-icon',
  'terminal-view-icon',
  'error-icon',
  'warning-icon',
  'info-icon'
];

try {
  const themeJson = JSON.parse(fs.readFileSync('product-icons/product-icon-theme.json', 'utf8'));
  const definedIcons = Object.keys(themeJson).filter(k => k !== 'iconDefinitions');
  
  console.log('Defined icon mappings:', definedIcons.length);
  console.log('Known VS Code icons:', knownVSCodeIcons.length);
  
  const unmappedKnownIcons = knownVSCodeIcons.filter(icon => !definedIcons.includes(icon));
  if (unmappedKnownIcons.length > 0) {
    console.log('ℹ️  Unmapped known icons:', unmappedKnownIcons);
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}

// 5. Potential issues summary
console.log('\n=== Potential Issues ===');
console.log('1. XML comments in SVG files - VS Code might not parse them correctly');
console.log('2. Extension needs to be reloaded in Extension Development Host');
console.log('3. Product icon theme setting might not be applied in dev host');
console.log('4. SVG paths might need to be absolute or have different format');

console.log('\n=== Recommended Actions ===');
console.log('1. Remove XML comments from all SVG files');
console.log('2. Restart Extension Development Host (F5)');
console.log('3. Manually select theme: Ctrl+Shift+P → "Preferences: Product Icon Theme"');
console.log('4. Check VS Code Developer Tools console for errors');
console.log('5. Try packaging extension: vsce package');
