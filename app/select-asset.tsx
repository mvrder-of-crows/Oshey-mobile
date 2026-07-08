import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Screen, TopBar } from "@/components/UI";
import { useTheme } from "@/theme/useTheme";
import { fonts, spacing, radii } from "@/theme/tokens";
import { haptics } from "@/theme/haptics";
import { CRYPTO_ASSETS } from "@/data/wallet";

export default function SelectAssetScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Screen>
      <TopBar title="Send from" onBack={() => router.back()} />
      <FlatList
        contentContainerStyle={{ paddingHorizontal: spacing.xl }}
        data={CRYPTO_ASSETS}
        keyExtractor={(a) => a.symbol}
        renderItem={({ item, index }) => (
          <Pressable
            style={[styles.row, index > 0 && { borderTopWidth: 1, borderTopColor: colors.line }]}
            onPress={() => {
              haptics.tap();
              router.push({ pathname: "/verify-recipient", params: { assetSymbol: item.symbol } });
            }}
          >
            <View style={styles.left}>
              <View style={[styles.chip, { backgroundColor: item.color }]}>
                <Text style={styles.chipLabel}>{item.symbol.slice(0, 1)}</Text>
              </View>
              <View>
                <Text style={[styles.name, { color: colors.textOnSurface }]}>{item.name}</Text>
                <Text style={[styles.balance, { color: colors.slate }]}>
                  {item.balance} {item.symbol}
                </Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={[styles.usd, { color: colors.textOnSurface }]}>
                ${item.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </Text>
              <ChevronRight size={14} color={colors.slate} />
            </View>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  left: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  chip: { width: 36, height: 36, borderRadius: radii.full, alignItems: "center", justifyContent: "center" },
  chipLabel: { fontFamily: fonts.displayBold, fontSize: 14, color: "#fff" },
  name: { fontFamily: fonts.bodyMedium, fontSize: 14 },
  balance: { fontFamily: fonts.mono, fontSize: 11, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  usd: { fontFamily: fonts.mono, fontSize: 13 },
});
