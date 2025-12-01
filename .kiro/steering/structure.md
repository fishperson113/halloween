# Project Structure

## Root Files

- `package.json` - Extension manifest with metadata and contribution points
- `README.md` - Extension documentation
- `CHANGELOG.md` - Version history (follows Keep a Changelog format)
- `.gitignore` / `.gitattributes` - Git configuration
- `.vscodeignore` - Files to exclude from extension package

## Directories

### `/themes`
Contains all theme definitions and generated assets.
- `KiroTheme-color-theme.json` - Complete color theme with UI colors and token colors
- `file-icon-theme.json` - File type icon mappings
- `product-icon-theme.json` - Product/UI icon mappings
- `kiroween-icons.ttf` - Generated icon font file
- `icon-mapping.json` - Icon to Unicode codepoint mappings
- `codepoints.json` - Icon codepoint definitions
- `kiroween-icons.css` - Generated CSS (for reference)
- `kiroween-icons.html` - Generated HTML preview (for reference)

### `/assets`
Visual assets and icon source files.
- `*.svg` - Source SVG files for icon generation
- `pallete.png` - Color palette reference

### `/.vscode`
VSCode workspace settings.

### `/.kiro`
Kiro-specific configuration and specifications.
- `/steering` - AI assistant guidance documents
- `/specs` - Feature specifications and implementation tasks
- `/settings` - Kiro settings (e.g., MCP configuration)

## File Naming Conventions

- Theme files: kebab-case with descriptive suffixes (e.g., `KiroTheme-color-theme.json`)
- Configuration files: lowercase with standard names (e.g., `package.json`)
- Documentation: UPPERCASE for root-level docs (e.g., `README.md`, `CHANGELOG.md`)

## Theme File Structure

All theme JSON files follow VSCode's schema:
- `$schema` property for validation
- Structured sections for different UI components
- Hex color codes with optional alpha channel
- TextMate scope selectors for syntax highlighting
