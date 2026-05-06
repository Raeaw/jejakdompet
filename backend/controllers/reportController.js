const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 1. Fungsi Grafik Arus Kas (Pemasukan vs Pengeluaran per Bulan)
exports.getCashflow = async (req, res) => {
	try {
		const userId = req.user.userId;
		const year = req.query.year
			? parseInt(req.query.year)
			: new Date().getFullYear();

		// Ambil semua jurnal Income & Expense milik user pada tahun tersebut
		const entries = await prisma.journalEntry.findMany({
			where: {
				wallet: {
					userId: userId,
					category: { in: ["income", "expense"] },
				},
				transaction: {
					transactionDate: {
						gte: new Date(`${year}-01-01`),
						lt: new Date(`${year + 1}-01-01`),
					},
				},
			},
			include: { wallet: true, transaction: true },
		});

		// Siapkan array kosong untuk 12 bulan
		const monthlyData = Array.from({ length: 12 }, () => ({
			income: 0,
			expense: 0,
		}));

		entries.forEach((entry) => {
			const monthIndex = new Date(entry.transaction.transactionDate).getMonth(); // 0 = Jan, 11 = Des
			const amount = Number(entry.amount);

			// Sesuai prinsip Akuntansi:
			// Pemasukan riil dicatat saat akun 'income' di-Kredit.
			// Pengeluaran riil dicatat saat akun 'expense' di-Debit.
			if (entry.wallet.category === "income" && entry.entryType === "credit") {
				monthlyData[monthIndex].income += amount;
			} else if (
				entry.wallet.category === "expense" &&
				entry.entryType === "debit"
			) {
				monthlyData[monthIndex].expense += amount;
			}
		});

		res.json({ year, data: monthlyData });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Gagal mengambil data arus kas" });
	}
};

// 2. Fungsi Grafik Distribusi Pengeluaran (Pie Chart)
exports.getExpenseDistribution = async (req, res) => {
	try {
		const userId = req.user.userId;
		// Format default: Bulan ini
		const currentDate = new Date();
		const month = req.query.month
			? parseInt(req.query.month)
			: currentDate.getMonth() + 1;
		const year = req.query.year
			? parseInt(req.query.year)
			: currentDate.getFullYear();

		// Tentukan rentang tanggal awal dan akhir bulan
		const startDate = new Date(year, month - 1, 1);
		const endDate = new Date(year, month, 1);

		const entries = await prisma.journalEntry.findMany({
			where: {
				wallet: { userId: userId, category: "expense" },
				entryType: "debit", // Hanya hitung saat uang benar-benar keluar (Debit ke beban)
				transaction: {
					transactionDate: { gte: startDate, lt: endDate },
				},
			},
			include: { wallet: true },
		});

		// Kelompokkan total pengeluaran berdasarkan nama dompet/kategori
		const distribution = {};
		entries.forEach((entry) => {
			const categoryName = entry.wallet.name;
			if (!distribution[categoryName]) {
				distribution[categoryName] = 0;
			}
			distribution[categoryName] += Number(entry.amount);
		});

		// Ubah object ke format array agar mudah dibaca oleh library grafik Frontend
		const chartData = Object.keys(distribution).map((key) => ({
			category: key,
			total: distribution[key],
		}));

		res.json({ period: `${year}-${month}`, data: chartData });
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Gagal mengambil data distribusi pengeluaran" });
	}
};
