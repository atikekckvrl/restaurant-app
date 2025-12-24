import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
// Footer component removed per user request
import Home from "./pages/Home";
import MenuPage from "./pages/MenuPage";
import Reservation from "./pages/Reservation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MenuPortal from "./pages/MenuPortal";
import { useState, useEffect } from "react";
import OrderPage from "./pages/OrderPage";
import KitchenPage from "./pages/KitchenPage";
import LoginPage from "./pages/LoginPage";
import { supabase } from "./lib/supabase";
import { Navigate } from "react-router-dom";

const App: React.FC = () => {
  const location = useLocation();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Mevcut oturumu al
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Oturum değişikliklerini dinle
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const hideLayout =
    location.pathname === "/menu" ||
    location.pathname === "/menuportal" ||
    location.pathname === "/order" ||
    location.pathname === "/kitchen" ||
    location.pathname === "/login";

  // const showFooter = location.pathname === "/"; // Footer removed, variable unused

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      {/* Sabit Arka Plan Katmanları */}
      <div className="parallax-bg" />
      <div className="parallax-overlay" />

      {!hideLayout && <Navbar />}

      <main className="flex-1 relative z-10 w-full overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/menuportal" element={<MenuPortal />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/kitchen" 
            element={session ? <KitchenPage /> : <Navigate to="/login" replace />} 
          />
        </Routes>
      </main>

      {/* Footer removed */}
    </div>
  );
};

export default App;
