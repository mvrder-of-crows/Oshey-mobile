import { Tabs } from "expo-router";
import { Home, Clock, User } from "lucide-react-native";
import { colors, fonts } from "@/theme/tokens";

// Ported from oshey-app/navigation/MainTabs.tsx. Screens are named home/
// history/profile (not "index") so this group never claims the root "/"
// path — app/index.tsx (Onboarding) owns that. Navigate here explicitly via
// router.push("/(tabs)/home"), never a bare "/(tabs)".
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.slate,
        tabBarStyle: { borderTopColor: colors.line, backgroundColor: colors.paper },
        tabBarLabelStyle: { fontFamily: fonts.body, fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Home", tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="history"
        options={{ title: "Ledger", tabBarIcon: ({ color, size }) => <Clock color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }}
      />
    </Tabs>
  );
}
