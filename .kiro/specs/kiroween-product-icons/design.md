# Design Document: Kiroween Product Icons

## Overview

The Kiroween Product Icons feature will create a complete Halloween-themed icon set for VS Code's product icons. This design focuses on generating 10 distinct SVG icons with consistent styling, integrating them into the VS Code extension through a product-icon-theme.json configuration file, and ensuring proper registration in the extension's package.json.

The implementation will be purely declarative - creating static SVG files and JSON configuration - with no runtime code required. The icons will use stroke-based designs for clarity at small sizes and leverage VS Code's `currentColor` mechanism for dynamic theming.

## Architecture

### Component Structure

```
product-icons/
├── icons/
│   ├── pumpkin.svg
│   ├── eyeball.svg
│   ├── dead-tree-branch.svg
│   ├── lightning-bolt.svg
│   ├── witch-hat.svg
│   ├── cauldron.svg
│   ├── coffin.svg
│   ├── skull.svg
│   └── haunted-eye.svg
└── product-icon-theme.json
```

### Integration Points

1. **VS Code Extension System**: The product icon theme is registered via the `contributes.productIconThemes` contribution point in package.json
2. **Theme Selector**: Users activate the icon theme through VS Code's theme picker (Command Palette → "Preferences: Product Icon Theme")
3. **Icon Resolution**: VS Code maps icon identifiers (e.g., `explorer-view-icon`) to SVG files via the product-icon-theme.json manifest

## Components and Interfaces

### SVG Icon Files

