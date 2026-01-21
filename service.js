const mongoose = require("mongoose");

/* ================================
   MongoDB Connection
================================ */
async function connectMongo() {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB Connected ✅");
}

/* ================================
   Models
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
   Services
================================ */
async function getAllBrands() {
  return Brand.find({}, { slug: 1, brandName: 1, _id: 0 });
}

async function getBrandWithCoupons(slug) {
  const brand = await Brand.findOne({ slug });
  const coupons = await Coupon.find({ brandSlug: slug });
  return { brand, coupons };
}

async function getCouponsByKeyword(keyword) {
  return Coupon.find({
    title: { $regex: keyword, $options: "i" }
  });
}

module.exports = {
  connectMongo,
  getAllBrands,
  getBrandWithCoupons,
  getCouponsByKeyword
};