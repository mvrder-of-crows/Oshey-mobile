import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../theme/useTheme";
import { fonts, radii, spacing } from "../theme/tokens";
import { haptics } from "../theme/haptics";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PrimaryButton({
  label,
  onPress,
  disabled,
  color,
  textColor,
  haptic = "confirm",
}: {
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  color?: string;
  textColor?: string;
  haptic?: "tap" | "confirm" | "success" | "warning" | "error" | "none";
}) {
  const { colors } = useTheme();
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 14, stiffness: 300 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 10, stiffness: 200 }))}
      onPress={() => {
        if (haptic !== "none") haptics[haptic]();
        onPress?.();
      }}
      disabled={disabled}
      style={[
        styles.button,
        animatedStyle,
        { backgroundColor: disabled ? colors.paperDim : color ?? colors.ink },
      ]}
    >
      <Text style={[styles.buttonLabel, { color: disabled ? colors.slate : textColor ?? colors.paper }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export function SecondaryLink({ label, onPress, color }: { label: string; onPress?: () => void; color?: string }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={() => { haptics.tap(); onPress?.(); }} style={styles.secondaryLink}>
      <Text style={[styles.secondaryLabel, { color: color ?? colors.slate }]}>{label}</Text>
    </Pressable>
  );
}

export function TopBar({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => { haptics.tap(); onBack?.(); }} style={styles.topBarSide} disabled={!onBack}>
        {onBack ? <ArrowLeft size={19} color={colors.textOnSurface} /> : null}
      </Pressable>
      <Text style={[styles.topBarTitle, { color: colors.textOnSurface }]} allowFontScaling>{title}</Text>
      <View style={styles.topBarSide}>{right}</View>
    </View>
  );
}

export function Screen({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.screen, { backgroundColor: dark ? colors.ink : colors.paper }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLabel: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
  },
  secondaryLink: {
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryLabel: {
    fontFamily: fonts.body,
    fontSize: 13,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  topBarSide: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: {
    fontFamily: fonts.display,
    fontSize: 15,
    fontWeight: "600",
  },
  screen: {
    flex: 1,
  },
});
