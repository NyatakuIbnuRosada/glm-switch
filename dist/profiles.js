"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PROFILE_CONFIG = void 0;
exports.getProfilesDir = getProfilesDir;
exports.getProfilePath = getProfilePath;
exports.getActiveProfilePath = getActiveProfilePath;
exports.getDefaultProfilePath = getDefaultProfilePath;
exports.initializeProfilesDir = initializeProfilesDir;
exports.profileExists = profileExists;
exports.createProfile = createProfile;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;
exports.updateAllProfiles = updateAllProfiles;
exports.deleteProfile = deleteProfile;
exports.listProfiles = listProfiles;
exports.getActiveProfile = getActiveProfile;
exports.setActiveProfile = setActiveProfile;
exports.getDefaultProfile = getDefaultProfile;
exports.setDefaultProfile = setDefaultProfile;
exports.getValidConfigKeys = getValidConfigKeys;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * Default profile configuration template
 */
exports.DEFAULT_PROFILE_CONFIG = {
    ANTHROPIC_BASE_URL: 'https://api.z.ai/api/anthropic',
    ANTHROPIC_AUTH_TOKEN: '',
    ANTHROPIC_DEFAULT_HAIKU_MODEL: 'glm-4.5-air',
    ANTHROPIC_DEFAULT_SONNET_MODEL: 'glm-4.7',
    ANTHROPIC_DEFAULT_OPUS_MODEL: 'glm-4.7',
};
/**
 * Get the profiles directory path
 */
function getProfilesDir() {
    const platform = os.platform();
    if (platform === 'win32') {
        const userProfile = process.env.USERPROFILE || process.env.HOME;
        if (!userProfile) {
            throw new Error('USERPROFILE environment variable not found');
        }
        return path.join(userProfile, '.claude', 'glm-switch');
    }
    else if (platform === 'darwin') {
        const home = os.homedir();
        return path.join(home, '.claude', 'glm-switch');
    }
    else {
        throw new Error(`Unsupported platform: ${platform}. Only Windows and macOS are supported.`);
    }
}
/**
 * Get profile file path for a given ID
 */
function getProfilePath(id) {
    return path.join(getProfilesDir(), `profile-${id}.json`);
}
/**
 * Get active profile file path
 */
function getActiveProfilePath() {
    return path.join(getProfilesDir(), 'active-profile.json');
}
/**
 * Get default profile file path
 */
function getDefaultProfilePath() {
    return path.join(getProfilesDir(), 'default-profile.json');
}
/**
 * Initialize profiles directory
 */
function initializeProfilesDir() {
    const profilesDir = getProfilesDir();
    if (!fs.existsSync(profilesDir)) {
        fs.mkdirSync(profilesDir, { recursive: true });
    }
}
/**
 * Check if a profile exists
 */
function profileExists(id) {
    return fs.existsSync(getProfilePath(id));
}
/**
 * Create a new profile
 */
function createProfile(id) {
    if (profileExists(id)) {
        throw new Error(`Profile ${id} already exists`);
    }
    // Validate ID is numeric
    if (!/^\d+$/.test(id)) {
        throw new Error('Profile ID must be numeric');
    }
    initializeProfilesDir();
    const now = new Date().toISOString();
    const profile = {
        id,
        config: { ...exports.DEFAULT_PROFILE_CONFIG },
        createdAt: now,
        updatedAt: now,
    };
    fs.writeFileSync(getProfilePath(id), JSON.stringify(profile, null, 2), 'utf8');
    // Set as default profile if it's profile 0
    if (id === '0' && !fs.existsSync(getDefaultProfilePath())) {
        setDefaultProfile('0');
    }
    return profile;
}
/**
 * Get a profile by ID
 */
function getProfile(id) {
    if (!profileExists(id)) {
        throw new Error(`Profile ${id} does not exist`);
    }
    const content = fs.readFileSync(getProfilePath(id), 'utf8');
    return JSON.parse(content);
}
/**
 * Update a specific key in a profile
 */
