/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { memo, ReactNode, RefObject, useEffect, useRef, useState } from "react";
// Import React Native components and Expo's vector icons
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Import from Expo's library

import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
// Restoring imports
import { UseMediaStreamResult } from "../../hooks/use-media-stream-mux";
import { useScreenCapture } from "../../hooks/use-screen-capture";
import { useWebcam } from "../../hooks/use-webcam";
import { AudioRecorder } from "../../lib/audio-recorder";

export type ControlTrayProps = {
  // Restore props
  videoRef: RefObject<any>; // Keep type any for RN compatibility
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
};

// MediaStreamButton removed previously, not restored as video is complex

function ControlTray({
  // Restore props
  videoRef,
  children,
  onVideoStreamChange = () => {},
  supportsVideo, // Keep this prop, even if unused for now
}: ControlTrayProps) {
  // Restore state and refs related to mic, video, audio pulse
  // Video streams logic might need native adaptation later if video is re-enabled
  const videoStreams = [useWebcam(), useScreenCapture()];
  const [activeVideoStream, setActiveVideoStream] =
    useState<MediaStream | null>(null);
  const [webcam, screenCapture] = videoStreams;
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false); // Restore muted state
  const connectButtonRef = useRef<any>(null);

  const { client, connected, connect, disconnect } =
    useLiveAPIContext();

  // Restore useEffect for AudioRecorder
  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };

    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData);
    };
  }, [connected, client, muted, audioRecorder]);

  // Restore simplified changeStreams logic (still needs native implementation)
  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    console.log("Change video stream (native implementation needed)");
    if (next) {
      // Native logic needed
    } else {
      setActiveVideoStream(null);
      onVideoStreamChange(null);
    }
  };

  // Restore style logic
  const actionsNavStyle = [
    styles.actionsNav,
    !connected && styles.disabled // Example conditional style
  ];
  const connectToggleStyle = [
    styles.actionButton,
    styles.connectToggleButton,
    connected && styles.connectToggleButtonConnected
  ];
  const micButtonStyle = [
    styles.actionButton,
    styles.micButton,
    !muted && styles.micButtonActive, // Style when mic is on (unmuted)
    !connected && styles.disabled // Style when disconnected
  ];

  // Icon properties
  const iconSize = 20;
  const iconColor = '#ffffff';

  return (
    // Restore original outer View structure
    <View style={styles.controlTray}>
      {/* Restore actionsNav View */}
      <View style={actionsNavStyle}>
        {/* Restore Mic Button with Expo Icon */}
        <TouchableOpacity
          style={micButtonStyle}
          onPress={() => setMuted(!muted)}
          disabled={!connected} // Disable interaction when not connected
        >
          {/* Use FontAwesome component */}
          <FontAwesome name={!muted ? "microphone" : "microphone-slash"} size={iconSize} color={iconColor} />
        </TouchableOpacity>

        {/* Video buttons still commented out */}
        {children}
      </View>

      {/* Move Connection Button and Text next to actionsNav */}
      <View style={styles.connectionGroup}>
        <View style={styles.connectionButtonContainer}>
          {/* Connect/Disconnect Button with Expo Icon */}
          <TouchableOpacity
            ref={connectButtonRef}
            style={connectToggleStyle}
            onPress={connected ? disconnect : connect}
          >
            {/* Use FontAwesome component */}
            <FontAwesome name={connected ? "pause" : "play"} size={iconSize} color={iconColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Restore previous StyleSheet definition
const styles = StyleSheet.create({
  controlTray: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  actionsNav: {
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 8,
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  connectionGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  connectionButtonContainer: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginVertical: 4,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  connectToggleButton: {
     backgroundColor: 'blue',
  },
  connectToggleButtonConnected: {
     backgroundColor: 'darkblue',
  },
  micButton: {
     backgroundColor: 'gray',
  },
  micButtonActive: {
      backgroundColor: 'red',
  },
  disabled: {
    opacity: 0.5,
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0'
  },
});

export default memo(ControlTray);