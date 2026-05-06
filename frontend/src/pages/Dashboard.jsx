import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatRupiah } from "../utils/formatRupiah";

export default function Dashboard() {
	const [wallets, setWallets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [refreshKey, setRefreshKey] = useState(0); // Trigger untuk fetch ulang data
	const navigate = useNavigate();

	// --- State untuk Modal Transaksi ---
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [txForm, setTxForm] = useState({
		description: "",
		amount: "",
		debitWalletId: "", // Uang Masuk ke / Kategori Pengeluaran
		creditWalletId: "", // Uang Keluar dari / Sumber Dana
	});

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [walletRes, transRes] = await Promise.all([
					api.get("/wallets"),
					api.get("/transactions"),
				]);

				setWallets(walletRes.data);
				setTransactions(transRes.data);
			} catch (error) {
				console.error("Gagal mengambil data:", error);
				if (error.response?.status === 401) handleLogout();
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [refreshKey]); // Akan dijalankan ulang jika refreshKey berubah

	// --- Handler Submit Transaksi ---
	const handleTransactionSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const payload = {
				description: txForm.description,
				entries: [
					{
						walletId: txForm.debitWalletId,
						entryType: "debit",
						amount: Number(txForm.amount),
					},
					{
						walletId: txForm.creditWalletId,
						entryType: "credit",
						amount: Number(txForm.amount),
					},
				],
			};

			await api.post("/transactions", payload);

			// Tutup modal, reset form, dan refresh data dashboard
			setIsModalOpen(false);
			setTxForm({
				description: "",
				amount: "",
				debitWalletId: "",
				creditWalletId: "",
			});
			setRefreshKey((old) => old + 1);
		} catch (error) {
			alert(
				error.response?.data?.message ||
					"Terjadi kesalahan saat menyimpan transaksi",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const totalAssets = wallets
		.filter((w) => w.category === "asset")
		.reduce((sum, w) => sum + Number(w.balance), 0);
	const totalLiabilities = wallets
		.filter((w) => w.category === "liability")
		.reduce((sum, w) => sum + Number(w.balance), 0);
	const netWorth = totalAssets - totalLiabilities;

	if (isLoading && refreshKey === 0) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
				Memuat Data Keuangan...
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-brand-dark relative">
			{/* 1. SIDEBAR KIRI */}
			<aside className="w-64 bg-brand-card border-r border-slate-700 hidden md:flex flex-col z-10">
				<div className="p-6 text-2xl font-bold text-brand-primary tracking-wider">
					JEJAKDOMPET.
				</div>
				<nav className="flex-1 px-4 space-y-2">
					<a
						href="#"
						className="block px-4 py-3 bg-brand-primary text-white rounded-lg"
					>
						Dashboard
					</a>
					<a
						href="#"
						className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
					>
						Transactions
					</a>
					<a
						href="#"
						className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg"
					>
						Accounts
					</a>
				</nav>
				<div className="p-4 border-t border-slate-700">
					<button
						onClick={handleLogout}
						className="w-full py-2 text-slate-400 hover:text-brand-danger transition-colors text-sm font-medium"
					>
						Keluar (Logout)
					</button>
				</div>
			</aside>

			{/* 2. AREA KONTEN UTAMA */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* HEADER */}
				<header className="h-20 bg-brand-card/50 border-b border-slate-700 flex items-center justify-between px-8">
					<h1 className="text-xl font-semibold text-white">Overview</h1>
					<button
						onClick={() => setIsModalOpen(true)}
						className="bg-brand-primary hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30 cursor-pointer"
					>
						+ New Transaction
					</button>
				</header>

				{/* KONTEN DASHBOARD SCROLLABLE */}
				<div className="flex-1 overflow-auto p-8">
					{/* Section: Total Balances */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-brand-card p-6 rounded-xl border border-slate-700">
							<p className="text-slate-400 text-sm mb-1">Total Assets</p>
							<h2 className="text-3xl font-bold text-white">
								{formatRupiah(totalAssets)}
							</h2>
						</div>
						<div className="bg-brand-card p-6 rounded-xl border border-slate-700">
							<p className="text-slate-400 text-sm mb-1">Total Liabilities</p>
							<h2 className="text-3xl font-bold text-brand-danger">
								{formatRupiah(totalLiabilities)}
							</h2>
						</div>
						<div className="bg-brand-card p-6 rounded-xl border border-slate-700">
							<p className="text-slate-400 text-sm mb-1">Net Worth</p>
							<h2
								className={`text-3xl font-bold ${netWorth >= 0 ? "text-brand-success" : "text-brand-danger"}`}
							>
								{formatRupiah(netWorth)}
							</h2>
						</div>
					</div>

					{/* Section: Charts & Recent Transactions */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 bg-brand-card rounded-xl border border-slate-700 p-6 min-h-75 flex items-center justify-center">
							<p className="text-slate-500">
								[ Area Grafik Arus Kas Bar Chart akan ditambahkan nanti ]
							</p>
						</div>

						<div className="bg-brand-card rounded-xl border border-slate-700 p-6 flex flex-col max-h-100">
							<h3 className="font-semibold text-white mb-4 border-b border-slate-700 pb-2">
								Recent Transactions
							</h3>
							<div className="space-y-4 overflow-y-auto flex-1 pr-2">
								{transactions.length === 0 ? (
									<p className="text-slate-500 text-sm text-center italic mt-4">
										Belum ada transaksi.
									</p>
								) : (
									transactions.map((trx) => (
										<div
											key={trx.id}
											className="flex justify-between items-center bg-slate-800/30 p-3 rounded-lg border border-slate-700/50"
										>
											<div>
												<p className="font-medium text-white text-sm">
													{trx.description}
												</p>
												<p className="text-xs text-slate-400 mt-1">
													{new Date(trx.transactionDate).toLocaleDateString(
														"id-ID",
														{ day: "numeric", month: "short", year: "numeric" },
													)}
												</p>
											</div>
											<span className="text-white font-semibold text-sm">
												{formatRupiah(trx.journalEntries[0]?.amount || 0)}
											</span>
										</div>
									))
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			{/* 3. MODAL POPUP FORM TRANSAKSI */}
			{isModalOpen && (
				<div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
					<div className="bg-brand-card border border-slate-700 w-full max-w-md rounded-2xl p-6 shadow-2xl">
						<div className="flex justify-between items-center mb-6">
							<h2 className="text-xl font-bold text-white">
								Catat Transaksi Baru
							</h2>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-slate-400 hover:text-white cursor-pointer"
							>
								✕
							</button>
						</div>

						<form onSubmit={handleTransactionSubmit} className="space-y-4">
							<div>
								<label className="block text-sm font-medium text-slate-300 mb-1">
									Keterangan
								</label>
								<input
									type="text"
									required
									value={txForm.description}
									onChange={(e) =>
										setTxForm({ ...txForm, description: e.target.value })
									}
									placeholder="Makan siang, Gaji bulanan, dll."
									className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-brand-primary focus:outline-none"
								/>
							</div>

							<div>
								<label className="block text-sm font-medium text-slate-300 mb-1">
									Nominal (Rp)
								</label>
								<input
									type="number"
									required
									min="0"
									value={txForm.amount}
									onChange={(e) =>
										setTxForm({ ...txForm, amount: e.target.value })
									}
									placeholder="50000"
									className="w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:border-brand-primary focus:outline-none"
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-brand-danger mb-1">
										Keluar Dari (Kredit)
									</label>
									<select
										required
										value={txForm.creditWalletId}
										onChange={(e) =>
											setTxForm({ ...txForm, creditWalletId: e.target.value })
										}
										className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:border-brand-primary focus:outline-none"
									>
										<option value="" disabled>
											Pilih Sumber...
										</option>
										{wallets.map((w) => (
											<option key={w.id} value={w.id}>
												{w.name} ({w.category})
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-brand-success mb-1">
										Masuk Ke (Debit)
									</label>
									<select
										required
										value={txForm.debitWalletId}
										onChange={(e) =>
											setTxForm({ ...txForm, debitWalletId: e.target.value })
										}
										className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-sm focus:border-brand-primary focus:outline-none"
									>
										<option value="" disabled>
											Pilih Tujuan...
										</option>
										{wallets.map((w) => (
											<option key={w.id} value={w.id}>
												{w.name} ({w.category})
											</option>
										))}
									</select>
								</div>
							</div>

							<div className="mt-8 pt-4">
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-brand-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
								>
									{isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
