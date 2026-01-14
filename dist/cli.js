#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const commands_1 = require("./commands");
const program = new commander_1.Command();
program
    .name('glm-switch')
    .description('CLI utility to manage GLM API profiles for Claude Code')
    .version('1.2.0');
// Apply profile command
program
    .command('on [id]')
    .description('Apply a profile (default: 0)')
    .action((id) => {
    (0, commands_1.applyProfile)(id);
});
// Disable GLM mode command
program
    .command('off')
    .description('Remove all GLM configuration (restore Claude API mode)')
    .action(() => {
    (0, commands_1.disableGLM)();
});
// Show status command
program
    .command('status')
    .description('Show current API mode and active profile')
    .action(() => {
    (0, commands_1.showStatus)();
});
// Initialize profile command
program
    .command('init [id]')
    .description('Create a new profile (default: 0)')
    .action((id = '0') => {
    (0, commands_1.initProfile)(id);
});
// Set value for specific profile command
program
    .command('set <id> <key> <value>')
    .description('Set a config value for a specific profile')
    .action((id, key, value) => {
    (0, commands_1.setProfileValue)(id, key, value);
});
// Set value for all profiles command
program
    .command('setall <key> <value>')
    .description('Set a config value for all profiles')
    .action((key, value) => {
    (0, commands_1.setAllProfilesValue)(key, value);
});
// List profiles command
program
    .command('list')
    .description('List all profiles')
    .action(() => {
    (0, commands_1.listAllProfiles)();
});
// Delete profile command
program
    .command('delete <id>')
    .description('Delete a profile')
    .action((id) => {
    (0, commands_1.deleteProfile)(id);
});
program.parse();
//# sourceMappingURL=cli.js.map