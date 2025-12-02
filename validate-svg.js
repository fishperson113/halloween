/**
 * SVG Validation Script
 * Checks for common SVG errors like duplicate attributes
 */

const fs = require('fs');
const path = require('path');

function validateSVG(filepath) {
    console.log(`Validating: ${filepath}`);
    console.log('='.repeat(60));
    
    const content = fs.readFileSync(filepath, 'utf8');
    const lines = content.split('\n');
    
    let errors = [];
    let warnings = [];
    
    // Check for duplicate attributes
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Check for duplicate fill attributes
        const fillMatches = line.match(/fill=/g);
        if (fillMatches && fillMatches.length > 1) {
            errors.push(`Line ${lineNum}: Duplicate 'fill' attribute`);
        }
        
        // Check for duplicate stroke attributes
        const strokeMatches = line.match(/stroke=/g);
        if (strokeMatches && strokeMatches.length > 1) {
            errors.push(`Line ${lineNum}: Duplicate 'stroke' attribute`);
        }
        
        // Check for duplicate id attributes
        const idMatches = line.match(/id=/g);
        if (idMatches && idMatches.length > 1) {
            errors.push(`Line ${lineNum}: Duplicate 'id' attribute`);
        }
        
        // Check for unclosed tags
        if (line.includes('<') && !line.includes('>') && !line.trim().startsWith('<!--')) {
            warnings.push(`Line ${lineNum}: Possibly unclosed tag`);
        }
    });
    
    // Check for basic SVG structure
    if (!content.includes('<svg')) {
        errors.push('Missing <svg> root element');
    }
    
    if (!content.includes('xmlns="http://www.w3.org/2000/svg"')) {
        warnings.push('Missing SVG namespace declaration');
    }
    
    if (!content.includes('viewBox')) {
        warnings.push('Missing viewBox attribute');
    }
    
    // Report results
    console.log('\nValidation Results:');
    console.log('-'.repeat(60));
    
    if (errors.length === 0 && warnings.length === 0) {
        console.log('✓ No errors or warnings found');
        console.log('✓ SVG appears to be valid');
        return true;
    }
    
    if (errors.length > 0) {
        console.log(`\n✗ ${errors.length} ERROR(S) FOUND:`);
        errors.forEach(err => console.log(`  ${err}`));
    }
    
    if (warnings.length > 0) {
        console.log(`\n⚠ ${warnings.length} WARNING(S):`);
        warnings.forEach(warn => console.log(`  ${warn}`));
    }
    
    return errors.length === 0;
}

// Validate the background pattern
const svgPath = path.join(__dirname, 'assets', 'background-pattern.svg');

if (!fs.existsSync(svgPath)) {
    console.error('Error: background-pattern.svg not found!');
    console.error('Run: node generate-background-pattern.js');
    process.exit(1);
}

const isValid = validateSVG(svgPath);

console.log('\n' + '='.repeat(60));
if (isValid) {
    console.log('✓ SVG validation passed!');
    process.exit(0);
} else {
    console.log('✗ SVG validation failed!');
    process.exit(1);
}
