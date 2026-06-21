import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Bookmark } from "lucide-react";
import Card from "@/components/ui/Card";
import { useT } from "@/utils/i18n";
import type { Scheme } from "@/types";
import { useAppStore } from "@/context/useAppStore";

export default function SchemeCard({ scheme }: { scheme: Scheme }) {
  const t = useT();
  const { savedSchemeIds, toggleSavedScheme } = useAppStore();
  const isSaved = savedSchemeIds.includes(scheme.id);

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <span className="inline-block text-xs font-medium text-brand-green bg-brand-softgreen px-2 py-1 rounded-full mb-2">
            {scheme.category}
          </span>
          <h3 className="text-lg font-semibold">{scheme.name}</h3>
        </div>
        <button
          onClick={() => toggleSavedScheme(scheme.id)}
          aria-label="Save scheme"
          className={isSaved ? "text-brand-blue" : "text-gray-300 hover:text-gray-400"}
        >
          <Bookmark fill={isSaved ? "currentColor" : "none"} size={20} />
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-300 text-sm">{scheme.shortDescription}</p>

      <ul className="space-y-1">
        {scheme.benefits.slice(0, 2).map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
            <CheckCircle2 size={16} className="text-brand-green mt-0.5 shrink-0" />
            {b}
          </li>
        ))}
      </ul>

      <div className="bg-brand-softblue dark:bg-blue-950/30 rounded-xl p-3 text-sm text-blue-900 dark:text-blue-200">
        <strong>{t("whyEligible")}:</strong> {scheme.eligibilityReason}
      </div>

      <Link
        to={`/scheme/${scheme.id}`}
        className="mt-1 inline-flex items-center justify-center gap-1 btn-primary text-sm"
      >
        {t("viewDetails")} <ArrowRight size={16} />
      </Link>
    </Card>
  );
}
