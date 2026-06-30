const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
const mongo_uri = process.env.MONGO_URI;

mongoose.connect(mongo_uri).then(() => {
  console.log("Your server has successfully connected to the database");
});

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["buyer", "seller"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const SellerSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    display_name: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      unique: true,
      required: true,
    },

    profile_picture: {
      type: String,
      default: "",
    },

    cover_photo: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    phone_number: String,

    location: {
      country: String,
      state: String,
      city: String,
    },

    bank_details: {
      bank_name: String,
      account_name: String,
      account_number: String,
    },

    is_verified: {
      type: Boolean,
      default: false,
    },

    markets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Markets",
      },
    ],

    total_sales: {
      type: Number,
      default: 0,
    },

    total_products: {
      type: Number,
      default: 0,
    },

    followers: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

const VerificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  code: String,

  expires_at: Date,

  type: {
    type: String,
    enum: ["email_verification", "phone_verification", "password_reset"],
  },
});

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    default: "",
  },
  order_number: {
    type: Number,
    default: 0,
  },
  revenue_generated: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // This will link each review to the Review collection
    },
  ],
});

const MarketplaceSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
  },

  name: String,

  description: String,

  logo: String,

  banner: String,

  products: [productSchema],

  target_funds: {
    type: Number,
    default: 0,
  },

  status: {
    type: String,
    default: "active",
  },
});

const User = mongoose.model("User", UserSchema);
const Sellers = mongoose.model("Sellers", SellerSchema);
const Markets = mongoose.model("Markets", MarketplaceSchema);
const Review = mongoose.model("Review", reviewSchema);

module.exports = { User, Sellers, Markets, Review };
