import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "@/context/CartContext";
import { useThemeColor } from "@/context/ThemeContext";

const formatPrice = (price: number) =>
  `₦${price.toLocaleString("en-NG")}`;

export default function CartScreen() {
  const { themeColor, themeForegroundColor } = useThemeColor();
  const {
    items,
    cartCount,
    subtotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Cart</Text>
          <Text style={styles.subtitle}>
            {cartCount} {cartCount === 1 ? "item" : "items"} in your bag
          </Text>
        </View>

        <Ionicons name="bag-outline" size={25} color={themeColor} />
      </View>

      {items.length === 0 ? (
        /* Empty Cart */
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="bag-handle-outline"
              size={55}
              color={themeColor}
            />
          </View>

          <Text style={styles.emptyTitle}>Your cart is empty</Text>

          <Text style={styles.emptySubtitle}>
            Your shopping bag is waiting. Find something you love!
          </Text>
        </View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartList}
          >
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.productImage}
                  resizeMode="cover"
                />

                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>

                  <Text style={styles.condition}>
                    {item.condition}
                  </Text>

                  <Text style={[styles.price, { color: themeColor }]}>
                    {formatPrice(item.price)}
                  </Text>

                  <View style={styles.itemActions}>
                    {/* Quantity Controls */}
                    <View style={styles.quantityControl}>
                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={styles.quantityButton}
                      >
                        <Ionicons
                          name="remove"
                          size={17}
                          color="#FFFFFF"
                        />
                      </Pressable>

                      <Text style={styles.quantity}>
                        {item.quantity}
                      </Text>

                      <Pressable
                        onPress={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={styles.quantityButton}
                      >
                        <Ionicons
                          name="add"
                          size={17}
                          color="#FFFFFF"
                        />
                      </Pressable>
                    </View>

                    {/* Remove */}
                    <Pressable
                      onPress={() => removeFromCart(item.id)}
                      hitSlop={10}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={19}
                        color="#A69EAD"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Order Summary */}
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatPrice(subtotal)}
              </Text>
            </View>

            <Text style={styles.deliveryNote}>
              Delivery fees will be calculated at checkout.
            </Text>

            <Pressable
              style={[styles.checkoutButton, { backgroundColor: themeColor }]}
              onPress={() => {
                // We'll connect the checkout screen here.
              }}
            >
              <Text style={[styles.checkoutText, { color: themeForegroundColor }]}>
                Proceed to checkout
              </Text>

              <Ionicons
                name="arrow-forward"
                size={19}
                color={themeForegroundColor}
              />
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09070D",
    paddingHorizontal: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
  },

  subtitle: {
    color: "#A69EAD",
    fontSize: 13,
    marginTop: 5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 70,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: "#211B29",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 25,
  },

  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  emptySubtitle: {
    color: "#A69EAD",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginTop: 10,
  },

  cartList: {
    paddingBottom: 20,
  },

  cartItem: {
    flexDirection: "row",
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#211B29",
    gap: 15,
  },

  productImage: {
    width: 105,
    height: 115,
    borderRadius: 12,
    backgroundColor: "#211B29",
  },

  productInfo: {
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 3,
  },

  productName: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  condition: {
    color: "#A69EAD",
    fontSize: 12,
    marginTop: 5,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 8,
  },

  itemActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#211B29",
    borderRadius: 8,
  },

  quantityButton: {
    padding: 7,
  },

  quantity: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    minWidth: 25,
    textAlign: "center",
  },

  summary: {
    borderTopWidth: 1,
    borderTopColor: "#302639",
    paddingTop: 20,
    paddingBottom: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  summaryLabel: {
    color: "#A69EAD",
    fontSize: 14,
  },

  summaryValue: {
    color: "#FFFFFF",
    fontSize: 19,
    fontWeight: "700",
  },

  deliveryNote: {
    color: "#A69EAD",
    fontSize: 11,
    marginTop: 8,
  },

  checkoutButton: {
    padding: 17,
    borderRadius: 10,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  checkoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});