import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ExternalLink, FileText, ListOrdered, HelpCircle, ArrowLeft, Loader2 } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { fetchSchemeById } from "@/services/api";
import type { Scheme } from "@/types";

export default function SchemeDetail() {
  const { id } = useParams<{ id: string }>();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchSchemeById(id).then((s) => {
      setScheme(s || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <Loader2 className="animate-spin mx-auto text-brand-blue" size={28} />
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Scheme not found.</p>
        <Link to="/results" className="text-brand-blue underline mt-2 inline-block">
          Back to results
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/results" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-blue mb-6">
        <ArrowLeft size={16} /> Back to results
      </Link>

      <h1 className="text-2xl font-bold mb-2">{scheme.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{scheme.shortDescription}</p>

      <Card className="mb-5">
        <h2 className="font-semibold mb-3">Benefits</h2>
        <ul className="space-y-1 text-sm">
          {scheme.benefits.map((b, i) => (
            <li key={i}>• {b}</li>
          ))}
        </ul>
      </Card>

      <Card className="mb-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <FileText size={18} /> Eligibility Criteria
        </h2>
        <ul className="space-y-1 text-sm">
          {scheme.eligibilityCriteria.map((c, i) => (
            <li key={i}>• {c}</li>
          ))}
        </ul>
      </Card>

      <Card className="mb-5">
        <h2 className="font-semibold mb-3">Required Documents</h2>
        <ul className="space-y-1 text-sm">
          {scheme.documentsRequired.map((d, i) => (
            <li key={i}>• {d}</li>
          ))}
        </ul>
      </Card>

      <Card className="mb-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <ListOrdered size={18} /> How to Apply
        </h2>
        <ol className="space-y-2 text-sm list-decimal list-inside">
          {scheme.applicationSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </Card>

      <Card className="mb-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <HelpCircle size={18} /> Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {scheme.faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 dark:border-gray-800 rounded-xl">
              <button
                className="w-full text-left px-4 py-3 text-sm font-medium"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.question}
              </button>
              {openFaq === i && (
                <p className="px-4 pb-3 text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </Card>

      <a href={scheme.officialLink} target="_blank" rel="noreferrer">
        <Button className="inline-flex items-center gap-2 w-full justify-center">
          Visit Official Website <ExternalLink size={16} />
        </Button>
      </a>
    </div>
  );
}
