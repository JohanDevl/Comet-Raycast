# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Build and Development:**
- `npm run dev` - Start development mode with hot reload
- `npm run build` - Build the extension for production (outputs to dist/)
- `npm run publish` - Publish extension to Raycast Store

**Code Quality:**
- `npm run lint` - Run ESLint to check code quality
- `npm run fix-lint` - Run ESLint with auto-fix

## Project Architecture

This is a **Raycast extension** for Comet browser integration, built with TypeScript and React. The extension provides commands to interact with Comet tabs, bookmarks, and history.

**Migration Status:** Extension has been successfully migrated from Google Chrome to Comet browser. All Chrome references have been replaced with Comet equivalents.

### Core Structure

**Entry Points (`src/`):**
- Command files (`new-tab.tsx`, `search-*.tsx`) - Each command corresponds to a Raycast command
- Tool files (`src/tools/`) - AI tool implementations for programmatic access

**Key Architectural Components:**

**Data Access Layer (`src/util/`):**
- File system operations to read Comet profile data
- Comet profile path resolution with fallback to default locations
- Bookmark and history file parsing

**Comet Interaction (`src/actions/index.tsx`):**
- AppleScript-based Comet automation using `run-applescript`
- Tab management (open, close, activate, search)
- Window and incognito window creation
- Comet installation verification

**React Hooks (`src/hooks/`):**
- `useTabSearch` - Real-time tab filtering with fuzzy search
- `useBookmarkSearch` - Bookmark search across profiles  
- `useHistorySearch` - Browser history search with SQL.js for SQLite access

**Data Models (`src/interfaces/`):**
- `Tab` class with parsing from AppleScript output using `TAB_CONTENTS_SEPARATOR`
- `HistoryEntry`, `BookmarkDirectory` interfaces
- Profile and preference type definitions

### Comet Browser Integration

**Completed Migration:** All Chrome functionality has been successfully adapted to work with Comet browser (Chromium-based).

**Migration Changes:**
- AppleScript commands: All "Google Chrome" references replaced with "Comet" application references
- File system paths: Updated from `Application Support/Google/Chrome/` to `Application Support/Comet/`
- Profile discovery: Adapted for Comet's profile system structure
- Data compatibility: Leverages Chromium foundation for SQLite/JSON format compatibility

**Implementation Status:** ✅ Complete - All Chrome references migrated to Comet.

### Comet Integration Details

**Profile Support:**
- Reads Comet's Local State file for profile discovery
- Supports custom profile paths via preferences
- Default behavior opens in topmost window; can target specific profiles

**Data Sources:**
- Comet History SQLite database (requires sql.js)
- Bookmarks JSON file parsing
- Live tab data via AppleScript queries

**Search Implementation:**
- All searches are case-insensitive with space/tab-separated word matching
- Tab search matches both title and URL content
- History/bookmark search includes title and URL fields

### Dependencies

**Core Raycast:**
- `@raycast/api` - Main Raycast SDK
- `@raycast/utils` - Utilities including favicon fetching

**Comet Integration:**
- `run-applescript` - AppleScript execution for Comet control
- `sql.js` - SQLite database access for Comet history

The extension follows Raycast's command + tools pattern where commands provide UI interfaces and tools enable programmatic AI agent access to the same functionality.