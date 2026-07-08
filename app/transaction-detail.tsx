import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Screen, TopBar } from "@/components/UI";
import { Stamp, MiniStamp } from "@/components/Stamp";
import { colors, fonts, radii, spacing } from "@/theme/tokens";

const LEDGER_ROWS: [string, string, string][] = [
  ["2:40:02 PM", "Recipient verified", "Amaka T. Chukwuemeka"],
  ["2:40:11 PM", "Rail health: healthy", "Oshey absorbs refund risk"],
  ["2:40:14 PM", "Quote locked", "1 BTC ≈ $61,204"],
  ["2:40:19 PM", "Escrow held", "32.10 USDT"],
  ["2:40:22 PM", "Payout initiated", "GTBank · NUBAN ••3390"],
  ["2:41:09 PM", "Payout confirmed", "₦84,200.00"],
];

export default function TransactionDetailScreen() {
  const router = useRouter();
  return (
    <Screen>
      <TopBar title="Ledger detail" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Stamp size={54} tilt={-6} />
          <View>
            <Text style={styles.headerAmount}>₦84,200.00</Text>
            <Text style={styles.headerId}>TXN-4482-OSH</Text>
          </View>
        </View>

        <View style={styles.timeline}>
          {LEDGER_ROWS.map(([time, label, sub], i) => (
            <View key={i} style={styles.row}>
              <MiniStamp color={i === LEDGER_ROWS.length - 1 ? colors.teal : colors.amber} />
              <View style={styles.rowText}>
                <Text style={styles.rowLabel}>{label}</Text>
                <Text style={styles.rowSub}>{sub}</Text>
                <Text style={styles.rowTime}>{time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xl },
  headerCard: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    backgroundColor: colors.ink, borderRadius: radii.md, padding: spacing.lg,
  },
  headerAmount: { fontFamily: fonts.display, fontWeight: "600", fontSize: 15, color: colors.paper },
  headerId: { fontFamily: fonts.mono, fontSize: 11, color: colors.slateOnDark, marginTop: 2 },
  timeline: { marginTop: spacing.xl, paddingLeft: 4 },
  row: { flexDirection: "row", gap: spacing.md },
  rowText: { flex: 1, paddingBottom: spacing.lg },
  rowLabel: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.ink },
  rowSub: { fontFamily: fonts.mono, fontSize: 10.5, color: colors.slate, marginTop: 2 },
  rowTime: { fontFamily: fonts.mono, fontSize: 10, color: "#B3AF9F", marginTop: 2 },
});
