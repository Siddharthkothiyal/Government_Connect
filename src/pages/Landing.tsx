import { Link } from "react-router-dom";
import { ClipboardList, Sparkles, ListChecks, ShieldCheck, Languages } from "lucide-react";
import Card from "@/components/ui/Card";
import { useT } from "@/utils/i18n";

export default function Landing() {
  const t = useT();

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-softblue dark:bg-blue-950/20">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 dark:text-white">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 text-gray-600 dark:text-gray-300 text-base md:text-lg">{t("heroSubtitle")}</p>
            <Link to="/apply" className="btn-primary inline-block mt-8 text-base">
              {t("checkEligibility")}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="card p-8 bg-white">
              <Sparkles className="text-brand-blue mb-4" size={32} />
              <p className="text-sm text-gray-500">Example AI summary</p>
              <p className="mt-2 font-medium">
                "Based on your profile, you are eligible for PM-KISAN because you are a farmer with less than 2
                hectares of land."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">{t("howItWorks")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: ClipboardList, title: t("step1Title"), desc: t("step1Desc") },
            { icon: ListChecks, title: t("step2Title"), desc: t("step2Desc") },
            { icon: Sparkles, title: t("step3Title"), desc: t("step3Desc") },
          ].map((step, i) => (
            <Card key={i} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-softblue dark:bg-blue-950/30 flex items-center justify-center mx-auto mb-4">
                <step.icon className="text-brand-blue" size={22} />
              </div>
              <h3 className="font-semibold mb-2">
                {i + 1}. {step.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="bg-brand-softgreen dark:bg-green-950/10 py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center">
          <Languages className="text-brand-green" size={28} />
          <p className="font-medium text-gray-800 dark:text-gray-100">{t("languagesSupported")}</p>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <Card className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <ShieldCheck className="text-brand-blue shrink-0" size={48} />
          <div>
            <h3 className="text-xl font-semibold">{t("trustTitle")}</h3>
            <p className="text-gray-600 dark:text-gray-300 mt-1">{t("trustDesc")}</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
