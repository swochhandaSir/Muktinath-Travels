import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import Navbar from "./components/Navbar";
import AppRouter from "./routes/routes.jsx";
import { BookingProvider } from "./context/BookingContext";

function App() {
  return (
    <BookingProvider>
      <AppRouter />
    </BookingProvider>
  );
}

export default App;
