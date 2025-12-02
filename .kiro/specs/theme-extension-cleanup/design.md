# Design Document

## Overview

This design outlines the cleanup and correction process for the Kiroween VSCode theme extension. The extension is currently a pure theme extension but has a path mismatch in package.json and contains unnecessary build artifacts. The design focuses on correcting the package.json path references, removing build artifacts, and optimizing the .vscodeignore file to ensure successful packaging and installation.

## Architecture

The Kiroween extension follows the standard VSCode theme extension architecture:

```
Extension (Pure Theme)
├── Theme Contributions
│   ├── Color Theme (JSON)
│   └── Product Icon Theme (JSON + Font)
└── Configuration
    └── Background Toggle Setting
```

**Key Architectural Principles:**
- Zero executable code (no TypeScript/JavaScript)
- Declarative configuration only (JSON)
- Static asset delivery (fonts, theme definitions)
- No activation events or commands

## Components and Interfaces

### 1. Package Manifest (package.json)

**Purpose:** Declares extension metadata and theme contributions

**Structure:**
- `name`, `displayName`, `description`: Extension identity
- `engines.vscode`: Minimum VSCode version
- `categories`: ["Themes", "Other"]
- `contributes.themes`: Color theme contribution
- `contributes.productIconThemes`: Product icon theme contribution
- `contributes.configuration`: Background toggle setting

**Current Issue:** Path mismatch in productIconThemes contribution
- Declared path: `./product-icons/product-icon-theme.json`
- Actual path: `./themes/product-icon-theme.json`

### 2. Color Theme (themes/KiroTheme-color-theme.json)

**Purpose:** Defines UI colors and syntax highlighting

**Interface:** VSCode Color Theme JSON Schema
- `colors`: UI element colors
- `tokenColors`: Syntax highlighting rules

**Status:** Correctly referenced and functional

### 3. Product Icon Theme (themes/product-icon-theme.json)

**Purpose:** Defines custom UI icons using icon font

**Interface:** VSCode Product Icon Theme JSON Schema
- `fonts`: Icon font declarations
- `iconDefinitions`: Icon-to-character mappings

**Dependencies:**
- Icon font file: `themes/kiroween-icons.ttf`
- Relative path reference: `./kiroween-icons.ttf`

**Status:** File exists but package.json references wrong path

### 4. Icon Font (themes/kiroween-icons.ttf)

**Purpose:** TrueType font containing custom Halloween-themed icons

**Format:** TrueType (.ttf)

**Status:** Correctly located and referenced within product-icon-theme.json

### 5. Build Artifacts

**Files to Remove:**
- `package-lock.json`: npm lock file (not needed for pure theme)
- Any `extension.js` or `extension.ts` files (none currently exist)
- `out/` directory (none currently exists)
- `node_modules/` directory (none currently exists)

### 6. Ignore Configuration (.vscodeignore)

**Purpose:** Excludes unnecessary files from .vsix package

**Current State:** Minimal configuration
**Needs:** Optimization to exclude development files

## Data Models

### Theme Contribution Model

```typescript
interface ThemeContribution {
  label: string;           // Display name in theme picker
  uiTheme: "vs-dark";     // Base theme type
  path: string;           // Relative path to theme JSON
}
```

### Product Icon Theme Contribution Model

```typescript
interface ProductIconThemeContribution {
  id: string;             // Unique identifier
  label: string;          // Display name in icon theme picker
  path: string;           // Relative path to icon theme JSON
}
```

### Icon Font Model

