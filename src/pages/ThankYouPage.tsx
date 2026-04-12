import * as React from "react";
import { motion } from "motion/react";
import { useCart } from "../context/CartContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, Clock, MapPin, ArrowLeft, Download, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ThankYouPage() {
  const { lastOrder } = useCart();
  const navigate = useNavigate();
  const receiptRef = React.useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  React.useEffect(() => {
    if (!lastOrder) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, [lastOrder, navigate]);

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current || !lastOrder) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });
      
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`recu-allo-pizza-${lastOrder.orderId}.pdf`);
      toast.success("Reçu téléchargé !");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Erreur lors du téléchargement du reçu.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!lastOrder) return null;

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8 md:mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-green-100 text-green-600 rounded-full mb-4 md:mb-6">
              <CheckCircle2 className="w-10 h-10 md:w-12 h-12" />
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-brand-dark mb-4">MERCI POUR VOTRE COMMANDE !</h1>
            <p className="text-lg md:text-xl text-brand-dark/60 font-medium px-4">
              Votre commande <span className="text-brand-red font-black">#{lastOrder.orderId}</span> a été reçue avec succès.
            </p>
          </motion.div>

          <div className="grid gap-8">
            {/* Email Confirmation Alert */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-brand-red text-white p-5 md:p-6 rounded-3xl shadow-xl flex items-center gap-4 md:gap-6"
            >
              <div className="bg-white/20 p-3 md:p-4 rounded-2xl shrink-0">
                <Mail className="w-6 h-6 md:w-8 h-8" />
              </div>
              <div>
                <h3 className="font-black text-lg md:text-xl">Email envoyé !</h3>
                <p className="text-sm md:text-base text-white/80">Un récapitulatif a été envoyé à <span className="font-bold underline break-all">{lastOrder.email}</span></p>
              </div>
            </motion.div>

            {/* Order Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-none shadow-2xl bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-6 md:p-12" ref={receiptRef}>
                  <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-8 mb-8 md:mb-12 pb-6 md:pb-8 border-b border-brand-red/10">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-brand-dark">
                        <Clock className="w-5 h-5 text-brand-red" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Heure de retrait</p>
                          <p className="font-black text-sm md:text-base">
                            {lastOrder.items.some(i => i.pickupTime && i.pickupTime !== 'asap') 
                              ? `À l'heure demandée (${lastOrder.items.find(i => i.pickupTime && i.pickupTime !== 'asap')?.pickupTime})`
                              : "Dès que possible (20-30 min)"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-brand-dark">
                        <MapPin className="w-5 h-5 text-brand-red" />
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40">Lieu de retrait</p>
                          <p className="font-black text-sm md:text-base">10 Rue de Maule, 78870 Bailly</p>
                        </div>
                      </div>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-dark/40 mb-1">Mode de paiement</p>
                      <p className="font-black text-brand-red uppercase text-sm md:text-base">
                        {lastOrder.paymentMethod === 'online' ? 'Payé en ligne' : 'À payer sur place'}
                      </p>
                      <p className="text-[10px] text-brand-dark/40 mt-1 italic">{lastOrder.timestamp}</p>
                    </div>
                  </div>

                  <div className="space-y-6 mb-8 md:mb-12">
                    <h3 className="text-xl md:text-2xl font-black text-brand-dark">DÉTAIL DE LA COMMANDE</h3>
                    <div className="space-y-4">
                      {lastOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start group gap-4">
                          <div className="flex gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                            <div>
                              <p className="font-black text-brand-dark text-sm md:text-base">
                                <span className="text-brand-red">{item.quantity}x</span> {item.name}
                              </p>
                              {item.notes && <p className="text-[10px] text-brand-dark/50 italic">"{item.notes}"</p>}
                              {item.pickupTime && <p className="text-[9px] font-bold text-brand-red uppercase">Retrait: {item.pickupTime}</p>}
                            </div>
                          </div>
                          <span className="font-bold text-brand-dark text-sm md:text-base whitespace-nowrap">{(item.price * item.quantity).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-brand-cream/50 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4">
                    <div className="flex justify-between items-center text-xl md:text-2xl font-black text-brand-dark">
                      <span>{lastOrder.paymentMethod === 'online' ? 'TOTAL PAYÉ' : 'TOTAL À PAYER'}</span>
                      <span className="text-brand-red">{lastOrder.totalPrice.toFixed(2)}€</span>
                    </div>
                  </div>

                  <div className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 no-print">
                    <Link to="/" className="flex-grow">
                      <Button variant="outline" className="w-full border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white font-black py-5 md:py-6 rounded-2xl">
                        <ArrowLeft className="mr-2 w-5 h-5" />
                        RETOUR À L'ACCUEIL
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleDownloadReceipt}
                      disabled={isDownloading}
                      className="bg-brand-dark text-white font-black py-5 md:py-6 px-8 rounded-2xl hover:bg-brand-red transition-colors disabled:opacity-50"
                    >
                      {isDownloading ? (
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      ) : (
                        <Download className="mr-2 w-5 h-5" />
                      )}
                      TÉLÉCHARGER LE REÇU
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
