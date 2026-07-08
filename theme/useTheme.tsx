import React, { createContext, useContext, useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { resolveColors, lightColors } from "./tokens";

type Scheme = "light" | "dark";

const ThemeContext = createContext<{
  scheme: Scheme;
  colors: typeof lightColors;
  toggle: () => void;
}>({
  scheme: "light",
  colors: lightColors,
  toggle: () => {},
});

/** Wrap the app once in App.tsx. Defaults to the device's system setting,
 *  but exposes toggle() so Profile > "Appearance" can override it. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const system = useColorScheme();
  const [override, setOverride] = useState<Scheme | null>(null);
  const scheme: Scheme = override ?? (system === "dark" ? "dark" : "light");

  const value = useMemo(
    () => ({
      scheme,
      colors: resolveColors(scheme),
      toggle: () => setOverride(scheme === "dark" ? "light" : "dark"),
    }),
    [scheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