```typescript
interface IconFont {
  id: string;
  src: Array<{
    path: string;         // Relative path to font file
    format: "truetype";
  }>;
  weight: "normal";
  style: "normal";
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Package.json contains no code-related fields

*For any* valid theme extension package.json, the file should not contain "main", "activationEvents", or "commands" fields, ensuring VSCode treats it as a pure theme extension.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Package.json contributes section contains only theme contributions

*For any* valid theme extension package.json, the "contributes" section should contain only "themes", "productIconThemes", and "configuration" keys, with no command or activation contributions.

**Validates: Requirements 1.4**

### Property 3: Package.json specifies valid VSCode engine version

*For any* valid theme extension package.json, the "engines.vscode" field should exist and contain a valid semantic version string.

**Validates: Requirements 1.5**

### Property 4: Project root contains no build artifacts

*For any* clean theme extension project, the root directory should not contain extension.js, extension.ts, out/, node_modules/, or package-lock.json.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 5: All package.json theme paths reference existing files

*For any* theme contribution path in package.json (color themes and product icon themes), the referenced file should exist at the specified location relative to the project root.

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 6: Product icon theme font paths are valid

*For any* font path declared in product-icon-theme.json, the font file should exist at the specified location relative to the product-icon-theme.json file.

**Validates: Requirements 3.5**

### Property 7: .vscodeignore excludes development files

*For any* properly configured theme extension, the .vscodeignore file should contain patterns that exclude .vscode/, .git/, .kiro/, assets/*.svg, and generated preview files (*.css, *.html in themes/).

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

## Error Handling

### Path Resolution Errors

**Scenario:** package.json references a theme file that doesn't exist

**Handling:**
- Validation script should detect missing files before packaging
- Error message should clearly indicate which path is invalid
- Suggest correct path based on actual file locations

### Invalid JSON Structure

**Scenario:** package.json or theme files contain invalid JSON

**Handling:**
- JSON parsing should fail gracefully with clear error messages
- Validation should identify the specific file and line with syntax errors
- Provide guidance on JSON syntax requirements

### Missing Required Fields

**Scenario:** package.json missing required fields like "engines" or "contributes"

**Handling:**
- Validation should check for all required fields
- Error message should list missing fields
- Provide example of correct structure

## Testing Strategy

### Unit Testing

Since this is a cleanup and validation task rather than executable code, traditional unit tests are not applicable. Instead, we will use:

**Validation Scripts:**
- Script to validate package.json structure
- Script to verify file paths
- Script to check for unwanted artifacts

**Manual Verification:**
- Install extension locally and verify no errors
- Check theme appears in theme picker
- Verify icons load correctly

### Property-Based Testing

Property-based tests will validate the correctness properties defined above. We will use a Node.js testing framework with file system operations to verify:

**Test Framework:** Jest or Mocha with Chai
**Test Approach:**
- Read and parse package.json
- Verify structure matches requirements
- Check file system for artifacts and correct paths
- Validate .vscodeignore patterns

**Property Test Configuration:**
- Each property test should run validation checks
- Tests should be deterministic (no randomness needed for file validation)
- Tests should provide clear failure messages with specific issues

**Test Tagging:**
Each property-based test will be tagged with a comment referencing the design document:
- Format: `// Feature: theme-extension-cleanup, Property {number}: {property_text}`

## Implementation Approach

### Phase 1: Package.json Path Correction

1. Update `contributes.productIconThemes[0].path` from `./product-icons/product-icon-theme.json` to `./themes/product-icon-theme.json`
2. Verify all other paths in package.json are correct
3. Validate package.json against VSCode extension schema

### Phase 2: Artifact Cleanup

1. Remove `package-lock.json` if it exists
2. Verify no `extension.js`, `extension.ts`, `out/`, or `node_modules/` exist
3. Document current clean state

### Phase 3: .vscodeignore Optimization

1. Add exclusion patterns for development directories
2. Exclude source SVG files from assets/
3. Exclude generated preview files (CSS, HTML)
4. Keep necessary theme files and fonts

### Phase 4: Validation and Packaging

1. Run validation scripts to verify all properties
2. Package extension using `vsce package`
3. Install .vsix locally and test
4. Verify no errors in VSCode console
5. Confirm themes appear and function correctly

## Dependencies

- **vsce**: VSCode Extension CLI for packaging
- **Node.js**: For running validation scripts
- **VSCode**: For testing installed extension

## Success Criteria

1. ✅ package.json contains no "main", "activationEvents", or "commands"
2. ✅ All theme paths in package.json are correct
3. ✅ No build artifacts in project root
4. ✅ .vscodeignore properly configured
5. ✅ Extension packages without errors
6. ✅ Extension installs without errors
7. ✅ Themes appear and function correctly in VSCode
