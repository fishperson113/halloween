# Design Document

## Overview

The File Icon Theme feature provides a Halloween-themed icon set for the Kiroween VSCode extension. This design implements a minimal, monochrome, stroke-based icon system that replaces default file and folder icons with spooky symbols. The implementation follows VSCode's file icon theme API and schema, ensuring compatibility and proper integration with the IDE.

The icon theme consists of:
- Custom SVG icons for specific file types (JS, TS, JSON, MD)
- Custom folder icons (open and closed states)
- A JSON configuration file mapping file extensions to icons
- Integration with the extension's package.json manifest

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    VSCode Extension                      │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │           package.json (manifest)                   │ │
│  │  - Registers file icon theme contribution point    │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │      file-icons/file-icon-theme.json               │ │
│  │  - Icon definitions and mappings                   │ │
│  │  - File extension associations                     │ │
│  │  - Folder icon definitions                         │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│                          ▼                               │
│  ┌────────────────────────────────────────────────────┐ │
│  │         file-icons/icons/ (SVG files)              │ │
│  │  - pumpkin.svg (JavaScript)                        │ │
│  │  - skull.svg (TypeScript)                          │ │
│  │  - ghost.svg (JSON)                                │ │
│  │  - scroll.svg (Markdown)                           │ │
│  │  - coffin-closed.svg (Folder)                      │ │
│  │  - coffin-open.svg (Folder expanded)               │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   VSCode File Explorer │
              │   Renders custom icons │
              └───────────────────────┘
