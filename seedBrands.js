require("dotenv").config();
const mongoose = require("mongoose");

const Brand = mongoose.model(
  "Brand",
  new mongoose.Schema({}, { strict: false }),
  "brands"
);

const brands = [
  "Nike",
  "Adidas",
  "Puma",
  "Reebok",
  "Apple",
  "Samsung",
  "Sony",
  "LG",
  "Dell",
  "HP",
  "Lenovo",
  "Amazon",
  "Walmart",
  "Target",
  "Costco",
  "Best Buy",
  "Flipkart",
  "Myntra",
  "Ajio",
  "Shein",
  "Zara",
  "H&M",
  "Uniqlo",
  "ASOS",
  "Sephora",
  "Ulta",
  "Nykaa",
  "Loreal",
  "Maybelline",
  "Lakme"
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  for (let name of brands) {
    const slug = slugify(name);

    await Brand.updateOne(
      { slug },
      {
        brandName: name,
        slug,
        seoTitle: `${name} Coupons & Promo Codes – Save Big Today`,
        seoDescription: `Get the latest ${name} coupons, promo codes, and deals. Save big on ${name} products today.`,
        website: `https://${slug}.com`,
        logo: `https://logo.clearbit.com/${slug}.com`
      },
      { upsert: true }
    );

    console.log("Inserted:", name);
  }

  console.log("All brands inserted");
  process.exit();
}

seed();
