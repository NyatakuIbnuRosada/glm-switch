/**
 * Profile configuration interface
 */
export interface ProfileConfig {
    ANTHROPIC_BASE_URL: string;
    ANTHROPIC_AUTH_TOKEN: string;
    ANTHROPIC_DEFAULT_HAIKU_MODEL: string;
    ANTHROPIC_DEFAULT_SONNET_MODEL: string;
    ANTHROPIC_DEFAULT_OPUS_MODEL: string;
}
/**
 * Profile interface
 */
export interface Profile {
    id: string;
    config: ProfileConfig;
    createdAt: string;
    updatedAt: string;
}
/**
 * Default profile configuration template
 */
export declare const DEFAULT_PROFILE_CONFIG: ProfileConfig;
/**
 * Get the profiles directory path
 */
export declare function getProfilesDir(): string;
/**
 * Get profile file path for a given ID
 */
export declare function getProfilePath(id: string): string;
/**
 * Get active profile file path
 */
export declare function getActiveProfilePath(): string;
/**
 * Get default profile file path
 */
export declare function getDefaultProfilePath(): string;
/**
 * Initialize profiles directory
 */
export declare function initializeProfilesDir(): void;
/**
 * Check if a profile exists
 */
export declare function profileExists(id: string): boolean;
/**
 * Create a new profile
 */
export declare function createProfile(id: string): Profile;
/**
 * Get a profile by ID
 */
export declare function getProfile(id: string): Profile;
/**
 * Update a specific key in a profile
 */
export declare function updateProfile(id: string, key: string, value: string): Profile;
/**
 * Update a specific key in all profiles
 */
export declare function updateAllProfiles(key: string, value: string): void;
/**
 * Delete a profile
 */
export declare function deleteProfile(id: string): void;
/**
 * List all profiles
 */
export declare function listProfiles(): Profile[];
/**
 * Get the active profile ID
 */
export declare function getActiveProfile(): string | null;
/**
 * Set the active profile
 */
export declare function setActiveProfile(id: string): void;
/**
 * Get the default profile ID
 */
export declare function getDefaultProfile(): string | null;
/**
 * Set the default profile ID
 */
export declare function setDefaultProfile(id: string): void;
/**
 * Get valid config keys
 */
export declare function getValidConfigKeys(): string[];
//# sourceMappingURL=profiles.d.ts.map