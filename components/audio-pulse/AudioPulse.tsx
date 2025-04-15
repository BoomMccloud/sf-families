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

import React from "react";
import { StyleSheet, View } from 'react-native';

const lineCount = 3;

export type AudioPulseProps = {
  active: boolean;
  volume: number;
  hover?: boolean;
};

export default function AudioPulse({ active, volume, hover }: AudioPulseProps) {
  const containerStyle = [
    styles.audioPulse,
    active ? styles.audioPulseActive : styles.audioPulseInactive,
  ];

  return (
    <View style={containerStyle}>
      {Array(lineCount)
        .fill(null)
        .map((_, i) => (
          <View
            key={i}
            style={styles.line}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  audioPulse: {
    flexDirection: 'row',
    width: 24,
    height: 24,
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingVertical: 5,
    opacity: 0.5,
  },
  audioPulseActive: {
    opacity: 1,
  },
  audioPulseInactive: {
      opacity: 0.3,
  },
  line: {
    width: 4,
    height: '50%',
    backgroundColor: '#a0a0a0',
    borderRadius: 2,
  },
});