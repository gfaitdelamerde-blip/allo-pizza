import { motion } from "motion/react";
import { PIZZAS, Pizza } from "@/src/constants";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { PizzaCustomizer } from "./PizzaCustomizer";
import * as React from "react";

export function MenuSection() {
  const [selectedPizza, setSelectedPizza] = React.useState<Pizza | null>(null);
  const [isCustomizerOpen, setIsCustomizerOpen] = React.useState(false);

  const handleOpenCustomizer = (pizza: Pizza) => {
    setSelectedPizza(pizza);
    setIsCustomizerOpen(true);
  };

  return (
    <section id="menu" className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-brand-red font-bold tracking-[0.2em] uppercase mb-2 block"
          >
            Notre Carte
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-brand-dark mb-6"
          >
            LES PIZZAS SIGNATURE
          </motion.h2>
          <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PIZZAS.slice(0, 6).map((pizza, index) => (
            <motion.div
              key={pizza.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group bg-white">
                <div className="relative h-64 overflow-hidden">
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
                <CardContent className="p-6">
                  <h3 className="text-2xl font-black mb-2 text-brand-dark group-hover:text-brand-red transition-colors">
                    {pizza.name}
                  </h3>
                  <p className="text-brand-dark/60 mb-6 line-clamp-2">
                    {pizza.description}
                  </p>
                  <Button 
                    onClick={() => handleOpenCustomizer(pizza)}
                    className="w-full bg-brand-dark hover:bg-brand-red text-white font-bold rounded-xl py-6 transition-colors group/btn"
                  >
                    <ShoppingCart className="mr-2 w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                    AJOUTER AU PANIER
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/menu">
            <Button variant="outline" className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white font-bold rounded-full px-12 py-6 text-lg">
              VOIR TOUT LE MENU
            </Button>
          </Link>
        </div>
      </div>

      <PizzaCustomizer 
        pizza={selectedPizza} 
        isOpen={isCustomizerOpen} 
        onClose={() => setIsCustomizerOpen(false)} 
      />
    </section>
  );
}


