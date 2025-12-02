# 🎃 Kiroween Background - Quick Setup

## TL;DR - 4 Steps

### 1️⃣ Install Extension
- Open Extensions (Ctrl+Shift+X)
- Search: **"Custom CSS and JS Loader"**
- Install by **be5invis**

### 2️⃣ Add to Settings
Open User Settings JSON (Ctrl+Shift+P → "Open User Settings (JSON)") and add:

```json
{
  "vscode_custom_css.imports": [
    "file:///C:/workspace/VSCodeTheme/halloween/themes/kiroween-background.css"
  ]
}
```

### 3️⃣ Enable Custom CSS
- Command Palette (Ctrl+Shift+P)
- Run: **"Enable Custom CSS and JS"**
- Restart VSCode

### 4️⃣ Activate Theme
- Command Palette (Ctrl+Shift+P)
- Run: **"Preferences: Color Theme"**
- Select: **"KiroTheme"**

## ✅ Done!

The Halloween background should now be visible behind your code!

---

## 🔧 Quick Commands

```bash
# Get CSS path
node inject-background.js

# Full setup guide
node setup-background-manual.js

# Validate SVG pattern
node validate-svg.js

# Test pattern in browser
start test-pattern-display.html
```

## 🆘 Not Working?

1. **Check Custom CSS is installed**: Extensions → Search "Custom CSS"
2. **Verify settings**: Open settings.json and look for `vscode_custom_css.imports`
3. **Enable Custom CSS**: Run the "Enable Custom CSS and JS" command
4. **Restart completely**: Close ALL VSCode windows and reopen
5. **Check console**: Help → Toggle Developer Tools → Console tab

## 📝 Your CSS Path

```
file:///C:/workspace/VSCodeTheme/halloween/themes/kiroween-background.css
```

Copy this path exactly into your settings.json!

## 🎨 Adjust Visibility

Too subtle? Edit `themes/kiroween-background.css` line 33:

```css
opacity: 0.05;  /* Change to 0.08 for more visible */
```

Too visible? Change to `0.02` for more subtle.

---

**Need more help?** See `BACKGROUND_TROUBLESHOOTING.md` for detailed troubleshooting.
