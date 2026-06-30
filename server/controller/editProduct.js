const { Markets, Sellers } = require("../model/db");

const edit_product = async (req, res) => {
  try {
    const { marketId, productId } = req.params;
    const { name, category, price, quantity } = req.body;

    // Find seller
    const seller = await Sellers.findOne({
      user_id: req.user.id,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Find marketplace
    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found.",
      });
    }

    // Ensure seller owns the marketplace
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to edit products in this marketplace.",
      });
    }

    // Find the product
    const product = market.products.id(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Update only supplied fields
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;

    await market.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
        product,
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

module.exports = { edit_product };