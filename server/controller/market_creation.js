const { Sellers } = require("../model/db");
const { Markets } = require("../model/db");

const create_a_market = async (req, res) => {
  try {
    const { name, description, target_funds } = req.body;
    const userId = req.user.id;

    const sellers = await Sellers.findOne({ user_id: userId });

    if (!sellers) {
      return res.status(404).json({
        message: "Seller not found",
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Marketplace name are required.",
      });
    }

    const marketplaceLogos = [
      "https://i.pinimg.com/1200x/4c/5c/eb/4c5ceb25f407b3a60a9550858caaf4fd.jpg",
      "https://i.pinimg.com/736x/b8/fe/3d/b8fe3d99156ae26e76fee0d674c30aa6.jpg",
      "https://i.pinimg.com/1200x/49/fb/18/49fb18493c74a9f97461f6c08cc382bf.jpg",
      "https://i.pinimg.com/736x/ee/d4/b6/eed4b615981b421f8a6eb50ee3cd1e12.jpg",
      "https://i.pinimg.com/1200x/f6/8f/94/f68f94899c4deda2d139af4d9ab313c8.jpg",
      "https://i.pinimg.com/736x/8d/e1/1b/8de11be6d4b730fa9f1fcdede06ca3c5.jpg",
    ];

    const getRandomMarketplaceLogo = () => {
      const randomIndex = Math.floor(Math.random() * marketplaceLogos.length);
      return marketplaceLogos[randomIndex];
    };

    // Create marketplace
    const marketplace = await Markets.create({
      owner: sellers._id, // comes from authentication middleware
      name,
      logo: getRandomMarketplaceLogo(),
      description,
      target_funds,
    });

    sellers.markets.push(marketplace._id);
    await sellers.save();

    const sellers_markets = await Sellers.findOne({
      user_id: req.user.id,
    }).populate("markets");

    return res.status(201).json({
      success: true,
      message: "Market created successfully.",
      marketplace,
      sellers_market: sellers_markets.markets,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create marketplace.",
    });
  }
};

module.exports = { create_a_market };
