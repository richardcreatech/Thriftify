import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getMarkets, type ApiMarket } from "@/services/api";

import { useThemeColor } from "@/context/ThemeContext";

const categories = [
  "All",
  "Fashion",
  "Electronics",
  "Food",
  "Beauty",
  "Sports",
  "Books",
  "Furniture",
  "Health",
  "Gaming",
  "Other",
];

export default function ExploreScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { themeColor, themeForegroundColor } = useThemeColor();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [markets, setMarkets] = useState<ApiMarket[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMarkets() {
      try {
        setLoading(true);
        setError(null);

        const data = await getMarkets();
        setMarkets(data);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading markets.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadMarkets();
  }, []);

  const filteredMarkets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return markets.filter((market) => {
      return (
        market.name.toLowerCase().includes(query) ||
        (market.description ?? "").toLowerCase().includes(query)
      );
    });
  }, [markets, search]);

  const productCardWidth = (width - 52) / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Explore</Text>
              <Text style={styles.subtitle}>
                Find markets and discover something new.
              </Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#A69EAD" />

            <TextInput
              accessibilityLabel="Search markets"
              placeholder="Search markets..."
              placeholderTextColor="#77717D"
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>

          {/* Markets heading and view toggle */}
          <View style={styles.productsHeader}>
            <View>
              <Text style={styles.sectionTitle}>Discover Markets</Text>
              <Text style={styles.productCount}>
                {filteredMarkets.length}{" "}
                {filteredMarkets.length === 1 ? "market" : "markets"}
              </Text>
            </View>

            <View style={styles.viewToggle}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Grid view"
                accessibilityState={{ selected: viewMode === "grid" }}
                style={[
                  styles.toggleButton,
                  viewMode === "grid" && { backgroundColor: themeColor },
                ]}
                onPress={() => setViewMode("grid")}
              >
                <Ionicons
                  name="grid-outline"
                  size={19}
                  color={viewMode === "grid" ? themeForegroundColor : "#A69EAD"}
                />
              </Pressable>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="List view"
                accessibilityState={{ selected: viewMode === "list" }}
                style={[
                  styles.toggleButton,
                  viewMode === "list" && { backgroundColor: themeColor },
                ]}
                onPress={() => setViewMode("list")}
              >
                <Ionicons
                  name="list-outline"
                  size={21}
                  color={viewMode === "list" ? themeForegroundColor : "#A69EAD"}
                />
              </Pressable>
            </View>
          </View>

          {/* Market listings */}
          {loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Loading markets...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyState}>
              <Ionicons name="alert-circle-outline" size={34} color="#A69EAD" />
              <Text style={styles.emptyTitle}>Couldn't load markets</Text>
              <Text style={styles.emptyText}>{error}</Text>
            </View>
          ) : filteredMarkets.length > 0 ? (
            <View style={styles.productGrid}>
              {filteredMarkets.map((market) => (
                <Pressable
                  key={market.id}
                  accessibilityRole="button"
                  accessibilityLabel={`Open ${market.name}`}
                  onPress={() => router.push(`/markets/${market.id}`)}
                  style={[
                    styles.productCard,
                    viewMode === "grid"
                      ? { width: productCardWidth }
                      : styles.listProductCard,
                  ]}
                >
                  <View
                    style={[
                      styles.productImageContainer,
                      viewMode === "list" && styles.listProductImageContainer,
                    ]}
                  >
                    <Image
                      source={{
                        uri: market.banner || market.logo || undefined,
                      }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                  </View>

                  <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={1}>
                      {market.name}
                    </Text>

                    <Text style={styles.marketDescription} numberOfLines={2}>
                      {market.description}
                    </Text>

                    <Text style={[styles.visitMarket, { color: themeColor }]}>
                      Visit market →
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="storefront-outline" size={34} color="#A69EAD" />
              <Text style={styles.emptyTitle}>No markets found</Text>
              <Text style={styles.emptyText}>
                Try searching with a different market name.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#09070D",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
  },
  subtitle: {
    color: "#A69EAD",
    fontSize: 13,
    marginTop: 6,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#211B29",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginTop: 25,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
  },
  categoryList: {
    gap: 9,
    paddingTop: 18,
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#342B3D",
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  selectedCategoryChip: {
    backgroundColor: "#8B19B5",
    borderColor: "#8B19B5",
  },
  categoryText: {
    color: "#BBAAC7",
    fontSize: 12,
    fontWeight: "600",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  productsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  productCount: {
    color: "#A69EAD",
    fontSize: 12,
    marginTop: 5,
  },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#211B29",
    padding: 4,
    borderRadius: 9,
  },
  toggleButton: {
    width: 35,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  productCard: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#15111B",
  },
  listProductCard: {
    width: "100%",
    flexDirection: "row",
  },
  productImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#211B29",
  },
  listProductImageContainer: {
    width: 112,
    height: 112,
    aspectRatio: undefined,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    flex: 1,
    padding: 10,
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  marketDescription: {
    color: "#A69EAD",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  visitMarket: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 10,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 14,
  },
  emptyText: {
    color: "#A69EAD",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
    textAlign: "center",
  },
});
