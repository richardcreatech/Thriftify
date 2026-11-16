import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/context/ThemeContext";
import { useRouter } from "expo-router";

const colors = [
  "#1685FF",
  "#FF1493",
  "#35E522",
  "#FF7800",
  "#FFE600",
  "#FF2864",
  "#9419D4",
  "#FFFFFF",
];

export default function ProfileScreen() {
  const router = useRouter();
  const { themeColor, themeForegroundColor, setThemeColor } = useThemeColor();
  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.profileSection}>
       <Pressable
  style={[styles.avatarBorder, { borderColor: themeColor }]}
>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={48}
              color={themeColor}
            />
          </View>
        </Pressable>

        {/* Colour Options */}
        <View style={styles.colorContainer}>
     {colors.map((color) => {
  const isSelected = themeColor === color;

  return (
    <Pressable
      key={color}
      onPress={() => setThemeColor(color)}
      style={[
        styles.colorOption,
        {
          backgroundColor: color,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected
            ? themeColor === "#FFFFFF"
              ? themeForegroundColor
              : "#FFFFFF"
            : "#FFFFFF55",
        },
      ]}
    />
  );
})}
        </View>

        {/* Edit Profile */}
        <Pressable
          style={styles.editButton}
          onPress={() => router.push("/edit-profile")}
        >
          <Ionicons
            name="person-circle-outline"
            size={17}
            color={themeColor === "#FFFFFF" ? themeForegroundColor : themeColor}
          />

          <Text style={styles.editButtonText}>
            Edit Profile
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05040A",
  },

 profileSection: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
},

  avatarBorder: {
    width: 64,
    height: 64,
    borderRadius: 40,
    borderWidth: 2,
    padding: 3,
  },

  avatar: {
    flex: 1,
    borderRadius: 40,
    backgroundColor: "#211B29",
    justifyContent: "center",
    alignItems: "center",
  },

  colorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 50,
  },

  colorOption: {
    width: 18,
    height: 18,
    borderRadius: 20,
  },

  editButton: {
    width: "88%",
    height: 37,
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  editButtonText: {
    color: "#17121D",
    fontSize: 11,
    fontWeight: "600",
  },
});