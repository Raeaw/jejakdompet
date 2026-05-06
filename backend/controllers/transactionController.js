const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createTransaction = async (req, res) => {
	try {
		const { description, entries } = req.body;
		const userId = req.user.userId;

		// 1. Validasi Input: Pastikan ada minimal 2 entry (Debit & Kredit)
		if (!entries || entries.length < 2) {
			return res
				.status(400)
				.json({
					message: "Transaksi membutuhkan minimal 2 jurnal (Debit & Kredit)",
				});
		}

		// 2. Validasi Seimbang (Balance): Total Debit HARUS SAMA DENGAN Total Kredit
		let totalDebit = 0;
		let totalCredit = 0;

		entries.forEach((entry) => {
			if (entry.entryType === "debit") totalDebit += Number(entry.amount);
			if (entry.entryType === "credit") totalCredit += Number(entry.amount);
		});

		if (totalDebit !== totalCredit) {
			return res
				.status(400)
				.json({
					message: `Jurnal tidak seimbang! Debit: ${totalDebit}, Credit: ${totalCredit}`,
				});
		}

		// 3. Eksekusi Database Transaction (Semua atau Tidak Sama Sekali)
		const result = await prisma.$transaction(async (tx) => {
			// a. Buat Payung Transaksi
			const transaction = await tx.transaction.create({
				data: {
					userId,
					description,
				},
			});

			// b. Buat Journal Entries & Update Saldo Dompet
			for (const entry of entries) {
				// Simpan jurnal
				await tx.journalEntry.create({
					data: {
						transactionId: transaction.id,
						walletId: entry.walletId,
						entryType: entry.entryType,
						amount: entry.amount,
					},
				});

				// Ambil data dompet untuk mengecek kategorinya
				const wallet = await tx.wallet.findUnique({
					where: { id: entry.walletId },
				});

				// Logika Akuntansi (Double-Entry) untuk mengubah Saldo (Balance)
				// Asset & Expense bertambah di Debit, berkurang di Kredit.
				// Liability & Income bertambah di Kredit, berkurang di Debit.
				let balanceChange = Number(entry.amount);

				if (["asset", "expense"].includes(wallet.category)) {
					balanceChange =
						entry.entryType === "debit" ? balanceChange : -balanceChange;
				} else if (["liability", "income"].includes(wallet.category)) {
					balanceChange =
						entry.entryType === "credit" ? balanceChange : -balanceChange;
				}

				// Update saldo dompet di database
				await tx.wallet.update({
					where: { id: entry.walletId },
					data: { balance: { increment: balanceChange } },
				});
			}

			return transaction;
		});

		res
			.status(201)
			.json({
				message: "Transaksi berhasil dicatat!",
				transactionId: result.id,
			});
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Terjadi kesalahan saat memproses transaksi" });
	}
};

// Fungsi untuk mengambil riwayat transaksi
exports.getTransactions = async (req, res) => {
	try {
		const userId = req.user.userId;

		const transactions = await prisma.transaction.findMany({
			where: { userId },
			include: {
				journalEntries: {
					include: { wallet: true }, // Tarik data dompet terkait
				},
			},
			orderBy: { transactionDate: "desc" },
		});

		res.json(transactions);
	} catch (error) {
		console.error(error);
		res
			.status(500)
			.json({ message: "Terjadi kesalahan saat mengambil riwayat transaksi" });
	}
};