Each icon is a standalone SVG file with the following structure:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Icon-specific paths -->
</svg>
```

**Key Attributes:**
- `viewBox="0 0 24 24"`: Establishes a 24x24 coordinate system
- `fill="none"`: Ensures no fills are applied
- `stroke="currentColor"`: Allows VS Code to apply theme colors dynamically
- `stroke-width="2"`: Consistent 2px stroke across all icons
- `stroke-linecap="round"` and `stroke-linejoin="round"`: Smooth line endings and joins

### Product Icon Theme JSON

The product-icon-theme.json file follows VS Code's schema:

```json
{
  "iconDefinitions": {
    "pumpkin": {
      "iconPath": "./icons/pumpkin.svg"
    },
    "eyeball": {
      "iconPath": "./icons/eyeball.svg"
    }
    // ... additional icon definitions
  },
  "explorer-view-icon": "pumpkin",
  "search-view-icon": "eyeball",
  "scm-view-icon": "dead-tree-branch",
  "debug-view-icon": "lightning-bolt",
  "extensions-view-icon": "witch-hat",
  "settings-view-icon": "cauldron",
  "terminal-view-icon": "coffin",
  "error-icon": "skull",
  "info-icon": "haunted-eye",
  "warning-icon": "pumpkin"
}
```

**Structure:**
- `iconDefinitions`: Maps icon IDs to SVG file paths
- Icon identifier mappings: Maps VS Code's product icon identifiers to icon definition IDs

### Package.json Contribution

The extension's package.json must include:

```json
{
  "contributes": {
    "productIconThemes": [
      {
        "id": "kiroween-icons",
        "label": "Kiroween Icons",
        "path": "./product-icons/product-icon-theme.json"
      }
    ]
  }
}
```

## Data Models

### Icon Specification

Each icon has the following properties:

| Property | Type | Description |
|----------|------|-------------|
| name | string | Icon identifier (e.g., "pumpkin") |
| vsCodeId | string | VS Code product icon identifier (e.g., "explorer-view-icon") |
| theme | "pumpkinOrange" \| "fogGrey" | Color theme assignment |
| svgPath | string | Path elements defining the icon shape |

### Icon Mappings

| VS Code Identifier | Icon Name | Theme Color | Description |
|-------------------|-----------|-------------|-------------|
| explorer-view-icon | pumpkin | pumpkinOrange | File explorer sidebar |
| search-view-icon | eyeball | fogGrey | Search sidebar |
| scm-view-icon | dead-tree-branch | fogGrey | Source control sidebar |
| debug-view-icon | lightning-bolt | pumpkinOrange | Debug sidebar |
| extensions-view-icon | witch-hat | pumpkinOrange | Extensions sidebar |
| settings-view-icon | cauldron | fogGrey | Settings gear icon |
| terminal-view-icon | coffin | fogGrey | Terminal panel |
| error-icon | skull | fogGrey | Error indicators |
| info-icon | haunted-eye | fogGrey | Info indicators |
| warning-icon | pumpkin | pumpkinOrange | Warning indicators |

## Correctness Properties


*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: SVG Structure Compliance

*For any* icon SVG file in the product-icons/icons/ directory, the file should have stroke="currentColor", fill="none", no gradient elements, and use the SVG namespace.

**Validates: Requirements 2.1, 2.3, 2.5**

### Property 2: Consistent Stroke Width

*For any* icon SVG file in the product-icons/icons/ directory, the root SVG element should have stroke-width="2".

**Validates: Requirements 2.2**

### Property 3: Standard ViewBox

*For any* icon SVG file in the product-icons/icons/ directory, the root SVG element should have viewBox="0 0 24 24".

**Validates: Requirements 2.4**

### Property 4: Icon Reference Integrity

*For any* icon path referenced in the iconDefinitions section of product-icon-theme.json, the corresponding SVG file should exist at that path.

**Validates: Requirements 4.5**

### Examples to Verify

The following are concrete examples that should be verified:

**Example 1: Complete Icon Set**
- All 10 required icons exist and are properly mapped in product-icon-theme.json
- **Validates: Requirements 1.1, 3.1-3.10**

**Example 2: Valid Theme JSON Structure**
- The product-icon-theme.json file is valid JSON with an iconDefinitions object and all required VS Code icon identifier mappings
- **Validates: Requirements 1.4, 4.2**

**Example 3: Correct Directory Structure**
- All SVG files exist in product-icons/icons/ directory
- **Validates: Requirements 4.1**

**Example 4: Package.json Configuration**
- The package.json includes a valid productIconThemes contribution point
- **Validates: Requirements 4.4**

## Error Handling

Since this feature consists entirely of static asset generation (SVG files and JSON configuration), there is no runtime error handling required. However, validation during development should address:

1. **Malformed SVG**: Ensure all SVG files are well-formed XML with proper namespace declarations
2. **Invalid JSON**: Ensure product-icon-theme.json is valid JSON that can be parsed
3. **Missing Files**: Ensure all icon paths referenced in JSON resolve to existing files
4. **Invalid Paths**: Ensure all file paths use forward slashes and are relative to the theme JSON file

These validations should be performed through testing rather than runtime error handling.

## Testing Strategy

### Unit Testing

Unit tests will verify the static assets meet specifications:

1. **JSON Structure Tests**
   - Parse product-icon-theme.json and verify it contains all required properties
   - Verify all 10 VS Code icon identifiers are mapped
   - Verify iconDefinitions contains entries for all unique icons

2. **File Existence Tests**
   - Verify all expected SVG files exist in product-icons/icons/
   - Verify product-icon-theme.json exists
   - Verify package.json contains productIconThemes contribution

3. **Icon Mapping Tests**
   - Verify each VS Code icon identifier maps to a valid icon definition
   - Verify each icon definition references an existing SVG file

### Property-Based Testing

Property-based tests will verify universal properties across all icons using a testing library appropriate for the implementation language (e.g., fast-check for JavaScript/TypeScript, QuickCheck for Haskell, Hypothesis for Python).

**Testing Framework**: We will use **fast-check** for JavaScript/TypeScript property-based testing.

**Test Configuration**: Each property-based test should run a minimum of 100 iterations.

1. **Property Test 1: SVG Structure Compliance**
   - **Feature: kiroween-product-icons, Property 1: SVG Structure Compliance**
   - Generator: All SVG files in product-icons/icons/
   - Property: Each file should parse as valid XML with stroke="currentColor", fill="none", no gradient elements
   - Validates: Requirements 2.1, 2.3, 2.5

2. **Property Test 2: Consistent Stroke Width**
   - **Feature: kiroween-product-icons, Property 2: Consistent Stroke Width**
   - Generator: All SVG files in product-icons/icons/
   - Property: Each file's root SVG element should have stroke-width="2"
   - Validates: Requirements 2.2

3. **Property Test 3: Standard ViewBox**
   - **Feature: kiroween-product-icons, Property 3: Standard ViewBox**
   - Generator: All SVG files in product-icons/icons/
   - Property: Each file's root SVG element should have viewBox="0 0 24 24"
   - Validates: Requirements 2.4

4. **Property Test 4: Icon Reference Integrity**
   - **Feature: kiroween-product-icons, Property 4: Icon Reference Integrity**
   - Generator: All icon paths from iconDefinitions in product-icon-theme.json
   - Property: Each referenced file path should resolve to an existing file
   - Validates: Requirements 4.5

### Integration Testing

Since this is a declarative VS Code extension with no runtime code, integration testing will focus on:

1. **Extension Loading**: Manually verify the extension loads in VS Code without errors
2. **Theme Activation**: Manually verify the icon theme appears in VS Code's theme selector
3. **Icon Display**: Manually verify icons display correctly when the theme is activated

### Manual Testing Checklist

- [ ] Install extension in VS Code
- [ ] Open theme selector (Command Palette → "Preferences: Product Icon Theme")
- [ ] Verify "Kiroween Icons" appears in the list
- [ ] Activate the theme
- [ ] Verify all sidebar icons display Halloween-themed alternatives
- [ ] Verify error, warning, and info icons display correctly
- [ ] Test at different zoom levels to ensure readability

## Implementation Notes

### SVG Design Guidelines

When creating the icon SVG paths:

1. **Simplicity**: Keep paths simple with minimal anchor points for clarity at small sizes
2. **Centering**: Design icons to be visually centered within the 24x24 viewBox
3. **Stroke-based**: Use only strokes, no fills, to maintain the monochrome aesthetic
4. **Recognizability**: Ensure each icon is immediately recognizable as its intended Halloween theme

### Icon Design Specifications

Each icon should be designed with these Halloween themes in mind:

- **Pumpkin**: Classic jack-o'-lantern with triangular eyes and jagged mouth
- **Eyeball**: Single eye with iris and pupil, possibly with veins
- **Dead Tree Branch**: Bare, twisted branch with sharp angles
- **Lightning Bolt**: Zigzag bolt shape
- **Witch Hat**: Pointed hat with wide brim
- **Cauldron**: Round pot with handles and bubbling contents
- **Coffin**: Traditional coffin shape with cross or decorative element
- **Skull**: Simplified skull with eye sockets and nasal cavity
- **Haunted Eye**: Eye with eerie details, distinct from the regular eyeball

### VS Code Product Icon Identifiers

The following VS Code product icon identifiers must be mapped:

- `explorer-view-icon`: File explorer in activity bar
- `search-view-icon`: Search in activity bar
- `scm-view-icon`: Source control in activity bar
- `debug-view-icon`: Debug in activity bar
- `extensions-view-icon`: Extensions in activity bar
- `settings-view-icon`: Settings gear icon
- `terminal-view-icon`: Terminal panel icon
- `error-icon`: Error severity indicator
- `info-icon`: Info severity indicator
- `warning-icon`: Warning severity indicator

## Dependencies

- **VS Code Extension API**: Version ^1.106.1 (as specified in package.json)
- **SVG 1.1 Specification**: For SVG file format compliance
- **VS Code Product Icon Theme Schema**: For theme JSON structure

## Future Enhancements

Potential future improvements:

1. **Additional Icons**: Expand the icon set to cover more VS Code product icons
2. **Color Variants**: Provide alternative color schemes beyond pumpkinOrange and fogGrey
3. **Animated Icons**: Add subtle animations for hover states (if VS Code supports it)
4. **Icon Customization**: Allow users to configure which Halloween icon maps to which VS Code identifier
