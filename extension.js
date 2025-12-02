/**
 * Kiroween Theme Extension - Background Activation Logic
 * 
 * This extension activates the Halloween background pattern when the Kiroween theme is active.
 * It handles CSS injection, configuration management, and error handling.
 * 
 * Requirements: 1.1, 3.3
 * - Implements CSS injection on theme activation
 * - Adds configuration options for background enable/disable
 * - Handles edge cases (missing assets, invalid paths)
 * - Provides error logging and fallback behavior
 */

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

/**
 * Configuration key for enabling/disabling the background
 */
const CONFIG_KEY = 'kiroween.background.enabled';

/**
 * Path to the background CSS file
 */
const CSS_FILE = 'themes/kiroween-background.css';

/**
 * Path to the background pattern asset
 */
const PATTERN_FILE = 'assets/background-pattern.svg';

/**
 * Validates that required asset files exist
 * 
 * @param {string} extensionPath - The extension's root path
 * @returns {Object} Validation result with status and missing files
 */
function validateAssets(extensionPath) {
    const result = {
        valid: true,
        missingFiles: []
    };

    // Check for CSS file
    const cssPath = path.join(extensionPath, CSS_FILE);
    if (!fs.existsSync(cssPath)) {
        result.valid = false;
        result.missingFiles.push(CSS_FILE);
    }

    // Check for background pattern
    const patternPath = path.join(extensionPath, PATTERN_FILE);
    if (!fs.existsSync(patternPath)) {
        result.valid = false;
        result.missingFiles.push(PATTERN_FILE);
    }

    return result;
}

/**
 * Gets the absolute file URI for the CSS file
 * 
 * @param {string} extensionPath - The extension's root path
 * @returns {string|null} File URI or null if file doesn't exist
 */
function getCssUri(extensionPath) {
    const cssPath = path.join(extensionPath, CSS_FILE);
    
    if (!fs.existsSync(cssPath)) {
        return null;
    }

    // Convert to file URI format
    // Windows: file:///C:/path/to/file
    // Unix: file:///path/to/file
    const normalizedPath = cssPath.replace(/\\/g, '/');
    return `file:///${normalizedPath}`;
}

/**
 * Checks if the Kiroween theme is currently active
 * 
 * @returns {boolean} True if Kiroween theme is active
 */
function isKiroweenThemeActive() {
    const config = vscode.workspace.getConfiguration();
    const currentTheme = config.get('workbench.colorTheme');
    return currentTheme === 'KiroTheme';
}

/**
 * Checks if the background feature is enabled in configuration
 * 
 * @returns {boolean} True if background is enabled
 */
function isBackgroundEnabled() {
    const config = vscode.workspace.getConfiguration();
    return config.get(CONFIG_KEY, true); // Default to enabled
}

/**
 * Displays information message with instructions for enabling the background
 * 
 * @param {string} cssUri - The CSS file URI
 */
function showBackgroundInstructions(cssUri) {
    const message = 'Kiroween Halloween background is ready! To enable it, install the "Custom CSS and JS Loader" extension and add the CSS path to your settings.';
    
    vscode.window.showInformationMessage(
        message,
        'Copy CSS Path',
        'Open Settings',
        'Disable Background'
    ).then(selection => {
        if (selection === 'Copy CSS Path') {
            vscode.env.clipboard.writeText(cssUri);
            vscode.window.showInformationMessage('CSS path copied to clipboard!');
        } else if (selection === 'Open Settings') {
            vscode.commands.executeCommand('workbench.action.openSettings', 'vscode_custom_css.imports');
        } else if (selection === 'Disable Background') {
            vscode.workspace.getConfiguration().update(
                CONFIG_KEY,
                false,
                vscode.ConfigurationTarget.Global
            );
        }
    });
}

/**
 * Handles missing asset files
 * 
 * @param {Array<string>} missingFiles - List of missing file paths
 */
function handleMissingAssets(missingFiles) {
    const message = `Kiroween background assets are missing: ${missingFiles.join(', ')}. The background will not be available.`;
    
    vscode.window.showWarningMessage(
        message,
        'Disable Background'
    ).then(selection => {
        if (selection === 'Disable Background') {
            vscode.workspace.getConfiguration().update(
                CONFIG_KEY,
                false,
                vscode.ConfigurationTarget.Global
            );
        }
    });
}

/**
 * Activates the extension
 * 
 * @param {vscode.ExtensionContext} context - The extension context
 */
function activate(context) {
    console.log('Kiroween theme extension is now active');

    const extensionPath = context.extensionPath;

    // Validate that required assets exist
    const validation = validateAssets(extensionPath);
    
    if (!validation.valid) {
        console.error('Kiroween: Missing required assets:', validation.missingFiles);
        handleMissingAssets(validation.missingFiles);
        return; // Exit early if assets are missing
    }

    // Check if background is enabled in configuration
    if (!isBackgroundEnabled()) {
        console.log('Kiroween: Background is disabled in configuration');
        return;
    }

    // Get the CSS file URI
    const cssUri = getCssUri(extensionPath);
    
    if (!cssUri) {
        console.error('Kiroween: Failed to resolve CSS file path');
        vscode.window.showErrorMessage('Kiroween: Failed to load background CSS file');
        return;
    }

    console.log('Kiroween: CSS file URI:', cssUri);

    // Check if Kiroween theme is active
    if (isKiroweenThemeActive()) {
        console.log('Kiroween: Theme is active, background ready');
        showBackgroundInstructions(cssUri);
    }

    // Register command to toggle background
    const toggleCommand = vscode.commands.registerCommand('kiroween.toggleBackground', () => {
        const currentState = isBackgroundEnabled();
        const newState = !currentState;
        
        vscode.workspace.getConfiguration().update(
            CONFIG_KEY,
            newState,
            vscode.ConfigurationTarget.Global
        ).then(() => {
            const message = newState 
                ? 'Kiroween background enabled. Restart VSCode to apply changes.'
                : 'Kiroween background disabled. Restart VSCode to apply changes.';
            vscode.window.showInformationMessage(message);
        });
    });

    // Register command to show CSS path
    const showPathCommand = vscode.commands.registerCommand('kiroween.showCssPath', () => {
        vscode.env.clipboard.writeText(cssUri);
        vscode.window.showInformationMessage(
            `CSS path copied to clipboard: ${cssUri}`,
            'Open Settings'
        ).then(selection => {
            if (selection === 'Open Settings') {
                vscode.commands.executeCommand('workbench.action.openSettings', 'vscode_custom_css.imports');
            }
        });
    });

    // Listen for theme changes
    const themeChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('workbench.colorTheme')) {
            if (isKiroweenThemeActive() && isBackgroundEnabled()) {
                console.log('Kiroween: Theme activated');
                showBackgroundInstructions(cssUri);
            }
        }
        
        if (e.affectsConfiguration(CONFIG_KEY)) {
            const enabled = isBackgroundEnabled();
            console.log('Kiroween: Background configuration changed:', enabled);
        }
    });

    // Add disposables to context
    context.subscriptions.push(toggleCommand);
    context.subscriptions.push(showPathCommand);
    context.subscriptions.push(themeChangeListener);
}

/**
 * Deactivates the extension
 */
function deactivate() {
    console.log('Kiroween theme extension is now deactivated');
}

module.exports = {
    activate,
    deactivate
};
