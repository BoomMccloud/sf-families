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
// Import React Native components
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';

import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { UseMediaStreamResult } from "../../hooks/use-media-stream-mux";
import { useScreenCapture } from "../../hooks/use-screen-capture";
import { useWebcam } from "../../hooks/use-webcam";
import { AudioRecorder } from "../../lib/audio-recorder";
import AudioPulse from "../audio-pulse/AudioPulse";

export type ControlTrayProps = {
  // Changed videoRef type for simplicity, as HTMLVideoElement doesn't exist
  videoRef: RefObject<any>;
  children?: ReactNode;
  supportsVideo: boolean;
  onVideoStreamChange?: (stream: MediaStream | null) => void;
};

type MediaStreamButtonProps = {
  isStreaming: boolean;
  onIcon: string; // Keep as string for now, represent with Text
  offIcon: string; // Keep as string for now, represent with Text
  start: () => Promise<any>;
  stop: () => any;
};

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(
  ({ isStreaming, onIcon, offIcon, start, stop }: MediaStreamButtonProps) => {
    const handlePress = isStreaming ? stop : start;
    const iconText = isStreaming ? onIcon : offIcon;

    return (
      <TouchableOpacity style={styles.actionButton} onPress={handlePress}>
        {/* Use Text for icons for now */}
        <Text style={styles.iconText}>{iconText}</Text>
      </TouchableOpacity>
    );
  }
);
MediaStreamButton.displayName = 'MediaStreamButton';

function ControlTray({
  videoRef, // Ref is now less relevant without web video element
  children,
  onVideoStreamChange = () => {},
  supportsVideo,
}: ControlTrayProps) {
  // Video streams logic might need native adaptation later
  const videoStreams = [useWebcam(), useScreenCapture()];
  const [activeVideoStream, setActiveVideoStream] =
    useState<MediaStream | null>(null);
  const [webcam, screenCapture] = videoStreams;
  const [inVolume, setInVolume] = useState(0); // Kept for AudioPulse
  const [audioRecorder] = useState(() => new AudioRecorder());
  const [muted, setMuted] = useState(false);
  // Removed renderCanvasRef
  // Changed connectButtonRef type
  const connectButtonRef = useRef<any>(null);

  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();

  useEffect(() => {
    const onData = (base64: string) => {
      client.sendRealtimeInput([
        {
          mimeType: "audio/pcm;rate=16000",
          data: base64,
        },
      ]);
    };
    // Volume listener for AudioPulse (not visual mic button pulse)
    const handleVolume = (vol: number) => setInVolume(vol);

    if (connected && !muted && audioRecorder) {
      audioRecorder.on("data", onData).on("volume", handleVolume).start();
    } else {
      audioRecorder.stop();
    }
    return () => {
      audioRecorder.off("data", onData).off("volume", handleVolume);
    };
  }, [connected, client, muted, audioRecorder]);

  // Simplified changeStreams logic - native implementation would differ
  const changeStreams = (next?: UseMediaStreamResult) => async () => {
    // Placeholder - Native video requires different handling
    console.log("Change video stream (native implementation needed)");
    if (next) {
      // const mediaStream = await next.start(); // This hook needs native adaptation
      // setActiveVideoStream(mediaStream);
      // onVideoStreamChange(mediaStream);
    } else {
      setActiveVideoStream(null);
      onVideoStreamChange(null);
    }
    // videoStreams.filter((msr) => msr !== next).forEach((msr) => msr.stop()); // Needs native adaptation
  };

  // Determine styles based on connection state
  const connectionContainerStyle = [
    styles.connectionContainer,
    connected && styles.connectionContainerConnected // Example conditional style
  ];
   const actionsNavStyle = [
    styles.actionsNav,
    !connected && styles.disabled // Example conditional style
  ];
   const connectToggleStyle = [
    styles.actionButton,
    styles.connectToggleButton, // Specific style for connect button
    connected && styles.connectToggleButtonConnected // Example conditional style
  ];
   const micButtonStyle = [
    styles.actionButton,
    styles.micButton, // Specific style for mic button
    !muted && styles.micButtonActive, // Example conditional style
    !connected && styles.disabled // Disable mic button look when not connected
   ];
   const textIndicatorStyle = [
       styles.textIndicator,
       !connected && styles.textIndicatorHidden // Hide text when not connected
   ]

  return (
    // Use View instead of section
    <View style={styles.controlTray}>
      {/* Removed canvas */}
      {/* Use View instead of nav */}
      <View style={actionsNavStyle}>
        {/* Use TouchableOpacity instead of button */}
        <TouchableOpacity
          style={micButtonStyle}
          onPress={() => setMuted(!muted)}
          disabled={!connected} // Disable interaction when not connected
        >
          {/* Use Text for icons */}
          <Text style={styles.iconText}>{!muted ? "MIC" : "MUT"}</Text>
        </TouchableOpacity>

        {/* Use View instead of div */}
        <View style={[styles.actionButton, styles.noAction]}>
          {/* AudioPulse expects volume */}
          <AudioPulse volume={volume} active={connected} hover={false} />
        </View>

        {/* Video buttons removed for simplicity, native implementation needed */}
        {/* {supportsVideo && (
          <>
            <MediaStreamButton ... />
            <MediaStreamButton ... />
          </>
        )} */}
        {children}
      </View>

      {/* Use View instead of div */}
      <View style={connectionContainerStyle}>
        {/* Use View instead of div */}
        <View style={styles.connectionButtonContainer}>
          <TouchableOpacity
            ref={connectButtonRef}
            style={connectToggleStyle}
            onPress={connected ? disconnect : connect}
          >
            {/* Use Text for icons */}
            <Text style={styles.iconText}>
              {connected ? "PAUSE" : "PLAY"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Use Text instead of span */}
        <Text style={textIndicatorStyle}>Streaming</Text>
      </View>
    </View>
  );
}

