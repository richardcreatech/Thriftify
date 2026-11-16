
import { useEffect, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/context/ThemeContext";
import {
  getMe,
  updateProfile,
  requestEmailChange,
  confirmEmailChange,
  confirmNewEmail,
} from "@/services/api";

type EmailStage = "email" | "currentOtp" | "newOtp";

export default function EditProfileScreen() {
  const router = useRouter();
  const { themeColor, themeForegroundColor } = useThemeColor();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [originalName, setOriginalName] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailStage, setEmailStage] = useState<EmailStage>("email");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [emailBusy, setEmailBusy] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const data = await getMe();

        if (isMounted) {
          setName(data.name);
          setOriginalName(data.name);
          setEmail(data.email);
        }
      } catch (error) {
        if (isMounted) {
          Alert.alert(
            "Error",
            error instanceof Error
              ? error.message
              : "Could not load your profile."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      Alert.alert("Invalid name", "Please enter your name.");
      return;
    }

    if (trimmedName === originalName) {
      Alert.alert("No changes", "You haven't changed your name.");
      return;
    }

    try {
      setSaving(true);

      const updatedUser = await updateProfile(trimmedName);

      setName(updatedUser.name);
      setOriginalName(updatedUser.name);

      Alert.alert(
        "Success",
        "Your profile has been updated successfully.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert(
        "Update failed",
        error instanceof Error
          ? error.message
          : "Could not update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRequestEmailChange = async () => {
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      Alert.alert("Missing email", "Please enter your new email address.");
      return;
    }

    if (trimmedEmail === email.toLowerCase()) {
      Alert.alert(
        "Same email",
        "Your new email is the same as your current email."
      );
      return;
    }

    try {
      setEmailBusy(true);

      await requestEmailChange(trimmedEmail);

      setNewEmail(trimmedEmail);
      setOtp("");
      setEmailStage("currentOtp");

      Alert.alert(
        "Verification code sent",
        `We've sent a verification code to ${email}.`
      );
    } catch (error) {
      Alert.alert(
        "Request failed",
        error instanceof Error
          ? error.message
          : "Could not request an email change."
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const handleConfirmCurrentEmail = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid code", "Please enter your 6-digit code.");
      return;
    }

    try {
      setEmailBusy(true);

      await confirmEmailChange(otp);

      setOtp("");
      setEmailStage("newOtp");

      Alert.alert(
        "Current email verified",
        `We've sent another verification code to ${newEmail}.`
      );
    } catch (error) {
      Alert.alert(
        "Verification failed",
        error instanceof Error
          ? error.message
          : "Could not verify your current email."
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const handleConfirmNewEmail = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid code", "Please enter your 6-digit code.");
      return;
    }

    try {
      setEmailBusy(true);

      const updatedUser = await confirmNewEmail(otp);

      setEmail(updatedUser.email);
      setNewEmail("");
      setOtp("");
      setEmailStage("email");

      Alert.alert(
        "Email updated",
        "Your email address has been changed successfully."
      );
    } catch (error) {
      Alert.alert(
        "Verification failed",
        error instanceof Error
          ? error.message
          : "Could not verify your new email."
      );
    } finally {
      setEmailBusy(false);
    }
  };

  const handleCancelEmailChange = () => {
    setNewEmail("");
    setOtp("");
    setEmailStage("email");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={22} color={themeColor} />
          </Pressable>

          <Text style={styles.title}>Edit Profile</Text>
        </View>

        <Text style={styles.sectionTitle}>PERSONAL INFORMATION</Text>

        {/* Full Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full name</Text>

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#77717D"
            autoCapitalize="words"
            editable={!loading && !saving}
          />
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>

          <View style={styles.emailInput}>
            <TextInput
              style={styles.emailField}
              value={email}
              editable={false}
            />

            <Ionicons
              name="lock-closed-outline"
              size={17}
              color="#77717D"
            />
          </View>

          {emailStage === "email" && (
            <>
              <Text style={styles.helperText}>
                This is your current account email.
              </Text>

              <TextInput
                style={[styles.input, styles.emailEntry]}
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Enter your new email address"
                placeholderTextColor="#77717D"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading && !emailBusy}
              />

              <Pressable
                style={[
                  styles.secondaryButton,
                  { borderColor: themeColor },
                  emailBusy && { opacity: 0.6 },
                ]}
                onPress={handleRequestEmailChange}
                disabled={loading || emailBusy}
              >
                {emailBusy ? (
                  <ActivityIndicator color={themeColor} />
                ) : (
                  <Text style={[styles.secondaryButtonText, { color: themeColor }]}>
                    Request Email Change
                  </Text>
                )}
              </Pressable>
            </>
          )}

          {emailStage === "currentOtp" && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationTitle}>
                Verify your current email
              </Text>

              <Text style={styles.helperText}>
                Enter the 6-digit code sent to {email}.
              </Text>

              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={(value) =>
                  setOtp(value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                placeholderTextColor="#77717D"
                keyboardType="number-pad"
                maxLength={6}
                editable={!emailBusy}
              />

              <Pressable
                style={[
                  styles.secondaryButton,
                  { backgroundColor: themeColor },
                  emailBusy && { opacity: 0.6 },
                ]}
                onPress={handleConfirmCurrentEmail}
                disabled={emailBusy}
              >
                {emailBusy ? (
                  <ActivityIndicator color={themeForegroundColor} />
                ) : (
                  <Text style={[styles.secondaryButtonText, { color: themeForegroundColor }]}>
                    Verify Current Email
                  </Text>
                )}
              </Pressable>

              <Pressable onPress={handleCancelEmailChange}>
                <Text style={styles.cancelText}>Cancel email change</Text>
              </Pressable>
            </View>
          )}

          {emailStage === "newOtp" && (
            <View style={styles.verificationSection}>
              <Text style={styles.verificationTitle}>
                Verify your new email
              </Text>

              <Text style={styles.helperText}>
                Enter the 6-digit code sent to {newEmail}.
              </Text>

              <TextInput
                style={styles.input}
                value={otp}
                onChangeText={(value) =>
                  setOtp(value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Enter 6-digit code"
                placeholderTextColor="#77717D"
                keyboardType="number-pad"
                maxLength={6}
                editable={!emailBusy}
              />

              <Pressable
                style={[
                  styles.secondaryButton,
                  { backgroundColor: themeColor },
                  emailBusy && { opacity: 0.6 },
                ]}
                onPress={handleConfirmNewEmail}
                disabled={emailBusy}
              >
                {emailBusy ? (
                  <ActivityIndicator color={themeForegroundColor} />
                ) : (
                  <Text style={[styles.secondaryButtonText, { color: themeForegroundColor }]}>
                    Confirm New Email
                  </Text>
                )}
              </Pressable>

              <Pressable onPress={handleCancelEmailChange}>
                <Text style={styles.cancelText}>Cancel email change</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Save Name */}
        <Pressable
          style={[
            styles.saveButton,
            { backgroundColor: themeColor },
            (loading || saving) && { opacity: 0.6 },
          ]}
          onPress={handleSave}
          disabled={loading || saving}
        >
          {saving ? (
            <ActivityIndicator color={themeForegroundColor} />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                { color: themeForegroundColor },
              ]}
            >
              {loading ? "Loading..." : "Save Name Changes"}
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09070D",
  },

  content: {
    paddingHorizontal: 22,
    paddingBottom: 35,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 22,
    marginBottom: 35,
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "700",
  },

  sectionTitle: {
    color: "#A69EAD",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 25,
  },

  inputGroup: {
    marginBottom: 25,
  },

  label: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 10,
  },

  input: {
    height: 52,
    backgroundColor: "#17131D",
    borderWidth: 1,
    borderColor: "#302639",
    borderRadius: 9,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontSize: 14,
  },

  emailInput: {
    height: 52,
    backgroundColor: "#110F15",
    borderWidth: 1,
    borderColor: "#211B29",
    borderRadius: 9,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
  },

  emailField: {
    flex: 1,
    color: "#77717D",
    fontSize: 14,
  },

  emailEntry: {
    marginTop: 15,
  },

  helperText: {
    color: "#77717D",
    fontSize: 11,
    marginTop: 9,
    marginBottom: 12,
    lineHeight: 17,
  },

  verificationSection: {
    marginTop: 22,
    gap: 12,
  },

  verificationTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  secondaryButton: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },

  cancelText: {
    color: "#A69EAD",
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
  },

  saveButton: {
    height: 52,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
});
