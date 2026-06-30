const { Sellers, Markets } = require("../model/db");

const productImages = [
  "https://....image1.jpg",
  "https://....image2.jpg",
  "https://....image3.jpg",
  "https://....image4.jpg",
];

const createProduct = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { name, category, price, quantity } = req.body;

    const seller = await Sellers.findOne({
      user_id: req.user.id,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found.",
      });
    }

    // Ensure the seller owns this marketplace
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add products to this marketplace.",
      });
    }

    const randomImage =
      productImages[Math.floor(Math.random() * productImages.length)];

    const newProduct = {
      name,
      category,
      price,
      quantity,
      imageURL: randomImage,
    };

    market.products.push(newProduct);

    seller.total_products += 1;

    await market.save();
    await seller.save();

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product: market.products[market.products.length - 1],
        products: market.products,
      market
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { createProduct };
