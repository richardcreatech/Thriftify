import { Ionicons } from "@expo/vector-icons";
import {
  FlatList,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
  Image
} from "react-native";

import { useEffect, useState } from "react";
import { getProducts, type ApiProduct } from "@/services/api";

import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useThemeColor } from "@/context/ThemeContext";

const banners = [
  {
    id: "1",
    title: "Discover your next favourite.",
    subtitle: "Explore products you'll love.",
    backgroundColor: "#42205C",
    label: "NEW COLLECTION",
  },
  {
    id: "2",
    title: "A little something for you.",
    subtitle: "Find great products at great prices.",
    backgroundColor: "#292044",
    label: "JUST FOR YOU",
  },
  {
    id: "3",
    title: "Your style, your choice.",
    subtitle: "Discover something different today.",
    backgroundColor: "#51243F",
    label: "EXPLORE MORE",
  },
];



const categories = [
  { id: "1", name: "Fashion", icon: "shirt-outline" as const },
  { id: "2", name: "Electronics", icon: "laptop-outline" as const },
  { id: "3", name: "Beauty", icon: "sparkles-outline" as const },
  { id: "4", name: "Home", icon: "home-outline" as const },
  { id: "5", name: "Sports", icon: "football-outline" as const },
  { id: "6", name: "Books", icon: "book-outline" as const },
  { id: "7", name: "Gaming", icon: "game-controller-outline" as const },
  { id: "8", name: "Food", icon: "fast-food-outline" as const },
];





export default function HomeScreen() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeBanner, setActiveBanner] = useState(0);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { width } = useWindowDimensions();
  const { themeColor, themeForegroundColor } = useThemeColor();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Products error:", err);
        setError("Couldn't load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const bannerWidth = width - 40;
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.container}>
          {/* Greeting */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Good evening ✨</Text>

              <Text style={styles.subtitle}>Find something you'll love.</Text>
            </View>

            <Ionicons name="notifications-outline" size={25} color="#FFFFFF" />
          </View>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={21} color="#A69EAD" />

            <TextInput
              style={styles.searchInput}
              placeholder="Search products..."
              placeholderTextColor="#A69EAD"
            />

            <Ionicons name="options-outline" size={22} color={themeColor} />
          </View>

          {/* Promotional carousel */}
          <View style={styles.carouselSection}>
            <FlatList
              data={banners}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              onMomentumScrollEnd={(event) => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / bannerWidth,
                );

                setActiveBanner(index);
              }}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.banner,
                    {
                      width: bannerWidth,
                      backgroundColor: item.backgroundColor,
                    },
                  ]}
                >
                  <Text style={[styles.bannerLabel, { color: themeColor }]}>
                    {item.label}
                  </Text>

                  <Text style={styles.bannerTitle}>{item.title}</Text>

                  <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>

                  <View style={[styles.bannerButton, { backgroundColor: themeColor }]}>
                  
                  </View>
                </View>
              )}
            />

            {/* Carousel indicators */}
            <View style={styles.pagination}>
              {banners.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.dot,
                    activeBanner === index && { backgroundColor: themeColor },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Categories */}
          <View style={styles.categoriesSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>

              <Text style={[styles.seeAll, { color: themeColor }]}>See all</Text>
            </View>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => {
                const isSelected = selectedCategory === item.id;

                return (
                  <Pressable
                    style={styles.categoryItem}
                    onPress={() => setSelectedCategory(item.id)}
                  >
                    <View
                      style={[
                        styles.categoryIcon,
                        isSelected && {
                          backgroundColor: themeColor,
                          borderColor: themeColor,
                        },
                      ]}
                    >
                      <Ionicons
                        name={item.icon}
                        size={25}
                        color={
                          isSelected ? themeForegroundColor : "#BBAAC7"
                        }
                      />
                    </View>

                    <Text
                      style={[
                        styles.categoryName,
                        isSelected && styles.selectedCategoryName,
                      ]}
                    >
                      {item.name}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>

          {/* Products */}
<View style={styles.productsSection}>
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>Discover Products</Text>
    <Text style={[styles.seeAll, { color: themeColor }]}>
      See all
    </Text>
  </View>

  {loading ? (
    <Text style={{ color: "#A69EAD" }}>
      Loading products...
    </Text>
  ) : error ? (
    <Text style={{ color: "#FF7777" }}>{error}</Text>
  ) : products.length === 0 ? (
    <Text style={{ color: "#A69EAD" }}>
      No products available yet. Check back soon!
    </Text>
  ) : (
    <View style={styles.productGrid}>
      {products
        .filter(
          (product) =>
            selectedCategory === "all" ||
            product.category ===
              categories.find(
                (category) => category.id === selectedCategory
              )?.name
        )
        .map((product) => (
          <Pressable
            key={product.id}
            style={styles.productCard}
            onPress={() =>
              router.push({
                pathname: "/products/[id]",
                params: { id: String(product.id) },
              })
            }
          >
            <View style={styles.productImageContainer}>
              {product.image ? (
                <Image
                  source={{ uri: product.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : null}

              <View style={styles.conditionBadge}>
                <Text style={styles.conditionText}>
                  {product.condition}
                </Text>
              </View>
            </View>

            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>

            <Text style={[styles.productPrice, { color: themeColor }]}>
              ₦{Number(product.price).toLocaleString("en-NG")}
            </Text>
          </Pressable>
        ))}
    </View>
  )}
</View>

          
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
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  greeting: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "700",
  },

  subtitle: {
    color: "#A69EAD",
    fontSize: 14,
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#211B29",
    height: 52,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 25,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 14,
  },
  carouselSection: {
    marginTop: 28,
  },

  banner: {
    height: 190,
    borderRadius: 16,
    padding: 20,
    justifyContent: "center",
  },

  bannerLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 12,
  },

  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    maxWidth: 260,
  },

  bannerSubtitle: {
    color: "#E0D6E8",
    fontSize: 13,
    marginTop: 8,
  },

  bannerButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 8,
    marginTop: 16,
  },

  bannerButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
    gap: 7,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 10,
    backgroundColor: "#51475A",
  },

  activeDot: {
    width: 20,
  },
  categoriesSection: {
    marginTop: 30,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  seeAll: {
    fontSize: 13,
    fontWeight: "600",
  },

  categoryList: {
    paddingRight: 10,
  },

  categoryItem: {
    alignItems: "center",
    marginRight: 20,
    width: 65,
  },

  categoryIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#211B29",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#33283B",
  },

  categoryName: {
    color: "#A69EAD",
    fontSize: 11,
    marginTop: 9,
    textAlign: "center",
  },

  selectedCategoryName: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  productsSection: {
  marginTop: 32,
  marginBottom: 25,
},

productGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
},

productCard: {
  width: "31.5%",
  marginBottom: 20,
},

productImageContainer: {
  width: "100%",
  aspectRatio: 0.85,
  backgroundColor: "#211B29",
  borderRadius: 10,
  overflow: "hidden",
  position: "relative",
},

productImage: {
  width: "100%",
  height: "100%",
},

conditionBadge: {
  position: "absolute",
  bottom: 7,
  left: 6,
  backgroundColor: "#09070D",
  paddingHorizontal: 7,
  paddingVertical: 4,
  borderRadius: 5,
},

conditionText: {
  color: "#FFFFFF",
  fontSize: 9,
  fontWeight: "600",
},

productName: {
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: "500",
  marginTop: 9,
},

productPrice: {
  fontSize: 13,
  fontWeight: "700",
  marginTop: 5,
},
});
