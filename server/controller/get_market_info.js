const { Markets, Sellers } = require("../model/db");

const getMarketInfo = async (req, res) => {
  try {
    const { marketId } = req.params;
    const userId = req.user.id;

    // Check if the user is a seller
    const seller = await Sellers.findOne({ user_id: userId });

    if (!seller) {
      return res.status(403).json({
        success: false,
        message: "You must be a seller to access this market info.",
      });
    }

    // Find the marketplace and optionally check if the seller owns it
    const market = await Markets.findById(marketId).populate("products");

    if (!market) {
      return res.status(404).json({
        success: false,
        message: "Marketplace not found.",
      });
    }

    // (Optional) Check if the seller is the owner of this market
    if (market.owner.toString() !== seller._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this marketplace info.",
      });
    }

    return res.status(200).json({
      success: true,
      market,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { getMarketInfo };
