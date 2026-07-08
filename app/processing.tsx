import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { MiniStamp, PendingStamp } from "@/components/Stamp";
import { colors, fonts, spacing } from "@/theme/tokens";

type Step = { label: string; done: boolean; pending?: boolean; time: string };

export default function ProcessingScreen() {
  const router = useRouter();
  const [steps, setSteps] = useState<Step[]>([
    { label: "Escrow held", done: true, time: "2:40:22 PM" },
    { label: "Fiat payout initiated", done: true, time: "2:40:24 PM" },
    { label: "Awaiting bank confirmation", done: false, pending: true, time: "" },
  ]);

  useEffect(() => {
    // Real implementation: poll a transaction-status endpoint or subscribe
    // to a push event; this timer only simulates that arrival for the demo.
    const timer = setTimeout(() => {
      setSteps((s) => s.map((step) => ({ ...step, done: true, pending: false })));
      setTimeout(() => router.replace("/success"), 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <View style={styles.spinnerWrap}>
        <ActivityIndicator size="large" color={colors.amber} />
      </View>
      <Text style={styles.title}>Sending to Amaka…</Text>
      <Text style={styles.subtitle}>
        Taking a little longer than usual — we&apos;ll notify you the moment it lands.
      </Text>

      <View style={styles.timeline}>
        {steps.map((s, i) => (
          <View key={i} style={styles.timelineRow}>
            {s.done ? <MiniStamp color={colors.teal} /> : <PendingStamp color={colors.amber} />}
            <View style={styles.timelineText}>
              <Text style={[styles.stepLabel, s.pending && { color: colors.amber }]}>{s.label}</Text>
              <Text style={styles.stepTime}>
                {s.pending ? "Non-blocking · you can close this" : s.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, paddingHorizontal: spacing.xl, paddingTop: 64 },
  spinnerWrap: { alignItems: "center", marginBottom: spacing.xl },
  title: { fontFamily: fonts.display, fontWeight: "600", fontSize: 17, color: colors.ink, textAlign: "center" },
  subtitle: { fontFamily: fonts.body, fontSize: 12.5, color: colors.slate, textAlign: "center", marginTop: 4 },
  timeline: { marginTop: spacing.xxl, paddingLeft: 4 },
  timelineRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  timelineText: { flex: 1 },
  stepLabel: { fontFamily: fonts.body, fontSize: 13.5, color: colors.ink },
  stepTime: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.slate, marginTop: 2 },
});
