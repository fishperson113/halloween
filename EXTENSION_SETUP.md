# Kiroween Extension Setup Guide

This guide explains how to test and use the Kiroween extension with the Halloween background feature.

## Testing the Extension in Development

### Method 1: Extension Development Host (Recommended)

1. Open this project in VSCode
2. Press `F5` to launch the Extension Development Host
3. In the new window, the Kiroween extension will be active
4. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
5. Select "Preferences: Color Theme" and choose "KiroTheme"
6. You should see a notification about the background feature

### Method 2: Install as VSIX

1. Package the extension:
   ```bash
   npm install -g vsce
   vsce package
   ```
2. Install the generated `.vsix` file:
   - Open VSCode
   - Go to Extensions view
   - Click "..." menu → "Install from VSIX..."
   - Select the generated `.vsix` file

## Enabling the Halloween Background

The extension provides commands to help you set up the background:

### Step 1: Get the CSS Path

1. Open Command Palette (`Ctrl+Shift+P`)
2. Run: **"Kiroween: Show Background CSS Path"**
3. The CSS file path will be copied to your clipboard

### Step 2: Install Custom CSS Extension

1. Install the "Custom CSS and JS Loader" extension (ID: `be-5.vscode-custom-css`)
2. This extension allows custom CSS to be injected into VSCode

### Step 3: Configure Custom CSS

1. Open your VSCode settings (`Ctrl+,` or `Cmd+,`)
2. Search for "custom css imports"
3. Click "Edit in settings.json"
4. Add the CSS path from your clipboard:
   ```json
   {
     "vscode_custom_css.imports": [
       "file:///path/to/kiroween/themes/kiroween-background.css"
     ]
   }
   ```

### Step 4: Enable Custom CSS

1. Open Command Palette
2. Run: **"Enable Custom CSS and JS"**
3. Restart VSCode

## Extension Commands

The extension provides these commands:

- **Kiroween: Show Background CSS Path** - Copies the CSS file path to clipboard
- **Kiroween: Toggle Halloween Background** - Enable/disable the background feature

## Configuration Options

You can configure the extension through VSCode settings:

- `kiroween.background.enabled` (boolean, default: true)
  - Enable or disable the Halloween background pattern
  - When disabled, the extension won't show background notifications

## Troubleshooting

### Background Not Showing

1. Verify the CSS file path is correct and absolute
2. Ensure "Custom CSS and JS Loader" is installed and enabled
3. Check that you ran "Enable Custom CSS and JS" command
4. Restart VSCode completely
5. Check Developer Tools console for errors (Help → Toggle Developer Tools)

### Extension Not Activating

1. Check that `extension.js` exists in the extension root
2. Verify `package.json` has the correct `main` field
3. Look for errors in the Extension Host output panel
4. Try reloading the Extension Development Host window

### Missing Assets Error

If you see a warning about missing assets:

1. Verify `assets/background-pattern.svg` exists
2. Verify `themes/kiroween-background.css` exists
3. Run the background pattern generator if needed:
   ```bash
   node generate-background-pattern.js
   ```

### Disabling the Background

If you want to disable the background:

**Option 1: Use the command**
- Open Command Palette
- Run: "Kiroween: Toggle Halloween Background"

**Option 2: Use settings**
- Open Settings (`Ctrl+,`)
- Search for "kiroween.background.enabled"
- Uncheck the box

**Option 3: Remove Custom CSS**
- Remove the CSS path from `vscode_custom_css.imports` in settings.json
- Run "Disable Custom CSS and JS" command
- Restart VSCode

## Testing Checklist

Use this checklist to verify the extension works correctly:

- [ ] Extension activates on startup (check console logs)
- [ ] Commands appear in Command Palette
- [ ] "Show Background CSS Path" copies path to clipboard
- [ ] "Toggle Background" changes the configuration setting
- [ ] Configuration setting appears in VSCode settings
- [ ] Asset validation detects missing files
- [ ] Error messages display when assets are missing
- [ ] Theme change detection works
- [ ] Background instructions show when theme is activated
- [ ] Extension deactivates cleanly

## Development Notes

### Extension Architecture

The extension consists of:

1. **extension.js** - Main activation logic
   - Validates assets on activation
   - Registers commands
   - Listens for theme changes
   - Handles configuration changes

2. **package.json** - Extension manifest
   - Defines activation events
   - Registers commands
   - Defines configuration schema

3. **themes/kiroween-background.css** - Background styling
   - Applied via Custom CSS extension
   - Contains opacity and blend mode settings

### Error Handling

The extension handles these edge cases:

- Missing CSS file → Shows warning, disables feature
- Missing pattern file → Shows warning, disables feature
- Invalid paths → Logs error, shows error message
- Configuration disabled → Silently skips activation
- Theme not active → Waits for theme activation

### Logging

The extension logs to the console:

- Activation/deactivation events
- Asset validation results
- Configuration changes
- Theme changes
- Error conditions

View logs in the Extension Host console (Help → Toggle Developer Tools).

## Next Steps

After verifying the extension works:

1. Test with different editor configurations
2. Verify background tiles seamlessly
3. Check contrast ratios with different syntax themes
4. Test performance with large files
5. Package and distribute the extension

## Resources

- [VSCode Extension API](https://code.visualstudio.com/api)
- [Custom CSS and JS Loader](https://marketplace.visualstudio.com/items?itemName=be5invis.vscode-custom-css)
- [Extension Packaging](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
