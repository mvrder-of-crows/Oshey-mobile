import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Check } from "lucide-react-native";
import { fonts } from "../theme/tokens";
import { useTheme } from "../theme/useTheme";

/**
 * Stamp — the signature element of Oshey.
 * Every confirmed/settled state renders as a rubber-stamp seal
 * instead of a generic colored dot or checkmark badge.
 */
export function Stamp({
  label = "OSHEY",
  size = 92,
  color,
  tilt = -8,
}: {
  label?: string;
  size?: number;
  color?: string;
  tilt?: number;
}) {
  const { colors } = useTheme();
  const resolved = color ?? colors.teal;
  return (
    <View
      style={[
        styles.stamp,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: resolved,
          transform: [{ rotate: `${tilt}deg` }],
        },
      ]}
    >
      <Text style={[styles.stampLabel, { color: resolved, fontSize: size * 0.16 }]}>{label}</Text>
      <Text style={[styles.stampSub, { color: resolved, fontSize: size * 0.1 }]}>✓ VERIFIED</Text>
    </View>
  );
}

/** Small inline stamp used in lists and timelines */
export function MiniStamp({ color, size = 22 }: { color?: string; size?: number }) {
  const { colors } = useTheme();
  const resolved = color ?? colors.teal;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: resolved,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check size={size * 0.5} color={resolved} strokeWidth={3} />
    </View>
  );
}

/** Dashed pending variant — used for in-progress ledger steps */
export function PendingStamp({ color, size = 22 }: { color?: string; size?: number }) {
  const { colors } = useTheme();
  const resolved = color ?? colors.amber;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: resolved,
        borderStyle: "dashed",
      }}
    />
  );
}

const styles = StyleSheet.create({
  stamp: {
    borderWidth: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  stampLabel: {
    fontFamily: fonts.displayBold,
    letterSpacing: 1,
    textAlign: "center",
  },
  stampSub: {
    fontFamily: fonts.mono,
    marginTop: 2,
    opacity: 0.85,
    textAlign: "center",
  },
});
