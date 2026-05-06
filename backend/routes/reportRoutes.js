const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

// Terapkan satpam (wajib login)
router.use(authMiddleware);

// GET /api/v1/reports/cashflow -> Ambil data Bar Chart
router.get('/cashflow', reportController.getCashflow);

// GET /api/v1/reports/expenses -> Ambil data Pie Chart
router.get('/expenses', reportController.getExpenseDistribution);

module.exports = router;