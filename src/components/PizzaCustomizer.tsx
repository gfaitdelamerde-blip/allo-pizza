import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pizza } from "../constants";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";
import { Minus, Plus, ShoppingCart, Clock } from "lucide-react";

interface PizzaCustomizerProps {
  pizza: Pizza | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PizzaCustomizer({ pizza, isOpen, onClose }: PizzaCustomizerProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState("");
  const [pickupTime, setPickupTime] = React.useState("asap");
  const [promoCode, setPromoCode] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNotes("");
      setPickupTime("asap");
      setPromoCode("");
    }
  }, [isOpen]);

  if (!pizza) return null;

  const handleAdd = () => {
    addToCart(pizza, quantity, notes, pickupTime);
    toast.success(`${pizza.name} ajouté au panier !`, {
      description: `${quantity}x ${pizza.name} - Retrait: ${pickupTime === 'asap' ? 'Le plus tôt possible' : pickupTime}`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] bg-brand-cream border-brand-red/20 rounded-[2rem] p-4 md:p-6 overflow-y-auto max-h-[90vh]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl md:text-3xl font-black text-brand-dark flex items-center gap-3">
            <span className="text-brand-red">{pizza.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:gap-6 py-2 md:py-4">
          <div className="flex items-center justify-between bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-brand-red/5">
            <span className="font-bold text-brand-dark text-sm md:text-base">Quantité</span>
            <div className="flex items-center gap-3 md:gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-brand-red/20"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <span className="font-black text-lg md:text-xl w-6 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 md:h-10 md:w-10 rounded-xl border-brand-red/20"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-brand-dark/60 flex items-center gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4" />
              Heure de retrait
            </Label>
            <Select value={pickupTime} onValueChange={setPickupTime}>
              <SelectTrigger className="rounded-xl border-brand-red/10 bg-white py-5 md:py-6 h-auto text-sm">
                <SelectValue placeholder="Choisir une heure" />
              </SelectTrigger>
              <SelectContent className="bg-white border-brand-red/10">
                <SelectItem value="asap">Le plus tôt possible (20-30 min)</SelectItem>
                <SelectItem value="18:30">18:30</SelectItem>
                <SelectItem value="19:00">19:00</SelectItem>
                <SelectItem value="19:30">19:30</SelectItem>
                <SelectItem value="20:00">20:00</SelectItem>
                <SelectItem value="20:30">20:30</SelectItem>
                <SelectItem value="21:00">21:00</SelectItem>
                <SelectItem value="21:30">21:30</SelectItem>
                <SelectItem value="22:00">22:00</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-brand-dark/60">
              Demandes spécifiques / Allergies
            </Label>
            <Textarea 
              placeholder="Ex: Pas d'oignons, bien cuite, allergie au gluten..."
              className="rounded-xl border-brand-red/10 bg-white min-h-[80px] md:min-h-[100px] text-sm"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-brand-dark/60">
              Code Promo
            </Label>
            <Input 
              placeholder="Entrez votre code"
              className="rounded-xl border-brand-red/10 bg-white py-5 md:py-6 h-auto text-sm"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button 
            className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-black py-6 md:py-8 text-base md:text-lg rounded-2xl shadow-lg shadow-brand-red/20"
            onClick={handleAdd}
          >
            <ShoppingCart className="mr-2 w-5 h-5 md:w-6 md:h-6" />
            AJOUTER — {(pizza.price * quantity).toFixed(2)}€
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
