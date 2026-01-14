"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyProfile = applyProfile;
exports.enableGLM = enableGLM;
exports.disableGLM = disableGLM;
exports.showStatus = showStatus;
exports.initProfile = initProfile;
exports.setProfileValue = setProfileValue;
exports.setAllProfilesValue = setAllProfilesValue;
exports.listAllProfiles = listAllProfiles;
exports.deleteProfile = deleteProfile;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const settings_1 = require("./settings");
const profiles_1 = require("./profiles");
/**
 * Apply a profile by ID (or default profile if no ID provided)
 */
function applyProfile(profileId) {
    const settingsPath = (0, config_1.getSettingsPath)();
    try {
        // Determine which profile to use
        let targetId;
        if (profileId) {
            targetId = profileId;
        }
        else {
            const defaultId = (0, profiles_1.getDefaultProfile)();
            targetId = defaultId || '0';
        }
        // Check if profile exists
        if (!(0, profiles_1.profileExists)(targetId)) {
            console.error(chalk_1.default.red(`✗ Profile ${targetId} does not exist`));
            console.log(chalk_1.default.gray(`  Run "glm-switch init ${targetId}" to create it first`));
            process.exit(1);
        }
        const profile = (0, profiles_1.getProfile)(targetId);
        const settings = (0, settings_1.readSettings)(settingsPath);
        // Check if token is empty
        if (!profile.config.ANTHROPIC_AUTH_TOKEN) {
            console.log(chalk_1.default.yellow(`⚠ Warning: Profile ${targetId} has no auth token`));
            console.log(chalk_1.default.gray(`  Run "glm-switch set ${targetId} token <your-token>" to set it`));
        }
        // Apply profile config to settings
        const newSettings = { ...settings };
        if (!newSettings.env) {
            newSettings.env = {};
        }
        newSettings.env = {
            ...newSettings.env,
            ...profile.config,
        };
        (0, settings_1.writeSettings)(settingsPath, newSettings);
        (0, profiles_1.setActiveProfile)(targetId);
        console.log(chalk_1.default.green(`✓ Profile ${targetId} applied`));
        console.log(chalk_1.default.gray('  Please restart VS Code for changes to take effect'));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to apply profile'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Legacy function - applies profile 0 by default
 * @deprecated Use applyProfile() instead
 */
function enableGLM() {
    applyProfile();
}
/**
 * Disable GLM mode (remove all GLM config from settings)
 */
function disableGLM() {
    const settingsPath = (0, config_1.getSettingsPath)();
    try {
        const settings = (0, settings_1.readSettings)(settingsPath);
        if (!(0, settings_1.hasGLMConfig)(settings, config_1.GLM_KEYS)) {
            console.log(chalk_1.default.yellow('⚠ GLM mode is already disabled'));
            return;
        }
        const newSettings = (0, settings_1.removeGLMConfig)(settings, config_1.GLM_KEYS);
        (0, settings_1.writeSettings)(settingsPath, newSettings);
        console.log(chalk_1.default.green('✓ Claude API mode restored'));
        console.log(chalk_1.default.gray('  Please restart VS Code for changes to take effect'));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to disable GLM mode'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Show current status
 */
function showStatus() {
    const settingsPath = (0, config_1.getSettingsPath)();
    try {
        const settings = (0, settings_1.readSettings)(settingsPath);
        const isGLMEnabled = (0, settings_1.hasGLMConfig)(settings, config_1.GLM_KEYS);
        const activeProfileId = (0, profiles_1.getActiveProfile)();
        if (isGLMEnabled) {
            console.log(chalk_1.default.green('Current mode: GLM'));
            if (activeProfileId) {
                console.log(chalk_1.default.gray(`Active Profile: ${activeProfileId}`));
            }
            console.log(chalk_1.default.gray(`API Endpoint: ${settings.env?.ANTHROPIC_BASE_URL || 'N/A'}`));
            console.log(chalk_1.default.gray(`Sonnet Model: ${settings.env?.ANTHROPIC_DEFAULT_SONNET_MODEL || 'N/A'}`));
            console.log(chalk_1.default.gray(`Opus Model: ${settings.env?.ANTHROPIC_DEFAULT_OPUS_MODEL || 'N/A'}`));
            console.log(chalk_1.default.gray(`Haiku Model: ${settings.env?.ANTHROPIC_DEFAULT_HAIKU_MODEL || 'N/A'}`));
            const token = settings.env?.ANTHROPIC_AUTH_TOKEN;
            if (token) {
                const maskedToken = token.length > 10
                    ? `${token.substring(0, 10)}...`
                    : token;
                console.log(chalk_1.default.gray(`Auth Token: ${maskedToken}`));
            }
            else {
                console.log(chalk_1.default.yellow('Auth Token: Not set'));
            }
        }
        else {
            console.log(chalk_1.default.blue('Current mode: Claude API'));
        }
        console.log(chalk_1.default.gray(`\nSettings file: ${settingsPath}`));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to read settings'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Initialize a new profile
 */
function initProfile(id) {
    try {
        if (!/^\d+$/.test(id)) {
            console.error(chalk_1.default.red('✗ Profile ID must be numeric'));
            console.log(chalk_1.default.gray('  Example: glm-switch init 0'));
            process.exit(1);
        }
        const profile = (0, profiles_1.createProfile)(id);
        console.log(chalk_1.default.green(`✓ Profile ${id} created`));
        console.log(chalk_1.default.gray(`  Config: ${JSON.stringify(profile.config, null, 2)}`));
        console.log(chalk_1.default.yellow(`  Don't forget to set your auth token:`));
        console.log(chalk_1.default.gray(`  glm-switch set ${id} token <your-token>`));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to create profile'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Set a value for a specific profile
 */
function setProfileValue(id, key, value) {
    try {
        if (!(0, profiles_1.profileExists)(id)) {
            console.error(chalk_1.default.red(`✗ Profile ${id} does not exist`));
            console.log(chalk_1.default.gray(`  Run "glm-switch init ${id}" to create it first`));
            process.exit(1);
        }
        const validKeys = (0, profiles_1.getValidConfigKeys)();
        if (!validKeys.includes(key)) {
            console.error(chalk_1.default.red(`✗ Invalid config key: ${key}`));
            console.log(chalk_1.default.gray(`  Valid keys: ${validKeys.join(', ')}`));
            process.exit(1);
        }
        const profile = (0, profiles_1.updateProfile)(id, key, value);
        console.log(chalk_1.default.green(`✓ Updated profile ${id}`));
        console.log(chalk_1.default.gray(`  ${key}: ${value}`));
        // Check if this is the active profile
        const activeProfileId = (0, profiles_1.getActiveProfile)();
        if (activeProfileId === id) {
            console.log(chalk_1.default.yellow(`  ⚠ This profile is currently active`));
            console.log(chalk_1.default.gray(`  Run "glm-switch on ${id}" to apply the changes`));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to update profile'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Set a value for all profiles
 */
function setAllProfilesValue(key, value) {
    try {
        const validKeys = (0, profiles_1.getValidConfigKeys)();
        if (!validKeys.includes(key)) {
            console.error(chalk_1.default.red(`✗ Invalid config key: ${key}`));
            console.log(chalk_1.default.gray(`  Valid keys: ${validKeys.join(', ')}`));
            process.exit(1);
        }
        (0, profiles_1.updateAllProfiles)(key, value);
        const profiles = (0, profiles_1.listProfiles)();
        console.log(chalk_1.default.green(`✓ Updated ${profiles.length} profile(s)`));
        console.log(chalk_1.default.gray(`  ${key}: ${value}`));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to update profiles'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * List all profiles
 */
function listAllProfiles() {
    try {
        const profiles = (0, profiles_1.listProfiles)();
        const activeProfileId = (0, profiles_1.getActiveProfile)();
        const defaultProfileId = (0, profiles_1.getDefaultProfile)();
        if (profiles.length === 0) {
            console.log(chalk_1.default.yellow('No profiles found'));
            console.log(chalk_1.default.gray('  Run "glm-switch init 0" to create your first profile'));
            return;
        }
        console.log(chalk_1.default.bold('Profiles:'));
        console.log('');
        profiles.forEach((profile) => {
            const isActive = profile.id === activeProfileId;
            const isDefault = profile.id === defaultProfileId;
            let status = '';
            if (isActive)
                status += chalk_1.default.green('[active] ');
            if (isDefault)
                status += chalk_1.default.blue('[default] ');
            console.log(`${status}chalk.bold(${profile.id})`);
            const token = profile.config.ANTHROPIC_AUTH_TOKEN;
            const maskedToken = token
                ? (token.length > 10 ? `${token.substring(0, 10)}...` : token)
                : chalk_1.default.yellow('(not set)');
            console.log(`  Base URL: ${profile.config.ANTHROPIC_BASE_URL}`);
            console.log(`  Token: ${maskedToken}`);
            console.log(`  Haiku: ${profile.config.ANTHROPIC_DEFAULT_HAIKU_MODEL}`);
            console.log(`  Sonnet: ${profile.config.ANTHROPIC_DEFAULT_SONNET_MODEL}`);
            console.log(`  Opus: ${profile.config.ANTHROPIC_DEFAULT_OPUS_MODEL}`);
            console.log('');
        });
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to list profiles'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
/**
 * Delete a profile
 */
function deleteProfile(id) {
    try {
        if (!(0, profiles_1.profileExists)(id)) {
            console.error(chalk_1.default.red(`✗ Profile ${id} does not exist`));
            process.exit(1);
        }
        (0, profiles_1.deleteProfile)(id);
        console.log(chalk_1.default.green(`✓ Profile ${id} deleted`));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to delete profile'));
        console.error(chalk_1.default.gray(`  ${error instanceof Error ? error.message : String(error)}`));
        process.exit(1);
    }
}
//# sourceMappingURL=commands.js.map