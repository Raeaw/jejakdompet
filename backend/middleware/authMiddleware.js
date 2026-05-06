const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	// 1. Ambil token dari header "Authorization"
	const authHeader = req.header("Authorization");
	if (!authHeader) {
		return res
			.status(401)
			.json({ message: "Akses ditolak. Token tidak ditemukan!" });
	}

	// 2. Format header yang benar adalah "Bearer <token_acak_panjang>"
	const token = authHeader.split(" ")[1];
	if (!token) {
		return res
			.status(401)
			.json({ message: "Akses ditolak. Format token salah!" });
	}

	try {
		// 3. Verifikasi token menggunakan rahasia kita
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// 4. Titipkan data userId ke dalam request agar bisa dipakai oleh Controller
		req.user = decoded;

		// 5. Izinkan lewat ke tahap selanjutnya
		next();
	} catch (error) {
		res
			.status(400)
			.json({ message: "Token tidak valid atau sudah kadaluarsa!" });
	}
};
