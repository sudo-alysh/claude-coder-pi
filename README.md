# Claude Coder Pi setup

Private, portable copy of the customized Pi interface used on Windows and macOS.
It includes:

- `claude-coder` with the Clawd header, animated reasoning border, Claude-orange theme, diffs, and tool UI
- `pi-usage-bars-safe` with the compact right-aligned subscription meter
- dependency-free automatic reasoning selection
- sanitized Pi settings templates

No auth tokens, sessions, trust data, or machine-specific paths are stored here.

## Install on another machine

Install Pi and sign in first, then clone/copy this repository and run:

```bash
node install.mjs --dry-run
node install.mjs
```

Restart Pi or run `/reload`.

The installer merges settings rather than touching `~/.pi/agent/auth.json`. Local package paths are generated for the current OS and home directory.

## Update this repository from the configured machine

Copy intentional source/settings changes back into this repository, review `git diff`, then commit. Never add `~/.pi/agent/auth.json`, sessions, or trust files.
