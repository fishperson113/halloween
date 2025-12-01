# Requirements Document

## Introduction

This document specifies the requirements for refactoring the Kiroween product icon theme to work correctly in VS Code. The current implementation incorrectly uses direct SVG file paths, which is not supported by VS Code's product icon theme system. Product icon themes in VS Code require either an icon font (TrueType font with icon glyphs) or mapping to VS Code's built-in codicon font. This refactor will convert the existing Halloween-themed SVG icons into a proper icon font and update the theme configuration accordingly.

## Glossary

- **Product Icon Theme**: A VS Code theme that customizes UI icons (not file icons) using icon fonts
- **Icon Font**: A TrueType font (.ttf) where each character glyph is an icon
- **Font Character**: A Unicode code point that maps to a specific glyph in a font
- **Glyph**: A visual representation of a character in a font
- **SVG to Font Conversion**: The process of converting SVG paths into font glyphs
- **icon-font-generator**: An npm package that converts SVG files into icon fonts
- **Codicon**: VS Code's built-in icon font system
- **Font Face**: CSS declaration that defines a custom font for use in web contexts

## Requirements

### Requirement 1

**User Story:** As a VS Code extension developer, I want to convert SVG icons into an icon font, so that the product icon theme works correctly in VS Code.

#### Acceptance Criteria

1. THE system SHALL convert all existing SVG icons into a TrueType font file
2. THE system SHALL assign unique Unicode code points to each icon glyph
3. THE system SHALL generate a font file named kiroween-icons.ttf
4. THE system SHALL place the font file in the product-icons directory
5. WHEN the font is generated THEN THE system SHALL preserve the visual appearance of the original SVG designs

### Requirement 2

**User Story:** As a VS Code extension developer, I want the product-icon-theme.json to reference the icon font correctly, so that VS Code can load and display the icons.

#### Acceptance Criteria

1. THE system SHALL define a fonts array in product-icon-theme.json
2. THE system SHALL specify the font id as "kiroween-icons"
3. THE system SHALL reference the font file path as "./kiroween-icons.ttf"
4. THE system SHALL specify the font format as "truetype"
5. THE system SHALL map each icon definition to its corresponding font character using Unicode escape sequences

### Requirement 3

**User Story:** As a developer, I want a build process to generate the icon font from SVG sources, so that I can update icons and regenerate the font easily.

#### Acceptance Criteria

1. THE system SHALL use icon-font-generator npm package for font generation
2. THE system SHALL provide an npm script to generate the font from SVG files
3. WHEN the build script runs THEN THE system SHALL read all SVG files from product-icons/icons/
4. WHEN the build script runs THEN THE system SHALL output the font file to product-icons/
5. THE system SHALL maintain a mapping file that documents which Unicode code point corresponds to which icon

### Requirement 4

**User Story:** As a VS Code user, I want the Halloween-themed icons to display correctly in the VS Code interface, so that I can enjoy the themed experience.

#### Acceptance Criteria

1. WHEN the product icon theme is activated THEN THE system SHALL display Halloween icons in the activity bar
2. WHEN the product icon theme is activated THEN THE system SHALL display Halloween icons for status indicators
3. THE system SHALL map all 10 VS Code icon identifiers to the appropriate Halloween icon glyphs
4. THE system SHALL ensure icons render clearly at 16x16 pixel size
5. THE system SHALL ensure icons inherit the correct color from VS Code's theme

### Requirement 5

**User Story:** As a developer, I want to maintain the existing SVG source files, so that I can edit icons visually and regenerate the font.

#### Acceptance Criteria

1. THE system SHALL keep all existing SVG files in product-icons/icons/ directory
2. THE system SHALL use SVG files as the source of truth for icon designs
3. WHEN an SVG file is modified THEN THE system SHALL allow regeneration of the font file
4. THE system SHALL document the build process in the project README or documentation
5. THE system SHALL ensure SVG files remain compatible with the font generation tool

### Requirement 6

**User Story:** As a developer, I want proper project structure and configuration, so that the icon font generation integrates smoothly with the extension build process.

#### Acceptance Criteria

1. THE system SHALL add icon-font-generator as a dev dependency in package.json
2. THE system SHALL create a build script in package.json for font generation
3. THE system SHALL update .gitignore to exclude generated font files if they should be regenerated
4. WHEN the extension is packaged THEN THE system SHALL include the generated font file
5. THE system SHALL ensure the font file path in product-icon-theme.json is relative and correct
