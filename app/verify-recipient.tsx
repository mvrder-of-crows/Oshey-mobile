import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Screen, TopBar, PrimaryButton } from "@/components/UI";
import { MiniStamp } from "@/components/Stamp";
import { useTheme } from "@/theme/useTheme";
import { fonts, radii, spacing } from "@/theme/tokens";
import { haptics } from "@/theme/haptics";

// Demo-only prefix map standing in for a real bank-lookup/NIBSS call.
// Real NUBAN numbers don't encode the bank in the prefix — this is a stub.
const BANK_PREFIX_MAP: Record<string, string> = {
  "014": "GTBank",
  "058": "GTBank",
  "011": "First Bank",
  "044": "Access Bank",
  "057": "Zenith Bank",
  "232": "Sterling Bank",
};

type Status = "idle" | "typing" | "detected" | "verifying" | "verified";

export default function VerifyRecipientScreen() {
  const router = useRouter();
  const { assetSymbol } = useLocalSearchParams<{ assetSymbol?: string }>();
  const { colors } = useTheme();

  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  // Live validation: auto-detect the bank once 3 digits are in, auto-verify
  // once all 10 are in — mirrors how a real name-enquiry flow would fire
  // debounced lookups as the user types, instead of requiring extra taps.
  useEffect(() => {
    if (account.length === 0) {
      setStatus("idle");
      setBank("");
      return;
    }
    if (account.length < 10) {
      setStatus("typing");
      const prefix = account.slice(0, 3);
      if (BANK_PREFIX_MAP[prefix]) setBank(BANK_PREFIX_MAP[prefix]);
      return;
    }
    // account.length === 10
    const prefix = account.slice(0, 3);
    setBank(BANK_PREFIX_MAP[prefix] ?? "GTBank");
    setStatus("verifying");
    const t = setTimeout(() => {
      setStatus("verified");
      haptics.success();
    }, 800);
    return () => clearTimeout(t);
  }, [account]);

  const verified = status === "verified";

  return (
    <Screen>
      <TopBar title="Send money" onBack={() => router.back()} />
      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.slate }]}>ACCOUNT NUMBER</Text>
          <TextInput
            value={account}
            onChangeText={setAccount}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="0000000000"
            placeholderTextColor={colors.slate}
            style={[styles.input, { color: colors.textOnSurface, borderBottomColor: colors.textOnSurface }]}
          />
        </View>

        {bank ? (
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.slate }]}>BANK</Text>
            <Text style={[styles.fieldValue, { color: colors.textOnSurface, borderBottomColor: colors.textOnSurface }]}>
              {bank} <Text style={{ fontSize: 10, color: colors.slate }}>· auto-detected</Text>
            </Text>
          </View>
        ) : null}

        {status === "verifying" && (
          <Text style={[styles.checking, { color: colors.slate }]}>Checking with NIBSS…</Text>
        )}

        {verified && (
          <View style={[styles.verifiedCard, { backgroundColor: colors.tealSoft }]}>
            <MiniStamp color={colors.teal} />
            <View>
              <Text style={[styles.verifiedName, { color: colors.textOnSurface }]}>Amaka T. Chukwuemeka</Text>
              <Text style={[styles.verifiedSub, { color: colors.teal }]}>Name confirmed via NIBSS</Text>
            </View>
          </View>
        )}

        <Text style={[styles.note, { color: colors.slate }]}>
          Confirm this is who you intend to pay — funds cannot be recalled once sent.
        </Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton
          label="Continue"
          disabled={!verified}
          onPress={() => router.push({ pathname: "/quote-confirm", params: { assetSymbol } })}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.xl },
  field: { marginBottom: spacing.md },
  fieldLabel: { fontFamily: fonts.mono, fontSize: 10.5, letterSpacing: 1 },
  input: {
    fontFamily: fonts.monoMedium, fontSize: 16,
    paddingVertical: 8, borderBottomWidth: 2, marginTop: 4,
  },
  fieldValue: {
    fontFamily: fonts.body, fontSize: 15,
    paddingVertical: 8, borderBottomWidth: 2, marginTop: 4,
  },
  checking: { fontFamily: fonts.body, fontSize: 12, marginTop: spacing.sm },
  verifiedCard: {
    flexDirection: "row", alignItems: "center", gap: spacing.md,
    borderRadius: radii.md, padding: spacing.lg, marginTop: spacing.lg,
  },
  verifiedName: { fontFamily: fonts.bodyMedium, fontSize: 14 },
  verifiedSub: { fontFamily: fonts.mono, fontSize: 11 },
  note: { fontFamily: fonts.body, fontSize: 11.5, lineHeight: 16, marginTop: spacing.md },
  footer: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl, paddingTop: spacing.sm },
});
