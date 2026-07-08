import { View, Text, StyleSheet, Pressable, Switch } from "react-native";
import { ChevronRight, User } from "lucide-react-native";
import { Screen, TopBar } from "@/components/UI";
import { useTheme } from "@/theme/useTheme";
import { fonts, spacing } from "@/theme/tokens";
import { haptics } from "@/theme/haptics";

const ROWS = ["Security & PIN", "Linked devices", "Payout methods", "About Oshey", "Support"];

export default function ProfileScreen() {
  const { colors, scheme, toggle } = useTheme();

  return (
    <Screen>
      <TopBar title="Profile" />
      <View style={{ paddingHorizontal: spacing.xl }}>
        <View style={[styles.identity, { borderBottomColor: colors.line }]}>
          <View style={[styles.avatar, { backgroundColor: colors.ink }]}>
            <User size={22} color={colors.amber} />
          </View>
          <View>
            <Text style={[styles.name, { color: colors.textOnSurface }]}>Tolu Adisa</Text>
            <Text style={[styles.wallet, { color: colors.slate }]}>Wallet ••4F2A</Text>
          </View>
        </View>

        <View style={[styles.row, { borderBottomColor: colors.line }]}>
          <Text style={[styles.rowLabel, { color: colors.textOnSurface }]}>Dark mode</Text>
          <Switch
            value={scheme === "dark"}
            onValueChange={() => { haptics.tap(); toggle(); }}
            trackColor={{ false: colors.paperDim, true: colors.teal }}
            thumbColor="#fff"
          />
        </View>

        {ROWS.map((r) => (
          <Pressable key={r} style={[styles.row, { borderBottomColor: colors.line }]} onPress={() => haptics.tap()}>
            <Text style={[styles.rowLabel, { color: colors.textOnSurface }]}>{r}</Text>
            <ChevronRight size={15} color={colors.slate} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identity: { flexDirection: "row", alignItems: "center", gap: spacing.md, paddingBottom: spacing.lg, borderBottomWidth: 1 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  name: { fontFamily: fonts.display, fontWeight: "600", fontSize: 15 },
  wallet: { fontFamily: fonts.mono, fontSize: 11, marginTop: 2 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1 },
  rowLabel: { fontFamily: fonts.body, fontSize: 13.5 },
});
