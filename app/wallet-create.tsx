import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { AlertTriangle, Eye, EyeOff, Copy, Check } from "lucide-react-native";
import * as Clipboard from "expo-clipboard";
import { Screen, TopBar, PrimaryButton } from "@/components/UI";
import { colors, fonts, radii, spacing } from "@/theme/tokens";

// In production this comes from a secure key-generation module, never rendered
// until the user explicitly asks to view it.
const RECOVERY_WORDS = ["forest", "amber", "cassava", "drum", "harbor", "9214", "lantern", "yield"];

export default function WalletCreateScreen() {
  const router = useRouter();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(true);

  async function onCopy() {
    await Clipboard.setStringAsync(RECOVERY_WORDS.join(" "));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <Screen>
      <TopBar title="Your key" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.warning}>
          <AlertTriangle size={16} color={colors.rust} style={{ marginTop: 2 }} />
          <Text style={styles.warningText}>
            This key controls your funds. Oshey never stores it. Write it down — if
            it&apos;s lost, there is no recovery.
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>RECOVERY PHRASE</Text>
            <TouchableOpacity onPress={() => setRevealed(!revealed)}>
              {revealed ? <EyeOff size={14} color={colors.amber} /> : <Eye size={14} color={colors.amber} />}
            </TouchableOpacity>
          </View>
          <View style={styles.wordGrid}>
            {RECOVERY_WORDS.map((w, i) => (
              <View key={i} style={styles.wordChip}>
                <Text style={styles.wordIndex}>{i + 1}</Text>
                <Text style={styles.wordText}>{revealed ? w : "••••••"}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity onPress={onCopy} style={styles.copyRow}>
            {copied ? <Check size={13} color={colors.teal} /> : <Copy size={13} color="#B9B7CC" />}
            <Text style={styles.copyLabel}>{copied ? "Copied" : "Copy to clipboard"}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.checkRow} onPress={() => setConfirmed(!confirmed)}>
          <View style={[styles.checkbox, confirmed && styles.checkboxOn]}>
            {confirmed && <Check size={12} color={colors.paper} />}
          </View>
          <Text style={styles.checkLabel}>
            Also hash &amp; store this key on this device only, for faster sign-in next time.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="I've saved it safely" onPress={() => router.push("/(tabs)/home")} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  warning: {
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.rustSoft,
    borderRadius: radii.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "#C1443B33",
  },
  warningText: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.ink },
  card: { backgroundColor: colors.ink, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md },
  cardLabel: { fontFamily: fonts.mono, fontSize: 11, letterSpacing: 1, color: colors.slateOnDark },
  wordGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  wordChip: {
    width: "47%",
    flexDirection: "row",
    gap: spacing.sm,
    backgroundColor: colors.ink2,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  wordIndex: { fontFamily: fonts.mono, fontSize: 13, color: colors.amber },
  wordText: { fontFamily: fonts.mono, fontSize: 13, color: colors.paper },
  copyRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.lg },
  copyLabel: { fontFamily: fonts.body, fontSize: 12, color: "#B9B7CC" },
  checkRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.xl, alignItems: "flex-start" },
  checkbox: {
    width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: colors.slate,
    marginTop: 2, alignItems: "center", justifyContent: "center",
  },
  checkboxOn: { backgroundColor: colors.teal, borderColor: colors.teal },
  checkLabel: { flex: 1, fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.slate },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
});
