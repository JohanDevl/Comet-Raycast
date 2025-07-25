import { runAppleScript } from "run-applescript";
import { LocalStorage } from "@raycast/api";
import { Tab } from "../interfaces";
import { NOT_INSTALLED_MESSAGE } from "../constants";
import { readFileSync } from "fs";
import { homedir } from "os";
import { join } from "path";

export async function getOpenTabs(useOriginalFavicon: boolean): Promise<Tab[]> {
  const faviconFormula = useOriginalFavicon
    ? `execute t javascript ¬
        "document.head.querySelector('link[rel~=icon]') ? document.head.querySelector('link[rel~=icon]').href : '';"`
    : '""';

  await checkAppInstalled();

  try {
    const openTabs = await runAppleScript(`
      set _output to ""
      tell application "Comet"
        repeat with w in windows
          set _w_id to get id of w as inches as string
          set _tab_index to 1
          repeat with t in tabs of w
            set _title to get title of t
            set _url to get URL of t
            set _favicon to ${faviconFormula}
            set _output to (_output & _title & "${Tab.TAB_CONTENTS_SEPARATOR}" & _url & "${Tab.TAB_CONTENTS_SEPARATOR}" & _favicon & "${Tab.TAB_CONTENTS_SEPARATOR}" & _w_id & "${Tab.TAB_CONTENTS_SEPARATOR}" & _tab_index & "\\n")
            set _tab_index to _tab_index + 1
          end repeat
        end repeat
      end tell
      return _output
  `);

    return openTabs
      .split("\n")
      .filter((line) => line.length !== 0)
      .map((line) => Tab.parse(line));
  } catch (err) {
    if ((err as Error).message.includes('Can\'t get application "Comet"')) {
      LocalStorage.removeItem("is-installed");
    }
    await checkAppInstalled();
    return [];
  }
}

export async function setActiveTab(tab: Tab): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      activate
      set _wnd to first window where id is ${tab.windowsId}
      set index of _wnd to 1
      set active tab index of _wnd to ${tab.tabIndex}
    end tell
    return true
  `);
}

export async function closeActiveTab(tab: Tab): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      activate
      set _wnd to first window where id is ${tab.windowsId}
      set index of _wnd to 1
      set active tab index of _wnd to ${tab.tabIndex}
      close active tab of _wnd
    end tell
    return true
  `);
}

const checkAppInstalled = async () => {
  const installed = await LocalStorage.getItem("is-installed");
  if (installed) return;

  const appInstalled = await runAppleScript(`
set isInstalled to false
try
    do shell script "osascript -e 'exists application \\"Comet\\"'"
    set isInstalled to true
end try

return isInstalled`);
  if (appInstalled === "false") {
    throw new Error(NOT_INSTALLED_MESSAGE);
  }
  LocalStorage.setItem("is-installed", true);
};

export async function createNewWindow(): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      make new window
      activate
    end tell
    return true
  `);
}

export async function createNewTab(): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      make new tab at end of tabs of window 1
      activate
    end tell
    return true
  `);
}

export async function createNewTabToWebsite(website: string): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      activate
      open location "${website}"
    end tell
    return true
  `);
}

// Check if a profile exists in Comet's Local State
function getExistingProfiles(): string[] {
  try {
    const localStatePath = join(homedir(), "Library/Application Support/Comet/Local State");
    const localStateContent = readFileSync(localStatePath, "utf8");
    const localState = JSON.parse(localStateContent);
    return Object.keys(localState.profile?.info_cache || {});
  } catch (error) {
    return [];
  }
}

// Get the profile name from directory name
function getProfileName(profileDir: string): string | null {
  try {
    const localStatePath = join(homedir(), "Library/Application Support/Comet/Local State");
    const localStateContent = readFileSync(localStatePath, "utf8");
    const localState = JSON.parse(localStateContent);
    const profileInfo = localState.profile?.info_cache?.[profileDir];
    return profileInfo?.name || null;
  } catch (error) {
    return null;
  }
}

export async function createNewTabWithProfile(profileId?: string, website?: string): Promise<void> {
  if (!profileId) {
    // No profile specified, use default behavior
    if (website) {
      await createNewTabToWebsite(website);
    } else {
      await createNewTab();
    }
    return;
  }

  // Check if requested profile exists, otherwise use current profile (no specific profile)
  let targetProfile: string | null = null;

  const existingProfiles = getExistingProfiles();

  // Check if the requested profile exists (by directory name or display name)
  const profileByDir = existingProfiles.find((dir) => dir === profileId);
  const profileByName = existingProfiles.find((dir) => {
    const name = getProfileName(dir);
    return name?.toLowerCase() === profileId?.toLowerCase();
  });

  if (profileByDir) {
    targetProfile = profileByDir;
  } else if (profileByName) {
    targetProfile = profileByName;
  }

  // If profile exists, try to use it
  if (targetProfile) {
    if (website) {
      // Open specific website in the profile
      try {
        await runAppleScript(`
          do shell script "open -na 'Comet' --args --profile-directory='${targetProfile}' '${website}'"
        `);
        return;
      } catch (error) {
        // Fall through to default behavior
      }
    } else {
      // Open empty new tab in the profile
      try {
        await runAppleScript(`
          do shell script "open -na 'Comet' --args --profile-directory='${targetProfile}'"
        `);
        return;
      } catch (error) {
        // Fall through to default behavior
      }
    }
  }

  // Fallback to default behavior if profile doesn't exist or fails
  if (website) {
    await createNewTabToWebsite(website);
  } else {
    await createNewTab();
  }
}

export async function createNewIncognitoWindow(): Promise<void> {
  await runAppleScript(`
    tell application "Comet"
      make new window with properties {mode:"incognito"}
      activate
    end tell
    return true
  `);
}
