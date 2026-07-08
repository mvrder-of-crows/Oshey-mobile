import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Fingerprint } from "lucide-react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export default function LoginScreen() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  function onKey(k: string) {
    if (k === "⌫") return setPin((p) => p.slice(0, -1));
    if (k === "") return;
    const next = (pin + k).slice(0, 6);
    setPin(next);
    if (next.length === 6) {
      // Real implementation: verify against the locally hashed PIN.
      setTimeout(() => router.replace("/(tabs)/home"), 200);
    }
  }

  return (
    <View style={styles.root}>
      <Fingerprint size={26} color={colors.amber} />
      <Text style={styles.title}>Enter your PIN</Text>
      <View style={styles.dots}>
        {Array.from({ length: 6 }).map((_, i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
        ))}
      </View>
      <View style={styles.pad}>
        {KEYS.map((k, i) => (
          <TouchableOpacity key={i} style={styles.key} onPress={() => onKey(k)} disabled={!k}>
            <Text style={styles.keyLabel}>{k}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, alignItems: "center", paddingTop: 96 },
  title: { fontFamily: fonts.display, fontWeight: "600", fontSize: 16, color: colors.paper, marginTop: spacing.md },
  dots: { flexDirection: "row", gap: 10, marginTop: spacing.xl },
  dot: { width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: colors.slateOnDark },
  dotFilled: { backgroundColor: colors.amber, borderColor: colors.amber },
  pad: { flexDirection: "row", flexWrap: "wrap", width: 260, marginTop: 48, justifyContent: "center" },
  key: { width: 80, height: 64, alignItems: "center", justifyContent: "center" },
  keyLabel: { fontFamily: fonts.display, fontSize: 22, color: colors.paper },
});
