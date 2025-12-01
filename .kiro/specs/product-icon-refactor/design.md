# Design Document: Product Icon Theme Refactor

## Overview

This design refactors the Kiroween product icon theme to use the correct VS Code product icon theme architecture. The current implementation incorrectly uses direct SVG file paths, which VS Code does not support for product icons. VS Code product icon themes require an icon font (TrueType format) where each icon is a glyph mapped to a Unicode code point.

The refactor will:
1. Convert existing SVG icons into a TrueType font file using icon-font-generator
2. Update product-icon-theme.json to reference the font and map icons to font characters
3. Establish a build process for regenerating the font from SVG sources
4. Maintain SVG files as editable source files

## Architecture

### High-Level Flow

```
SVG Source Files → Build Script → Icon Font (.ttf) → VS Code Product Icon Theme
```

1. **Source**: SVG files in `product-icons/icons/` serve as the source of truth
2. **Build**: npm script runs icon-font-generator to convert SVGs to font
3. **Output**: TrueType font file (`kiroween-icons.ttf`) with icon glyphs
4. **Configuration**: `product-icon-theme.json` references the font and maps VS Code icon IDs to font characters
5. **Runtime**: VS Code loads the font and displays icons using font characters

### Directory Structure

```
product-icons/
├── icons/                          # Source SVG files
│   ├── pumpkin.svg
│   ├── eyeball.svg
│   ├── dead-tree-branch.svg
│   ├── lightning-bolt.svg
│   ├── witch-hat.svg
│   ├── cauldron.svg
│   ├── coffin.svg
│   ├── skull.svg
│   └── haunted-eye.svg
├── kiroween-icons.ttf             # Generated icon font
├── product-icon-theme.json        # Theme configuration
└── icon-mapping.json              # Unicode code point mapping (generated)
```

## Components and Interfaces

### 1. Icon Font Generator

**Tool**: `icon-font-generator` npm package

**Input**: SVG files from `product-icons/icons/`

**Output**: 
- `kiroween-icons.ttf` - TrueType font file
- `icon-mapping.json` - Mapping of icon names to Unicode code points

**Configuration**:
```javascript
{
  inputDir: 'product-icons/icons',
  outputDir: 'product-icons',
  fontName: 'kiroween-icons',
  types: ['ttf'],
  normalize: true,
  fontHeight: 1000,
  descent: 0
}
```

### 2. Product Icon Theme JSON

**Schema**: VS Code Product Icon Theme

**Structure**:
```json
{
  "fonts": [
    {
      "id": "kiroween-icons",
      "src": [
        {
          "path": "./kiroween-icons.ttf",
          "format": "truetype"
        }
      ],
      "weight": "normal",
      "style": "normal"
    }
  ],
  "iconDefinitions": {
    "pumpkin": {
      "fontCharacter": "\\e001"
    },
    "eyeball": {
      "fontCharacter": "\\e002"
    }
    // ... additional icons
  },
  "explorer-view-icon": "pumpkin",
  "search-view-icon": "eyeball"
  // ... additional mappings
}
```

**Key Properties**:
- `fonts`: Array defining custom fonts to load
- `fonts[].id`: Unique identifier for the font
- `fonts[].src`: Array of font source files with paths and formats
- `iconDefinitions`: Maps icon IDs to font characters
- `iconDefinitions[].fontCharacter`: Unicode escape sequence (e.g., "\\e001")
- VS Code icon identifier mappings: Maps VS Code's built-in icon IDs to custom icon definitions

### 3. Build Script

**Location**: `package.json` scripts section

**Script**:
```json
{
  "scripts": {
    "build:icons": "icon-font-generator product-icons/icons/*.svg -o product-icons -n kiroween-icons --types ttf --height 1000 --normalize --json product-icons/icon-mapping.json"
  }
}
```

**Behavior**:
1. Reads all SVG files from `product-icons/icons/`
2. Converts each SVG to a font glyph
3. Assigns sequential Unicode code points starting from U+E001 (Private Use Area)
4. Generates `kiroween-icons.ttf` in `product-icons/`
5. Generates `icon-mapping.json` with name-to-codepoint mappings

