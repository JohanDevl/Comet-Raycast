import { List } from "@raycast/api";
import { useEffect, useState } from "react";
import { useCachedState } from "@raycast/utils";
import { getAvailableProfiles } from "../util";
import { CometProfile } from "../interfaces";
import { DEFAULT_COMET_PROFILE_ID, COMET_PROFILE_KEY } from "../constants";

interface Props {
  onProfileSelected?: (profile: string) => void;
}

export default function CometProfileDropDown({ onProfileSelected }: Props) {
  const [selectedProfile, setSelectedProfile] = useCachedState<string>(COMET_PROFILE_KEY, DEFAULT_COMET_PROFILE_ID);
  const [profiles, setProfiles] = useState<CometProfile[]>([]);

  useEffect(() => {
    // Load profiles synchronously from directory listing
    const availableProfiles = getAvailableProfiles();
    const profileList = availableProfiles.map((id) => ({
      name: id === "Default" ? "Default" : id.startsWith("Profile ") ? id : `Profile ${id}`,
      id: id,
    }));
    
    // Always include at least a default profile
    if (profileList.length === 0) {
      profileList.push({ id: DEFAULT_COMET_PROFILE_ID, name: "Default" });
    }
    
    setProfiles(profileList);
    
    // Set default profile if none selected and profiles available
    if (!selectedProfile && profileList.length > 0) {
      setSelectedProfile(profileList[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedProfile && profiles.length > 0) {
      onProfileSelected?.(selectedProfile);
    }
  }, [selectedProfile, profiles]);

  return (
    <List.Dropdown tooltip="Select Comet Profile" value={selectedProfile} onChange={setSelectedProfile}>
      {profiles.map((profile) => (
        <List.Dropdown.Item key={profile.id} value={profile.id} title={profile.name} />
      ))}
    </List.Dropdown>
  );
}
