const { Markets, Sellers } = require("../model/db");

const delete_product = async (req, res) => {
  try {
    const { marketId, productId } = req.params;

    // Find the seller
    const seller = await Sellers.findOne({
      user_id: req.user.id,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Find the marketplace
    const market = await Markets.findById(marketId);

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found.",
      });
    }

    // Check ownership
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to delete products from this marketplace.",
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

    // Remove the product
    product.deleteOne();

    await market.save();

    return res.status(200).json({
      success: true,
        message: "Product deleted successfully.",
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

module.exports = { delete_product };