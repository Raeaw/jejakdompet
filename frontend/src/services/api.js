import axios from "axios";

// Buat instance axios dengan URL dasar backend kita
const api = axios.create({
	baseURL: "http://localhost:3000/api/v1",
});

// Interceptor: Otomatis selipkan Token JWT ke setiap request yang dikirim
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default api;
