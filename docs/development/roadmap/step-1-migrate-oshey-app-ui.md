# Step 1 — Migrate UI from oshey-app mock

## What to build
Port the fully-built mock UI from `Projects/oshey-app` (Expo SDK 51, React
Navigation native-stack) into this project (Expo SDK 54, Expo Router
file-based routing) and replace the default `create-expo-app` boilerplate.
`oshey-app` is deleted once this is verified working — this project becomes
the only home for the mobile UI.

## Why a real restructure, not a copy
`oshey-app` navigates imperatively via `useNavigation().navigate("Screen", params)`
against a hand-built `RootNavigator`/`MainTabs`. Expo Router derives the route
tree from the file system and navigates via `useRouter()` / `<Link>`. Every
screen's navigation calls need rewriting, not just moving files.

## Route mapping (React Navigation screen -> Expo Router file)

| oshey-app screen (navigation/RootNavigator, MainTabs) | New route file |
|---|---|
| Onboarding (initial) | `app/index.tsx` |
| WalletCreate | `app/wallet-create.tsx` |
| Login | `app/login.tsx` |
| MainTabs > Home | `app/(tabs)/index.tsx` (replaces default) |
| MainTabs > History | `app/(tabs)/history.tsx` (replaces `explore.tsx`) |
| MainTabs > Profile | `app/(tabs)/profile.tsx` (new tab) |
| SelectAsset | `app/select-asset.tsx` |
| VerifyRecipient | `app/verify-recipient.tsx` |
| QuoteConfirm | `app/quote-confirm.tsx` |
| Signing (fade transition) | `app/signing.tsx` (`Stack.Screen options={{ animation: "fade" }}` set in `_layout.tsx`) |
| Processing (gestureEnabled: false) | `app/processing.tsx` (`gestureEnabled: false` in `_layout.tsx`) |
| Success (gestureEnabled: false) | `app/success.tsx` (`gestureEnabled: false` in `_layout.tsx`) |
| TransactionDetail | `app/transaction-detail.tsx` |

`app/_layout.tsx` (root Stack) replaces `App.tsx`'s `NavigationContainer` +
`RootNavigator` + font-loading + `ThemeProvider` + splash-screen logic, all
combined into one file per Expo Router convention. `(tabs)/_layout.tsx`
(Tabs) replaces `navigation/MainTabs.tsx`.

Default boilerplate to remove: `app/(tabs)/explore.tsx` (replaced by
`history.tsx`), `app/modal.tsx` (unused), and any default components/hooks
that only existed to support the removed boilerplate screens (check
`components/`, `hooks/` for orphans after the swap — don't delete blind).

## Files to bring over (as-is or near-as-is, source -> dest)
- `theme/tokens.ts`, `theme/useTheme.tsx`, `theme/haptics.ts`, `theme/useResponsive.ts` -> same paths under `Oshey-mobile`
- `components/Stamp.tsx`, `components/UI.tsx` -> same paths (co-exist with or replace existing `components/`, check for name clashes first)
- `data/wallet.ts` -> same path
- `screens/*.tsx` (12 files) -> become the route files per the table above; each one's `useNavigation()`/`useRoute()` calls rewritten to `useRouter()`/`useLocalSearchParams()`, and `nav.navigate(X, params)` / `nav.goBack()` rewritten to `router.push({ pathname: "/x", params })` / `router.back()`

## New dependencies needed (not already in Oshey-mobile's package.json)
Install via `npx expo install` (SDK-54-compatible versions, not raw `npm install`):
- `expo-clipboard` (WalletCreate reveal/copy)
- `expo-local-authentication` (Signing screen biometric step)
- `@expo-google-fonts/space-grotesk`, `@expo-google-fonts/inter`, `@expo-google-fonts/jetbrains-mono`
- `lucide-react-native`

Already present in Oshey-mobile at compatible-or-newer versions, keep as-is:
`expo-haptics`, `expo-splash-screen`, `expo-status-bar`, `react-native-gesture-handler`,
`react-native-reanimated`, `@react-navigation/native`, `@react-navigation/bottom-tabs`.

## Implementation detail
- Font loading + splash-hide moves into `app/_layout.tsx` (Expo Router's
  entrypoint), replacing the `useFonts`/`SplashScreen.preventAutoHideAsync`
  block currently in `oshey-app/App.tsx`.
- `ThemeProvider` (light/dark + manual override) wraps the root layout the
  same way it wrapped `<Shell>` in `oshey-app/App.tsx`.
- Tab bar icons/colors/labels in `(tabs)/_layout.tsx` ported directly from
  `MainTabs.tsx`'s `screenOptions`/`Tab.Screen` props — Expo Router's `Tabs`
  component takes the same shape of options.
- Screen-to-screen params (e.g. `assetSymbol` passed into VerifyRecipient ->
  QuoteConfirm) become Expo Router's string-based route params
  (`useLocalSearchParams<{ assetSymbol: string }>()`).

## Done criteria
- `npx expo start` boots with no red-screen errors.
- Full flow walkable start to finish: Onboarding -> WalletCreate -> Login ->
  Home (tabs) -> Send -> SelectAsset -> VerifyRecipient -> QuoteConfirm ->
  Signing -> Processing -> Success -> TransactionDetail; History and Profile
  tabs reachable and functional (dark-mode toggle still works).
- No leftover references to `@react-navigation/native-stack`'s
  `createNativeStackNavigator` or the old `RootNavigator`/`MainTabs` files.
- `Projects/oshey-app` deleted only after the above is confirmed working.
