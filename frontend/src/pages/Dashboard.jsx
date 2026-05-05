export default function Dashboard() {
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
						className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg hover-transition duration-200"
					>
						Transactions
					</a>
					<a
						href="#"
						className="block px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg hover-transition duration-200"
					>
						Accounts
					</a>
				</nav>
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
							<h2 className="text-3xl font-bold text-white">Rp 12.500.000</h2>
						</div>
						<div className="bg-brand-card p-6 rounded-xl border border-slate-700">
							<p className="text-slate-400 text-sm mb-1">
								Total Liabilities (CC)
							</p>
							<h2 className="text-3xl font-bold text-brand-danger">
								- Rp 2.300.000
							</h2>
						</div>
						<div className="bg-brand-card p-6 rounded-xl border border-slate-700">
							<p className="text-slate-400 text-sm mb-1">Net Worth</p>
							<h2 className="text-3xl font-bold text-brand-success">
								Rp 10.200.000
							</h2>
						</div>
					</div>

					{/* Section: Charts & Recent Transactions */}
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<div className="lg:col-span-2 bg-brand-card rounded-xl border border-slate-700 p-6 min-h-[300px] flex items-center justify-center">
							<p className="text-slate-500">
								[ Area Grafik Arus Kas Bar Chart ]
							</p>
						</div>

						<div className="bg-brand-card rounded-xl border border-slate-700 p-6">
							<h3 className="font-semibold mb-4 border-b border-slate-700 pb-2">
								Recent Transactions
							</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center">
									<div>
										<p className="font-medium">Makan Nasi Padang</p>
										<p className="text-xs text-slate-400">Dompet Tunai</p>
									</div>
									<span className="text-brand-danger font-semibold">
										- 50.000
									</span>
								</div>
								<div className="flex justify-between items-center">
									<div>
										<p className="font-medium">Gaji Bulanan</p>
										<p className="text-xs text-slate-400">BCA</p>
									</div>
									<span className="text-brand-success font-semibold">
										+ 5.000.000
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
