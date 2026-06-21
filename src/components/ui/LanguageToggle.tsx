import { useAppStore } from "@/context/useAppStore";

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore();
  return (
    <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full overflow-hidden text-sm">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1.5 ${language === "en" ? "bg-brand-blue text-white" : "bg-transparent"}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage("hi")}
        className={`px-3 py-1.5 ${language === "hi" ? "bg-brand-blue text-white" : "bg-transparent"}`}
      >
        हिं
      </button>
    </div>
  );
}
