# Kiroween Theme

A Halloween-themed VSCode extension created for the Kiroween Hackathon. Transform your editor with spooky, vibrant colors and custom Halloween icons!

## Features

- **Dark Color Theme**: Halloween-inspired palette with pumpkin orange, witch purple, toxic green, and blood red
- **Custom Product Icons**: Halloween-themed UI icons including pumpkins, eyeballs, skulls, and more
- **Halloween Background Pattern**: Subtle, spooky background overlay with ghosts, pumpkins, and skulls (optional)
- **High Contrast Design**: Optimized for readability with thematic colors

## Installation

1. Install the extension from the VSCode Marketplace (or install the .vsix file)
2. Open Command Palette (`Ctrl+K Ctrl+T` or `Cmd+K Cmd+T`)
3. Select "Kiroween" color theme
4. Open Command Palette and search for "Preferences: Product Icon Theme"
5. Select "Kiroween Icons"

### Optional: Enable Halloween Background

The Kiroween theme includes a subtle Halloween-themed background pattern that displays ghosts, pumpkins, skulls, and other spooky elements behind your code. This feature requires the "Custom CSS and JS Loader" extension.

#### Quick Setup

1. Install the "Custom CSS and JS Loader" extension (be-5.vscode-custom-css)
2. Open Command Palette and run: **"Kiroween: Show Background CSS Path"**
   - This will copy the CSS file path to your clipboard
3. Open your VSCode `settings.json` and add:
   ```json
   {
     "vscode_custom_css.imports": [
       "file:///path/from/clipboard"
     ]
   }
   ```
4. Open Command Palette and run: "Enable Custom CSS and JS"
5. Restart VSCode

#### Configuration Options

The extension provides several commands and settings:

**Commands** (accessible via Command Palette):
- `Kiroween: Show Background CSS Path` - Copy the CSS file path to clipboard
- `Kiroween: Toggle Halloween Background` - Enable/disable the background feature

**Settings**:
- `kiroween.background.enabled` (boolean, default: true) - Enable or disable the Halloween background pattern

To disable the background without uninstalling:
1. Open Settings (Ctrl+,)
2. Search for "kiroween.background.enabled"
3. Uncheck the box

Or use the Command Palette: **"Kiroween: Toggle Halloween Background"**

#### Alternative Setup Methods

**Method 1: Using inject-background.js Helper**

1. Run `node inject-background.js` in the extension directory to get the CSS file path
2. Follow the instructions displayed in the console

**Method 2: Manual CSS Injection**

If you prefer not to use an extension, you can manually inject the CSS:

1. Locate your VSCode installation directory
2. Find the `workbench.html` file (usually in `resources/app/out/vs/code/electron-browser/workbench/`)
3. Add a `<link>` tag to include `themes/kiroween-background.css`
4. Restart VSCode

**Note**: The background is intentionally subtle (5% opacity) to maintain code readability. You can adjust the opacity in `themes/kiroween-background.css` if desired (recommended range: 0.02-0.08).

## Development

### Prerequisites

- Node.js and npm installed
- VSCode or Kiro IDE

### Testing the Extension

Press `F5` in VSCode to launch the Extension Development Host with the theme loaded.

### Icon Font Build Process

The product icons use a custom icon font generated from SVG sources. The font file (`kiroween-icons.ttf`) and mapping file (`icon-mapping.json`) are committed to the repository, so you don't need to rebuild them unless you're modifying the icon designs.

#### Regenerating the Icon Font

If you modify any SVG icons in `assets/`, regenerate the font:

```bash
npm run build:icons
```

This command:
1. Reads all SVG files from `assets/`
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

1. Create an SVG file in `assets/`
   - Use `stroke="currentColor"` for color inheritance
   - Keep designs simple with path-based elements
   - Include a `viewBox` attribute
2. Run `npm run build:icons` to regenerate the font
3. Update `themes/product-icon-theme.json`:
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
assets/                 # Source SVG files and visual assets
├── *.svg              # Icon source files
└── pallete.png        # Color palette reference
themes/
├── KiroTheme-color-theme.json  # Color theme configuration
├── product-icon-theme.json     # Product icon theme configuration
├── kiroween-icons.ttf          # Generated icon font (committed)
├── icon-mapping.json           # Unicode mappings (committed)
├── codepoints.json             # Icon codepoint mappings
├── kiroween-icons.css          # Generated CSS (for reference)
└── kiroween-icons.html         # Generated HTML preview (for reference)
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

## Troubleshooting

### Background Not Showing

If the Halloween background isn't displaying:

1. **Verify CSS file path**: Ensure the path in `settings.json` is absolute and uses forward slashes
2. **Check Custom CSS extension**: Make sure "Custom CSS and JS Loader" is installed and enabled
3. **Run enable command**: Execute "Enable Custom CSS and JS" from the Command Palette
4. **Restart VSCode**: A full restart is required after enabling custom CSS
5. **Check console**: Open Developer Tools (Help > Toggle Developer Tools) and check for CSS loading errors

### Background Too Visible/Distracting

If the background is too prominent:

1. Open `themes/kiroween-background.css`
2. Adjust the `opacity` value (line ~30):
   - Lower values (0.02-0.03) = more subtle
   - Higher values (0.06-0.08) = more visible
3. Save the file and restart VSCode

### Background Pattern Not Tiling Correctly

If you see seams or gaps in the pattern:

1. Verify `background-pattern.svg` exists in the `assets/` directory
2. Check that `background-size` matches the SVG viewBox (400px x 400px)
3. Ensure `background-repeat: repeat` is set in the CSS

### VSCode Shows "Unsupported" Warning

VSCode may show a warning that it's been modified when using Custom CSS:

- This is expected behavior when injecting custom CSS
- The warning is harmless and can be dismissed
- Your VSCode installation is not damaged

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## License

See LICENSE file for details.

**Enjoy the spooky coding experience!** 🎃👻
