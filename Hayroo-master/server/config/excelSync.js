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
    console.log("🔄 Starting Google Sheet Auto-Sync...");

    // Append timestamp (&t=...) to force bypass Google's published CSV cache
    const cacheBusterUrl = `${SHEET_URL}${SHEET_URL.includes("?") ? "&" : "?"}t=${Date.now()}`;
    const response = await axios.get(cacheBusterUrl, { responseType: "text" });
    
    const results = [];
    const stream = Readable.from(response.data);

    await new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("error", (err) => reject(err))
        .on("end", () => resolve());
    });

    if (results.length === 0) {
      console.log("⚠️ Sheet returned 0 rows. Skipping update.");
      return;
    }

    const activeSheetProductNames = [];

    for (const row of results) {
      const pName = (row["Product Name"] || row["Name"] || row["pName"] || "").trim();
      const pDescription = row["Description"] || row["description"] || "No description provided";
      
      const rawPrice = row["Price"] || row["price"] || "0";
      const pPrice = parseFloat(String(rawPrice).replace(/[^0-9.]/g, "")); 
      
      const rawQuantity = row["Stock"] || row["Quantity"] || row["quantity"] || "0";
      const pQuantity = parseInt(rawQuantity, 10) || 0;

      const pStatus = row["Status"] || row["status"] || "Active";
      const categoryName = (row["Category Name"] || row["Category"] || row["category"] || "").trim();
      const categoryDesc = row["Category Description"] || `${categoryName} category`;
      
      const rawOffer = row["Offer %"] || row["Offer"] || "0";
      const pOffer = parseInt(rawOffer, 10) || 0;

      const img1 = row["Image 1"] || "";
      const img2 = row["Image 2"] || "";
      const pImages = [img1, img2].filter((url) => url && url.trim() !== "");

      if (!pName || isNaN(pPrice)) continue;

      activeSheetProductNames.push(pName);

      try {
        // 1. Category Auto-Lookup or Creation
        let categoryId = null;
        if (categoryName) {
          let category = await categoryModel.findOne({
            cName: { $regex: new RegExp(`^${categoryName}$`, "i") }
          });

          if (!category) {
            category = await categoryModel.create({
              cName: categoryName,
              cDescription: categoryDesc,
              cStatus: "Active",
              cImage: img1 || "default_cat.png"
            });
          }
          categoryId = category._id;
        }

        // 2. Upsert Product Details
        const updateData = {
          pName,
          pDescription,
          pPrice,
          pQuantity,
          pStatus,
          pOffer,
          ...(categoryId && { pCategory: categoryId }),
          pImages: pImages.length > 0 ? pImages : ["default_product.png"]
        };

        await productModel.findOneAndUpdate(
          { pName: { $regex: new RegExp(`^${pName}$`, "i") } },
          { $set: updateData },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      } catch (rowError) {
        console.error(`❌ Error syncing product "${pName}":`, rowError.message);
      }
    }

    // 3. Remove products from Database if missing from Google Sheet
    if (activeSheetProductNames.length > 0) {
      const deleteResult = await productModel.deleteMany({
        pName: { 
          $nin: activeSheetProductNames.map((name) => new RegExp(`^${name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}$`, "i")) 
        }
      });
      console.log(`🗑️ Removed ${deleteResult.deletedCount} old products not in Excel.`);
    }

    console.log("✨ Google Sheet Sync Completed Successfully!");
  } catch (error) {
    console.error("❌ Google Sheet Sync Error:", error.message);
  }
};

// Sync every 2 minutes
cron.schedule("*/2 * * * *", () => {
  syncProductsFromSheet();
});

module.exports = { syncProductsFromSheet };