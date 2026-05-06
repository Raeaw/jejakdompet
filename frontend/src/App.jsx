import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

// Komponen pelindung: Jika tidak ada token, paksa ke halaman Login
const ProtectedRoute = ({ children }) => {
	const token = localStorage.getItem("token");
	if (!token) return <Navigate to="/login" replace />;
	return children;
};

function App() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Hapus tanda kutip di element */}
				<Route path="/login" element={<Login />} />

				{/* Hapus tanda kutip di element */}
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
