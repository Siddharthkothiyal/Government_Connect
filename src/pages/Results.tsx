import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Download, FileWarning } from "lucide-react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import SchemeCard from "@/components/scheme/SchemeCard";
import { useAppStore } from "@/context/useAppStore";
import { useT } from "@/utils/i18n";

export default function Results() {
  const { results, profile, language } = useAppStore();
  const navigate = useNavigate();
  const t = useT();

  useEffect(() => {
    if (!results) {
      navigate("/apply");
    }
  }, [results, navigate]);

  if (!results) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <Sparkles className="mx-auto mb-4 text-brand-blue animate-pulse" size={36} />
        <p className="text-gray-500">{t("analyzing")}</p>
      </div>
    );
  }

  function handleDownload() {
    const content = `SchemeWise AI – Eligibility Report\n\nName: ${profile.fullName}\n\nEligible Schemes:\n${results!.schemes
      .map((s) => `- ${s.name}: ${s.eligibilityReason}`)
      .join("\n")}\n\nSummary:\n${language === "hi" ? results!.aiSummaryHi : results!.aiSummaryEn}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schemewise-eligibility-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="mb-8 bg-brand-softblue dark:bg-blue-950/20 border-blue-100">
          <div className="flex items-start gap-3">
            <Sparkles className="text-brand-blue shrink-0 mt-1" size={22} />
            <div>
              <h2 className="font-semibold mb-1">{t("aiSummary")}</h2>
              <p className="text-sm text-gray-700 dark:text-gray-200">
                {language === "hi" ? results.aiSummaryHi : results.aiSummaryEn}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button variant="outline" onClick={handleDownload} className="inline-flex items-center gap-2 text-sm">
              <Download size={16} /> Download Report
            </Button>
          </div>
        </Card>
      </motion.div>

      <h1 className="text-xl font-bold mb-4">
        {results.schemes.length} schemes found for {profile.fullName || "you"}
      </h1>

      {results.schemes.length === 0 ? (
        <Card className="text-center py-10">
          <FileWarning className="mx-auto mb-3 text-gray-400" size={32} />
          <p className="text-gray-500">No matching schemes found. Try adjusting your details.</p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  );
}
