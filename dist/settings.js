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
exports.readSettings = readSettings;
exports.writeSettings = writeSettings;
exports.hasGLMConfig = hasGLMConfig;
exports.addGLMConfig = addGLMConfig;
exports.removeGLMConfig = removeGLMConfig;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Remove comments from JSON string (VS Code settings.json supports comments)
 */
function stripJsonComments(jsonString) {
    let result = '';
    let inString = false;
    let inSingleLineComment = false;
    let inMultiLineComment = false;
    let escapeNext = false;
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];
        const nextChar = jsonString[i + 1];
        // Handle escape sequences in strings
        if (escapeNext) {
            if (inString)
                result += char;
            escapeNext = false;
            continue;
        }
        if (char === '\\') {
            if (inString)
                result += char;
            escapeNext = true;
            continue;
        }
        // Toggle string mode
        if (char === '"' && !inSingleLineComment && !inMultiLineComment) {
            inString = !inString;
            result += char;
            continue;
        }
        // If in string, just add character
        if (inString) {
            result += char;
            continue;
        }
        // Handle comment start
        if (char === '/' && !inSingleLineComment && !inMultiLineComment) {
            if (nextChar === '/') {
                inSingleLineComment = true;
                i++; // Skip next slash
                continue;
            }
            else if (nextChar === '*') {
                inMultiLineComment = true;
                i++; // Skip asterisk
                continue;
            }
        }
        // Handle comment end
        if (inSingleLineComment && (char === '\n' || char === '\r')) {
            inSingleLineComment = false;
            result += char; // Keep newline
            continue;
        }
        if (inMultiLineComment && char === '*' && nextChar === '/') {
            inMultiLineComment = false;
            i++; // Skip closing slash
            continue;
        }
        // Skip characters in comments
        if (inSingleLineComment || inMultiLineComment) {
            continue;
        }
        // Add character to result
        result += char;
    }
    // Remove trailing commas
    result = result.replace(/,(\s*[}\]])/g, '$1');
    return result;
}
/**
 * Read and parse settings.json file (handles VS Code JSONC format)
 * Creates file with default settings if it doesn't exist
 */
function readSettings(filePath) {
    if (!fs.existsSync(filePath)) {
        // Create default settings file
        const defaultSettings = {};
        // Ensure directory exists
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        // Create file with empty JSON object
        fs.writeFileSync(filePath, JSON.stringify(defaultSettings, null, 2), 'utf8');
        return defaultSettings;
    }
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleanedContent = stripJsonComments(content);
        return JSON.parse(cleanedContent);
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error(`Invalid JSON in settings file: ${error.message}`);
        }
        throw error;
    }
}
/**
 * Write settings to file with backup (preserves VS Code format with comments)
 */
function writeSettings(filePath, settings) {
    const backupPath = `${filePath}.backup`;
    try {
        // Create backup if file exists
        if (fs.existsSync(filePath)) {
            fs.copyFileSync(filePath, backupPath);
        }
        // Validate JSON structure
        const jsonString = JSON.stringify(settings, null, 2);
        JSON.parse(jsonString); // Validate it can be parsed
        // Write to temp file first (atomic write)
        const tempPath = `${filePath}.tmp`;
        fs.writeFileSync(tempPath, jsonString, 'utf8');
        // Rename temp to actual file
        fs.renameSync(tempPath, filePath);
        // Remove backup on success
        if (fs.existsSync(backupPath)) {
            fs.unlinkSync(backupPath);
        }
    }
    catch (error) {
        // Restore from backup on error
        if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, filePath);
            fs.unlinkSync(backupPath);
        }
        throw error;
    }
}
/**
 * Check if settings has GLM configuration
 */
function hasGLMConfig(settings, glmKeys) {
    if (!settings.env)
        return false;
    // Check if at least one GLM key exists
    return glmKeys.some(key => settings.env && key in settings.env);
}
/**
 * Add GLM configuration to settings
 */
function addGLMConfig(settings, glmConfig) {
    const newSettings = { ...settings };
    if (!newSettings.env) {
        newSettings.env = {};
    }
    // Merge GLM config into env
    newSettings.env = {
        ...newSettings.env,
        ...glmConfig,
    };
    return newSettings;
}
/**
 * Remove GLM configuration from settings
 */
function removeGLMConfig(settings, glmKeys) {
    const newSettings = { ...settings };
    if (!newSettings.env) {
        return newSettings;
    }
    // Remove all GLM keys
    glmKeys.forEach(key => {
        delete newSettings.env[key];
    });
    // Remove env object if empty
    if (Object.keys(newSettings.env).length === 0) {
        delete newSettings.env;
    }
    return newSettings;
}
//# sourceMappingURL=settings.js.map