export interface SettingsPath {
    path: string;
    exists: boolean;
}
/**
 * Get the Claude Code settings.json file path for the current platform
 */
export declare function getSettingsPath(): string;
/**
 * Default GLM API configuration template
 * This is used as a fallback and for backwards compatibility
 */
export declare const GLM_CONFIG_TEMPLATE: {
    ANTHROPIC_BASE_URL: string;
    ANTHROPIC_AUTH_TOKEN: string;
    ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
    ANTHROPIC_DEFAULT_SONNET_MODEL: string;
    ANTHROPIC_DEFAULT_OPUS_MODEL: string;
};
/**
 * Legacy GLM configuration (for backwards compatibility)
 * @deprecated Use profile-based configuration instead
 */
export declare const GLM_CONFIG: {
    ANTHROPIC_BASE_URL: string;
    ANTHROPIC_AUTH_TOKEN: string;
    ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
    ANTHROPIC_DEFAULT_SONNET_MODEL: string;
    ANTHROPIC_DEFAULT_OPUS_MODEL: string;
};
/**
 * Keys to check for GLM mode detection
 */
export declare const GLM_KEYS: string[];
//# sourceMappingURL=config.d.ts.map