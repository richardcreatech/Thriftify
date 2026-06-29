const { Sellers } = require("../model/db");
const { Markets } = require("../model/db");


const getMarketplaces = async (req, res) => {
  try {
    const sellers = await Sellers.findOne({
      user_id: req.user.id,
    }).populate("markets");

    if (!sellers) {
      return res.status(404).json({
        message: "Sellers not found",
      });
    }

    res.json({
      marketplaces: sellers.markets,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {getMarketplaces}