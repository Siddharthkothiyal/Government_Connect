import { Link, useLocation } from "react-router-dom";
import { Landmark, Menu, X } from "lucide-react";
import { useState } from "react";
import LanguageToggle from "@/components/ui/LanguageToggle";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import { useT } from "@/utils/i18n";

const navItems = [
  { path: "/", labelKey: "home" as const },
  { path: "/apply", labelKey: "checkEligibilityNav" as const },
  { path: "/chat", labelKey: "assistant" as const },
  { path: "/profile", labelKey: "profile" as const },
];

export default function Navbar() {
  const location = useLocation();
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-brand-blue">
          <Landmark size={24} />
          SchemeWise AI
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path
                  ? "text-brand-blue"
                  : "text-gray-600 dark:text-gray-300 hover:text-brand-blue"
              }
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageToggle />
          <DarkModeToggle />
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 px-4 py-3 flex flex-col gap-3">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setOpen(false)} className="py-1 text-gray-700 dark:text-gray-200">
              {t(item.labelKey)}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <LanguageToggle />
            <DarkModeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
