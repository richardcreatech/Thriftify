import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

const developmentHost =
  Constants.expoConfig?.hostUri?.replace(/:\d+$/, "") || "localhost";
const API_BASE_URL = (
  process.env.EXPO_PUBLIC_API_URL || `http://${developmentHost}:3500/api`
).replace(/\/+$/, "");

const TOKEN_KEY = "thriftify_token";

type ApiResponse = {
  message?: string;
  products?: unknown;
  reviews?: unknown;
  review?: unknown;
  token?: unknown;
  [key: string]: unknown;
  markets?: unknown;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiProduct = {
  id: number | string;
  name: string;
  description: string | null;
  category: string;
  price: number | string;
  quantity: number;
  image: string | null;
  condition: string;
  market_id: number | string;
  market_name: string;
};

export type ApiReview = {
  id: number | string;
  product_id: number | string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name: string;
};


export type ApiMarket = {
  id: number | string;
  name: string;
  description: string | null;
  logo: string | null;
  banner: string | null;
};

export type ApiMarketProduct = {
  id: number | string;
  market_id: number | string;
  name: string;
  description: string | null;
  category: string;
  condition: string;
  price: number | string;
  quantity: number;
  primary_image: string | null;
};

export type ApiMarketProductsResponse = {
  market: ApiMarket;
  products: ApiMarketProduct[];
};

export type ApiUser = {
  id: number | string;
  name: string;
  email: string;
  is_verified: boolean;
  created_at?: string;
};

function isApiProduct(value: unknown): value is ApiProduct {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    (typeof product.id === "number" || typeof product.id === "string") &&
    typeof product.name === "string" &&
    (typeof product.description === "string" ||
      product.description === null) &&
    typeof product.quantity === "number" &&
    typeof product.category === "string" &&
    (typeof product.price === "number" || typeof product.price === "string") &&
    (typeof product.image === "string" || product.image === null) &&
    typeof product.condition === "string" &&
    (typeof product.market_id === "number" ||
      typeof product.market_id === "string") &&
    typeof product.market_name === "string"
  );
}

function isApiReview(value: unknown): value is ApiReview {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const review = value as Record<string, unknown>;

  return (
    (typeof review.id === "number" || typeof review.id === "string") &&
    (typeof review.product_id === "number" ||
      typeof review.product_id === "string") &&
    typeof review.rating === "number" &&
    Number.isInteger(review.rating) &&
    review.rating >= 1 &&
    review.rating <= 5 &&
    (typeof review.comment === "string" || review.comment === null) &&
    typeof review.created_at === "string" &&
    typeof review.reviewer_name === "string"
  );
}

function isApiMarket(value: unknown): value is ApiMarket {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const market = value as Record<string, unknown>;

  return (
    (typeof market.id === "number" ||
      typeof market.id === "string") &&
    typeof market.name === "string" &&
    (typeof market.description === "string" ||
      market.description === null) &&
    (typeof market.logo === "string" ||
      market.logo === null) &&
    (typeof market.banner === "string" ||
      market.banner === null)
  );
}

function isApiMarketProduct(
  value: unknown
): value is ApiMarketProduct {
  if (!value || typeof value !== "object") return false;

  const product = value as Record<string, unknown>;

  return (
    (typeof product.id === "string" ||
      typeof product.id === "number") &&
    (typeof product.market_id === "string" ||
      typeof product.market_id === "number") &&
    typeof product.name === "string" &&
    (typeof product.description === "string" ||
      product.description === null) &&
    typeof product.category === "string" &&
    typeof product.condition === "string" &&
    (typeof product.price === "string" ||
      typeof product.price === "number") &&
    typeof product.quantity === "number" &&
    (typeof product.primary_image === "string" ||
      product.primary_image === null)
  );
}

