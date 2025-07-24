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

This is a **Raycast extension** for Google Chrome integration, built with TypeScript and React. The extension provides commands to interact with Chrome tabs, bookmarks, and history.

**Current Adaptation Project:** Extension is being adapted to support Comet browser (Chromium-based). See `PLAN_ADAPTATION_COMET.md` for detailed implementation plan.

### Core Structure

**Entry Points (`src/`):**
- Command files (`new-tab.tsx`, `search-*.tsx`) - Each command corresponds to a Raycast command
- Tool files (`src/tools/`) - AI tool implementations for programmatic access

**Key Architectural Components:**

**Data Access Layer (`src/util/`):**
- File system operations to read Chrome profile data
- Chrome profile path resolution with fallback to default locations
- Bookmark and history file parsing

**Chrome Interaction (`src/actions/index.tsx`):**
- AppleScript-based Chrome automation using `run-applescript`
- Tab management (open, close, activate, search)
- Window and incognito window creation
- Chrome installation verification

**React Hooks (`src/hooks/`):**
- `useTabSearch` - Real-time tab filtering with fuzzy search
- `useBookmarkSearch` - Bookmark search across profiles  
- `useHistorySearch` - Browser history search with SQL.js for SQLite access

**Data Models (`src/interfaces/`):**
- `Tab` class with parsing from AppleScript output using `TAB_CONTENTS_SEPARATOR`
- `HistoryEntry`, `BookmarkDirectory` interfaces
- Profile and preference type definitions

### Comet Browser Adaptation

**Objective:** Adapt all Chrome functionality to work with Comet browser (Chromium-based).

**Key Adaptation Areas:**
- AppleScript commands: Replace "Google Chrome" with "Comet" application references
- File system paths: Update from `Application Support/Google/Chrome/` to Comet's equivalent paths
- Profile discovery: Adapt Chrome's Local State parsing for Comet's profile system
- Data compatibility: Leverage Chromium foundation for SQLite/JSON format compatibility

**Implementation Status:** Planning phase - see `PLAN_ADAPTATION_COMET.md` for detailed roadmap.

### Chrome Integration Details

**Profile Support:**
- Reads Chrome's Local State file for profile discovery
- Supports custom profile paths via preferences
- Default behavior opens in topmost window; can target specific profiles

**Data Sources:**
- Chrome History SQLite database (requires sql.js)
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

**Chrome Integration:**
- `run-applescript` - AppleScript execution for Chrome control
- `sql.js` - SQLite database access for Chrome history

The extension follows Raycast's command + tools pattern where commands provide UI interfaces and tools enable programmatic AI agent access to the same functionality.