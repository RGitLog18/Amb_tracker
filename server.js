const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (connect once)
const url =
  process.env.MONGO_URL ||
  "mongodb+srv://rajeedandge444:PNzwy19r3iM1qEZ8@cluster0.mfaavun.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let db;
(async () => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    db = client.db("tinder");
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME || "dp5svqc1n",
  api_key: process.env.CLOUD_KEY || "736295659442531",
  api_secret: process.env.CLOUD_SECRET || "jH-TRd5A65JCoTezD0L7gBfxHPE",
});

// Multer storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "hospital_uploads",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => Date.now() + "-" + file.originalname,
  },
});

const upload = multer({ storage });

// Handle multiple named file uploads
const multipleFields = upload.fields([
  { name: "hospitalCert", maxCount: 1 },
  { name: "ambulanceLicense", maxCount: 1 },
  { name: "fireNOC", maxCount: 1 },
  { name: "biomedicalAuth", maxCount: 1 },
  { name: "serviceAgreement", maxCount: 1 },
]);

// Upload route
app.post("/upload", (req, res, next) => {
  multipleFields(req, res, (err) => {
    if (err) {
      console.error("❌ Multer/Cloudinary error:", err);
      return res.status(400).json({
        success: false,
        error: "File upload failed: " + err.message,
      });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log("📩 REQ BODY:", req.body);
    console.log("📂 REQ FILES:", req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ success: false, error: "No files uploaded" });
    }

    // Validate text fields
    if (!req.body.name || !req.body.address) {
      return res.status(400).json({ success: false, error: "Name and address are required" });
    }

    // Build DB object
    const obj = {
      name: req.body.name,
      address: req.body.address,
      documents: {
        hospitalCert: req.files.hospitalCert ? req.files.hospitalCert[0].path : null,
        ambulanceLicense: req.files.ambulanceLicense ? req.files.ambulanceLicense[0].path : null,
        fireNOC: req.files.fireNOC ? req.files.fireNOC[0].path : null,
        biomedicalAuth: req.files.biomedicalAuth ? req.files.biomedicalAuth[0].path : null,
        serviceAgreement: req.files.serviceAgreement ? req.files.serviceAgreement[0].path : null,
      },
      upload_time: new Date(),
    };

    const result = await db.collection("hospital_registrations").insertOne(obj);

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("❌ SERVER ERROR:", err.stack || err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
