import { motion } from "motion/react";
import { Phone, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as React from "react";

export function ContactSection() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message envoyé !", {
      description: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
    });
    (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="py-24 bg-brand-cream">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <span className="text-brand-red font-bold tracking-[0.2em] uppercase mb-4 block">
              Contactez-nous
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-brand-dark mb-8">
              VENEZ NOUS <span className="text-brand-red">VOIR</span>
            </h2>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <MapPin className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">Adresse</h4>
                  <p className="text-brand-dark/60">10 Rue de Maule, 78870 Bailly, France</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <Phone className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">Téléphone</h4>
                  <p className="text-brand-dark/60">01 30 56 52 52</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="bg-white p-4 rounded-2xl shadow-md">
                  <Clock className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h4 className="font-black text-xl mb-1">Horaires</h4>
                  <p className="text-brand-dark/60">Lundi - Vendredi: 12h00 - 23h00</p>
                  <p className="text-brand-dark/60">Samedi - Dimanche: 12h00 - 00h00</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden h-[300px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-500 border-4 border-white">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2626.262626262626!2d2.078!3d48.84!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e683f2f2f2f2f2%3A0x2f2f2f2f2f2f2f2f!2s10%20Rue%20de%20Maule%2C%2078870%20Bailly%2C%20France!5e0!3m2!1sfr!2sfr!4v1626262626262!5m2!1sfr!2sfr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-brand-red/10"
          >
            <h3 className="text-2xl md:text-3xl font-black mb-8 text-brand-dark">ENVOYEZ UN MESSAGE</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-brand-dark/60">Nom</label>
                  <Input required placeholder="Votre nom" className="rounded-xl border-brand-cream bg-brand-cream/50 py-6" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest text-brand-dark/60">Email</label>
                  <Input required type="email" placeholder="votre@email.com" className="rounded-xl border-brand-cream bg-brand-cream/50 py-6" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-brand-dark/60">Sujet</label>
                <Input required placeholder="Sujet de votre message" className="rounded-xl border-brand-cream bg-brand-cream/50 py-6" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-widest text-brand-dark/60">Message</label>
                <textarea 
                  required
                  className="w-full min-h-[150px] rounded-xl border border-brand-cream bg-brand-cream/50 p-4 focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                  placeholder="Comment pouvons-nous vous aider ?"
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-xl py-8 text-lg group">
                ENVOYER LE MESSAGE
                <Send className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

