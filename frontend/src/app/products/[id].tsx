import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TextInput,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


import {
  ApiError,
  getProductById,
  getProductReviews,
  submitProductReview,
  type ApiReview,
  type ApiProduct,
} from "@/services/api";
import { useCart } from "@/context/CartContext";
import { useThemeColor } from "@/context/ThemeContext";
import { useCallback, useEffect, useRef, useState } from "react";

function formatReviewDate(dateValue: string) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : date.toLocaleDateString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);

        const fetchedProduct = await getProductById(id);

        if (isMounted) {
          setProduct(fetchedProduct);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load this product.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const { themeColor, themeForegroundColor } = useThemeColor();
  const { addToCart } = useCart();
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const router = useRouter();
  const reviewsRequestId = useRef(0);

  const loadReviews = useCallback(async (): Promise<boolean> => {
    const requestId = ++reviewsRequestId.current;
    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const fetchedReviews = await getProductReviews(id);
      if (requestId !== reviewsRequestId.current) {
        return false;
      }

      setReviews(fetchedReviews);
      return true;
    } catch (err) {
      if (requestId !== reviewsRequestId.current) {
        return false;
      }

      setReviewsError(
        err instanceof Error ? err.message : "Could not load product reviews.",
      );
      return false;
    } finally {
      if (requestId === reviewsRequestId.current) {
        setReviewsLoading(false);
      }
    }
  }, [id]);

  useEffect(() => {
    setHasReviewed(false);
    void loadReviews();
    return () => {
      reviewsRequestId.current += 1;
    };
  }, [id, loadReviews]);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) /
        reviews.length
      : 0;

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert("Rating required", "Please select a star rating.");
      return;
    }

    if (hasReviewed || reviewSubmitting) {
      return;
    }

    setReviewSubmitting(true);
    try {
      await submitProductReview(id, rating, reviewText);
      setHasReviewed(true);
      setRating(0);
      setReviewText("");
      setReviewModalVisible(false);

      const refreshed = await loadReviews();
      Alert.alert(
        "Review submitted",
        refreshed
          ? "Thank you for sharing your experience!"
          : "Your review was submitted, but the latest reviews could not be refreshed.",
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setHasReviewed(true);
        setRating(0);
        setReviewText("");
        setReviewModalVisible(false);
        Alert.alert("Already reviewed", err.message);
      } else if (err instanceof ApiError && err.status === 401) {
        setReviewModalVisible(false);
        Alert.alert(
          "Sign in required",
          "Please sign in to submit a review.",
          [{ text: "Sign in", onPress: () => router.push("/(auth)") }],
        );
      } else {
        Alert.alert(
          "Review failed",
          err instanceof Error ? err.message : "Could not submit your review.",
        );
      }
    } finally {
      setReviewSubmitting(false);
    }
  };

if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Loading product...</Text>
    </SafeAreaView>
  );
}

if (error) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>{error}</Text>

      <Pressable onPress={() => router.replace("/(tabs)")}>
        <Text style={[styles.backText, { color: themeColor }]}>
          Back to Home
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

if (!product) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Product not found</Text>

      <Pressable onPress={() => router.replace("/(tabs)")}>
        <Text style={[styles.backText, { color: themeColor }]}>
          Back to Home
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

  const addToWishlist = () => {
    Alert.alert("Saved", `${product.name} added to your wishlist.`);
  };

const handleAddToCart = () => {
  addToCart({
    id: String(product.id),
    name: product.name,
    price: Number(product.price),
    condition: product.condition,
    category: product.category,
    image: product.image ?? "",
    marketId: String(product.market_id),
  });
  Alert.alert("Added to cart", `${product.name} has been added.`);
};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={25} color="#FFFFFF" />
          </Pressable>

          <Text style={styles.headerTitle}>Product Details</Text>

          <Pressable onPress={addToWishlist}>
            <Ionicons name="heart-outline" size={25} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Product image */}
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.imagePlaceholder]}>
            <Ionicons name="image-outline" size={48} color="#77717F" />
          </View>
        )}

        {/* Product information */}
        <View style={styles.content}>
          <Text style={[styles.condition, { color: themeColor }]}>{product.condition}</Text>

          <Text style={styles.productName}>{product.name}</Text>

          <Text style={[styles.price, { color: themeColor }]}>
            ₦{Number(product.price).toLocaleString("en-NG")}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Product description</Text>

          <Text style={styles.description}>
            {product.description?.trim() ||
              `Discover this ${product.name}, a great find from our ${product.category} collection.`}
          </Text>

          <Text style={styles.sectionTitle}>Product condition</Text>

          <Text style={styles.description}>{product.condition}</Text>

          <Text style={styles.sectionTitle}>Seller and availability</Text>

          <Text style={styles.description}>{product.market_name}</Text>

          <Text style={styles.description}>
            {product.quantity > 0
              ? `${product.quantity} available`
              : "Currently out of stock"}
          </Text>
       
          <View style={styles.divider} />

