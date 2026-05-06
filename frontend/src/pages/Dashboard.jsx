import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatRupiah } from "../utils/formatRupiah";

export default function Dashboard() {
	const [wallets, setWallets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();

	// 1. Pindahkan handleLogout ke ATAS agar bisa dibaca oleh fungsi di bawahnya
	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	// 2. Masukkan definisi fetchData ke DALAM useEffect
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
				if (error.response?.status === 401) {
					handleLogout();
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchData(); // Panggil fungsinya
	}, []); // Dependency kosong sekarang sudah sesuai aturan ESLint

	// --- Kalkulasi Saldo Cepat ---
	// Pisahkan total aset dan total liabilitas berdasarkan kategorinya
	const totalAssets = wallets
		.filter((w) => w.category === "asset")
		.reduce((sum, w) => sum + Number(w.balance), 0);

	const totalLiabilities = wallets
		.filter((w) => w.category === "liability")
		.reduce((sum, w) => sum + Number(w.balance), 0);

	const netWorth = totalAssets - totalLiabilities;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
				Memuat Data Keuangan...
			</div>
		);
	}

	return (
		<div className="flex h-screen bg-brand-dark">
			{/* 1. SIDEBAR KIRI */}
			<aside className="w-64 bg-brand-card border-r border-slate-700 hidden md:flex flex-col">
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
					<h1 className="text-xl font-semibold">Overview</h1>
					<button className="bg-brand-primary hover:bg-blue-600 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/30">
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
						{/* Tempat untuk Chart */}
						<div className="lg:col-span-2 bg-brand-card rounded-xl border border-slate-700 p-6 min-h-75 flex items-center justify-center">
							<p className="text-slate-500">
								[ Area Grafik Arus Kas Bar Chart akan ditambahkan di Hari 5 ]
							</p>
						</div>

						{/* List Transaksi Terakhir (Dinamic) */}
						<div className="bg-brand-card rounded-xl border border-slate-700 p-6 flex flex-col max-h-100">
							<h3 className="font-semibold mb-4 border-b border-slate-700 pb-2">
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
												<p className="font-medium text-sm">{trx.description}</p>
												<p className="text-xs text-slate-400 mt-1">
													{new Date(trx.transactionDate).toLocaleDateString(
														"id-ID",
														{ day: "numeric", month: "short", year: "numeric" },
													)}
												</p>
											</div>
											{/* Ambil amount dari salah satu jurnal entry-nya untuk ditampilkan */}
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
		</div>
	);
}
