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
exports.GLM_KEYS = exports.GLM_CONFIG = exports.GLM_CONFIG_TEMPLATE = void 0;
exports.getSettingsPath = getSettingsPath;
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * Get the Claude Code settings.json file path for the current platform
 */
function getSettingsPath() {
    const platform = os.platform();
    if (platform === 'win32') {
        // Windows: C:\Users\{username}\.claude\settings.json
        const userProfile = process.env.USERPROFILE || process.env.HOME;
        if (!userProfile) {
            throw new Error('USERPROFILE environment variable not found');
        }
        return path.join(userProfile, '.claude', 'settings.json');
    }
    else if (platform === 'darwin') {
        // macOS: ~/.claude/settings.json
        const home = os.homedir();
        return path.join(home, '.claude', 'settings.json');
    }
    else {
        throw new Error(`Unsupported platform: ${platform}. Only Windows and macOS are supported.`);
    }
}
/**
 * Default GLM API configuration template
 * This is used as a fallback and for backwards compatibility
 */
exports.GLM_CONFIG_TEMPLATE = {
    ANTHROPIC_BASE_URL: 'https://api.z.ai/api/anthropic',
    ANTHROPIC_AUTH_TOKEN: 'b8eb5131e993419fa5f39181c7c6a1db.emTv6QgzVxbSo3a7',
    ANTHROPIC_DEFAULT_HAIKU_MODEL: 'glm-4.5-air',
    ANTHROPIC_DEFAULT_SONNET_MODEL: 'glm-4.7',
    ANTHROPIC_DEFAULT_OPUS_MODEL: 'glm-4.7',
};
/**
 * Legacy GLM configuration (for backwards compatibility)
 * @deprecated Use profile-based configuration instead
 */
exports.GLM_CONFIG = exports.GLM_CONFIG_TEMPLATE;
/**
 * Keys to check for GLM mode detection
 */
exports.GLM_KEYS = Object.keys(exports.GLM_CONFIG_TEMPLATE);
//# sourceMappingURL=config.js.map