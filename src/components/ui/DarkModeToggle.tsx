import { Moon, Sun } from "lucide-react";
import { useAppStore } from "@/context/useAppStore";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useAppStore();
  return (
    <button
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="p-2 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      {darkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
