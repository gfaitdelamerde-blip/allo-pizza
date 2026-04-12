import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section id="home" className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1920&q=80"
          alt="Pizza background"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-brand-red font-bold tracking-[0.3em] uppercase mb-4 block">
            Authenticité & Saveurs
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter">
            BIENVENUE CHEZ<br />
            <span className="text-brand-red">ALLO PIZZA</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
            Découvrez notre cuisine traditionnelle italienne avec une touche moderne. 
            Des ingrédients frais pour une expérience inoubliable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/menu">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-full px-10 py-7 text-lg group">
                VOIR LE MENU
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#contact">
              <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-full px-10 py-7 text-lg">
                NOUS CONTACTER
              </Button>
            </a>
          </div>
        </motion.div>
      </div>


      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-cream to-transparent" />
    </section>
  );
}
