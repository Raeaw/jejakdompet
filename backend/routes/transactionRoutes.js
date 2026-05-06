const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");
const authMiddleware = require("../middleware/authMiddleware");

// Harus login untuk melakukan transaksi
router.use(authMiddleware);

// POST /api/v1/transactions -> Buat transaksi baru
router.post("/", transactionController.createTransaction);

// GET /api/v1/transactions -> Lihat riwayat transaksi
router.get("/", transactionController.getTransactions);

module.exports = router;
