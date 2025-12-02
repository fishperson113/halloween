# Kiroween Background Troubleshooting Guide

## Issue: Background Pattern Not Showing

If you can't see the Halloween background pattern, follow these steps:

### Step 1: Verify the Pattern File

The background pattern should be visible when opened directly:

1. Open `assets/background-pattern.svg` in a web browser
2. You should see Halloween icons (ghosts, pumpkins, skulls, witch hats, eyeballs)
3. If the file won't open, regenerate it:
   ```bash
   node generate-background-pattern.js
   ```

### Step 2: Test the Pattern Display

Open `test-pattern-display.html` in your browser to see:
- Direct SVG display
- Tiled background pattern
- Simulated editor view

If you can see the pattern in the HTML test but not in VSCode, continue to Step 3.

### Step 3: Install Custom CSS Extension

The background requires the "Custom CSS and JS Loader" extension:

1. Open VSCode/Kiro IDE
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Custom CSS and JS Loader"
4. Install the extension by be5invis
5. Restart VSCode

### Step 4: Configure Custom CSS

The Kiroween extension should automatically add the CSS path, but you can verify:

1. Open Settings (Ctrl+,)
2. Search for "custom css imports"
3. You should see an entry like:
   ```json
   {
     "vscode_custom_css.imports": [
       "file:///C:/path/to/halloween/themes/kiroween-background.css"
     ]
   }
   ```

If it's missing, run the command: **"Kiroween: Show Background CSS Path"**

### Step 5: Enable Custom CSS

1. Open Command Palette (Ctrl+Shift+P)
2. Run: **"Enable Custom CSS and JS"**
3. Restart VSCode when prompted

### Step 6: Verify Theme is Active

1. Open Command Palette
2. Run: **"Preferences: Color Theme"**
3. Select **"KiroTheme"**
4. The background should now be visible

## Adjusting Background Visibility

If the background is too subtle or too visible, you can adjust it:

### Method 1: Adjust CSS Opacity

Edit `themes/kiroween-background.css` and change the opacity value:

```css
.monaco-editor .view-lines {
  opacity: 0.05;  /* Change this value */
}
```

- Lower values (0.02-0.03) = more subtle
- Higher values (0.06-0.08) = more visible
- Recommended range: 0.02-0.08

### Method 2: Regenerate Pattern with Different Opacity

Edit `generate-background-pattern.js` and change the opacity in the `createSVGGroup` function:

```javascript
return `  <g transform="${transform}" opacity="0.3">  // Change this value
    ${content}
  </g>`;
```

Then regenerate:
```bash
node generate-background-pattern.js
```

## Common Issues

### Issue: "Extension is not compatible"

**Error:** Extension requires ^1.106.1 but you have 1.103.2

**Solution:** The package.json has been updated to require ^1.103.0. Make sure you have the latest version of the extension.

### Issue: VSCode shows "Unsupported" warning

**Cause:** Custom CSS modifies VSCode's core files

**Solution:** This is expected behavior. The warning is harmless and can be dismissed. Your VSCode installation is not damaged.

### Issue: Background shows but is too dark/light

**Solution:** Adjust the opacity values as described above. The background should be subtle enough to not interfere with code readability.

### Issue: Pattern has visible seams

**Cause:** The SVG viewBox doesn't match the CSS background-size

**Solution:** Ensure both are set to 400x400:
- SVG: `viewBox="0 0 400 400"`
- CSS: `background-size: 400px 400px;`

### Issue: Background doesn't update after changes

**Solution:**
1. Disable Custom CSS: Run "Disable Custom CSS and JS"
2. Make your changes
3. Enable Custom CSS: Run "Enable Custom CSS and JS"
4. Restart VSCode

## Testing Checklist

Use this checklist to verify everything is working:

- [ ] `assets/background-pattern.svg` exists and can be opened
- [ ] `test-pattern-display.html` shows the pattern correctly
- [ ] Custom CSS and JS Loader extension is installed
- [ ] CSS path is in `vscode_custom_css.imports` setting
- [ ] Custom CSS is enabled (run the enable command)
- [ ] KiroTheme color theme is active
- [ ] VSCode has been restarted after enabling Custom CSS
- [ ] Background is visible in the editor (even if subtle)

## Manual Verification

To manually verify the background is working:

1. Open Developer Tools (Help > Toggle Developer Tools)
2. In the Console, run:
   ```javascript
   document.querySelector('.monaco-editor .view-lines').style.backgroundImage
   ```
3. You should see: `url("file:///path/to/background-pattern.svg")`

If you see `none` or an error, the CSS hasn't been applied correctly.

## Getting Help

If you've followed all steps and the background still isn't showing:

1. Check the Extension Host output panel for errors
2. Check the Developer Tools console for CSS loading errors
3. Verify file permissions on the CSS and SVG files
4. Try the fallback method in `inject-background.js`

## Current Configuration

**Pattern Settings:**
- Size: 400x400px
- Elements: 16 Halloween icons per tile
- SVG Opacity: 0.3 (30%)
- CSS Opacity: 0.05 (5%)
- Effective Opacity: ~1.5%
- Colors: Kiroween palette (goldenYellow, burntOrange, hotPink, deepPurple, darkPurple, fogGrey)

**CSS Settings:**
- Target: `.monaco-editor .view-lines`
- Repeat: repeat
- Size: 400px 400px
- Position: center
- Attachment: local
- Blend mode: lighten

## Quick Fix Commands

```bash
# Regenerate pattern
node generate-background-pattern.js

# Test pattern display
start test-pattern-display.html

# Show CSS path
# Run in VSCode: "Kiroween: Show Background CSS Path"

# Toggle background
# Run in VSCode: "Kiroween: Toggle Halloween Background"
```
