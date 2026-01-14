export interface Settings {
    [key: string]: any;
    env?: {
        [key: string]: string;
    };
}
/**
 * Read and parse settings.json file (handles VS Code JSONC format)
 * Creates file with default settings if it doesn't exist
 */
export declare function readSettings(filePath: string): Settings;
/**
 * Write settings to file with backup (preserves VS Code format with comments)
 */
export declare function writeSettings(filePath: string, settings: Settings): void;
/**
 * Check if settings has GLM configuration
 */
export declare function hasGLMConfig(settings: Settings, glmKeys: string[]): boolean;
/**
 * Add GLM configuration to settings
 */
export declare function addGLMConfig(settings: Settings, glmConfig: Record<string, string>): Settings;
/**
 * Remove GLM configuration from settings
 */
export declare function removeGLMConfig(settings: Settings, glmKeys: string[]): Settings;
//# sourceMappingURL=settings.d.ts.map