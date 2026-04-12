import * as React from "react";
import { motion } from "motion/react";
import { PIZZAS, Pizza } from "../constants";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, Pizza as PizzaIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PizzaCustomizer } from "../components/PizzaCustomizer";

export default function MenuPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string>("tous");
  const [selectedPizza, setSelectedPizza] = React.useState<Pizza | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = React.useState(false);

  const categories = [
    { id: "tous", name: "Tous" },
    { id: "classique", name: "Classiques" },
    { id: "speciale", name: "Spéciales" },
    { id: "sucree", name: "Sucrées" },
  ];

  const filteredPizzas = PIZZAS.filter(pizza => {
    const matchesSearch = pizza.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         pizza.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "tous" || pizza.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenCustomizer = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsCustomizerOpen(true);
  };

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-brand-red font-bold tracking-[0.2em] uppercase mb-2 block"
            >
              Notre Carte Complète
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-brand-dark mb-8"
            >
              LE MENU <span className="text-brand-red">ALLO PIZZA</span>
            </motion.h1>
            <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 mb-12 bg-white p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-brand-red/5">
            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              <div className="flex items-center gap-2 w-full md:w-auto mb-2 md:mb-0">
                <Filter className="w-4 h-4 text-brand-red" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-dark/40 md:hidden">Filtres</span>
              </div>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={activeCategory === cat.id ? "default" : "ghost"}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-full px-4 md:px-6 py-1 md:py-2 h-auto text-xs md:text-sm font-bold ${
                    activeCategory === cat.id 
                      ? "bg-brand-red text-white hover:bg-brand-red/90" 
                      : "text-brand-dark/60 hover:text-brand-red"
                  }`}
                >
                  {cat.name}
                </Button>
              ))}
            </div>
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/30 w-4 h-4" />
              <Input 
                placeholder="Rechercher une pizza..." 
                className="pl-10 py-5 rounded-full border-brand-red/10 bg-brand-cream/50 focus:ring-brand-red text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPizzas.map((pizza, index) => (
              <motion.div
                key={pizza.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white h-full flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={pizza.image}
                      alt={pizza.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-brand-red text-white font-bold px-3 py-1 text-lg">
                        {pizza.price.toFixed(2)}€
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-black mb-2 text-brand-dark group-hover:text-brand-red transition-colors">
                      {pizza.name}
                    </h3>
                    <p className="text-brand-dark/60 mb-6 line-clamp-3 flex-grow">
                      {pizza.description}
                    </p>
                    <Button 
                      onClick={() => handleOpenCustomizer(pizza)}
                      className="w-full bg-brand-dark hover:bg-brand-red text-white font-bold rounded-xl py-6 transition-colors group/btn mt-auto"
                    >
                      <ShoppingCart className="mr-2 w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                      AJOUTER AU PANIER
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPizzas.length === 0 && (
            <div className="text-center py-24 opacity-40">
              <PizzaIcon className="w-24 h-24 mx-auto mb-4" />
              <p className="text-2xl font-bold">Aucune pizza ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <PizzaCustomizer 
        pizza={selectedPizza} 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
      />
    </div>
  );
}
