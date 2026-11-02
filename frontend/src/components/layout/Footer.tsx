import { Link } from "react-router-dom";
import { TrendingUp, Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-primary-foreground">Credit</span>
                <span className="text-saffron">Risk</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 max-w-md">
              Empowering Moroccan microfinance institutions with AI-driven credit risk assessment. 
              Building a more inclusive financial future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-saffron">Quick Links</h4>
            <ul className="space-y-3">
              {["Home", "Dashboard", "Predict", "About"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-saffron transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-saffron">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Mail className="w-4 h-4 text-saffron" />
                contact@creditrisk.ma
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <Phone className="w-4 h-4 text-saffron" />
                +212 5XX-XXXXXX
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 text-saffron" />
                Casablanca, Morocco
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2024 CreditRisk. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-primary-foreground/50 hover:text-saffron text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="text-primary-foreground/50 hover:text-saffron text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
