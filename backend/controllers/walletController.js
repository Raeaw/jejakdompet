const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Fungsi: Membuat Dompet/Kategori Baru
exports.createWallet = async (req, res) => {
	try {
		const { name, category, balance } = req.body;
		// userId didapatkan dari satpam (middleware) kita
		const userId = req.user.userId;

		const wallet = await prisma.wallet.create({
			data: {
				userId,
				name, // misal: "BCA", "Dompet Tunai", "Makan Siang"
				category, // misal: "asset", "expense", "income"
				balance: balance || 0, // Default 0 jika tidak diisi
			},
		});

		res.status(201).json({ message: "Dompet berhasil dibuat", wallet });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Terjadi kesalahan saat membuat dompet" });
	}
};

// Fungsi: Mengambil Daftar Dompet Milik User yang Sedang Login
exports.getWallets = async (req, res) => {
	try {
		const userId = req.user.userId;

		const wallets = await prisma.wallet.findMany({
			where: { userId },
			orderBy: { createdAt: "desc" },
		});

		res.json(wallets);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Terjadi kesalahan saat mengambil data dompet" });
	}
};
