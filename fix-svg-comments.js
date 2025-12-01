const fs = require('fs');
const path = require('path');

const iconsDir = 'shared-icons';
const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

console.log(`Removing XML comments from ${files.length} SVG files...\n`);

files.forEach(file => {
  const filePath = path.join(iconsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove XML comments
  const originalLength = content.length;
  content = content.replace(/<!--[\s\S]*?-->/g, '');
  
  // Clean up extra whitespace
  content = content.replace(/\n\s*\n/g, '\n');
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`✓ ${file} - Removed ${originalLength - content.length} characters`);
});

console.log('\n✓ All SVG files cleaned!');
