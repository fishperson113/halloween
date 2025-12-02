# Requirements Document

## Introduction

This specification addresses the cleanup and structural correction of the Kiroween VSCode theme extension. The extension must be transformed into a pure theme extension with zero code files, correct folder structure, and no activation errors. The goal is to ensure the extension can be packaged as a valid .vsix file and installed without any "command not found" or activation errors.

## Glossary

- **Extension**: A VSCode extension package that adds functionality or theming to the editor
- **Theme Extension**: A VSCode extension that only provides visual theming (colors, icons) without executable code
- **Product Icons**: UI icons used throughout the VSCode interface (file explorer, toolbar, etc.)
- **Color Theme**: JSON file defining colors for editor UI and syntax highlighting
- **.vsix File**: VSCode extension package format for distribution and installation
- **vsce**: Visual Studio Code Extension CLI tool for packaging extensions
- **Activation Event**: VSCode mechanism that triggers extension code execution
- **Main Entry Point**: JavaScript/TypeScript file specified in package.json that runs when extension activates

## Requirements

### Requirement 1

**User Story:** As a theme extension developer, I want to ensure the package.json contains only theme-related contributions, so that VSCode does not attempt to load any code or commands.

#### Acceptance Criteria

1. WHEN the package.json is validated THEN the Extension SHALL NOT contain a "main" field
2. WHEN the package.json is validated THEN the Extension SHALL NOT contain an "activationEvents" field
3. WHEN the package.json is validated THEN the Extension SHALL NOT contain a "commands" field
4. WHEN the package.json is validated THEN the Extension SHALL contain only "themes" and "productIconThemes" in the contributes section
5. WHEN the package.json is validated THEN the Extension SHALL specify the correct engine version for VSCode compatibility

### Requirement 2

**User Story:** As a theme extension developer, I want to remove all code files and build artifacts, so that the extension package contains only theme definition files.

#### Acceptance Criteria

1. WHEN scanning the project root THEN the Extension SHALL NOT contain any extension.js files
2. WHEN scanning the project root THEN the Extension SHALL NOT contain any extension.ts files
3. WHEN scanning the project root THEN the Extension SHALL NOT contain an out/ directory
4. WHEN scanning the project root THEN the Extension SHALL NOT contain a node_modules/ directory
5. WHEN scanning the project root THEN the Extension SHALL NOT contain a package-lock.json file

### Requirement 3

**User Story:** As a theme extension developer, I want the package.json to correctly reference all theme files in their actual locations, so that VSCode can locate and load all theme assets without errors.

#### Acceptance Criteria

1. WHEN the Extension is loaded THEN the package.json SHALL reference product-icon-theme.json at its actual location in themes/
2. WHEN the Extension is loaded THEN the package.json SHALL correctly reference the color theme file path
3. WHEN the Extension is loaded THEN all referenced paths in package.json SHALL match actual file locations
4. WHEN the Extension is loaded THEN VSCode SHALL successfully locate all theme definition files without path errors
5. WHEN the product icon theme is applied THEN VSCode SHALL successfully load the icon font from the themes/ directory

### Requirement 4

**User Story:** As a theme extension developer, I want an optimized .vscodeignore file, so that unnecessary files are excluded from the extension package and the .vsix file size is minimized.

#### Acceptance Criteria

1. WHEN the Extension is packaged THEN the .vscodeignore SHALL exclude .vscode/ directory
2. WHEN the Extension is packaged THEN the .vscodeignore SHALL exclude .git/ directory
3. WHEN the Extension is packaged THEN the .vscodeignore SHALL exclude .kiro/ directory
4. WHEN the Extension is packaged THEN the .vscodeignore SHALL exclude source SVG files from assets/
5. WHEN the Extension is packaged THEN the .vscodeignore SHALL exclude generated preview files (CSS and HTML)

### Requirement 5

**User Story:** As a theme extension user, I want to install the extension without errors, so that I can immediately use the Kiroween theme in my editor.

#### Acceptance Criteria

1. WHEN the Extension is installed THEN VSCode SHALL NOT display "command not found" errors
2. WHEN the Extension is installed THEN VSCode SHALL NOT display activation errors
3. WHEN the Extension is installed THEN the color theme SHALL appear in the theme picker
4. WHEN the Extension is installed THEN the product icon theme SHALL appear in the icon theme picker
5. WHEN the user selects the theme THEN VSCode SHALL apply all theme colors and icons correctly

### Requirement 6

**User Story:** As a theme extension developer, I want to successfully package the extension using vsce, so that I can distribute the theme to users.

#### Acceptance Criteria

1. WHEN running vsce package THEN the Extension SHALL build without errors
2. WHEN running vsce package THEN the Extension SHALL produce a valid .vsix file
3. WHEN the .vsix file is created THEN the Extension SHALL have a minimal file size containing only necessary assets
4. WHEN the .vsix file is inspected THEN the Extension SHALL contain the correct folder structure
5. WHEN the .vsix file is installed THEN the Extension SHALL function correctly without any runtime errors
