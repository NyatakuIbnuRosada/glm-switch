/**
 * Apply a profile by ID (or default profile if no ID provided)
 */
export declare function applyProfile(profileId?: string): void;
/**
 * Legacy function - applies profile 0 by default
 * @deprecated Use applyProfile() instead
 */
export declare function enableGLM(): void;
/**
 * Disable GLM mode (remove all GLM config from settings)
 */
export declare function disableGLM(): void;
/**
 * Show current status
 */
export declare function showStatus(): void;
/**
 * Initialize a new profile
 */
export declare function initProfile(id: string): void;
/**
 * Set a value for a specific profile
 */
export declare function setProfileValue(id: string, key: string, value: string): void;
/**
 * Set a value for all profiles
 */
export declare function setAllProfilesValue(key: string, value: string): void;
/**
 * List all profiles
 */
export declare function listAllProfiles(): void;
/**
 * Delete a profile
 */
export declare function deleteProfile(id: string): void;
//# sourceMappingURL=commands.d.ts.map