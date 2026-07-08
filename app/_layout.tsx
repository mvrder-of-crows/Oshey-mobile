import { useCallback } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  useFonts,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from "@expo-google-fonts/jetbrains-mono";
import { ThemeProvider, useTheme } from "@/theme/useTheme";

SplashScreen.preventAutoHideAsync();

// Ported from oshey-app/App.tsx's <Shell> — status bar + stack styling react
// to the theme, so this has to live inside ThemeProvider, not next to it.
function RootStack() {
  const { scheme, colors } = useTheme();
  return (
    <>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="wallet-create" />
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="select-asset" />
        <Stack.Screen name="verify-recipient" />
        <Stack.Screen name="quote-confirm" />
        <Stack.Screen name="signing" options={{ animation: "fade" }} />
        <Stack.Screen name="processing" options={{ gestureEnabled: false }} />
        <Stack.Screen name="success" options={{ gestureEnabled: false }} />
        <Stack.Screen name="transaction-detail" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayout}>
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
