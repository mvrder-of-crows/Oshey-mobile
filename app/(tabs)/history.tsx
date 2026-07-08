import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Screen, TopBar } from "@/components/UI";
import { MiniStamp } from "@/components/Stamp";
import { colors, fonts, spacing } from "@/theme/tokens";

const TXS = [
  { name: "Amara Obi", amt: "₦84,200", state: "Completed", color: colors.teal },
  { name: "Femi Bank", amt: "₦12,000", state: "Refunded", color: colors.rust },
  { name: "Chuka N.", amt: "₦230,500", state: "Completed", color: colors.teal },
  { name: "Bisi Fashola", amt: "₦45,000", state: "Completed", color: colors.teal },
  { name: "David Okoro", amt: "₦8,900", state: "Verification failed", color: colors.rust },
];

export default function HistoryScreen() {
  const router = useRouter();
  return (
    <Screen>
      <TopBar title="Ledger" />
      <FlatList
        contentContainerStyle={{ paddingHorizontal: spacing.xl }}
        data={TXS}
        keyExtractor={(item, i) => `${item.name}-${i}`}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={[styles.row, index > 0 && styles.rowBorder]}
            onPress={() => router.push("/transaction-detail")}
          >
            <View style={styles.left}>
              <MiniStamp color={item.color} />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.state}>{item.state}</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Text style={styles.amt}>{item.amt}</Text>
              <ChevronRight size={14} color={colors.slate} />
            </View>
          </TouchableOpacity>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  left: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  name: { fontFamily: fonts.bodyMedium, fontSize: 13.5, color: colors.ink },
  state: { fontFamily: fonts.mono, fontSize: 11, color: colors.slate },
  right: { flexDirection: "row", alignItems: "center", gap: 4 },
  amt: { fontFamily: fonts.mono, fontSize: 13, color: colors.ink },
});