{/* REVIEWS HEADER */}
<View style={styles.reviewHeader}>
  <View>
    <Text style={styles.sectionTitle}>Customer reviews</Text>

    <View style={styles.ratingSummary}>
      <Text style={styles.averageRating}>
        {averageRating.toFixed(1)}
      </Text>

      <View>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= Math.round(averageRating) ? "star" : "star-outline"}
              size={15}
              color="#F5B544"
            />
          ))}
        </View>

        <Text style={styles.reviewCount}>
          {reviews.length} reviews
        </Text>
      </View>
    </View>
  </View>

  {!hasReviewed && (
    <Pressable
      style={[styles.writeReviewButton, { backgroundColor: themeColor }]}
      onPress={() => setReviewModalVisible(true)}
    >
      <Ionicons name="create-outline" size={17} color={themeForegroundColor} />
      <Text style={[styles.writeReviewText, { color: themeForegroundColor }]}>
        Write a review
      </Text>
    </Pressable>
  )}
</View>

{reviewsLoading ? (
  <Text style={styles.reviewState}>Loading reviews...</Text>
) : reviewsError ? (
  <View>
    <Text style={styles.reviewState}>{reviewsError}</Text>
    <Pressable onPress={() => void loadReviews()}>
      <Text style={[styles.retryReviews, { color: themeColor }]}>
        Try again
      </Text>
    </Pressable>
  </View>
) : reviews.length === 0 ? (
  <Text style={styles.reviewState}>
    No reviews yet. Be the first to review this product!
  </Text>
) : (
  reviews.map((review) => (
    <View key={review.id} style={styles.reviewItem}>
      <View style={styles.reviewTop}>
        <View style={[styles.reviewerAvatar, { backgroundColor: themeColor }]}>
          <Text style={[styles.reviewerInitial, { color: themeForegroundColor }]}>
            {review.reviewer_name.charAt(0)}
          </Text>
        </View>

        <View style={styles.reviewerDetails}>
          <Text style={styles.reviewerName}>{review.reviewer_name}</Text>
          <Text style={styles.reviewDate}>
            {formatReviewDate(review.created_at)}
          </Text>
        </View>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Ionicons
              key={star}
              name={star <= review.rating ? "star" : "star-outline"}
              size={12}
              color="#F5B544"
            />
          ))}
        </View>
      </View>

      {review.comment ? (
        <Text style={styles.reviewComment}>{review.comment}</Text>
      ) : null}
    </View>
  ))
)}
        </View>
      </ScrollView>

      <Modal
  visible={reviewModalVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setReviewModalVisible(false)}
>
  <Pressable
    style={styles.modalBackdrop}
    onPress={() => setReviewModalVisible(false)}
  >
    <Pressable
      style={styles.reviewSheet}
      onPress={(event) => event.stopPropagation()}
    >
      <View style={styles.sheetHandle} />

      <View style={styles.reviewModalHeader}>
        <Text style={styles.modalTitle}>Write a review</Text>

        <Pressable onPress={() => setReviewModalVisible(false)}>
          <Ionicons name="close" size={23} color="#FFFFFF" />
        </Pressable>
      </View>

      <Text style={styles.modalSubtitle}>
        How would you rate {product.name}?
      </Text>

      {/* STAR SELECTION */}
      <View style={styles.ratingSelector}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={34}
              color="#F5B544"
            />
          </Pressable>
        ))}
      </View>

      <Text style={[styles.ratingHint, { color: themeColor }]}>
        {rating === 0
          ? "Select your rating"
          : `${rating} out of 5 stars`}
      </Text>

      {/* REVIEW INPUT */}
      <TextInput
        style={styles.reviewInput}
        placeholder="Share your experience (optional)..."
        placeholderTextColor="#77717F"
        multiline
        textAlignVertical="top"
        value={reviewText}
        onChangeText={setReviewText}
      />

      <Pressable
        style={[
          styles.submitReviewButton,
          { backgroundColor: themeColor },
          reviewSubmitting && styles.disabledSubmitButton,
        ]}
        onPress={submitReview}
        disabled={reviewSubmitting}
      >
        <Text style={[styles.submitReviewText, { color: themeForegroundColor }]}>
          {reviewSubmitting ? "Submitting..." : "Submit review"}
        </Text>
      </Pressable>
    </Pressable>
  </Pressable>
