const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Buka jalur komunikasi lintas port (Frontend <-> Backend)
app.use(express.json()); // Agar bisa membaca body request format JSON
app.use(morgan("dev")); // Logger

// Route Dasar (Health Check)
app.get("/", (req, res) => {
	res.json({
		status: "success",
		message: "JEJAKDOMPET API Gateway is running smoothly!",
	});
});

// Jalankan Server
app.listen(PORT, () => {
	console.log(`Gateway Server berjalan di http://localhost:${PORT}`);
});
