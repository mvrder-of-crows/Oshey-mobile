import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { PrimaryButton, SecondaryLink } from "@/components/UI";
import { colors, fonts, spacing } from "@/theme/tokens";

export default function OnboardingScreen() {
  const router = useRouter();
  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.eyebrow}>SEND / RECEIVE</Text>
        <Text style={styles.headline}>
          Your crypto,{"\n"}their naira.{"\n"}
          <Text style={{ color: colors.amber }}>No wallet needed.</Text>
        </Text>
        <Text style={styles.body}>
          Send stablecoin-backed value straight into any Nigerian bank account.
          They just see cash land — no crypto, no app, no friction.
        </Text>
      </View>

      <View>
        <View style={styles.dots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
        <PrimaryButton
          label="Create my wallet"
          color={colors.amber}
          textColor={colors.ink}
          onPress={() => router.push("/wallet-create")}
        />
        <SecondaryLink label="I already have a key" color="#B9B7CC" onPress={() => router.push("/login")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.ink,
    justifyContent: "space-between",
    paddingHorizontal: spacing.xxl,
    paddingTop: 72,
    paddingBottom: spacing.xxl,
  },
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amber,
  },
  headline: {
    fontFamily: fonts.displayBold,
    fontSize: 34,
    lineHeight: 36,
    color: colors.paper,
    marginTop: spacing.md,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
    color: "#B9B7CC",
    marginTop: spacing.lg,
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4A4868",
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.amber,
  },
});
