const { Sellers, Markets } = require("../model/db");

const delete_market = async (req, res) => {
  try {
    const { marketId } = req.params;
    const userId = req.user.id;

    // Find the seller
    const seller = await Sellers.findOne({ user_id: userId });

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

    // Make sure this seller owns it
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this marketplace.",
      });
    }

    // Remove the marketplace ID from the seller
    seller.markets.pull(marketId);
    await seller.save();

    const sellers_markets = await Sellers.findOne({
      user_id: req.user.id,
    }).populate("markets");

    // Delete the marketplace
    await Markets.findByIdAndDelete(marketId);

    return res.status(200).json({
      success: true,
      message: "Marketplace deleted successfully.",
      sellers_market: sellers_markets.markets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { delete_market };
