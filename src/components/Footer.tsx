import { Pizza as PizzaIcon, Globe, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-brand-dark text-white pt-24 pb-12 overflow-hidden relative">
      {/* Decorative background circle */}
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-brand-red p-2 rounded-lg">
                <PizzaIcon className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tighter">ALLO PIZZA</span>
            </div>
            <p className="text-white/60 leading-relaxed">
              La meilleure pizza artisanale de Bailly. Tradition, passion et ingrédients frais 
              pour un goût authentique à chaque bouchée.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-black mb-8 text-brand-red">LIENS RAPIDES</h4>
            <ul className="space-y-4">
              <li><a href="#home" className="text-white/60 hover:text-white transition-colors">Accueil</a></li>
              <li><a href="#about" className="text-white/60 hover:text-white transition-colors">Chez Nous</a></li>
              <li><a href="#menu" className="text-white/60 hover:text-white transition-colors">Notre Menu</a></li>
              <li><a href="#contact" className="text-white/60 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black mb-8 text-brand-red">CONTACT</h4>
            <ul className="space-y-4 text-white/60">
              <li>10 Rue de Maule, 78870 Bailly</li>
              <li>01 30 56 52 52</li>
              <li>contact@allopizza.fr</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-black mb-8 text-brand-red">NEWSLETTER</h4>
            <p className="text-white/60 mb-6">Restez informé de nos nouveautés et promotions.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-white/10 border-none rounded-xl px-4 py-2 flex-grow focus:ring-2 focus:ring-brand-red outline-none"
              />
              <Button className="bg-brand-red hover:bg-brand-red/90 rounded-xl">OK</Button>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/40 text-sm">
            © 2026 Allo Pizza. Tous droits réservés.
          </p>
          <div className="flex gap-8 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
          </div>
          <Button 
            onClick={scrollToTop}
            variant="outline" 
            size="icon" 
            className="rounded-full border-white/20 hover:bg-brand-red hover:border-brand-red"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </footer>
  );
}
