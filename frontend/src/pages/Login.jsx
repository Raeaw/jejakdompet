import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [message, setMessage] = useState({ type: "", text: "" }); // Untuk notifikasi error/sukses
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage({ type: "", text: "" });
		setIsLoading(true);

		try {
			if (isLoginMode) {
				// Proses Login
				const response = await api.post("/auth/login", {
					email: formData.email,
					password: formData.password,
				});

				// Simpan token ke localStorage
				localStorage.setItem("token", response.data.token);

				// Arahkan user ke halaman utama (Dashboard)
				navigate("/");
			} else {
				// Proses Register
				await api.post("/auth/register", {
					name: formData.name,
					email: formData.email,
					password: formData.password,
				});

				// Jika sukses, ubah ke mode login dan beri tahu user
				setIsLoginMode(true);
				setMessage({
					type: "success",
					text: "Registrasi berhasil! Silakan login.",
				});
			}
		} catch (error) {
			// Tangkap pesan error dari backend
			const errorMsg =
				error.response?.data?.message || "Terjadi kesalahan pada server";
			setMessage({ type: "error", text: errorMsg });
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-brand-dark p-4">
			<div className="w-full max-w-md bg-brand-card p-8 rounded-2xl border border-slate-700 shadow-2xl">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-brand-primary tracking-wider mb-2">
						JEJAKDOMPET.
					</h1>
					<p className="text-slate-400">
						{isLoginMode
							? "Masuk untuk mengelola keuanganmu"
							: "Buat akun baru untuk memulai"}
					</p>
				</div>

				{/* Notifikasi Error / Sukses */}
				{message.text && (
					<div
						className={`p-4 mb-6 rounded-lg text-sm font-medium ${
							message.type === "error"
								? "bg-brand-danger/20 text-red-400 border border-brand-danger/50"
								: "bg-brand-success/20 text-emerald-400 border border-brand-success/50"
						}`}
					>
						{message.text}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5">
					{/* Input Nama (Hanya muncul saat mode Register) */}
					{!isLoginMode && (
						<div>
							<label className="block text-sm font-medium text-slate-300 mb-1">
								Nama Lengkap
							</label>
							<input
								type="text"
								name="name"
								value={formData.name}
								onChange={handleChange}
								required={!isLoginMode}
								className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-white"
								placeholder="John Doe"
							/>
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-slate-300 mb-1">
							Email
						</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-white"
							placeholder="email@contoh.com"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-300 mb-1">
							Password
						</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							required
							className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-white"
							placeholder="••••••••"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-brand-primary hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isLoading ? "Memproses..." : isLoginMode ? "Masuk" : "Daftar"}
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-slate-400 text-sm">
						{isLoginMode ? "Belum punya akun? " : "Sudah punya akun? "}
						<button
							type="button"
							onClick={() => {
								setIsLoginMode(!isLoginMode);
								setMessage({ type: "", text: "" }); // Clear error saat ganti mode
							}}
							className="text-brand-primary hover:text-blue-400 font-medium transition-colors cursor-pointer"
						>
							{isLoginMode ? "Daftar sekarang" : "Masuk di sini"}
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}
