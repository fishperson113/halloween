# Technology Stack

## Extension Type

VSCode Theme Extension (compatible with Kiro IDE)

## Requirements

- VSCode Engine: ^1.106.1
- Category: Themes

## Project Structure

Standard VSCode extension structure with JSON-based theme definitions.

## Key Technologies

- JSON/JSONC for theme configuration
- VSCode Extension API
- TextMate grammar scopes for syntax highlighting

## Theme Components

1. **Color Theme** (`themes/KiroTheme-color-theme.json`)
   - UI colors (editor, sidebar, status bar, etc.)
   - Token colors (syntax highlighting)
   - Based on `hc-black` UI theme

2. **File Icons** (`file-icons/file-icon-theme.json`)
   - Custom file type icons (in development)

3. **Product Icons** (`product-icons/product-icon-theme.json`)
   - Custom UI icons (in development)

## Common Commands

Since this is a theme extension, there are no build or compile steps. The extension is ready to use as-is.

### Testing
- Press F5 in VSCode to launch Extension Development Host
- The theme will be available in the Command Palette (Ctrl+K Ctrl+T)

### Packaging
```bash
vsce package
```

### Installation
- Install the .vsix file via Extensions view
- Or publish to VSCode Marketplace
