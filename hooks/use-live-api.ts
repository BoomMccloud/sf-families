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

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MultimodalLiveAPIClientConnection,
  MultimodalLiveClient,
} from "../lib/multimodal-live-client";
import { LiveConfig } from "../types/multimodal-live-types";
import { AudioStreamer } from "../lib/audio-streamer";
import { audioContext } from "../lib/utils";
import VolMeterWorket from "../lib/worklets/vol-meter";
import { Part, Content } from "@google/generative-ai";
import instructionData from "../config/system-instructions.json";
import { getPromptNameByApiCode } from "../config/languageConfig";

// Mapping is now removed, using helper function instead
// const languageCodeToName: { [key: string]: string } = { ... };

// Helper function to create system instruction object using Content type
const createSystemInstruction = (languageName: string): Content => {
  if (!instructionData.template) {
    console.error("System instruction template is missing from JSON.");
    return { parts: [{ text: "Default fallback instruction." }], role: 'user' }; // Fallback with role
  }
  const instructionText = instructionData.template.replace(
    /\{languageCode\}/g,
    languageName
  );
  return { parts: [{ text: instructionText }], role: 'user' }; // Added role: 'user'
};

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateLanguageAndReconnect: (newLanguageCode: string) => Promise<void>;
  languageCode: string;
  volume: number;
};

export function useLiveAPI({
  url,
  apiKey,
}: MultimodalLiveAPIClientConnection): UseLiveAPIResults {
  const client = useMemo(
    () => new MultimodalLiveClient({ url, apiKey }),
    [url, apiKey],
  );
  const audioStreamerRef = useRef<AudioStreamer | null>(null);

  // Default API language code
  const defaultApiLangCode = 'en-US';
  const [languageCode, setLanguageCode] = useState<string>(defaultApiLangCode);
  const [connected, setConnected] = useState(false);

  // Initialize config state with system instructions and speech config
  const [config, setConfig] = useState<LiveConfig>(() => {
    const initialPromptName = getPromptNameByApiCode(languageCode);
    if (!initialPromptName) {
        console.error(`Initial prompt name not found for API code: ${languageCode}. Defaulting to English.`);
        // Provide a fallback or handle error appropriately
    }
    return {
        model: "models/gemini-2.0-flash-exp",
        systemInstruction: createSystemInstruction(initialPromptName || 'English'), // Use fetched name or fallback
        generationConfig: {
            responseModalities: "audio",
            speechConfig: {
                language_code: languageCode, // Use initial language code state
            },
        }
    };
  });

  const [volume, setVolume] = useState(0);

  // register audio for streaming server -> speakers
  useEffect(() => {
    if (!audioStreamerRef.current) {
      audioContext({ id: "audio-out" }).then((audioCtx: AudioContext) => {
        audioStreamerRef.current = new AudioStreamer(audioCtx);
        audioStreamerRef.current
          .addWorklet<any>("vumeter-out", VolMeterWorket, (ev: any) => {
            setVolume(ev.data.volume);
          })
          .then(() => {
            // Successfully added worklet
          });
      });
    }
  }, [audioStreamerRef]);

  useEffect(() => {
    const onClose = () => {
      setConnected(false);
    };

    const stopAudioStreamer = () => audioStreamerRef.current?.stop();

    const onAudio = (data: ArrayBuffer) =>
      audioStreamerRef.current?.addPCM16(new Uint8Array(data));

    client
      .on("close", onClose)
      .on("interrupted", stopAudioStreamer)
      .on("audio", onAudio);

    return () => {
      client
        .off("close", onClose)
        .off("interrupted", stopAudioStreamer)
        .off("audio", onAudio);
    };
  }, [client]);

  const connect = useCallback(async () => {
    console.log("Connecting with config:", config);
    if (!config) {
      throw new Error("config has not been set");
    }
    if (connected) {
        client.disconnect();
        setConnected(false);
    }
    try {
        await client.connect(config);
        setConnected(true);
        console.log("Connected successfully.");
    } catch (error) {
        console.error("Failed to connect:", error);
        setConnected(false);
        throw error;
    }
  }, [client, setConnected, config, connected]);

  const disconnect = useCallback(async () => {
    if (connected) {
        client.disconnect();
        setConnected(false);
    }
  }, [setConnected, client, connected]);

  const updateLanguageAndReconnect = useCallback(async (newApiLanguageCode: string) => {
    // Get the prompt name using the helper function
    const newPromptName = getPromptNameByApiCode(newApiLanguageCode);

    if (!newPromptName) {
      console.error(`Prompt name not found for API code: ${newApiLanguageCode}. Cannot update instruction. Using previous or default.`);
      // Decide handling: Use old prompt name? Default to English? For now, let createSystemInstruction use fallback.
      // We still proceed to update the languageCode state and speechConfig below.
    }

    console.log(`Attempting to update API language to ${newApiLanguageCode} (Prompt name: ${newPromptName || 'Fallback'})`);

    // Create the new config based on the existing one, updating only language parts
    const newConfig: LiveConfig = {
      ...config,
      // Use fetched name if available, otherwise createSystemInstruction handles fallback
      systemInstruction: createSystemInstruction(newPromptName || 'English'),
      generationConfig: {
        ...config.generationConfig,
        speechConfig: {
          ...config.generationConfig?.speechConfig,
          language_code: newApiLanguageCode, // Set the new API language code for speech
        },
      },
    };

    // Update states
    setLanguageCode(newApiLanguageCode); // Update the state holding the current API code
    setConfig(newConfig);

    console.log("Updating language settings and reconnecting with:", newConfig);

    if (connected) {
        client.disconnect();
        setConnected(false);
    }

    try {
      await client.connect(newConfig);
      setConnected(true);
      console.log("Reconnected successfully with updated language settings.");
    } catch (error) {
      console.error("Failed to reconnect after updating language settings:", error);
      setConnected(false);
      // Consider reverting state on failure
      // setLanguageCode(config.generationConfig?.speechConfig?.language_code || defaultApiLangCode); // Revert language code state
      // setConfig(config); // Revert config state
      throw error;
    }
    // Changed dependencies: removed config, setConfig, setLanguageCode as they are covered by useCallback's nature when using state setters.
    // Added dependency on 'client' and 'connected' state.
  }, [client, connected]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    updateLanguageAndReconnect,
    languageCode,
    volume,
  };
}