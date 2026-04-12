import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function CartBanner() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show on checkout or thank you pages
  const hideOnPages = ["/checkout", "/thank-you"];
  if (hideOnPages.includes(location.pathname) || totalItems === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-0 right-0 z-[40] px-4 pointer-events-none"
      >
        <div className="container mx-auto max-w-2xl pointer-events-auto">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-brand-dark text-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-2xl shadow-brand-red/20 border border-brand-red/20 flex items-center justify-between gap-3 md:gap-4"
          >
            <div className="flex items-center gap-3 md:gap-4 pl-1 md:pl-2">
              <div className="relative">
                <div className="bg-brand-red p-2 md:p-3 rounded-xl md:rounded-2xl">
                  <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <span className="absolute -top-1.5 -right-1.5 bg-white text-brand-red font-black text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-2 border-brand-dark">
                  {totalItems}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest hidden sm:block">Votre Panier</p>
                <p className="text-lg md:text-xl font-black text-brand-red">{totalPrice.toFixed(2)}€</p>
              </div>
            </div>

            <Button 
              onClick={() => navigate("/checkout")}
              className="bg-brand-red hover:bg-brand-red/90 text-white font-black px-4 md:px-8 py-5 md:py-7 rounded-xl md:rounded-2xl flex items-center gap-2 group relative overflow-hidden text-sm md:text-base"
            >
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex items-center gap-2"
              >
                <span className="hidden xs:inline">FINALISER LA COMMANDE</span>
                <span className="xs:hidden">VALIDER</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.div>
              
              {/* Pulsing ring effect */}
              <motion.div
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none"
              />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
