# Kiroween Theme

A Halloween-themed VSCode extension created for the Kiroween Hackathon. Transform your editor with spooky, vibrant colors and custom Halloween icons!

## Features

- **Dark Color Theme**: Halloween-inspired palette with pumpkin orange, witch purple, toxic green, and blood red
- **Custom Product Icons**: Halloween-themed UI icons including pumpkins, eyeballs, skulls, and more
- **High Contrast Design**: Optimized for readability with thematic colors

## Installation

1. Install the extension from the VSCode Marketplace (or install the .vsix file)
2. Open Command Palette (`Ctrl+K Ctrl+T` or `Cmd+K Cmd+T`)
3. Select "Kiroween" color theme
4. Open Command Palette and search for "Preferences: Product Icon Theme"
5. Select "Kiroween Icons"

## Development

### Prerequisites

- Node.js and npm installed
- VSCode or Kiro IDE

### Testing the Extension

Press `F5` in VSCode to launch the Extension Development Host with the theme loaded.

### Icon Font Build Process

The product icons use a custom icon font generated from SVG sources. The font file (`kiroween-icons.ttf`) and mapping file (`icon-mapping.json`) are committed to the repository, so you don't need to rebuild them unless you're modifying the icon designs.

#### Regenerating the Icon Font

If you modify any SVG icons in `shared-icons/`, regenerate the font:

```bash
npm run build:icons
```

This command:
1. Reads all SVG files from `shared-icons/`
2. Converts each SVG to a font glyph
3. Generates `kiroween-icons.ttf` (TrueType font file)
4. Generates `icon-mapping.json` (Unicode code point mappings)

#### Icon Mapping

Each icon is mapped to a Unicode code point in the Private Use Area (U+E001+):

| Icon Name | Font Character | VS Code Usage |
|-----------|----------------|---------------|
| pumpkin | \e001 | Explorer, Warning |
| eyeball | \e002 | Search |
| dead-tree-branch | \e003 | Source Control |
| lightning-bolt | \e004 | Debug |
| witch-hat | \e005 | Extensions |
| cauldron | \e006 | Settings |
| coffin | \e007 | Terminal |
| skull | \e008 | Error |
| haunted-eye | \e009 | Info |

#### Adding New Icons

1. Create an SVG file in `shared-icons/`
   - Use `stroke="currentColor"` for color inheritance
   - Keep designs simple with path-based elements
   - Include a `viewBox` attribute
2. Run `npm run build:icons` to regenerate the font
3. Update `product-icons/product-icon-theme.json`:
   - Add the icon to `iconDefinitions` with its font character from `icon-mapping.json`
   - Map it to VS Code icon identifiers as needed

#### SVG Requirements

For compatibility with the icon font generator, SVG files must:
- Be valid XML with SVG namespace
- Contain path elements (not just shapes)
- Have a viewBox attribute
- Not rely on external resources or complex features

### Project Structure

```
shared-icons/           # Source SVG files (editable, shared between themes)
product-icons/
├── kiroween-icons.ttf  # Generated icon font (committed)
├── icon-mapping.json   # Unicode mappings (committed)
└── product-icon-theme.json  # Theme configuration
```

## Color Palette

- **Pumpkin Orange** (#FF7A18) - Keywords, status bar
- **Witch Purple** (#6A0D83) - Sidebar, line numbers
- **Toxic Green** (#4EF17B) - Strings, selections
- **Blood Red** (#FF2E4C) - Errors, badges
- **Fog Grey** (#C6C6C6) - Foreground text
- **Midnight Black** (#0B0B0F) - Editor background
- **Void Navy** (#1A1A29) - Panels, tabs
- **Haunted Blue** (#3849FF) - Functions, types

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

See LICENSE file for details.

**Enjoy the spooky coding experience!** 🎃👻
