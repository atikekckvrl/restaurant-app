import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Reservation from "./pages/Reservation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MenuPortal from "./pages/MenuPortal";
import OrderPage from "./pages/OrderPage";

const App: React.FC = () => {
  const location = useLocation();

  // Menü sayfasında Navbar ve Footer gizlenecek
  const hideLayout =
    location.pathname === "/menu" ||
    location.pathname === "/menuportal" ||
    location.pathname === "/order";

  return (
    <div className="min-h-screen flex flex-col bg-black">
      {!hideLayout && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menuportal" element={<MenuPortal />} />
          <Route path="/order" element={<OrderPage />} />
        </Routes>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
};

export default App;
