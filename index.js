require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   MongoDB
================================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => {
    console.error("Mongo Error:", err);
    process.exit(1);
  });

/* ================================
   Models (no schema lock)
================================ */
const Brand =
  mongoose.models.Brand ||
  mongoose.model(
    "Brand",
    new mongoose.Schema({}, { strict: false }),
    "brands"
  );

const Coupon =
  mongoose.models.Coupon ||
  mongoose.model(
    "Coupon",
    new mongoose.Schema({}, { strict: false }),
    "coupons"
  );

/* ================================
   Health check
================================ */
app.get("/", (req, res) => {
  res.send("Coupon SEO API Running 🚀");
});

/* ================================
   ALL BRANDS  (SITEMAP)
   GET /api/brands
================================ */
app.get("/api/brands", async (req, res) => {
  try {
    const brands = await Brand.find({}, { slug: 1, brandName: 1, _id: 0 });
    res.json(brands);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   SINGLE BRAND
   GET /api/brands/nike
================================ */
app.get("/api/brands/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const brand = await Brand.findOne({ slug });
    const coupons = await Coupon.find({ brandSlug: slug });

    if (!brand) return res.status(404).json({ error: "Brand not found" });

    res.json({ brand, coupons });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   KEYWORDS
================================ */
app.get("/api/keywords/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword.replace(/-/g, " ");

    const coupons = await Coupon.find({
      title: { $regex: keyword, $options: "i" }
    });

    res.json({
      title: `${keyword} Coupons & Promo Codes`,
      description: `Find verified ${keyword} deals`,
      heading: `${keyword} Coupons`,
      coupons
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   Affiliate redirect
================================ */
app.get("/out/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.sendStatus(404);
    res.redirect(coupon.affiliateUrl);
  } catch {
    res.sendStatus(500);
  }
});

/* ================================
   Railway port
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});








