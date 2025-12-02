/**
 * Kiroween Theme Extension - Background Activation Logic
 * 
 * This extension activates the Halloween background pattern when the Kiroween theme is active.
 * It automatically injects CSS into VSCode's workbench for seamless background display.
 * 
 * Requirements: 1.1, 3.3
 * - Implements automatic CSS injection on theme activation
 * - Adds configuration options for background enable/disable
 * - Handles edge cases (missing assets, invalid paths)
 * - Provides error logging and fallback behavior
 */

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
 * Gets the background pattern as a data URI
 * 
 * @param {string} extensionPath - The extension's root path
 * @returns {string|null} Data URI or null if file doesn't exist
 */
function getPatternDataUri(extensionPath) {
    try {
        const patternPath = path.join(extensionPath, PATTERN_FILE);
        const patternSvg = fs.readFileSync(patternPath, 'utf8');
        return `data:image/svg+xml;base64,${Buffer.from(patternSvg).toString('base64')}`;
    } catch (error) {
        console.error('Kiroween: Failed to read pattern file:', error);
        return null;
    }
}

/**
 * Injects CSS automatically by updating workspace/user settings
 * This uses VSCode's customization API instead of modifying system files
 * 
 * @param {string} extensionPath - The extension's root path
 * @returns {Promise<boolean>} True if injection was successful
 */
async function injectBackgroundCSS(extensionPath) {
    try {
        // Get pattern as data URI
        const patternDataUri = getPatternDataUri(extensionPath);
        if (!patternDataUri) {
            return false;
        }
        
        // Create CSS with embedded data URI
        const inlineCSS = `.monaco-editor .view-lines {
            background-image: url('${patternDataUri}');
            background-repeat: repeat;
            background-size: 400px 400px;
            background-position: center;
            background-attachment: local;
        }
        .monaco-editor .view-lines::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: inherit;
            opacity: 0.05;
            mix-blend-mode: lighten;
            pointer-events: none;
            z-index: -1;
        }`;
        
        // Try to inject via Custom CSS extension if available
        const config = vscode.workspace.getConfiguration();
        const cssUri = getCssUri(extensionPath);
        
        if (cssUri) {
            const customCssImports = config.get('vscode_custom_css.imports', []);
            
            if (!customCssImports.includes(cssUri)) {
                customCssImports.push(cssUri);
                await config.update(
                    'vscode_custom_css.imports',
                    customCssImports,
                    vscode.ConfigurationTarget.Global
                );
                
                console.log('Kiroween: Added CSS to Custom CSS imports');
                return true;
            }
        }
        
        console.log('Kiroween: Background CSS configured');
        return true;
        
    } catch (error) {
        console.error('Kiroween: Failed to inject CSS:', error);
        return false;
    }
}

/**
 * Removes injected CSS from settings
 * 
 * @returns {Promise<boolean>} True if removal was successful
 */
async function removeBackgroundCSS() {
    try {
        const config = vscode.workspace.getConfiguration();
        const customCssImports = config.get('vscode_custom_css.imports', []);
        
        // Remove any Kiroween CSS paths
        const filtered = customCssImports.filter(path => !path.includes('kiroween-background.css'));
        
        if (filtered.length !== customCssImports.length) {
            await config.update(
                'vscode_custom_css.imports',
                filtered,
                vscode.ConfigurationTarget.Global
            );
            
            console.log('Kiroween: Removed CSS from Custom CSS imports');
            return true;
        }
        
        return false;
        
    } catch (error) {
        console.error('Kiroween: Failed to remove CSS:', error);
        return false;
    }
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
        return;
    }

    // Check if background is enabled in configuration
    if (!isBackgroundEnabled()) {
        console.log('Kiroween: Background is disabled in configuration');
        return;
    }

    // Automatically inject CSS if theme is active
    if (isKiroweenThemeActive()) {
        console.log('Kiroween: Theme is active, injecting background CSS');
        injectBackgroundCSS(extensionPath).then(injected => {
            if (injected) {
                vscode.window.showInformationMessage(
                    'Kiroween Halloween background activated! Install "Custom CSS and JS Loader" extension and restart VSCode to see the effect.',
                    'Install Extension',
                    'Restart Now'
                ).then(selection => {
                    if (selection === 'Install Extension') {
                        vscode.env.openExternal(vscode.Uri.parse('vscode:extension/be5invis.vscode-custom-css'));
                    } else if (selection === 'Restart Now') {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            } else {
                // Fallback to manual method
                const cssUri = getCssUri(extensionPath);
                if (cssUri) {
                    showBackgroundInstructions(cssUri);
                }
            }
        });
    }

    // Register command to toggle background
    const toggleCommand = vscode.commands.registerCommand('kiroween.toggleBackground', () => {
        const currentState = isBackgroundEnabled();
        const newState = !currentState;
        
        if (newState) {
            // Enable: inject CSS
            injectBackgroundCSS(extensionPath).then(injected => {
                if (injected) {
                    vscode.workspace.getConfiguration().update(
                        CONFIG_KEY,
                        true,
                        vscode.ConfigurationTarget.Global
                    ).then(() => {
                        vscode.window.showInformationMessage(
                            'Kiroween background enabled. Restart VSCode to apply changes.',
                            'Restart Now'
                        ).then(selection => {
                            if (selection === 'Restart Now') {
                                vscode.commands.executeCommand('workbench.action.reloadWindow');
                            }
                        });
                    });
                }
            });
        } else {
            // Disable: remove CSS
            removeBackgroundCSS().then(removed => {
                if (removed) {
                    vscode.workspace.getConfiguration().update(
                        CONFIG_KEY,
                        false,
                        vscode.ConfigurationTarget.Global
                    ).then(() => {
                        vscode.window.showInformationMessage(
                            'Kiroween background disabled. Restart VSCode to apply changes.',
                            'Restart Now'
                        ).then(selection => {
                            if (selection === 'Restart Now') {
                                vscode.commands.executeCommand('workbench.action.reloadWindow');
                            }
                        });
                    });
                }
            });
        }
    });

    // Register command to show CSS path (fallback method)
    const showPathCommand = vscode.commands.registerCommand('kiroween.showCssPath', () => {
        const cssUri = getCssUri(extensionPath);
        if (cssUri) {
            vscode.env.clipboard.writeText(cssUri);
            vscode.window.showInformationMessage(
                `CSS path copied to clipboard: ${cssUri}`,
                'Open Settings'
            ).then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('workbench.action.openSettings', 'vscode_custom_css.imports');
                }
            });
        }
    });

    // Listen for theme changes
    const themeChangeListener = vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('workbench.colorTheme')) {
            if (isKiroweenThemeActive() && isBackgroundEnabled()) {
                console.log('Kiroween: Theme activated, injecting background');
                injectBackgroundCSS(extensionPath).then(injected => {
                    if (injected) {
                        vscode.window.showInformationMessage(
                            'Kiroween background ready! Restart VSCode to see the effect.',
                            'Restart Now'
                        ).then(selection => {
                            if (selection === 'Restart Now') {
                                vscode.commands.executeCommand('workbench.action.reloadWindow');
                            }
                        });
                    }
                });
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
