
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getMarketProducts,
  type ApiMarketProduct,
  type ApiMarketProductsResponse,
} from "@/services/api";

import { useThemeColor } from "@/context/ThemeContext";

export default function MarketScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { themeColor } = useThemeColor();

const [search, setSearch] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [categoryVisible, setCategoryVisible] = useState(false);

const [market, setMarket] =
  useState<ApiMarketProductsResponse["market"] | null>(null);

const [marketProducts, setMarketProducts] = useState<ApiMarketProduct[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;

  async function loadMarket() {
    try {
      setLoading(true);
      setError(null);

      const data = await getMarketProducts(id);

      if (isMounted) {
        setMarket(data.market);
        setMarketProducts(data.products);
      }
    } catch (error) {
      if (isMounted) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading this market."
        );
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }

  loadMarket();

  return () => {
    isMounted = false;
  };
}, [id]);
  
  // const market = markets.find((item) => item.id === id);

  

  const categories = useMemo(() => {
  return [
    "All",
    ...new Set(marketProducts.map((product) => product.category)),
  ];
}, [marketProducts]);

const filteredProducts = useMemo(() => {
  const query = search.trim().toLowerCase();

  return marketProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });
}, [marketProducts, search, selectedCategory]);

  const productCardWidth = (width - 52) / 2;

  if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.errorTitle}>Loading market...</Text>
    </SafeAreaView>
  );
}

if (error || !market) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.errorTitle}>
        {error || "Market not found"}
      </Text>

      <Pressable onPress={() => router.back()}>
        <Text style={[styles.backText, { color: themeColor }]}>
          Go back
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Market banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: market.banner || market.logo || undefined }}
            style={styles.banner}
            resizeMode="cover"
          />

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Market information */}
        <View style={styles.marketInfo}>
          <Text style={styles.marketName}>{market.name}</Text>

          <Text style={styles.marketDescription}>
            {market.description}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#A69EAD"
          />

          <TextInput
            placeholder="Search this market..."
            placeholderTextColor="#77717D"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {/* Products heading and category popup */}
        <View style={styles.productsHeader}>
          <View>
            <Text style={styles.sectionTitle}>Products</Text>

            <Text style={styles.productCount}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </Text>
          </View>

          <Pressable
            style={styles.categoryButton}
            onPress={() => setCategoryVisible(true)}
          >
            <Ionicons
              name="options-outline"
              size={17}
              color={themeColor}
            />

            <Text style={[styles.categoryButtonText, { color: themeColor }]}>
              {selectedCategory === "All"
                ? "Categories"
                : selectedCategory}
            </Text>

            <Ionicons
              name="chevron-down"
              size={15}
              color={themeColor}
            />
          </Pressable>
        </View>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productGrid}>
            {filteredProducts.map((product) => (
              <Pressable
                key={product.id}
                style={[
                  styles.productCard,
                  { width: productCardWidth },
                ]}
                onPress={() =>
                  router.push(`/products/${product.id}`)
                }
              >
                <View style={styles.productImageContainer}>
                  <Image
                   source={{ uri: product.primary_image || undefined }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />

                  <View style={styles.conditionBadge}>
                    <Text style={styles.conditionText}>
                      {product.condition}
                    </Text>
                  </View>
                </View>

                <View style={styles.productInfo}>
                  <Text
                    style={styles.productName}
                    numberOfLines={1}
                  >
                    {product.name}
                  </Text>

                  <Text style={[styles.productPrice, { color: themeColor }]}>
                   ₦{Number(product.price).toLocaleString("en-NG")}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name="bag-outline"
              size={34}
              color="#A69EAD"
            />

            <Text style={styles.emptyTitle}>
              No products found
            </Text>

            <Text style={styles.emptyText}>
              Try another search or select a different category.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Category popup */}
      <Modal
        visible={categoryVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setCategoryVisible(false)}
          />

          <View style={styles.categorySheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>
                Product categories
              </Text>

              <Pressable
                onPress={() => setCategoryVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={23}
                  color="#FFFFFF"
                />
              </Pressable>
            </View>

            {categories.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <Pressable
                  key={category}
                  style={styles.categoryOption}
                  onPress={() => {
                    setSelectedCategory(category);
                    setCategoryVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      isSelected && [
                        styles.selectedCategoryText,
                        { color: themeColor },
                      ],
                    ]}
                  >
                    {category}
                  </Text>

                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={themeColor}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09070D",
  },

  bannerContainer: {
    height: 210,
    backgroundColor: "#211B29",
  },

  banner: {
    width: "100%",
    height: "100%",
  },

  backButton: {
    position: "absolute",
    top: 16,
    left: 18,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(9, 7, 13, 0.75)",
    justifyContent: "center",
    alignItems: "center",
  },

  marketInfo: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  marketName: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
  },

  marketDescription: {
    color: "#A69EAD",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 19,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#211B29",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginHorizontal: 20,
    marginTop: 22,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 10,
  },

  productsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
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

  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#211B29",
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 9,
  },

  categoryButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },

  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  productCard: {
    overflow: "hidden",
    borderRadius: 12,
    backgroundColor: "#15111B",
  },

  productImageContainer: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#211B29",
  },

  productImage: {
    width: "100%",
    height: "100%",
  },

  conditionBadge: {
    position: "absolute",
    left: 8,
    top: 8,
    borderRadius: 6,
    backgroundColor: "rgba(9, 7, 13, 0.82)",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },

  conditionText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },

  productInfo: {
    padding: 10,
  },

  productName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },

  productPrice: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 7,
  },

  emptyState: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 55,
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

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },

  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  categorySheet: {
    backgroundColor: "#15111B",
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  sheetTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  categoryOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#29222F",
  },

  categoryOptionText: {
    color: "#BBAAC7",
    fontSize: 14,
  },

  selectedCategoryText: {
    fontWeight: "700",
  },

  errorTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    padding: 20,
  },

  backText: {
    paddingHorizontal: 20,
  },
});
