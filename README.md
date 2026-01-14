# GLM Switch Profile for claude-code

> **Public tool for Supermeo & Inwave DR Team**

A CLI tool for managing multiple GLM API profiles in Claude Code/VS Code. Quickly switch between different GLM configurations without manual editing.

[![npm version](https://badge.fury.io/js/glm-switch.svg)](https://www.npmjs.com/package/glm-switch)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Features

- **Multiple Profiles** - Manage multiple profiles with different tokens and models
- **Quick Switch** - Switch between profiles with a single command
- **Bulk Update** - Update config across all profiles at once
- **Safe Operations** - Automatic backup, JSON validation, and rollback on errors
- **Cross-Platform** - Support for Windows & macOS
- **JSONC Support** - Reads settings.json with comments
- **Auto-Create** - Automatically creates files if they don't exist

---

## Installation

### Method 1: Install from npm (Recommended)

```bash
npm install -g glm-switch
```

### Method 2: Install from GitHub

```bash
# Clone repository
git clone https://github.com/supermeo-studio/glm-switch.git
cd glm-switch

# Setup
npm run setup
```

The `npm run setup` command will:
1. Install dependencies
2. Build TypeScript to JavaScript
3. Create a global symlink via `npm link`

---

## Profile Concept

Each **profile** is a separate GLM API configuration containing:

| Config Key | Description |
|------------|-------------|
| `ANTHROPIC_BASE_URL` | API endpoint for GLM |
| `ANTHROPIC_AUTH_TOKEN` | Authentication token |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL` | Haiku model (lightweight) |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | Sonnet model (balanced) |
| `ANTHROPIC_DEFAULT_OPUS_MODEL` | Opus model (powerful) |

**Storage:** Profiles are stored in `~/.claude/glm-switch/`

---

## Usage Guide

### 1. Create Your First Profile

```bash
# Create profile 0 with default values
glm-switch init 0
```

Output:
```
✓ Profile 0 created
  Config: {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  }
  Don't forget to set your auth token:
  glm-switch set 0 token <your-token>
```

### 2. Set Token for Profile

```bash
# Set token for profile 0
glm-switch set 0 token b8eb5131e993419fa5f39181c7c6a1db.emTv6QgzVxbSo3a7
```

### 3. Apply Profile

```bash
# Apply default profile (0)
glm-switch on

# Apply specific profile
glm-switch on 1
```

**Important:** After applying, **restart Claude Code/VS Code** for changes to take effect.

### 4. Create Additional Profiles

```bash
# Create profile 1
glm-switch init 1

# Set different token for profile 1
glm-switch set 1 token another_token_here

# Apply profile 1
glm-switch on 1
```

### 5. Bulk Update - Update All Profiles

```bash
# Update Sonnet model for all profiles
glm-switch setall sonnet glm-4.7

# Update Opus model for all profiles
glm-switch setall opus glm-4.7

# Update Haiku model for all profiles
glm-switch setall haiku glm-4.5-air

# Update API endpoint for all profiles
glm-switch setall ANTHROPIC_BASE_URL https://api.z.ai/api/anthropic
```

### 6. List All Profiles

```bash
glm-switch list
```

Output:
```
Profiles:

[active] [default] 0
  Base URL: https://api.z.ai/api/anthropic
  Token: b8eb5131e...
  Haiku: glm-4.5-air
  Sonnet: glm-4.7
  Opus: glm-4.7

 1
  Base URL: https://api.z.ai/api/anthropic
  Token: (not set)
  Haiku: glm-4.5-air
  Sonnet: glm-4.7
  Opus: glm-4.7
```

### 7. Check Current Status

```bash
glm-switch status
```

### 8. Delete Profile

```bash
glm-switch delete 1
```

### 9. Disable GLM Mode (Restore Claude API)

```bash
glm-switch off
```

---

## All Commands

| Command | Description | Example |
|---------|-------------|---------|
| `init [id]` | Create a new profile | `glm-switch init 0` |
| `set <id> <key> <value>` | Set value for a specific profile | `glm-switch set 0 token xxxx` |
| `setall <key> <value>` | Set value for all profiles | `glm-switch setall sonnet glm-4.7` |
| `on [id]` | Apply profile (default: 0) | `glm-switch on 1` |
| `off` | Remove GLM config | `glm-switch off` |
| `status` | Show current status | `glm-switch status` |
| `list` | List all profiles | `glm-switch list` |
| `delete <id>` | Delete a profile | `glm-switch delete 1` |
| `--help` | Show help | `glm-switch --help` |
| `--version` | Show version | `glm-switch --version` |

---

## Valid Config Keys

When using `set` or `setall` commands, valid keys are:

```
ANTHROPIC_BASE_URL
ANTHROPIC_AUTH_TOKEN
ANTHROPIC_DEFAULT_HAIKU_MODEL
ANTHROPIC_DEFAULT_SONNET_MODEL
ANTHROPIC_DEFAULT_OPUS_MODEL
```

---

## How It Works

### File Storage Structure

```
~/.claude/
├── settings.json              # Claude Code settings
└── glm-switch/                # GLM Switch profiles directory
    ├── profile-0.json        # Profile 0 config
    ├── profile-1.json        # Profile 1 config
    ├── active-profile.json   # Currently active profile
    └── default-profile.json  # Default profile (0)
```

### Profile File Format

```json
{
  "id": "0",
  "config": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "your-token-here",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  },
  "createdAt": "2025-01-14T10:00:00.000Z",
  "updatedAt": "2025-01-14T10:00:00.000Z"
}
```

### Settings.json Modification

When running `glm-switch on [id]`, the tool injects config from the profile into `~/.claude/settings.json`:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://api.z.ai/api/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "your-token-here",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "glm-4.5-air",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "glm-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "glm-4.7"
  }
}
```

---

## Recommended Workflows

### First-Time Setup

```bash
# 1. Create profile 0
glm-switch init 0

# 2. Set your token
glm-switch set 0 token your_token_here

# 3. Apply
glm-switch on

# 4. Restart Claude Code
```

### Add New Profile

```bash
# 1. Create new profile
glm-switch init 1

# 2. Set token
glm-switch set 1 token another_token

# 3. Apply when needed
glm-switch on 1
```

### Update Models for All

```bash
glm-switch setall sonnet glm-4.7
glm-switch setall opus glm-4.7
glm-switch setall haiku glm-4.5-air
```

---

## Safety Features

- **Automatic Backup** - Creates `.backup` file before modifying
- **Atomic Writes** - Uses temp files to prevent corruption
- **JSON Validation** - Validates structure before writing
- **Rollback on Error** - Restores from backup if modification fails
- **Non-destructive** - Preserves other settings

---

## Troubleshooting

### Command not found after installation

```bash
# Close and reopen terminal
# Or check npm bin path
npm bin -g

# Ensure npm bin is in your PATH
```

### Changes not taking effect

```bash
# 1. Check status
glm-switch status

# 2. Restart Claude Code/VS Code COMPLETELY
# 3. Check status again
```

### Profile does not exist

```bash
# List all profiles
glm-switch list

# Create profile if needed
glm-switch init 0
```

### Invalid config key

```bash
✗ Invalid config key: invalid_key
  Valid keys: ANTHROPIC_BASE_URL, ANTHROPIC_AUTH_TOKEN, ANTHROPIC_DEFAULT_HAIKU_MODEL, ANTHROPIC_DEFAULT_SONNET_MODEL, ANTHROPIC_DEFAULT_OPUS_MODEL
```

### Permission errors

**Windows:** Run terminal as Administrator

**macOS:**
```bash
# Check permissions
ls -la ~/.claude/

# Fix permissions
chmod 644 ~/.claude/settings.json
```

---

## Development

### Clone & Setup

```bash
git clone https://github.com/supermeo-studio/glm-switch.git
cd glm-switch
npm run setup
```

### Build

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

### Clean

```bash
npm run clean
```

---

## Uninstallation

### Global npm package

```bash
npm uninstall -g glm-switch
```

### Manual cleanup (optional)

```bash
# Remove profiles directory
rm -rf ~/.claude/glm-switch
```

---

## Platform Support

| Platform | Status | Settings Location |
|----------|--------|-------------------|
| Windows 10/11 | ✅ Supported | `C:\Users\{username}\.claude\settings.json` |
| macOS | ✅ Supported | `~/.claude/settings.json` |
| Linux | ⚠️ Untested | `~/.claude/settings.json` |

---

## Version History

### v2.0.0 (Current)
- ✨ Multi-profile support
- ✨ New commands: `init`, `set`, `setall`, `list`, `delete`
- ✨ Profile storage in `~/.claude/glm-switch/`
- ✨ Default profile concept

### v1.1.0
- ✅ JSONC support (comments in settings.json)
- ✅ Auto-create settings.json

### v1.0.0
- 🎉 Initial release
- ✅ Basic on/off switching

---

## License

MIT © Supermeo & Inwave DR Team

---

## Links

- **npm:** https://www.npmjs.com/package/glm-switch
- **GitHub:** https://github.com/supermeo-studio/glm-switch

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