```

### Design Principles

1. **Declarative Configuration**: All icon mappings are defined in JSON, following VSCode's schema
2. **Minimal Design**: Icons use simple stroke-based shapes without complex fills or gradients
3. **Consistency**: All icons share the same viewBox (24x24) and styling approach
4. **Extensibility**: New file types can be added by creating SVG files and updating the JSON mapping
5. **Fallback Support**: Unmapped file types use VSCode's default icons

## Components and Interfaces

### 1. Icon Theme Configuration (`file-icon-theme.json`)

**Purpose**: Defines the mapping between file types and icon files

**Structure**:
```json
{
  "$schema": "vscode://schemas/icon-theme",
  "iconDefinitions": {
    "iconId": {
      "iconPath": "./icons/icon-name.svg"
    }
  },
  "fileExtensions": {
    "ext": "iconId"
  },
  "folder": "folderId",
  "folderExpanded": "folderExpandedId"
}
```

**Key Properties**:
- `iconDefinitions`: Object mapping icon IDs to SVG file paths
- `fileExtensions`: Object mapping file extensions to icon IDs
- `folder`: Icon ID for closed folders
- `folderExpanded`: Icon ID for open folders

### 2. SVG Icon Files

**Purpose**: Visual representation of file types using Halloween-themed symbols

**Specifications**:
- ViewBox: `0 0 24 24`
- Style: Stroke-based, no fills (or minimal fills for necessary details)
- Color: Monochrome (VSCode applies theme colors)
- Format: Valid SVG XML

**Icon Mappings**:
- `pumpkin.svg` → JavaScript files (.js)
- `skull.svg` → TypeScript files (.ts)
- `ghost.svg` → JSON files (.json)
- `scroll.svg` → Markdown files (.md)
- `coffin-closed.svg` → Closed folders
- `coffin-open.svg` → Open folders

### 3. Extension Manifest Integration (`package.json`)

**Purpose**: Registers the file icon theme with VSCode

**Contribution Point**:
```json
{
  "contributes": {
    "iconThemes": [
      {
        "id": "kiroween-file-icons",
        "label": "Kiroween File Icons",
        "path": "./file-icons/file-icon-theme.json"
      }
    ]
  }
}
```

## Data Models

### Icon Definition

```typescript
interface IconDefinition {
  iconPath: string;  // Relative path to SVG file
}
```

### Icon Theme Configuration

```typescript
interface FileIconTheme {
  $schema: string;  // VSCode icon theme schema URL
  iconDefinitions: {
    [iconId: string]: IconDefinition;
  };
  fileExtensions?: {
    [extension: string]: string;  // Maps extension to iconId
  };
  fileNames?: {
    [fileName: string]: string;  // Maps specific filenames to iconId
  };
  folder?: string;  // Icon ID for closed folders
  folderExpanded?: string;  // Icon ID for open folders
  folderNames?: {
    [folderName: string]: string;  // Maps specific folder names to iconId
  };
  folderNamesExpanded?: {
    [folderName: string]: string;  // Maps specific expanded folder names to iconId
  };
}
```

### SVG Icon Structure

```typescript
interface SVGIcon {
  viewBox: "0 0 24 24";
  xmlns: "http://www.w3.org/2000/svg";
  elements: SVGElement[];  // Path, circle, rect, etc.
}
```

## Corr
ectness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: All icons use consistent viewBox dimensions

*For any* SVG icon file in the icon theme, the viewBox attribute should be exactly "0 0 24 24"

**Validates: Requirements 1.2, 2.2, 3.2, 4.2, 5.3, 6.2**

**Rationale**: This property ensures visual consistency across all icons. By verifying that every SVG file uses the same coordinate system, we guarantee that icons will render at the same size and scale properly in the file explorer. This is more comprehensive than testing individual icons separately.

### Property 2: All icons follow monochrome stroke-based styling

*For any* SVG icon file in the icon theme, the icon should use stroke-based design without color fills (fill="none" or no fill attribute, and no color attributes other than currentColor)

**Validates: Requirements 6.1, 6.3**

**Rationale**: This property ensures the Halloween aesthetic remains consistent and that icons adapt to VSCode's theme colors. By checking all icons at once, we verify the entire icon set maintains the minimal, monochrome design principle.

### Property 3: Configuration integrity - all mappings reference valid icons

*For any* file extension or folder mapping in the icon theme configuration, the referenced icon ID should exist in iconDefinitions and point to an existing SVG file in the icons directory

**Validates: Requirements 7.3, 8.3**

**Rationale**: This property ensures there are no broken references in the configuration. It verifies that every mapped file type has a corresponding icon definition and that all icon paths point to actual files, preventing runtime errors when VSCode tries to load icons.

### Property 4: Configuration follows VSCode schema

The icon theme configuration file should be valid JSON and reference the VSCode file icon theme schema

**Validates: Requirements 8.1, 8.4**

**Rationale**: This ensures the configuration is parseable and follows VSCode's expected structure, allowing the theme to load correctly.

### Example Tests

The following specific examples should be verified to ensure correct implementation:

**Example 1: JavaScript file mapping**
- The configuration should map the "js" extension to an icon definition
- That icon definition should point to a pumpkin-themed SVG file
**Validates: Requirements 1.1**

**Example 2: TypeScript file mapping**
- The configuration should map the "ts" extension to an icon definition
- That icon definition should point to a skull-themed SVG file
**Validates: Requirements 2.1**

**Example 3: JSON file mapping**
- The configuration should map the "json" extension to an icon definition
- That icon definition should point to a ghost-themed SVG file
**Validates: Requirements 3.1**

**Example 4: Markdown file mapping**
- The configuration should map the "md" extension to an icon definition
- That icon definition should point to a scroll or book-themed SVG file
**Validates: Requirements 4.1**

**Example 5: Folder icon mappings**
- The configuration should define a "folder" property pointing to a closed coffin icon
- The configuration should define a "folderExpanded" property pointing to an open coffin icon
**Validates: Requirements 5.1, 5.2**

**Example 6: Extension manifest registration**
- The package.json should contain an iconThemes contribution point
- The contribution should reference the file-icon-theme.json file
**Validates: Requirements 7.1, 7.2**

## Error Handling

### Invalid SVG Files

**Scenario**: An SVG file is malformed or cannot be parsed

**Handling**:
- VSCode will fail to load the icon and may show a default icon or no icon
- Prevention: Validate SVG files during development using XML parsers
- Detection: Manual testing in VSCode extension development host

### Missing Icon Files

**Scenario**: Configuration references an icon file that doesn't exist

**Handling**:
- VSCode will fail to load the icon silently
- Prevention: Property-based test verifying all referenced files exist
- Detection: Automated tests checking file paths

### Invalid Configuration JSON

**Scenario**: The file-icon-theme.json file contains invalid JSON

**Handling**:
- VSCode will fail to load the entire icon theme
- Prevention: JSON schema validation during development
- Detection: JSON linting and automated tests

### Schema Violations

**Scenario**: Configuration doesn't follow VSCode's icon theme schema

**Handling**:
- VSCode may ignore invalid properties or fail to load the theme
- Prevention: Use $schema property and validate against VSCode's schema
- Detection: Schema validation tools and manual testing

### Unmapped File Types

**Scenario**: A file type has no custom icon mapping

**Handling**:
- VSCode falls back to its default icon for that file type
- This is expected behavior and not an error
- No special handling required

## Testing Strategy

### Dual Testing Approach

This feature requires both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, configuration structure, and integration points
- **Property-based tests** verify universal properties that should hold across all icons and mappings
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Framework**: fast-check (JavaScript/Node.js property-based testing library)

**Configuration**: Each property-based test should run a minimum of 100 iterations to ensure thorough coverage of the random input space.

**Test Tagging**: Each property-based test must include a comment explicitly referencing the correctness property from this design document using the format:
```javascript
// Feature: file-icon-theme, Property 1: All icons use consistent viewBox dimensions
```

**Property Tests**:

1. **Property 1 Test: ViewBox Consistency**
   - Read all SVG files from the icons directory
   - Parse each SVG and extract the viewBox attribute
   - Verify each viewBox equals "0 0 24 24"
   - **Validates: Property 1**

2. **Property 2 Test: Monochrome Stroke Styling**
   - Read all SVG files from the icons directory
   - Parse each SVG and check for fill attributes
   - Verify fills are either "none", absent, or use "currentColor"
   - Verify no color attributes are present (except currentColor)
   - **Validates: Property 2**

3. **Property 3 Test: Configuration Integrity**
   - Read the icon theme configuration JSON
   - For each icon ID referenced in fileExtensions, folder, and folderExpanded
   - Verify the icon ID exists in iconDefinitions
   - Verify the iconPath points to an existing file
   - Verify the file is in the icons directory
   - **Validates: Property 3**

4. **Property 4 Test: Schema Compliance**
   - Read the icon theme configuration JSON
   - Verify it's valid JSON
   - Verify the $schema property is present and points to VSCode's icon theme schema
   - Optionally validate against the schema if available
   - **Validates: Property 4**

### Unit Testing

**Framework**: Node.js built-in test runner or Jest

**Unit Tests**:

1. **JavaScript File Mapping Test**
   - Load the configuration
   - Verify "js" extension maps to an icon ID
   - Verify that icon ID points to a pumpkin-related file
   - **Validates: Example 1**

2. **TypeScript File Mapping Test**
   - Load the configuration
   - Verify "ts" extension maps to an icon ID
   - Verify that icon ID points to a skull-related file
   - **Validates: Example 2**

3. **JSON File Mapping Test**
   - Load the configuration
   - Verify "json" extension maps to an icon ID
   - Verify that icon ID points to a ghost-related file
   - **Validates: Example 3**

4. **Markdown File Mapping Test**
   - Load the configuration
   - Verify "md" extension maps to an icon ID
   - Verify that icon ID points to a scroll-related file
   - **Validates: Example 4**

5. **Folder Icon Mapping Test**
   - Load the configuration
   - Verify "folder" property exists and maps to a coffin icon
   - Verify "folderExpanded" property exists and maps to an open coffin icon
   - **Validates: Example 5**

6. **Extension Manifest Test**
   - Load package.json
   - Verify iconThemes contribution point exists
   - Verify it references the correct file-icon-theme.json path
   - **Validates: Example 6**

### Manual Testing

Some aspects require manual verification in VSCode:

1. **Visual Appearance**: Icons look appropriate and match the Halloween theme
2. **Icon Recognition**: Icons are recognizable as their intended symbols
3. **Theme Integration**: Icons work well with the Kiroween color theme
4. **User Experience**: Icons display correctly in the file explorer

**Testing Process**:
1. Press F5 in VSCode to launch Extension Development Host
2. Open the Command Palette (Ctrl+Shift+P)
3. Select "Preferences: File Icon Theme"
4. Choose "Kiroween File Icons"
5. Verify icons appear correctly for different file types
6. Test folder expand/collapse behavior

## Implementation Notes

### SVG Design Guidelines

When creating the Halloween-themed icons:

1. **Pumpkin (JavaScript)**: Simple jack-o'-lantern face with triangular eyes and nose, curved smile
2. **Skull (TypeScript)**: Skull outline with eye sockets and nasal cavity, minimal detail
3. **Ghost (JSON)**: Classic ghost shape with wavy bottom edge and simple eyes
4. **Scroll (Markdown)**: Rolled scroll or open book with visible lines
5. **Coffin Closed**: Hexagonal coffin shape, closed
6. **Coffin Open**: Same coffin shape with lid slightly open or separated

### VSCode Icon Theme API

The icon theme follows VSCode's declarative API:
- No JavaScript code execution required
- Pure JSON configuration with SVG assets
- VSCode handles all rendering and application logic
- Theme can be activated/deactivated by users through settings

### File Organization

```
file-icons/
├── file-icon-theme.json    # Main configuration
└── icons/
    ├── pumpkin.svg         # JavaScript files
    ├── skull.svg           # TypeScript files
    ├── ghost.svg           # JSON files
    ├── scroll.svg          # Markdown files
    ├── coffin-closed.svg   # Folders
    └── coffin-open.svg     # Expanded folders
```

### Extension Manifest Integration

The package.json contribution:
```json
{
  "contributes": {
    "iconThemes": [
      {
        "id": "kiroween-file-icons",
        "label": "Kiroween File Icons",
        "path": "./file-icons/file-icon-theme.json"
      }
    ]
  }
}
```

## Future Enhancements

Potential additions for future iterations:

1. **Additional File Types**: CSS, HTML, Python, etc.
2. **Language-Specific Icons**: React (.jsx), Vue (.vue), etc.
3. **Special Folder Names**: node_modules, .git, src, etc.
4. **File Name Patterns**: README.md, package.json, etc.
5. **Alternative Icon Styles**: Filled versions or different Halloween symbols
6. **Icon Variants**: Different intensity levels or detail variations

These enhancements can be added incrementally without modifying the core architecture.
