# Project Structure

## Root Files

- `package.json` - Extension manifest with metadata and contribution points
- `README.md` - Extension documentation
- `CHANGELOG.md` - Version history (follows Keep a Changelog format)
- `.gitignore` / `.gitattributes` - Git configuration
- `.vscodeignore` - Files to exclude from extension package

## Directories

### `/themes`
Contains the main color theme definition.
- `KiroTheme-color-theme.json` - Complete theme with UI colors and token colors

### `/file-icons`
File icon theme (in development).
- `file-icon-theme.json` - File type icon mappings
- `/icons` - Icon assets

### `/product-icons`
Product/UI icon theme (in development).
- `product-icon-theme.json` - UI icon mappings
- `/icons` - Icon assets
- `spec.md` - Feature specification
- `steering.md` - Development guidelines

### `/assets`
Visual assets and documentation.
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
