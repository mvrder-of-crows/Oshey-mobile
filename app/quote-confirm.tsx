import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ChevronDown, ChevronUp, AlertTriangle, Check, TrendingUp, TrendingDown } from "lucide-react-native";
import { Screen, TopBar, PrimaryButton } from "@/components/UI";
import { useTheme } from "@/theme/useTheme";
import { fonts, radii, spacing } from "@/theme/tokens";
import { haptics } from "@/theme/haptics";
import { findAsset } from "@/data/wallet";

const FEE_ROWS: [string, string][] = [
  ["Swap fee", "₦512"],
  ["Network fee", "₦380"],
  ["Platform margin", "₦792"],
];

const PAYOUT_NGN = 84200;

export default function QuoteConfirmScreen() {
  const router = useRouter();
  const { assetSymbol } = useLocalSearchParams<{ assetSymbol?: string }>();
  const asset = findAsset(assetSymbol ?? "USDT");
  const { colors } = useTheme();

  const [breakdown, setBreakdown] = useState(false);
  const [ackDegraded, setAckDegraded] = useState(false);
  const railDegraded = true;

  // Live rate ticker — simulates a streaming price feed so the quote feels
  // alive instead of a static number frozen at page-load.
  const baseRate = asset.usdValue / asset.balance || 1;
  const [rate, setRate] = useState(baseRate);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const prevRate = useRef(baseRate);

  useEffect(() => {
    const id = setInterval(() => {
      setRate((r) => {
        const drift = r * (Math.random() * 0.002 - 0.001);
        const next = r + drift;
        setDirection(next >= prevRate.current ? "up" : "down");
        prevRate.current = next;
        return next;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const fromAmount = (PAYOUT_NGN / 1585 / rate).toFixed(asset.symbol === "BTC" ? 6 : 4);
  const canProceed = !railDegraded || ackDegraded;

  return (
    <Screen>
      <TopBar title="Confirm quote" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.summaryCard, { backgroundColor: colors.ink }]}>
          <Text style={styles.summaryLabel}>RECIPIENT GETS</Text>
          <Text style={styles.summaryAmount}>₦{PAYOUT_NGN.toLocaleString()}.00</Text>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>You send</Text>
            <Text style={styles.summaryRowValue}>{fromAmount} {asset.symbol}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryRowLabel}>Live rate</Text>
            <View style={styles.rateRow}>
              {direction === "up" ? (
                <TrendingUp size={11} color="#5FCBA6" />
              ) : direction === "down" ? (
                <TrendingDown size={11} color="#E28B85" />
              ) : null}
              <Text style={styles.summaryRowValue}>
                1 {asset.symbol} ≈ ${rate.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.feeToggle} onPress={() => setBreakdown(!breakdown)}>
          <Text style={[styles.feeToggleLabel, { color: colors.textOnSurface }]}>Platform fee — ₦1,684</Text>
          {breakdown ? <ChevronUp size={16} color={colors.textOnSurface} /> : <ChevronDown size={16} color={colors.textOnSurface} />}
        </Pressable>
        {breakdown && (
          <View style={[styles.feeBreakdown, { backgroundColor: colors.paperDim }]}>
            {FEE_ROWS.map(([label, value]) => (
              <View key={label} style={styles.feeRow}>
                <Text style={[styles.feeRowLabel, { color: colors.slate }]}>{label}</Text>
                <Text style={[styles.feeRowLabel, { color: colors.slate }]}>{value}</Text>
              </View>
            ))}
          </View>
        )}

        {railDegraded && (
          <View style={[styles.warning, { backgroundColor: colors.rustSoft }]}>
            <AlertTriangle size={16} color={colors.rust} style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.warningTitle, { color: colors.rust }]}>Payout corridor is degraded right now</Text>
              <Text style={[styles.warningBody, { color: colors.textOnSurface }]}>
                If this transaction fails, you&apos;ll cover the refund swap fee instead of
                Oshey. You can wait, or continue anyway.
              </Text>
              <Pressable
                style={styles.ackRow}
                onPress={() => { haptics.tap(); setAckDegraded(!ackDegraded); }}
              >
                <View style={[styles.checkbox, { borderColor: colors.rust }, ackDegraded && { backgroundColor: colors.rust }]}>
                  {ackDegraded && <Check size={12} color="#fff" />}
                </View>
                <Text style={[styles.ackLabel, { color: colors.textOnSurface }]}>I understand and want to proceed</Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton
          label="Confirm & send"
          disabled={!canProceed}
          haptic="confirm"
          onPress={() => router.push("/signing")}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg },
  summaryCard: { borderRadius: radii.md, padding: spacing.lg },
  summaryLabel: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1, color: "#9694AE" },
  summaryAmount: { fontFamily: fonts.displayBold, fontSize: 26, color: "#F2EFE8", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#2E2C4E", marginVertical: spacing.md },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 6, alignItems: "center" },
  summaryRowLabel: { fontFamily: fonts.mono, fontSize: 12, color: "#B9B7CC" },
  summaryRowValue: { fontFamily: fonts.mono, fontSize: 12, color: "#B9B7CC" },
  rateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  feeToggle: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingVertical: spacing.md, marginTop: spacing.lg,
  },
  feeToggleLabel: { fontFamily: fonts.body, fontSize: 13 },
  feeBreakdown: { borderRadius: radii.sm, padding: spacing.md, gap: 6 },
  feeRow: { flexDirection: "row", justifyContent: "space-between" },
  feeRowLabel: { fontFamily: fonts.mono, fontSize: 11.5 },
  warning: { flexDirection: "row", gap: spacing.sm, borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg },
  warningTitle: { fontFamily: fonts.bodySemibold, fontSize: 13 },
  warningBody: { fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16, marginTop: 4 },
  ackRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  ackLabel: { fontFamily: fonts.body, fontSize: 12 },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
});
