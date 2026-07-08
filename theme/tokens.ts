// Oshey design tokens
// Ink (deep indigo night) + warm paper + amber accent + teal (verified) + rust (warning)

// Shared brand constants that don't flip between schemes
export const brand = {
  ink: "#14132B",
  ink2: "#211F3D",
  inkLine: "#2E2C4E",
  amber: "#E8A33D",
  amberDeep: "#C9822A",
  teal: "#1F6F5C",
  rust: "#C1443B",
  slateOnDark: "#9694AE",
  white: "#FFFFFF",
};

export const lightColors = {
  ...brand,
  paper: "#F2EFE8",
  paperDim: "#E7E2D6",
  tealSoft: "#DCEAE4",
  rustSoft: "#F3DEDB",
  slate: "#6B6A7C",
  line: "#DAD4C4",
  surface: "#FFFFFF",
  textOnSurface: "#14132B",
};

export const darkColors = {
  ...brand,
  paper: "#100F20",
  paperDim: "#1B1A33",
  tealSoft: "#173A32",
  rustSoft: "#3A1E1C",
  slate: "#8B899E",
  line: "#2A2846",
  surface: "#1B1A33",
  textOnSurface: "#F2EFE8",
};

// Default export kept for any code that hasn't switched to useTheme() yet
export const colors = lightColors;

export function resolveColors(scheme: "light" | "dark" | null | undefined) {
  return scheme === "dark" ? darkColors : lightColors;
}

export const fonts = {
  display: "SpaceGrotesk_600SemiBold",
  displayBold: "SpaceGrotesk_700Bold",
  body: "Inter_400Regular",
  bodyMedium: "Inter_500Medium",
  bodySemibold: "Inter_600SemiBold",
  mono: "JetBrainsMono_400Regular",
  monoMedium: "JetBrainsMono_500Medium",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 22,
  full: 999,
};

// google-fonts packages needed:
// expo install @expo-google-fonts/space-grotesk @expo-google-fonts/inter @expo-google-fonts/jetbrains-mono expo-font
