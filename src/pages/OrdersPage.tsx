import * as React from "react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Package, ChevronRight, ShoppingBag } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = React.useState<any[]>([]);
  const [fetching, setFetching] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    if (user) {
      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          formattedDate: doc.data().timestamp?.toDate().toLocaleString('fr-FR')
        }));
        setOrders(ordersData);
        setFetching(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "orders");
      });

      return () => unsubscribe();
    }
  }, [user, loading, navigate]);

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-6xl font-black text-brand-dark mb-4">MES COMMANDES</h1>
            <div className="w-24 h-1.5 bg-brand-red mx-auto rounded-full" />
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[3rem] shadow-xl border border-brand-red/5">
              <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-brand-dark/10" />
              <p className="text-2xl font-bold text-brand-dark/40 mb-8">Vous n'avez pas encore passé de commande.</p>
              <Link to="/menu">
                <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-black px-8 py-6 rounded-2xl">
                  DÉCOUVRIR LE MENU
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden hover:shadow-2xl transition-all group">
                    <CardHeader className="bg-brand-dark text-white p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-brand-red p-2 rounded-lg shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base md:text-lg font-black">COMMANDE #{order.orderId}</CardTitle>
                          <p className="text-[10px] text-white/50 font-bold">{order.formattedDate}</p>
                        </div>
                      </div>
                      <Badge className={`${
                        order.status === 'completed' ? 'bg-green-500' : 'bg-brand-red'
                      } text-white font-black uppercase tracking-widest text-[10px] md:text-xs`}>
                        {order.status === 'completed' ? 'Prête' : 'En préparation'}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-5 md:p-8">
                      <div className="space-y-4 mb-6">
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-brand-dark/70">
                              <span className="font-black text-brand-dark">{item.quantity}x</span> {item.name}
                            </span>
                            <span className="font-bold">{(item.price * item.quantity).toFixed(2)}€</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t border-brand-red/10 flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark/40">
                            <Clock className="w-4 h-4 text-brand-red" />
                            <span>RETRAIT SUR PLACE</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-brand-dark/40">
                            <Badge variant="outline" className="border-brand-red/20 text-brand-red text-[9px] px-2">
                              {order.paymentMethod === 'online' ? 'PAYÉ EN LIGNE' : 'À PAYER SUR PLACE'}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-xl md:text-2xl font-black text-brand-dark">
                          TOTAL: <span className="text-brand-red">{order.totalPrice.toFixed(2)}€</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