</Modal>

      {/* Bottom actions */}
      <View style={styles.bottomActions}>
        <Pressable style={styles.wishlistButton} onPress={addToWishlist}>
          <Ionicons name="heart-outline" size={22} color="#FFFFFF" />
        </Pressable>

        <Pressable
          style={[
            styles.cartButton,
            { backgroundColor: themeColor },
            product.quantity <= 0 && styles.disabledCartButton,
          ]}
          onPress={handleAddToCart}
          disabled={product.quantity <= 0}
        >
          <Ionicons
            name={product.quantity > 0 ? "bag-add-outline" : "close-circle-outline"}
            size={20}
            color={themeForegroundColor}
          />
          <Text style={[styles.cartButtonText, { color: themeForegroundColor }]}>
            {product.quantity > 0 ? "Add to cart" : "Out of stock"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09070D",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },

  productImage: {
    width: "100%",
    height: 350,
    backgroundColor: "#211B29",
  },

  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    padding: 20,
  },

  condition: {
    fontSize: 12,
    fontWeight: "600",
  },

  productName: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "700",
    marginTop: 8,
  },

  price: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },

  divider: {
    height: 1,
    backgroundColor: "#29222F",
    marginVertical: 22,
  },

  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 12,
  },

  description: {
    color: "#A69EAD",
    fontSize: 14,
    lineHeight: 22,
  },

  bottomActions: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: "#100D15",
    borderTopWidth: 1,
    borderTopColor: "#29222F",
  },

  wishlistButton: {
    width: 55,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#211B29",
    alignItems: "center",
    justifyContent: "center",
  },

  cartButton: {
    flex: 1,
    height: 52,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },

  disabledCartButton: {
    opacity: 0.55,
  },

  cartButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    padding: 20,
  },

  backText: {
    paddingHorizontal: 20,
  },
  reviewHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 22,
},

ratingSummary: {
  flexDirection: "row",
  alignItems: "center",
  gap: 12,
  marginTop: 8,
},

averageRating: {
  color: "#FFFFFF",
  fontSize: 32,
  fontWeight: "700",
},

stars: {
  flexDirection: "row",
  gap: 3,
},

reviewCount: {
  color: "#A69EAD",
  fontSize: 11,
  marginTop: 4,
},

reviewState: {
color: "#A69EAD",
fontSize: 13,
lineHeight: 20,
paddingVertical: 12,
},

retryReviews: {
fontSize: 13,
fontWeight: "600",
paddingVertical: 8,
},

writeReviewButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6,
  backgroundColor: "#382342",
  paddingHorizontal: 12,
  paddingVertical: 10,
  borderRadius: 9,
},

writeReviewText: {
  color: "#FFFFFF",
  fontSize: 11,
  fontWeight: "600",
},

reviewItem: {
  paddingVertical: 17,
  borderTopWidth: 1,
  borderTopColor: "#29222F",
},

reviewTop: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},

reviewerAvatar: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#382342",
  alignItems: "center",
  justifyContent: "center",
},

reviewerInitial: {
  fontWeight: "700",
},

reviewerDetails: {
  flex: 1,
},

reviewerName: {
  color: "#FFFFFF",
  fontSize: 12,
  fontWeight: "600",
},

reviewDate: {
  color: "#77717F",
  fontSize: 10,
  marginTop: 3,
},

reviewComment: {
  color: "#A69EAD",
  fontSize: 13,
  lineHeight: 21,
  marginTop: 12,
},

modalBackdrop: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "flex-end",
},

reviewSheet: {
  backgroundColor: "#17121D",
  padding: 22,
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

reviewModalHeader: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
},

modalTitle: {
  color: "#FFFFFF",
  fontSize: 19,
  fontWeight: "700",
},

modalSubtitle: {
  color: "#A69EAD",
  fontSize: 13,
  marginTop: 15,
},

ratingSelector: {
  flexDirection: "row",
  justifyContent: "center",
  gap: 12,
  marginTop: 25,
},

ratingHint: {
  fontSize: 12,
  textAlign: "center",
  marginTop: 10,
},

reviewInput: {
  minHeight: 120,
  backgroundColor: "#211B29",
  borderWidth: 1,
  borderColor: "#35283E",
  borderRadius: 12,
  padding: 14,
  color: "#FFFFFF",
  fontSize: 13,
  marginTop: 25,
},

submitReviewButton: {
  paddingVertical: 16,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 18,
},

submitReviewText: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "700",
},

disabledSubmitButton: {
  opacity: 0.6,
},
});
