import { products } from "@/constants/products";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
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
import { useThemeColor } from "@/context/ThemeContext";

export default function WishlistScreen() {
  const { themeColor, themeForegroundColor } = useThemeColor();
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCondition, setSelectedCondition] = useState("All");
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Temporary demo: use the first 20 products as wishlist items.
  const wishlistProducts = products;

 const categories = [
  "All",
  ...new Set(wishlistProducts.map((product) => product.category)),
];

const conditions = [
  "All",
  ...new Set(wishlistProducts.map((product) => product.condition)),
];

const filteredProducts = useMemo(() => {
  return wishlistProducts.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    const matchesCondition =
      selectedCondition === "All" ||
      product.condition === selectedCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });
}, [search, selectedCategory, selectedCondition, wishlistProducts]);

  // Different sizes and vertical offsets create the scattered appearance.
  const bubbleSizes = [115, 85, 125, 95, 105, 75, 120, 90, 100, 80, 115, 95];

  const openProduct = (id: string) => {
    router.push(`/products/${id}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>My Wishlist</Text>
            <Text style={styles.subtitle}>
              A little collection of things you love.
            </Text>
          </View>

          <Pressable style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={23} color={themeColor} />
          </Pressable>
        </View>

        {/* SEARCH BAR */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#A69EAD" />

          <TextInput
            placeholder="Find something in your wishlist..."
            placeholderTextColor="#77717F"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={19} color="#A69EAD" />
            </Pressable>
          )}

          <View style={styles.searchDivider} />

          <Pressable onPress={() => setFilterVisible(true)}>
  <Ionicons
    name="options-outline"
    size={21}
    color={themeColor}
  />
</Pressable>
        </View>

        {/* COLLECTION HEADER */}
        <View style={styles.collectionHeader}>
          <Text style={styles.collectionTitle}>Your collection</Text>
          <Text style={styles.itemCount}>{filteredProducts.length} items</Text>
        </View>

        {/* FLOATING PRODUCTS */}
        {filteredProducts.length > 0 ? (
          <View style={styles.productCanvas}>
            {filteredProducts.map((product, index) => {
              const imageSize = bubbleSizes[index % bubbleSizes.length];
              const isSelected = selectedProduct === product.id;

              return (
                <Pressable
                  key={product.id}
                  style={[
                    styles.productBubble,
                    {
                      width: width * 0.31,
                      height: 155,
                      marginTop:
                        index % 3 === 1 ? 35 : index % 3 === 2 ? 10 : 0,
                    },
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      openProduct(product.id);
                    } else {
                      setSelectedProduct(product.id);
                    }
                  }}
                >
                  <View style={styles.imageContainer}>
                    <View
                      style={[
                        styles.productCircle,
                        {
                          width: imageSize,
                          height: imageSize,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: product.image }}
                        style={styles.productImage}
                        resizeMode="contain"
                      />
                    </View>

                    {isSelected && (
                      <View style={[styles.selectedIndicator, { backgroundColor: themeColor }]}>
                        <Ionicons
                          name="arrow-up-right"
                          size={15}
                          color={themeForegroundColor}
                        />
                      </View>
                    )}
                  </View>

                  {isSelected && (
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {product.name}
                      </Text>
                      <Text style={[styles.productPrice, { color: themeColor }]}>
                        ₦{product.price.toLocaleString("en-NG")}
                      </Text>
                      <Text style={styles.tapHint}>Tap again to view</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={38} color={themeColor} />
            <Text style={styles.emptyTitle}>Nothing found</Text>
            <Text style={styles.emptySubtitle}>
              Try searching for another product.
            </Text>
          </View>
        )}
      </ScrollView>
      <Modal
  visible={filterVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setFilterVisible(false)}
>
  <Pressable
    style={styles.modalBackdrop}
    onPress={() => setFilterVisible(false)}
  >
    <Pressable
      style={styles.filterSheet}
      onPress={(event) => event.stopPropagation()}
    >
      <View style={styles.sheetHandle} />

      <View style={styles.filterHeader}>
        <Text style={styles.filterTitle}>Filter wishlist</Text>

        <Pressable onPress={() => setFilterVisible(false)}>
          <Ionicons name="close" size={23} color="#FFFFFF" />
        </Pressable>
      </View>

      {/* CATEGORY */}
      <Text style={styles.filterLabel}>Category</Text>

      <View style={styles.filterOptions}>
        {categories.map((category) => (
          <Pressable
            key={category}
            onPress={() => setSelectedCategory(category)}
            style={[
              styles.filterOption,
              selectedCategory === category && {
                backgroundColor: themeColor,
                borderColor: themeColor,
              },
            ]}
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedCategory === category && {
                  color: themeForegroundColor,
                },
              ]}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* CONDITION */}
      <Text style={styles.filterLabel}>Condition</Text>

      <View style={styles.filterOptions}>
        {conditions.map((condition) => (
          <Pressable
            key={condition}
            onPress={() => setSelectedCondition(condition)}
            style={[
              styles.filterOption,
              selectedCondition === condition && {
                backgroundColor: themeColor,
                borderColor: themeColor,
              },
            ]}
          >
            <Text
              style={[
                styles.filterOptionText,
                selectedCondition === condition && {
                  color: themeForegroundColor,
                },
              ]}
            >
              {condition}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ACTIONS */}
      <View style={styles.filterActions}>
        <Pressable
          style={styles.resetButton}
          onPress={() => {
            setSelectedCategory("All");
            setSelectedCondition("All");
          }}
        >
          <Text style={[styles.resetText, { color: themeColor }]}>Reset</Text>
        </Pressable>

        <Pressable
          style={[styles.applyButton, { backgroundColor: themeColor }]}
          onPress={() => setFilterVisible(false)}
        >
          <Text style={[styles.applyText, { color: themeForegroundColor }]}>
            Show {filteredProducts.length} products
          </Text>
        </Pressable>
      </View>
    </Pressable>
  </Pressable>
</Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09070D",
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: "#A69EAD",
    fontSize: 13,
    marginTop: 7,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    height: 52,
    backgroundColor: "#17121D",
    borderWidth: 1,
    borderColor: "#302537",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    marginTop: 28,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 13,
    paddingVertical: 0,
  },
  searchDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#3A3040",
  },
  collectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 32,
    marginBottom: 15,
  },
  collectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  itemCount: {
    color: "#A69EAD",
    fontSize: 12,
  },
  productCanvas: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  productBubble: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 125,
    position: "relative",
  },
  selectedIndicator: {
    position: "absolute",
    right: 0,
    top: 5,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    alignItems: "center",
    marginTop: 2,
    width: "100%",
  },
  productName: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    maxWidth: "100%",
  },
  productPrice: {
    fontSize: 11,
    marginTop: 3,
  },
  tapHint: {
    color: "#77717F",
    fontSize: 9,
    marginTop: 3,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 100,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 15,
  },
  emptySubtitle: {
    color: "#A69EAD",
    fontSize: 12,
    marginTop: 7,
  },

  productCircle: {
    borderRadius: 1000,
    backgroundColor: "#211B29",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  modalBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.65)",
  justifyContent: "flex-end",
},

filterSheet: {
  backgroundColor: "#17121D",
  paddingHorizontal: 22,
  paddingTop: 12,
  paddingBottom: 35,
  borderTopLeftRadius: 22,
  borderTopRightRadius: 22,
  borderWidth: 1,
  borderColor: "#35283E",
},

sheetHandle: {
  width: 38,
  height: 4,
  borderRadius: 5,
  backgroundColor: "#51465A",
  alignSelf: "center",
  marginBottom: 22,
},

filterHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 28,
},

filterTitle: {
  color: "#FFFFFF",
  fontSize: 19,
  fontWeight: "700",
},

filterLabel: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "600",
  marginBottom: 13,
},

filterOptions: {
  flexDirection: "row",
  flexWrap: "wrap",
  gap: 9,
  marginBottom: 25,
},

filterOption: {
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 20,
  backgroundColor: "#211B29",
  borderWidth: 1,
  borderColor: "#35283E",
},

filterOptionText: {
  color: "#A69EAD",
  fontSize: 12,
},

filterActions: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginTop: 5,
},

resetButton: {
  paddingVertical: 15,
  paddingHorizontal: 22,
},

resetText: {
  fontWeight: "600",
},

applyButton: {
  flex: 1,
  paddingVertical: 15,
  borderRadius: 12,
  alignItems: "center",
},

applyText: {
  color: "#FFFFFF",
  fontWeight: "600",
  fontSize: 13,
},
});
