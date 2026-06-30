const { Sellers, Markets } = require("../model/db");

const get_market_performance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find seller
    const seller = await Sellers.findOne({
      user_id: userId,
    });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Get all markets owned by the seller
    const markets = await Markets.find({
      owner: seller._id,
    })

    return res.status(200).json({
      success: true,
      markets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

module.exports = { get_market_performance };