### 4. Icon Mapping File

**Format**: JSON

**Purpose**: Documents which Unicode code point corresponds to each icon

**Structure**:
```json
{
  "pumpkin": "\\e001",
  "eyeball": "\\e002",
  "dead-tree-branch": "\\e003",
  "lightning-bolt": "\\e004",
  "witch-hat": "\\e005",
  "cauldron": "\\e006",
  "coffin": "\\e007",
  "skull": "\\e008",
  "haunted-eye": "\\e009"
}
```

## Data Models

### Icon Definition

| Property | Type | Description |
|----------|------|-------------|
| name | string | Icon identifier (e.g., "pumpkin") |
| fontCharacter | string | Unicode escape sequence (e.g., "\\e001") |
| svgSource | string | Path to source SVG file |

### VS Code Icon Mapping

| VS Code ID | Icon Name | Font Character |
|------------|-----------|----------------|
| explorer-view-icon | pumpkin | \\e001 |
| search-view-icon | eyeball | \\e002 |
| scm-view-icon | dead-tree-branch | \\e003 |
| debug-view-icon | lightning-bolt | \\e004 |
| extensions-view-icon | witch-hat | \\e005 |
| settings-view-icon | cauldron | \\e006 |
| terminal-view-icon | coffin | \\e007 |
| error-icon | skull | \\e008 |
| info-icon | haunted-eye | \\e009 |
| warning-icon | pumpkin | \\e001 |

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unique Unicode Code Points

*For any* icon mapping configuration, all assigned Unicode code points should be unique with no duplicates.

**Validates: Requirements 1.2**

### Property 2: All Icon Definitions Have Font Characters

*For any* icon definition in the iconDefinitions section of product-icon-theme.json, it should have a fontCharacter property with a valid Unicode escape sequence.

**Validates: Requirements 2.5**

### Property 3: All SVG Files Processed

*For any* SVG file in the product-icons/icons/ directory, when the build script runs, it should be included in the generated font file.

**Validates: Requirements 3.3**

### Property 4: All VS Code Icon Identifiers Mapped

*For any* of the 10 required VS Code icon identifiers (explorer-view-icon, search-view-icon, scm-view-icon, debug-view-icon, extensions-view-icon, settings-view-icon, terminal-view-icon, error-icon, info-icon, warning-icon), the product-icon-theme.json should contain a mapping to a valid icon definition.

**Validates: Requirements 4.3**

### Property 5: Build Process Idempotence

*For any* state of the SVG source files, running the build script multiple times should produce consistent output without errors.

**Validates: Requirements 5.3**

### Property 6: SVG Compatibility

*For any* SVG file in the product-icons/icons/ directory, it should be valid input for the icon-font-generator tool (valid SVG structure with paths).

**Validates: Requirements 5.5**

### Property 7: Relative Font Path

*For any* font path reference in product-icon-theme.json, it should be a relative path that correctly resolves to the font file from the theme JSON location.

**Validates: Requirements 6.5**

### Examples to Verify

**Example 1: Font File Exists**
- After running the build script, kiroween-icons.ttf should exist in the product-icons/ directory
- **Validates: Requirements 1.3, 1.4**

**Example 2: Fonts Array Structure**
- The product-icon-theme.json should contain a fonts array with an entry having id "kiroween-icons", path "./kiroween-icons.ttf", and format "truetype"
- **Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Example 3: Build Script Exists**
- The package.json should contain a script for building the icon font
- **Validates: Requirements 3.2, 6.2**

**Example 4: Build Output Location**
- When the build script runs, the font file should be output to the product-icons/ directory
- **Validates: Requirements 3.4**

**Example 5: Mapping File Exists**
- After running the build script, icon-mapping.json should exist documenting the code point mappings
- **Validates: Requirements 3.5**

**Example 6: SVG Files Preserved**
- All 9 original SVG files should still exist in product-icons/icons/ after the refactor
- **Validates: Requirements 5.1**