export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
) {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error) {
    const detail = error instanceof Error ? ` ${error.message}` : "";
    throw new Error(
      `Could not connect to the Thriftify server. Check the API URL and server connection.${detail}`,
    );
  }

  const responseText = await response.text();
  let data: ApiResponse;
  try {
    data = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(
      response.ok
        ? "The server returned an invalid response."
        : `The server returned an invalid response (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    throw new ApiError(
      typeof data.message === "string"
        ? data.message
        : `Request failed (HTTP ${response.status}).`,
      response.status,
    );
  }

  return data;
}

export async function signup(
  name: string,
  email: string,
  password: string,
) {
  const data = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });

  await saveAuthToken(data);
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  await saveAuthToken(data);

  return data;
}

async function saveAuthToken(data: ApiResponse) {
  if (typeof data.token !== "string" || !data.token) {
    throw new Error("The server did not return an authentication token.");
  }

  await AsyncStorage.setItem(TOKEN_KEY, data.token);
}

export async function getMe(): Promise<ApiUser> {
  const data = await apiRequest("/auth/me");

  if (
    !data.user ||
    typeof data.user !== "object" ||
    typeof (data.user as Record<string, unknown>).name !== "string" ||
    typeof (data.user as Record<string, unknown>).email !== "string"
  ) {
    throw new Error("The server returned an invalid user profile.");
  }

  return data.user as ApiUser;
}

export async function getProducts() {
  const data = await apiRequest("/products");
  if (!Array.isArray(data.products) || !data.products.every(isApiProduct)) {
    throw new Error("The server returned an invalid product list.");
  }
  return data.products;
}

export async function getProductById(
  id: string,
): Promise<ApiProduct> {
  const data = await apiRequest(`/products/${encodeURIComponent(id)}`);

  if (!isApiProduct(data.product)) {
    throw new Error("The server returned an invalid product.");
  }

  return data.product;
}

export async function getProductReviews(
  productId: string | number,
): Promise<ApiReview[]> {
  const data = await apiRequest(
    `/reviews/${encodeURIComponent(String(productId))}`,
  );

  if (!Array.isArray(data.reviews) || !data.reviews.every(isApiReview)) {
    throw new Error("The server returned an invalid product review list.");
  }

  return data.reviews;
}

export function submitProductReview(
  productId: string | number,
  rating: number,
  comment: string,
) {
  const trimmedComment = comment.trim();
  const body = trimmedComment
    ? { rating, comment: trimmedComment }
    : { rating };

  return apiRequest(`/reviews/${encodeURIComponent(String(productId))}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getMarkets(): Promise<ApiMarket[]> {
  const data = await apiRequest("/markets");

  if (
    !Array.isArray(data.markets) ||
    !data.markets.every(isApiMarket)
  ) {
    throw new Error("The server returned an invalid market list.");
  }

  return data.markets;
}

export async function getMarketProducts(
  marketId: string
): Promise<ApiMarketProductsResponse> {
  const data = await apiRequest(`/markets/${marketId}/products`);

  if (
    !data.market ||
    typeof data.market !== "object" ||
    !Array.isArray(data.products) ||
    !data.products.every(isApiMarketProduct)
  ) {
    throw new Error("The server returned invalid market products.");
  }

  return {
    market: data.market as ApiMarketProductsResponse["market"],
    products: data.products,
  };
}

export async function updateProfile(name: string): Promise<ApiUser> {
  const data = await apiRequest("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

  if (
    !data.user ||
    typeof data.user !== "object" ||
    typeof (data.user as Record<string, unknown>).name !== "string" ||
    typeof (data.user as Record<string, unknown>).email !== "string"
  ) {
    throw new Error("The server returned an invalid updated profile.");
  }

  return data.user as ApiUser;
}


export async function requestEmailChange(newEmail: string) {
  const data = await apiRequest("/auth/email-change", {
    method: "POST",
    body: JSON.stringify({ newEmail: newEmail.trim() }),
  });

  return data;
}

export async function confirmEmailChange(otp: string) {
  const data = await apiRequest("/auth/email-change/confirm", {
    method: "POST",
    body: JSON.stringify({ otp: otp.trim() }),
  });

  return data;
}

export async function confirmNewEmail(otp: string): Promise<ApiUser> {
  const data = await apiRequest("/auth/email-change/confirm-new", {
    method: "POST",
    body: JSON.stringify({ otp: otp.trim() }),
  });

  if (
    !data.user ||
    typeof data.user !== "object" ||
    typeof (data.user as Record<string, unknown>).name !== "string" ||
    typeof (data.user as Record<string, unknown>).email !== "string"
  ) {
    throw new Error("The server returned an invalid updated profile.");
  }

  return data.user as ApiUser;
}
