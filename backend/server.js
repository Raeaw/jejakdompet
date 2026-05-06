const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Import Routes
const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// === DAFTARKAN RUTE DI SINI ===
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallets", walletRoutes);

// Route Dasar (Health Check)
app.get("/", (req, res) => {
	res.json({
		status: "success",
		message: "JEJAKDOMPET API Gateway is running smoothly!",
	});
});

app.listen(PORT, () => {
	console.log(`Gateway Server berjalan di http://localhost:${PORT}`);
});
