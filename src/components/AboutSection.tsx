import { motion } from "motion/react";
import { Utensils, Leaf, MapPin } from "lucide-react";

const FEATURES = [
  {
    icon: Utensils,
    title: "Authenticité",
    description: "Chez Allo Pizza, nous sommes fiers de proposer une cuisine traditionnelle italienne avec une touche moderne.",
    number: "01"
  },
  {
    icon: Leaf,
    title: "Ingrédients Frais",
    description: "Nous nous engageons à servir à nos clients les meilleures pizzas préparées avec des ingrédients frais.",
    number: "02"
  },
  {
    icon: MapPin,
    title: "Au Cœur de la Ville",
    description: "Idéalement situé à Bailly, notre restaurant est l'endroit parfait pour venir chercher une délicieuse pizza.",
    number: "03"
  }
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-red/10 rounded-full blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=800&q=80"
                alt="Chef making pizza"
                className="rounded-3xl shadow-2xl relative z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-6 -right-6 bg-brand-red text-white p-8 rounded-2xl shadow-xl z-20 hidden md:block">
                <p className="text-4xl font-black">15+</p>
                <p className="text-sm font-bold uppercase tracking-widest">Années d'expérience</p>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-brand-red font-bold tracking-[0.2em] uppercase mb-4 block"
            >
              Notre Histoire
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl md:text-6xl font-black text-brand-dark mb-8 leading-tight"
            >
              LA PASSION DE LA <span className="text-brand-red">PIZZA ARTISANALE</span>
            </motion.h2>
            
            <div className="space-y-8">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-brand-cream rounded-2xl flex items-center justify-center group-hover:bg-brand-red transition-colors duration-300">
                      <feature.icon className="w-8 h-8 text-brand-red group-hover:text-white transition-colors" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-brand-red font-black text-xl opacity-20">{feature.number}</span>
                      <h3 className="text-xl font-black text-brand-dark">{feature.title}</h3>
                    </div>
                    <p className="text-brand-dark/60 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
