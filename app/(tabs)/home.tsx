import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { Send, User, Wallet } from "lucide-react-native";
import { MiniStamp } from "@/components/Stamp";
import { useTheme } from "@/theme/useTheme";
import { useResponsive } from "@/theme/useResponsive";
import { fonts, radii, spacing } from "@/theme/tokens";
import { haptics } from "@/theme/haptics";
import { CRYPTO_ASSETS, FIAT_BALANCE_NGN, totalCryptoUsd } from "@/data/wallet";

const RECENT = [
  { name: "Amara Obi", amt: "₦84,200", state: "Completed", color: "teal" as const },
  { name: "Femi Bank", amt: "₦12,000", state: "Refunded", color: "rust" as const },
  { name: "Chuka N.", amt: "₦230,500", state: "Completed", color: "teal" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isTablet, columns } = useResponsive();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Real implementation: re-fetch balances + recent activity here.
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.amber} />}
      >
        <View style={[styles.header, { backgroundColor: colors.ink }]}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>Good evening, Tolu</Text>
              <Text style={styles.balance}>${totalCryptoUsd().toLocaleString(undefined, { minimumFractionDigits: 2 })}</Text>
              <Text style={styles.balanceSub}>across {CRYPTO_ASSETS.length} crypto assets</Text>
            </View>
            <Pressable style={styles.avatar} onPress={() => { haptics.tap(); router.push("/(tabs)/profile"); }}>
              <User size={17} color={colors.amber} />
            </Pressable>
          </View>
          <Pressable
            style={styles.sendButton}
            onPress={() => { haptics.confirm(); router.push("/select-asset"); }}
          >
            <Send size={16} color={colors.ink} />
            <Text style={[styles.sendLabel, { color: colors.ink }]}>Send to a bank account</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* Naira wallet — kept visually distinct from crypto since it's a
              different asset class (already-fiat, no swap needed to spend). */}
          <View style={[styles.nairaCard, { backgroundColor: colors.tealSoft }]}>
            <View style={styles.nairaLeft}>
              <View style={[styles.nairaIcon, { backgroundColor: colors.teal }]}>
                <Wallet size={16} color="#fff" />
              </View>
              <View>
                <Text style={[styles.nairaLabel, { color: colors.teal }]}>Naira wallet</Text>
                <Text style={[styles.nairaSub, { color: colors.slate }]}>From refunds & cash-ins</Text>
              </View>
            </View>
            <Text style={[styles.nairaAmount, { color: colors.textOnSurface }]}>
              ₦{FIAT_BALANCE_NGN.toLocaleString()}
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textOnSurface, marginTop: spacing.xl }]}>
            Your crypto
          </Text>
          <View style={[styles.assetGrid, isTablet && { flexWrap: "wrap", flexDirection: "row", gap: spacing.md }]}>
            {CRYPTO_ASSETS.map((a) => (
              <View
                key={a.symbol}
                style={[
                  styles.assetRow,
                  { borderColor: colors.line },
                  isTablet && { width: `${100 / columns - 2}%` },
                ]}
              >
                <View style={styles.assetLeft}>
                  <View style={[styles.assetChip, { backgroundColor: a.color }]}>
                    <Text style={styles.assetChipLabel}>{a.symbol.slice(0, 1)}</Text>
                  </View>
                  <View>
                    <Text style={[styles.assetName, { color: colors.textOnSurface }]}>{a.name}</Text>
                    <Text style={[styles.assetBalance, { color: colors.slate }]}>
                      {a.balance} {a.symbol}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.assetUsd, { color: colors.textOnSurface }]}>
                  ${a.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sectionRow}>
            <Text style={[styles.sectionTitle, { color: colors.textOnSurface }]}>Recent</Text>
            <Pressable onPress={() => { haptics.tap(); router.push("/(tabs)/history"); }}>
              <Text style={[styles.sectionLink, { color: colors.slate }]}>See all</Text>
            </Pressable>
          </View>
          {RECENT.map((t, i) => (
            <View key={i} style={[styles.txRow, i > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}>
              <View style={styles.txLeft}>
                <MiniStamp color={t.color === "teal" ? colors.teal : colors.rust} />
                <View>
                  <Text style={[styles.txName, { color: colors.textOnSurface }]}>{t.name}</Text>
                  <Text style={[styles.txState, { color: colors.slate }]}>{t.state}</Text>
                </View>
              </View>
              <Text style={[styles.txAmt, { color: colors.textOnSurface }]}>{t.amt}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 56,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  greeting: { fontFamily: fonts.body, fontSize: 12, color: "#9694AE" },
  balance: { fontFamily: fonts.displayBold, fontSize: 28, color: "#F2EFE8", marginTop: 4 },
  balanceSub: { fontFamily: fonts.mono, fontSize: 11, color: "#8F8DAA", marginTop: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#211F3D", alignItems: "center", justifyContent: "center" },
  sendButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: "#E8A33D", borderRadius: radii.lg, paddingVertical: 14, marginTop: spacing.xl,
  },
  sendLabel: { fontFamily: fonts.display, fontWeight: "600", fontSize: 14.5 },
  body: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.xl },
  nairaCard: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderRadius: radii.md, padding: spacing.lg,
  },
  nairaLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  nairaIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  nairaLabel: { fontFamily: fonts.bodySemibold, fontSize: 13 },
  nairaSub: { fontFamily: fonts.mono, fontSize: 10.5, marginTop: 1 },
  nairaAmount: { fontFamily: fonts.mono, fontSize: 15 },
  sectionTitle: { fontFamily: fonts.display, fontWeight: "600", fontSize: 13.5, marginBottom: spacing.md },
  assetGrid: { gap: 0 },
  assetRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 12, borderTopWidth: 1,
  },
  assetLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  assetChip: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  assetChipLabel: { fontFamily: fonts.displayBold, fontSize: 13, color: "#fff" },
  assetName: { fontFamily: fonts.bodyMedium, fontSize: 13.5 },
  assetBalance: { fontFamily: fonts.mono, fontSize: 11, marginTop: 1 },
  assetUsd: { fontFamily: fonts.mono, fontSize: 13 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.xl, marginBottom: spacing.md },
  sectionLink: { fontFamily: fonts.body, fontSize: 12 },
  txRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  txLeft: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  txName: { fontFamily: fonts.bodyMedium, fontSize: 13.5 },
  txState: { fontFamily: fonts.mono, fontSize: 11 },
  txAmt: { fontFamily: fonts.mono, fontSize: 13 },
});
