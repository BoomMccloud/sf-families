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

export type GetAudioContextOptions = AudioContextOptions & {
    id?: string;
  };
  
  const map: Map<string, AudioContext> = new Map();
  
  export const audioContext: (
    options?: GetAudioContextOptions,
  ) => Promise<AudioContext> = (() => {
    // Define didInteract promise creator, but don't call it immediately
    let didInteractPromise: Promise<void> | null = null;
    const createDidInteractPromise = () => {
      if (!didInteractPromise) {
        didInteractPromise = new Promise((res) => {
          // Only add listeners if window exists (client-side)
          if (typeof window !== 'undefined') {
            console.log('Attaching interaction listeners for AudioContext');
            window.addEventListener("pointerdown", () => res(), { once: true });
            window.addEventListener("keydown", () => res(), { once: true });
          } else {
            // Resolve immediately if not in a browser environment
            // Or potentially reject if interaction is strictly required
            res();
          }
        });
      }
      return didInteractPromise;
    };
  
    return async (options?: GetAudioContextOptions) => {
      try {
        const a = new Audio();
        a.src =
          "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
        await a.play();
        if (options?.id && map.has(options.id)) {
          const ctx = map.get(options.id);
          if (ctx) {
            return ctx;
          }
        }
        const ctx = new AudioContext(options);
        if (options?.id) {
          map.set(options.id, ctx);
        }
        return ctx;
      } catch (_e) {
        // Ensure interaction promise is created and awaited *here*
        await createDidInteractPromise();
        if (options?.id && map.has(options.id)) {
          const ctx = map.get(options.id);
          if (ctx) {
            return ctx;
          }
        }
        const ctx = new AudioContext(options);
        if (options?.id) {
          map.set(options.id, ctx);
        }
        return ctx;
      }
    };
  })();
  
  export const blobToJSON = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          const json = JSON.parse(reader.result as string);
          resolve(json);
        } else {
          reject("oops");
        }
      };
      reader.readAsText(blob);
    });
  
  export function base64ToArrayBuffer(base64: string) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }