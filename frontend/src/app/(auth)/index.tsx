import { useThemeColor } from "@/context/ThemeContext";
import { login } from "@/services/api";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const router = useRouter();
  const { themeColor, themeForegroundColor } = useThemeColor();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await login(email.trim().toLowerCase(), password);

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Sign in failed",
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.form}>
            <Image
              source={require("../../assets/images/thriftify-logo.png")}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Thriftify"
            />
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to Thriftify.
            </Text>

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#A99EAD"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              accessibilityLabel="Email"
              returnKeyType="next"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#A99EAD"
              secureTextEntry
              autoCapitalize="none"
              textContentType="password"
              accessibilityLabel="Password"
              returnKeyType="done"
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              accessibilityRole="button"
              onPress={handleLogin}
              disabled={loading}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: themeColor },
                pressed && styles.buttonPressed,
                loading && { opacity: 0.6 },
              ]}
            >
              <Text
                style={[styles.buttonText, { color: themeForegroundColor }]}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Text>
            </Pressable>

            <Link href="/signup" asChild>
              <Pressable style={styles.signupLink}>
                <Text style={styles.signupText}>
                  Don't have an account?{" "}
                  <Text style={[styles.signupHighlight, { color: themeColor }]}>
                    Sign up
                  </Text>
                </Text>
              </Pressable>
            </Link>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
    color: "#000000",
  },
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  form: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 28,
    borderRadius: 16,
  },
  title: {
    color: "#000000",
    fontSize: 30,
    fontWeight: "700",
  },
  subtitle: {
    color: "#8d8391",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 32,
  },
  label: {
    color: "#585252",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#625469",
    borderRadius: 12,
    backgroundColor: "#352b3905",
    color: "#000000",
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  button: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  signupLink: {
    marginTop: 24,
    alignItems: "center",
  },

  signupText: {
    color: "#77717D",
    fontSize: 14,
  },

  signupHighlight: {
    fontWeight: "700",
  },
});
