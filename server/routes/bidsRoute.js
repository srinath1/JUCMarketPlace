const router = require("express").Router();
const Bid = require("../models/bidModel");
const authMiddleware = require("../middleware/authMiddleware");

// place a new bid
router.post("/place-new-bid", authMiddleware, async (req, res) => {
  console.log("place a bid", req.body);
  try {
    const newBid = new Bid(req.body);
    await newBid.save();
    res.send({ success: true, message: "Bid placed successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});
router.post("/get-all-bids", authMiddleware, async (req, res) => {
  console.log(req.body);

  try {
    const { product, seller, buyer } = req.body;
    let filters = {};
    if (product) {
      filters.product = product;
    }
    if (seller) {
      filters.seller = seller;
    }
    if (buyer) {
      filters.buyer = buyer;
    }
    console.log("Filters", filters);
    const bids = await Bid.find(filters)
      .populate("product")
      .populate("buyer")
      .populate("seller");
    res.send({ success: true, data: bids });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});
module.exports = router;
