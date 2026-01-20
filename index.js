require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

/* ================================
   Health check
================================ */
app.get("/", (req, res) => {
  res.send("Coupon SEO API Running 🚀");
});

/* ================================
   Test Supabase Connection
================================ */
app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "Supabase Connected ✅",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      status: "Supabase NOT connected ❌",
      error: error.message
    });
  }
});

/* ================================
   GET ALL BRANDS
================================ */
app.get("/api/brands", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM brands");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   GET SINGLE BRAND
================================ */
app.get("/api/brands/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const brandResult = await pool.query(
      "SELECT * FROM brands WHERE slug = $1",
      [slug]
    );

    if (brandResult.rows.length === 0) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const couponsResult = await pool.query(
      "SELECT * FROM coupons WHERE brand_slug = $1",
      [slug]
    );

    res.json({
      brand: brandResult.rows[0],
      coupons: couponsResult.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   KEYWORDS SEARCH
================================ */
app.get("/api/keywords/:keyword", async (req, res) => {
  try {
    const keyword = req.params.keyword.replace(/-/g, " ");

    const result = await pool.query(
      "SELECT * FROM coupons WHERE title ILIKE $1",
      [`%${keyword}%`]
    );

    res.json({
      title: `${keyword} Coupons & Promo Codes`,
      description: `Find verified ${keyword} deals`,
      heading: `${keyword} Coupons`,
      coupons: result.rows
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================================
   Affiliate Redirect
================================ */
app.get("/out/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT affiliate_url FROM coupons WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) return res.sendStatus(404);

    res.redirect(result.rows[0].affiliate_url);
  } catch {
    res.sendStatus(500);
  }
});

/* ================================
   Start Server
================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});










