import * as React from "react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2, ShoppingCart, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

import { useNavigate } from "react-router-dom";

export function Cart() {
  const { items, totalPrice, totalItems, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsOpen(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative group">
          <motion.div
            animate={totalItems > 0 ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ShoppingCart className="w-6 h-6 group-hover:text-brand-red transition-colors" />
          </motion.div>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="bg-brand-red text-white w-5 h-5 flex items-center justify-center p-0 text-[10px] rounded-full border-2 border-brand-cream">
                {totalItems}
              </Badge>
            </motion.div>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md bg-brand-cream border-l-brand-red/20 flex flex-col">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-2xl font-black text-brand-dark flex items-center gap-2">
            <ShoppingBag className="text-brand-red" />
            VOTRE PANIER
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <ShoppingBag className="w-16 h-16" />
              <p className="font-bold text-lg">Votre panier est vide</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-brand-red/10">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="font-black text-brand-dark group-hover:text-brand-red transition-colors truncate">
                      {item.name}
                    </h4>
                    <span className="font-bold text-brand-red shrink-0">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                  <p className="text-xs text-brand-dark/50 mb-2 line-clamp-1">{item.description}</p>
                  
                  {item.pickupTime && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-brand-red uppercase tracking-wider mb-1">
                      <Clock className="w-3 h-3" />
                      Retrait: {item.pickupTime === 'asap' ? 'ASAP' : item.pickupTime}
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-[10px] bg-white p-2 rounded-lg border border-brand-red/5 text-brand-dark/60 italic mb-3">
                      "{item.notes}"
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-white rounded-lg p-1 shadow-sm border border-brand-red/5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-md"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-md"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-brand-dark/20 hover:text-brand-red transition-colors"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-auto pt-6 flex flex-col gap-4">
            <Separator className="bg-brand-red/10" />
            <div className="space-y-2">
              <div className="flex justify-between text-brand-dark/60 text-sm font-bold">
                <span>Sous-total</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-brand-dark/60 text-sm font-bold">
                <span>Mode de retrait</span>
                <span className="text-brand-red">Sur place uniquement</span>
              </div>
              <Separator className="bg-brand-red/10 my-2" />
              <div className="flex justify-between text-xl font-black text-brand-dark">
                <span>TOTAL</span>
                <span>{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
            <Button 
              className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-black py-8 text-lg rounded-2xl shadow-lg shadow-brand-red/20"
              onClick={handleCheckout}
            >
              PASSER À LA CAISSE
            </Button>
            <p className="text-[10px] text-center text-brand-dark/40 uppercase tracking-widest font-bold">
              Choisissez votre mode de paiement à l'étape suivante
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
