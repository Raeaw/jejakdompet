const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// Fungsi untuk Register (Daftar Akun)
exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// 1. Cek apakah email sudah terdaftar
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: "Email sudah digunakan!" });
		}

		// 2. Hash password (acak password agar aman)
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		// 3. Simpan user ke database
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash,
			},
		});

		res.status(201).json({
			message: "Registrasi berhasil!",
			user: { id: newUser.id, name: newUser.name, email: newUser.email },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Terjadi kesalahan pada server" });
	}
};

// Fungsi untuk Login
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// 1. Cari user berdasarkan email
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Email atau password salah!" });
		}

		// 2. Cocokkan password yang diinput dengan password hash di database
		const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
		if (!isPasswordValid) {
			return res.status(401).json({ message: "Email atau password salah!" });
		}

		// 3. Buat Token JWT (Berlaku selama 1 hari)
		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});

		res.json({
			message: "Login berhasil!",
			token,
			user: { id: user.id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Terjadi kesalahan pada server" });
	}
};
