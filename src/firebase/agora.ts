import * as functions from "firebase-functions";
import { RtcRole, RtcTokenBuilder } from "agora-access-token";

// Load Agora credentials from environment variables
const AGORA_APP_ID = process.env.AGORA_APP_ID || "YOUR_AGORA_APP_ID";
const AGORA_APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE || "YOUR_AGORA_APP_CERTIFICATE";

if (!AGORA_APP_ID || !AGORA_APP_CERTIFICATE) {
  console.error("Agora credentials are missing!");
  throw new Error("Agora credentials must be set in environment variables.");
}

// Cloud Function to generate Agora token
export const generateAgoraToken = functions.https.onRequest((req, res) => {
  const { channelName, uid, role = "publisher", expiryTime = 3600 } = req.body;

  if (!channelName || !uid) {
    res.status(400).send("Missing 'channelName' or 'uid'");
    return;
  }

  try {
    const rtcRole = role === "subscriber" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expiryTime;

    const token = RtcTokenBuilder.buildTokenWithUid(
      AGORA_APP_ID,
      AGORA_APP_CERTIFICATE,
      channelName,
      parseInt(uid, 10),
      rtcRole,
      privilegeExpireTime
    );

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error generating Agora token:", error);
    res.status(500).send("Failed to generate token");
  }
});

