import * as React from "react";
import { motion } from "motion/react";
import { useCart, OrderDetails } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Wallet, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function StripePaymentForm({ 
  totalPrice, 
  onSuccess, 
  onCancel 
}: { 
  totalPrice: number; 
  onSuccess: () => Promise<void>;
  onCancel: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    const toastId = toast.loading("Initialisation du paiement...");

    try {
      // 1. Create PaymentIntent on the server
      console.log("Fetching payment intent for amount:", totalPrice);
      const backendUrl = import.meta.env.VITE_API_URL || "";
      const response = await fetch(`${backendUrl}/api/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `Erreur serveur: ${response.status}` }));
        console.error("Server error data:", errorData);
        throw new Error(errorData.error || "Erreur lors de l'initialisation du paiement");
      }

      const data = await response.json();
      console.log("Payment intent data received");

      if (!data.clientSecret) {
        throw new Error("Le serveur n'a pas renvoyé de secret de paiement");
      }

      toast.loading("Vérification de la carte...", { id: toastId });

      // 2. Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement) as any,
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        toast.success("Paiement réussi !", { id: toastId });
        await onSuccess();
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Erreur lors du paiement", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-4">
        <div className="p-4 rounded-xl border border-brand-red/10 bg-brand-cream/30">
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1a1a1a',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#e11d48',
                },
              },
            }}
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-brand-dark/40 uppercase tracking-widest font-bold justify-center">
          <ShieldCheck className="w-3 h-3 text-green-500" />
          Paiement 100% sécurisé via Stripe
        </div>
      </div>

      <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button 
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 rounded-2xl font-bold py-7"
        >
          ANNULER
        </Button>
        <Button 
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-[2] bg-brand-red hover:bg-brand-red/90 text-white font-black py-7 rounded-2xl shadow-lg shadow-brand-red/20 disabled:opacity-50"
        >
          {isProcessing ? "TRAITEMENT..." : `PAYER ${totalPrice.toFixed(2)}€`}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, setLastOrder } = useCart();
  const { user } = useAuth();
  const [email, setEmail] = React.useState(user?.email || "");
  const [paymentMethod, setPaymentMethod] = React.useState<'online' | 'onsite'>('onsite');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (items.length === 0 && !isSubmitting) {
      navigate("/menu");
    }
  }, [items, navigate, isSubmitting]);

  const processOrder = async (isPaid: boolean = false) => {
    setIsSubmitting(true);
    const orderData = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        notes: item.notes || "",
        pickupTime: item.pickupTime || "",
        image: item.image
      })),
      totalPrice,
      paymentMethod,
      isPaid,
      email,
      userId: user?.uid || null,
      orderId: Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: serverTimestamp(),
      status: 'pending'
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      
      const order: OrderDetails = {
        ...orderData,
        timestamp: new Date().toLocaleString('fr-FR'),
      } as any;

      setLastOrder(order);
      clearCart();
      navigate("/thank-you");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "orders");
      setIsSubmitting(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Veuillez entrer votre email pour la confirmation.");
      return;
    }

    if (paymentMethod === 'online') {
      setShowPaymentModal(true);
    } else {
      await processOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-6xl font-black text-brand-dark mb-4">FINALISER LA COMMANDE</h1>
            <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Form */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-brand-dark text-white p-6">
                  <CardTitle className="text-xl font-black">VOS INFORMATIONS</CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-8 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-brand-dark/60">
                      Email de confirmation
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      className="rounded-xl border-brand-red/10 bg-brand-cream/30 py-5 md:py-6"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                <CardHeader className="bg-brand-dark text-white p-6">
                  <CardTitle className="text-xl font-black">MODE DE PAIEMENT</CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-8 space-y-4">
                  <div 
                    onClick={() => setPaymentMethod('onsite')}
                    className={`flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'onsite' 
                        ? 'border-brand-red bg-brand-red/5' 
                        : 'border-brand-red/5 bg-brand-cream/20 hover:border-brand-red/20'
                    }`}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'onsite' ? 'border-brand-red' : 'border-brand-dark/20'
                    }`}>
                      {paymentMethod === 'onsite' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-brand-red" />}
                    </div>
                    <Wallet className={`w-5 h-5 md:w-6 md:h-6 ${paymentMethod === 'onsite' ? 'text-brand-red' : 'text-brand-dark/40'}`} />
                    <div>
                      <p className="font-black text-brand-dark text-sm md:text-base">Paiement sur place</p>
                      <p className="text-[10px] md:text-xs text-brand-dark/50 italic">Payez lors du retrait</p>
                    </div>
                  </div>

                  <div 
                    onClick={() => setPaymentMethod('online')}
                    className={`flex items-center gap-3 md:gap-4 p-4 md:p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'online' 
                        ? 'border-brand-red bg-brand-red/5' 
                        : 'border-brand-red/5 bg-brand-cream/20 hover:border-brand-red/20'
                    }`}
                  >
                    <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'online' ? 'border-brand-red' : 'border-brand-dark/20'
                    }`}>
                      {paymentMethod === 'online' && <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-brand-red" />}
                    </div>
                    <CreditCard className={`w-5 h-5 md:w-6 md:h-6 ${paymentMethod === 'online' ? 'text-brand-red' : 'text-brand-dark/40'}`} />
                    <div>
                      <p className="font-black text-brand-dark text-sm md:text-base">Paiement en ligne</p>
                      <p className="text-[10px] md:text-xs text-brand-dark/50 italic">Sécurisé via Stripe</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Summary */}
            <div className="space-y-8">
              <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden sticky top-32">
                <CardHeader className="bg-brand-red text-white p-6">
                  <CardTitle className="text-xl font-black flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6" />
                    RÉSUMÉ
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 md:p-8">
                  <div className="space-y-4 mb-8">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-brand-dark/70">
                          <span className="font-black text-brand-dark">{item.quantity}x</span> {item.name}
                        </span>
                        <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-6 border-t border-brand-red/10 space-y-4">
                    <div className="flex justify-between items-center text-xl font-black text-brand-dark">
                      <span>TOTAL</span>
                      <span className="text-brand-red">{totalPrice.toFixed(2)}€</span>
                    </div>
                    <p className="text-[10px] md:text-xs text-brand-dark/40 text-center italic leading-tight">
                      TVA incluse. Retrait uniquement sur place au 10 Rue de Maule.
                    </p>
                  </div>

                  <Button 
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-black py-6 md:py-8 text-lg md:text-xl rounded-2xl shadow-lg shadow-brand-red/20 mt-8 group disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
                        TRAITEMENT...
                      </div>
                    ) : (
                      <>
                        {paymentMethod === 'onsite' ? 'VALIDER LA COMMANDE' : 'PAYER ET COMMANDER'}
                        <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="bg-white rounded-[2rem] border-none shadow-2xl p-8 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-brand-dark flex items-center gap-3">
              <CreditCard className="text-brand-red" />
              PAIEMENT SÉCURISÉ
            </DialogTitle>
            <DialogDescription className="font-bold text-brand-dark/40">
              Vos informations bancaires sont traitées en toute sécurité par Stripe.
            </DialogDescription>
          </DialogHeader>

          <Elements stripe={stripePromise}>
            <StripePaymentForm 
              totalPrice={totalPrice} 
              onSuccess={() => processOrder(true)}
              onCancel={() => setShowPaymentModal(false)}
            />
          </Elements>
        </DialogContent>
      </Dialog>
    </div>
  );
}
