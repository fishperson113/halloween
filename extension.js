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
    return config.get(CONFIG_KEY, true);
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
        'Install Extension',
        'Disable Background'
    ).then(selection => {
        if (selection === 'Copy CSS Path') {
            vscode.env.clipboard.writeText(cssUri);
            vscode.window.showInformationMessage('CSS path copied to clipboard!');
        } else if (selection === 'Install Extension') {
            vscode.env.openExternal(vscode.Uri.parse('vscode:extension/be5invis.vscode-custom-css'));
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
 * 
 * @param {string} extensionPath - The extension's root path
 * @returns {Promise<boolean>} True if injection was successful
 */
async function injectBackgroundCSS(extensionPath) {
    try {
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
                const cssUri = getCssUri(extensionPath);
                if (cssUri) {
                    showBackgroundInstructions(cssUri);
                }
            }
        });
    }

    // Register command to activate Kiroween theme
    const activateCommand = vscode.commands.registerCommand('kiroween.activate', async () => {
        const config = vscode.workspace.getConfiguration();
        
        // Activate color theme
        await config.update('workbench.colorTheme', 'KiroTheme', vscode.ConfigurationTarget.Global);
        
        // Activate product icons
        await config.update('workbench.productIconTheme', 'kiroween-icons', vscode.ConfigurationTarget.Global);
        
        // Enable background
        await config.update(CONFIG_KEY, true, vscode.ConfigurationTarget.Global);
        
        // Configure Custom CSS
        await injectBackgroundCSS(extensionPath);
        
        vscode.window.showInformationMessage(
            '🎃 Kiroween activated! Install "Custom CSS and JS Loader" extension for the background.',
            'Install Extension',
            'Restart Now'
        ).then(selection => {
            if (selection === 'Install Extension') {
                vscode.env.openExternal(vscode.Uri.parse('vscode:extension/be5invis.vscode-custom-css'));
            } else if (selection === 'Restart Now') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
    });

    // Register command to deactivate Kiroween theme
    const deactivateCommand = vscode.commands.registerCommand('kiroween.deactivate', async () => {
        const config = vscode.workspace.getConfiguration();
        
        // Deactivate color theme (switch to default dark)
        await config.update('workbench.colorTheme', 'Default Dark+', vscode.ConfigurationTarget.Global);
        
        // Deactivate product icons
        await config.update('workbench.productIconTheme', null, vscode.ConfigurationTarget.Global);
        
        // Disable background
        await config.update(CONFIG_KEY, false, vscode.ConfigurationTarget.Global);
        
        // Remove Custom CSS
        await removeBackgroundCSS();
        
        vscode.window.showInformationMessage(
            'Kiroween deactivated. Restart VSCode to complete.',
            'Restart Now'
        ).then(selection => {
            if (selection === 'Restart Now') {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        });
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
    context.subscriptions.push(activateCommand);
    context.subscriptions.push(deactivateCommand);
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
