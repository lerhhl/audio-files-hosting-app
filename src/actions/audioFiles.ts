"use server";

import { getAllAudioFilesByUsername } from "@/lib/database";
import { verifySession } from "@/lib/session";

export async function getAllAudioFilesByUsernameAction() {
  const { username } = await verifySession();

  if (!username) {
    console.error("No username found in session.");
    return [];
  }

  try {
    const audioFiles = await getAllAudioFilesByUsername(username);
    return audioFiles;
  } catch (error) {
    console.error("Error fetching audio files:", error);
    return [];
  }
}
