/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { MenuSection } from "./components/MenuSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";
import { CartProvider } from "./context/CartContext";
import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuPage from "./pages/MenuPage";
import CheckoutPage from "./pages/CheckoutPage";
import ThankYouPage from "./pages/ThankYouPage";
import OrdersPage from "./pages/OrdersPage";
import { CartBanner } from "./components/CartBanner";

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AboutSection />
        <MenuSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}

import { AuthProvider } from "./context/AuthContext";

export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading for a smoother entrance
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="min-h-screen bg-brand-cream selection:bg-brand-red selection:text-white">
          <Toaster position="top-center" expand={true} richColors />
          <AnimatePresence>
            {isLoading ? (
              <motion.div
                key="loader"
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center"
              >
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity }
                  }}
                  className="w-24 h-24 border-8 border-brand-red border-t-transparent rounded-full mb-8"
                />
                <h2 className="text-white font-black text-3xl tracking-tighter animate-pulse">
                  ALLO PIZZA
                </h2>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/menu" element={<MenuPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/thank-you" element={<ThankYouPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                </Routes>
                <CartBanner />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}



