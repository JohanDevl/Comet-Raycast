import { List } from "@raycast/api";
import { useEffect } from "react";
import { useCachedPromise, useCachedState } from "@raycast/utils";
import { existsSync, promises } from "fs";
import { getLocalStatePath, getAvailableProfiles } from "../util";
import { CometProfile } from "../interfaces";
import { DEFAULT_COMET_PROFILE_ID, COMET_PROFILE_KEY, COMET_PROFILES_KEY } from "../constants";

interface Props {
  onProfileSelected?: (profile: string) => void;
}

async function loadCometProfiles(): Promise<CometProfile[]> {
  try {
    // First try to load from Local State file (includes profile names)
    const path = getLocalStatePath();
    if (existsSync(path)) {
      const cometState = await promises.readFile(path, "utf-8");
      const parsed = JSON.parse(cometState);
      if (parsed.profile?.info_cache) {
        const profiles = parsed.profile.info_cache;
        return Object.entries<{ name: string }>(profiles).map(([key, val]) => ({
          name: val.name,
          id: key,
        }));
      }
    }
  } catch (error) {
    // If Local State parsing fails, fall back to directory listing
  }

  // Fallback: get available profiles from directory listing
  const availableProfiles = getAvailableProfiles();
  if (availableProfiles.length === 0) {
    return [];
  }
  return availableProfiles.map((id) => ({
    name: id === "Default" ? "Default" : `Profile ${id.split(" ")[1] || id}`,
    id: id,
  }));
}

export default function CometProfileDropDown({ onProfileSelected }: Props) {
  const [selectedProfile, setSelectedProfile] = useCachedState<string>(COMET_PROFILE_KEY, DEFAULT_COMET_PROFILE_ID);
  const [profiles, setProfiles] = useCachedState<CometProfile[]>(COMET_PROFILES_KEY, []);
  const { data: loadedProfiles } = useCachedPromise(loadCometProfiles);

  useEffect(() => {
    if (loadedProfiles !== undefined) {
      setProfiles(loadedProfiles);
      if (loadedProfiles.length > 0 && !selectedProfile) {
        setSelectedProfile(loadedProfiles[0].id);
      }
    }
  }, [loadedProfiles]);

  useEffect(() => {
    if (selectedProfile && profiles.length > 0) {
      onProfileSelected?.(selectedProfile);
    }
  }, [selectedProfile, profiles]);

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <List.Dropdown tooltip="Select Comet Profile" value={selectedProfile} onChange={setSelectedProfile}>
      {profiles.map((profile) => (
        <List.Dropdown.Item key={profile.id} value={profile.id} title={profile.name} />
      ))}
    </List.Dropdown>
  );
}
