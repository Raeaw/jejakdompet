const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');
const authMiddleware = require('../middleware/authMiddleware');

// Terapkan middleware ke semua rute di bawahnya (Harus Login Dulu!)
router.use(authMiddleware);

// POST /api/v1/wallets -> Bikin dompet
router.post('/', walletController.createWallet);

// GET /api/v1/wallets -> Lihat daftar dompet
router.get('/', walletController.getWallets);

module.exports = router;