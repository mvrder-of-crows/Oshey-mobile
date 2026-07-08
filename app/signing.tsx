import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as LocalAuthentication from "expo-local-authentication";
import { Fingerprint } from "lucide-react-native";
import { colors, fonts, spacing } from "@/theme/tokens";

export default function SigningScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "failed">("idle");

  useEffect(() => {
    async function run() {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        // Fall back gracefully — do not block a transaction on missing hardware.
        router.replace("/processing");
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm this transaction",
      });
      if (result.success) {
        router.replace("/processing");
      } else {
        setStatus("failed");
      }
    }
    run();
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.iconWrap}>
        <Fingerprint size={32} color={colors.amber} />
      </View>
      <Text style={styles.title}>Confirm with biometrics</Text>
      <Text style={styles.subtitle}>
        A fresh signature is required to move funds — separate from your
        app-unlock passcode.
      </Text>
      {status === "failed" && (
        <Text style={styles.retry} onPress={() => router.replace("/signing")}>
          Couldn&apos;t verify — tap to try again
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ink, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl },
  iconWrap: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.ink2, alignItems: "center", justifyContent: "center" },
  title: { fontFamily: fonts.display, fontWeight: "600", fontSize: 16, color: colors.paper, marginTop: spacing.lg },
  subtitle: { fontFamily: fonts.body, fontSize: 12.5, lineHeight: 17, color: colors.slateOnDark, textAlign: "center", marginTop: spacing.sm },
  retry: { fontFamily: fonts.body, fontSize: 13, color: colors.amber, marginTop: spacing.xl },
});
