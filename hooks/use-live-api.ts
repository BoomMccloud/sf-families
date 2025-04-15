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
import { Part } from "@google/generative-ai";

export type UseLiveAPIResults = {
  client: MultimodalLiveClient;
  setConfig: (config: LiveConfig) => void;
  config: LiveConfig;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  updateLanguageAndReconnect: (languageCode: string) => Promise<void>;
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

  const [connected, setConnected] = useState(false);
  const [config, setConfig] = useState<LiveConfig>({
    model: "models/gemini-2.0-flash-exp",
    generationConfig: {
      responseModalities: "audio",
    }
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
    console.log(config);
    if (!config) {
      throw new Error("config has not been set");
    }
    client.disconnect();
    await client.connect(config);
    setConnected(true);
  }, [client, setConnected, config]);

  const disconnect = useCallback(async () => {
    client.disconnect();
    setConnected(false);
  }, [setConnected, client]);

  const updateLanguageAndReconnect = useCallback(async (languageCode: string) => {
    // 1. Construct the system instruction
    const instructionText = `You are the helpful assistant for the SF Families App.
The SF Families App will help users find information and support for their child's early education. In this first phase, users can:
• Learn about their child's development: Access helpful content about how children grow and learn.
• Discover ECE financial resources: Find information about financial aid options like ELFA, FRC, and state subsidies to help pay for early care and education programs.
• Understand available support: Increase awareness of the financial assistance available for early childhood education.

This is currently a demo application. If the user asks questions beyond these topics or requests features not listed, let them know that new features will be added in the future.

RESPOND IN ${languageCode}. YOU MUST RESPOND UNMISTAKABLY IN ${languageCode}.`;
    const systemInstruction = { parts: [{ text: instructionText }] };

    // 2. Create the new config object, deeply merging generationConfig
    const newConfig: LiveConfig = {
      ...config, // Spread existing config
      systemInstruction, // Add new system instruction
      generationConfig: {
        ...config.generationConfig, // Spread existing generation config
        speechConfig: {
          ...config.generationConfig?.speechConfig, // Spread existing speech config
          language_code: languageCode, // Set the new language code
        },
      },
    };

    // Update the config state (important for subsequent calls or UI display)
    setConfig(newConfig);

    console.log("Updating language settings and reconnecting with:", newConfig);

    // Perform the disconnect and connect logic directly here
    // using the newConfig object to avoid state update delays.
    client.disconnect();
    try {
      await client.connect(newConfig);
      setConnected(true);
      console.log("Reconnected successfully with updated language settings.");
    } catch (error) {
      console.error("Failed to reconnect after updating language settings:", error);
      setConnected(false);
      throw error;
    }
  }, [client, config, setConfig, setConnected]);

  return {
    client,
    config,
    setConfig,
    connected,
    connect,
    disconnect,
    updateLanguageAndReconnect,
    volume,
  };
}