// Add StyleSheet definition
const styles = StyleSheet.create({
  controlTray: {
    // Position this in _layout.tsx if needed, e.g., bottom: 20
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end', // Align items to bottom (connection button below nav)
    paddingHorizontal: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15, // Add padding for safe areas / home indicator
    width: '100%', // Take full width for positioning
  },
  actionsNav: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: 30,
    padding: 8,
    alignItems: 'center',
    marginRight: 10, // Space between nav and connection button
    borderWidth: 1,
    borderColor: '#cccccc',
  },
  connectionContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end', // Align items to bottom
  },
  connectionContainerConnected: {
    // Add styles for connected state if needed
  },
  connectionButtonContainer: {
    padding: 8,
    backgroundColor: '#f0f0f0', // Light grey background
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginBottom: 4, // Space between button and text
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24, // Make it circular
    backgroundColor: '#e0e0e0', // Medium grey
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4, // Space between buttons in actionsNav
    borderWidth: 1,
    borderColor: 'transparent', // Default no border
  },
  connectToggleButton: {
     backgroundColor: 'blue', // Blue when disconnected
  },
  connectToggleButtonConnected: {
     backgroundColor: 'darkblue', // Darker blue when connected
  },
  micButton: {
     backgroundColor: 'red', // Red when active/unmuted
  },
  micButtonActive: {
      backgroundColor: 'darkred', // Darker red when active/unmuted
  },
  noAction: {
    backgroundColor: 'transparent', // No background for pulse container
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconText: {
    color: '#ffffff', // White icon text
    fontWeight: 'bold',
    fontSize: 10, // Smaller text for icons
  },
  textIndicator: {
    fontSize: 11,
    color: 'blue',
  },
  textIndicatorHidden: {
      opacity: 0,
  },
  disabled: {
    opacity: 0.5, // Make disabled elements look faded
    // Ensure background/border show disabled state if needed
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0'
  }
});

export default memo(ControlTray);