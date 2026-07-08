import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Stamp } from "@/components/Stamp";
import { PrimaryButton, SecondaryLink } from "@/components/UI";
import { colors, fonts, spacing } from "@/theme/tokens";

export default function SuccessScreen() {
  const router = useRouter();
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={styles.root}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Stamp size={110} />
      </Animated.View>
      <Text style={styles.title}>Oshey! Delivered.</Text>
      <Text style={styles.subtitle}>₦84,200.00 landed in Amaka&apos;s GTBank account.</Text>
      <View style={styles.pill}>
        <Text style={styles.pillText}>Settled in 47s</Text>
      </View>
      <View style={styles.actions}>
        <PrimaryButton label="View transaction" onPress={() => router.push("/transaction-detail")} />
        <SecondaryLink label="Back to home" onPress={() => router.push("/(tabs)/home")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xxl },
  title: { fontFamily: fonts.display, fontWeight: "600", fontSize: 20, color: colors.ink, marginTop: spacing.xl, textAlign: "center" },
  subtitle: { fontFamily: fonts.body, fontSize: 13, color: colors.slate, textAlign: "center", marginTop: 6, lineHeight: 18 },
  pill: { backgroundColor: colors.tealSoft, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, marginTop: spacing.lg },
  pillText: { fontFamily: fonts.mono, fontSize: 11, color: colors.teal },
  actions: { width: "100%", marginTop: spacing.xxl, gap: 10 },
});
