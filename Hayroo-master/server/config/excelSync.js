// C:\lakmal_code\com_v5\com_v5\Hayroo-master\server\config\excelSync.js
const axios = require("axios");
const csv = require("csv-parser");
const { Readable } = require("stream");
const cron = require("node-cron");
const productModel = require("../models/products");
const categoryModel = require("../models/categories");

const syncProductsFromSheet = async () => {
  const SHEET_URL = process.env.SHEET_CSV_URL;

  if (!SHEET_URL) {
    console.log("⚠️ SHEET_CSV_URL is not defined in .env file.");
    return;
  }

  try {
    console.log("🔄 Starting Google Sheet Auto-Sync (Categories & Products)...");

    const response = await axios.get(SHEET_URL, { responseType: "text" });
    const results = [];
    const stream = Readable.from(response.data);

    stream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        console.log(`📊 Processing ${results.length} rows from Google Sheet.`);

        const activeSheetProductNames = [];

        for (const row of results) {
          const pName = row.Name || row.name || row.pName;
          const pDescription = row.Description || row.description || row.pDescription || "No description provided";
          const pPrice = parseFloat(row.Price || row.price || row.pPrice || 0);
          const pQuantity = parseInt(row.Quantity || row.quantity || row.pQuantity || 0);
          const imageUrl = row.Image || row.image || row.pImage || "";
          const pStatus = row.Status || row.status || row.pStatus || "Active";
          const categoryName = row.Category || row.category || row.pCategory;
          const categoryDesc = row["Category Description"] || row.categoryDescription || `${categoryName} category`;
          const pOffer = parseInt(row.Offer || row.pOffer || 0);

          if (!pName || isNaN(pPrice)) continue;

          activeSheetProductNames.push(pName);

          // 1. Dynamic Category Auto-Creation/Lookup
          let categoryId = null;
          if (categoryName) {
            let category = await categoryModel.findOne({
              cName: { $regex: new RegExp(`^${categoryName.trim()}$`, "i") }
            });

            if (!category) {
              category = new categoryModel({
                cName: categoryName.trim(),
                cDescription: categoryDesc,
                cStatus: "Active",
                cImage: imageUrl || "default_cat.png"
              });
              await category.save();
              console.log(`📁 Auto-Created Category: ${category.cName}`);
            }
            categoryId = category._id;
          }

          // 2. Product Upsert (Create / Update)
          const updateData = {
            pName: pName.trim(),
            pDescription,
            pPrice,
            pQuantity,
            pStatus,
            pOffer,
            ...(categoryId && { pCategory: categoryId }),
            ...(imageUrl && { pImages: [imageUrl] })
          };

          await productModel.findOneAndUpdate(
            { pName: pName.trim() },
            { $set: updateData },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          );

          console.log(`✅ Synced Product: ${pName}`);
        }

        // 3. Handle Deleted Products from Sheet (Disabled state setting)
        if (activeSheetProductNames.length > 0) {
          await productModel.updateMany(
            { pName: { $nin: activeSheetProductNames } },
            { $set: { pStatus: "Disabled" } }
          );
        }

        console.log("✨ Google Sheet Category & Product Sync Completed Successfully!");
      });
  } catch (error) {
    console.error("❌ Google Sheet Sync Error:", error.message);
  }
};

// සෑම විනාඩි 5කට වරක් Auto-Sync වීම
cron.schedule("*/5 * * * *", () => {
  syncProductsFromSheet();
});

module.exports = { syncProductsFromSheet };