**Example 7: Build Documentation**
- The README or documentation should explain how to run the build script
- **Validates: Requirements 5.4**

**Example 8: Dev Dependency Added**
- The package.json should include icon-font-generator in devDependencies
- **Validates: Requirements 6.1**

**Example 9: GitIgnore Configuration**
- If the font should be regenerated, .gitignore should exclude the generated font file
- **Validates: Requirements 6.3**

## Error Handling

### Build-Time Errors

1. **Missing SVG Files**: If expected SVG files are missing, the build script should fail with a clear error message
2. **Invalid SVG Format**: If an SVG file cannot be parsed by icon-font-generator, the build should fail and indicate which file is problematic
3. **Font Generation Failure**: If the font generation process fails, the error should be logged with details
4. **Output Directory Issues**: If the output directory doesn't exist or isn't writable, the build should fail gracefully

### Configuration Errors

1. **Missing Font File**: If product-icon-theme.json references a font file that doesn't exist, VS Code will fail to load the theme
2. **Invalid Unicode Escapes**: If fontCharacter values are malformed, icons won't display
3. **Missing Icon Definitions**: If a VS Code icon ID maps to a non-existent icon definition, the default icon will be used

### Validation Strategy

- Run the build script as part of CI/CD to catch build failures early
- Validate product-icon-theme.json structure against VS Code's schema
- Test the extension in VS Code's Extension Development Host before publishing
- Use property-based tests to verify configuration correctness

## Testing Strategy

### Unit Testing

Unit tests will verify specific configuration and file structure:

1. **Configuration Structure Tests**
   - Parse product-icon-theme.json and verify it contains the fonts array
   - Verify fonts array has correct id, path, and format
   - Verify all icon definitions have fontCharacter properties
   - Verify all 10 VS Code icon identifiers are present

2. **File Existence Tests**
   - Verify kiroween-icons.ttf exists after build
   - Verify icon-mapping.json exists after build
   - Verify all 9 SVG source files exist
   - Verify package.json contains build script and dev dependency

3. **Path Resolution Tests**
   - Verify font path in theme JSON resolves correctly
   - Verify all file paths are relative and correct

### Property-Based Testing

Property-based tests will verify universal properties using **fast-check** for JavaScript/TypeScript.

**Test Configuration**: Each property-based test should run a minimum of 100 iterations.

1. **Property Test 1: Unique Unicode Code Points**
   - **Feature: product-icon-refactor, Property 1: Unique Unicode Code Points**
   - Generator: All fontCharacter values from iconDefinitions
   - Property: No duplicate code points exist
   - **Validates: Requirements 1.2**

2. **Property Test 2: All Icon Definitions Have Font Characters**
   - **Feature: product-icon-refactor, Property 2: All Icon Definitions Have Font Characters**
   - Generator: All entries in iconDefinitions
   - Property: Each has a fontCharacter property with valid Unicode escape format (\\e[0-9a-f]{3,4})
   - **Validates: Requirements 2.5**

3. **Property Test 3: All SVG Files Processed**
   - **Feature: product-icon-refactor, Property 3: All SVG Files Processed**
   - Generator: All SVG files in product-icons/icons/
   - Property: Each SVG filename (without extension) appears in icon-mapping.json
   - **Validates: Requirements 3.3**

4. **Property Test 4: All VS Code Icon Identifiers Mapped**
   - **Feature: product-icon-refactor, Property 4: All VS Code Icon Identifiers Mapped**
   - Generator: List of 10 required VS Code icon identifiers
   - Property: Each identifier exists in product-icon-theme.json and maps to a valid icon definition
   - **Validates: Requirements 4.3**

5. **Property Test 5: Build Process Idempotence**
   - **Feature: product-icon-refactor, Property 5: Build Process Idempotence**
   - Generator: Run build script multiple times
   - Property: Output files remain consistent across runs (same file size, same mappings)
   - **Validates: Requirements 5.3**

