const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Brand = mongoose.model("Brand", new mongoose.Schema({
  name: String,
  slug: String,
  description: String
}));

router.get("/", async (req, res) => {
  const brands = await Brand.find();
  res.json(brands);
});

router.get("/:slug", async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug });
  res.json(brand);
});

module.exports = router;