function updateProfile(id, key, value) {
    const profile = getProfile(id);
    if (!(key in profile.config)) {
        throw new Error(`Invalid config key: ${key}`);
    }
    profile.config[key] = value;
    profile.updatedAt = new Date().toISOString();
    fs.writeFileSync(getProfilePath(id), JSON.stringify(profile, null, 2), 'utf8');
    return profile;
}
/**
 * Update a specific key in all profiles
 */
function updateAllProfiles(key, value) {
    const profilesDir = getProfilesDir();
    if (!fs.existsSync(profilesDir)) {
        throw new Error('No profiles found. Run "glm-switch init 0" first.');
    }
    const files = fs.readdirSync(profilesDir);
    const profileFiles = files.filter(f => f.startsWith('profile-') && f.endsWith('.json'));
    if (profileFiles.length === 0) {
        throw new Error('No profiles found. Run "glm-switch init 0" first.');
    }
    // Check if key is valid
    const tempProfile = { config: { ...exports.DEFAULT_PROFILE_CONFIG } };
    if (!(key in tempProfile.config)) {
        throw new Error(`Invalid config key: ${key}`);
    }
    profileFiles.forEach(file => {
        const filePath = path.join(profilesDir, file);
        const profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        profile.config[key] = value;
        profile.updatedAt = new Date().toISOString();
        fs.writeFileSync(filePath, JSON.stringify(profile, null, 2), 'utf8');
    });
}
/**
 * Delete a profile
 */
function deleteProfile(id) {
    if (!profileExists(id)) {
        throw new Error(`Profile ${id} does not exist`);
    }
    fs.unlinkSync(getProfilePath(id));
    // Clear active profile if it was the deleted one
    const activeId = getActiveProfile();
    if (activeId === id) {
        if (fs.existsSync(getActiveProfilePath())) {
            fs.unlinkSync(getActiveProfilePath());
        }
    }
}
/**
 * List all profiles
 */
function listProfiles() {
    const profilesDir = getProfilesDir();
    if (!fs.existsSync(profilesDir)) {
        return [];
    }
    const files = fs.readdirSync(profilesDir);
    const profileFiles = files.filter(f => f.startsWith('profile-') && f.endsWith('.json'));
    const profiles = [];
    profileFiles.forEach(file => {
        const filePath = path.join(profilesDir, file);
        const profile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        profiles.push(profile);
    });
    // Sort by ID (numeric)
    profiles.sort((a, b) => parseInt(a.id) - parseInt(b.id));
    return profiles;
}
/**
 * Get the active profile ID
 */
function getActiveProfile() {
    const activeProfilePath = getActiveProfilePath();
    if (!fs.existsSync(activeProfilePath)) {
        return null;
    }
    const content = fs.readFileSync(activeProfilePath, 'utf8');
    const data = JSON.parse(content);
    return data.id || null;
}
/**
 * Set the active profile
 */
function setActiveProfile(id) {
    if (!profileExists(id)) {
        throw new Error(`Profile ${id} does not exist`);
    }
    initializeProfilesDir();
    const data = { id };
    fs.writeFileSync(getActiveProfilePath(), JSON.stringify(data, null, 2), 'utf8');
}
/**
 * Get the default profile ID
 */
function getDefaultProfile() {
    const defaultProfilePath = getDefaultProfilePath();
    if (!fs.existsSync(defaultProfilePath)) {
        return '0'; // Default to profile 0
    }
    const content = fs.readFileSync(defaultProfilePath, 'utf8');
    const data = JSON.parse(content);
    return data.id || '0';
}
/**
 * Set the default profile ID
 */
function setDefaultProfile(id) {
    if (!profileExists(id)) {
        throw new Error(`Profile ${id} does not exist`);
    }
    initializeProfilesDir();
    const data = { id };
    fs.writeFileSync(getDefaultProfilePath(), JSON.stringify(data, null, 2), 'utf8');
}
/**
 * Get valid config keys
 */
function getValidConfigKeys() {
    return Object.keys(exports.DEFAULT_PROFILE_CONFIG);
}
//# sourceMappingURL=profiles.js.map