6. **Property Test 6: SVG Compatibility**
   - **Feature: product-icon-refactor, Property 6: SVG Compatibility**
   - Generator: All SVG files in product-icons/icons/
   - Property: Each file is valid XML with SVG namespace and contains path elements
   - **Validates: Requirements 5.5**

7. **Property Test 7: Relative Font Path**
   - **Feature: product-icon-refactor, Property 7: Relative Font Path**
   - Generator: Font path from product-icon-theme.json
   - Property: Path is relative (doesn't start with / or contain :) and resolves to existing file
   - **Validates: Requirements 6.5**

### Integration Testing

1. **Extension Loading Test**
   - Install extension in VS Code Extension Development Host
   - Verify no errors in developer console
   - Verify theme appears in product icon theme selector

2. **Icon Display Test**
   - Activate the Kiroween Icons theme
   - Verify icons display in activity bar
   - Verify icons display for status indicators
   - Test at different zoom levels

3. **Build Process Test**
   - Run `npm run build:icons`
   - Verify font file is generated
   - Verify mapping file is generated
   - Verify no build errors

### Manual Testing Checklist

- [ ] Run `npm install` to install icon-font-generator
- [ ] Run `npm run build:icons` to generate font
- [ ] Verify kiroween-icons.ttf exists in product-icons/
- [ ] Verify icon-mapping.json exists in product-icons/
- [ ] Open VS Code Extension Development Host (F5)
- [ ] Open Command Palette → "Preferences: Product Icon Theme"
- [ ] Select "Kiroween Icons"
- [ ] Verify Halloween icons appear in activity bar
- [ ] Verify error/warning/info icons display correctly
- [ ] Test at 100%, 125%, and 150% zoom levels

## Implementation Notes

### Unicode Private Use Area

The icon font will use Unicode code points in the Private Use Area (U+E000 to U+F8FF) to avoid conflicts with standard Unicode characters. The icon-font-generator typically starts at U+E001.

### SVG Preparation

The existing SVG files should work with icon-font-generator, but they must:
- Be valid XML
- Contain path elements (not just shapes that need to be converted)
- Have a viewBox attribute
- Not rely on external resources or complex features

If SVGs need modification, ensure they maintain:
- `stroke="currentColor"` for color inheritance
- `fill="none"` for stroke-only designs
- Simple path-based designs

### Font Generation Options

Key options for icon-font-generator:
- `--types ttf`: Generate only TrueType format (VS Code requirement)
- `--height 1000`: Font height in units (standard for icon fonts)
- `--normalize`: Normalize icon sizes for consistency
- `--json`: Output mapping file for documentation

### VS Code Theme Loading

VS Code loads product icon themes by:
1. Reading the theme JSON file
2. Loading referenced font files using @font-face
3. Applying icon definitions to UI elements
4. Using fontCharacter values to display specific glyphs

The font must be in the same directory or a subdirectory of the theme JSON file.

### Build Process Integration

The build script should be:
- Run manually during development when icons change
- Run as part of the extension packaging process
- Documented in the README for contributors

Consider adding a pre-package script:
```json
{
  "scripts": {
    "vscode:prepublish": "npm run build:icons"
  }
}
```

### Troubleshooting

Common issues and solutions:

1. **Icons not displaying**: Check browser/VS Code console for font loading errors
2. **Wrong icons showing**: Verify fontCharacter mappings match icon-mapping.json
3. **Build fails**: Ensure all SVGs are valid and icon-font-generator is installed
4. **Font file not found**: Verify path in theme JSON is relative and correct

## Dependencies

- **icon-font-generator**: ^2.1.10 or later (dev dependency)
- **VS Code Engine**: ^1.106.1 (existing)
- **Node.js**: Required for running build scripts

## Future Enhancements

1. **Automated Build**: Add a file watcher to regenerate font when SVGs change
2. **Multiple Variants**: Generate different font weights or styles
3. **Icon Preview**: Create an HTML preview page showing all icons
4. **Color Variants**: Explore multi-color icon support (if VS Code adds support)
5. **Additional Icons**: Expand the icon set to cover more VS Code UI elements
