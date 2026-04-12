import * as React from "react";
import { Menu, Pizza } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { motion } from "motion/react";
import { Cart } from "./Cart";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User as UserIcon, LogOut, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_LINKS = [
  { name: "ACCUEIL", href: "/" },
  { name: "CHEZ NOUS", href: "/#about" },
  { name: "MENU", href: "/menu" },
  { name: "CONTACT", href: "/#contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const location = useLocation();
  const { user, loginWithGoogle, logout } = useAuth();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-red p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <Pizza className="text-white w-6 h-6" />
          </div>
          <span className={`text-xl sm:text-2xl font-black tracking-tighter ${isScrolled || !isHome ? "text-brand-dark" : "text-white"}`}>
            ALLO PIZZA
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-bold tracking-widest hover:text-brand-red transition-colors ${
                isScrolled || !isHome ? "text-brand-dark" : "text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex items-center gap-4">
            <Cart />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className={`rounded-full ${isScrolled || !isHome ? "text-brand-dark" : "text-white"}`}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-brand-red" />
                    ) : (
                      <UserIcon className="w-6 h-6" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white rounded-2xl shadow-2xl border-brand-red/10">
                  <DropdownMenuLabel className="font-black text-brand-dark">{user.displayName || "Mon Compte"}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/orders">
                    <DropdownMenuItem className="cursor-pointer font-bold gap-2">
                      <History className="w-4 h-4 text-brand-red" />
                      Mes Commandes
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer font-bold gap-2 text-red-600">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                onClick={() => loginWithGoogle()}
                variant="ghost" 
                size="icon" 
                className={isScrolled || !isHome ? "text-brand-dark" : "text-white"}
              >
                <UserIcon className="w-6 h-6" />
              </Button>
            )}

            <Link to="/menu">
              <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-full px-6">
                COMMANDER
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden flex items-center gap-2">
          <Cart />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={isScrolled || !isHome ? "text-brand-dark" : "text-white"}>
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-brand-cream border-l-brand-red/20">
              <SheetTitle className="text-brand-red font-black text-2xl mb-8">ALLO PIZZA</SheetTitle>
              <div className="flex flex-col gap-6 mt-12">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-2xl font-black text-brand-dark hover:text-brand-red transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link to="/menu">
                  <Button className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold rounded-full py-6 text-lg mt-4">
                    COMMANDER EN LIGNE
                  </Button>
                </Link>

                <div className="mt-8 pt-8 border-t border-brand-red/10">
                  {user ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-12 h-12 rounded-full border-2 border-brand-red" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-brand-red flex items-center justify-center text-white">
                            <UserIcon className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <p className="font-black text-brand-dark">{user.displayName || "Mon Compte"}</p>
                          <p className="text-xs text-brand-dark/40 font-bold">{user.email}</p>
                        </div>
                      </div>
                      <Link to="/orders" className="flex items-center gap-3 text-xl font-black text-brand-dark hover:text-brand-red transition-colors">
                        <History className="w-6 h-6 text-brand-red" />
                        Mes Commandes
                      </Link>
                      <button 
                        onClick={() => logout()} 
                        className="flex items-center gap-3 text-xl font-black text-red-600 hover:text-red-700 transition-colors w-full text-left"
                      >
                        <LogOut className="w-6 h-6" />
                        Déconnexion
                      </button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => loginWithGoogle()}
                      className="w-full bg-brand-dark hover:bg-brand-dark/90 text-white font-bold rounded-full py-6 text-lg"
                    >
                      <UserIcon className="mr-2 w-5 h-5" />
                      SE CONNECTER
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}


