import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/routes.jsx";

function App() {
	return (
		<>
			<AppRouter />
		</>
	);
}

export default App;
