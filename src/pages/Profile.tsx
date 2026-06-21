import { Link } from "react-router-dom";
import { User, History, Bookmark, Trash2 } from "lucide-react";
import Card from "@/components/ui/Card";
import { useAppStore } from "@/context/useAppStore";

export default function Profile() {
  const { profile, history, savedSchemeIds, toggleSavedScheme, resetProfile } = useAppStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-softblue flex items-center justify-center">
            <User className="text-brand-blue" size={26} />
          </div>
          <div>
            <h1 className="font-semibold text-lg">{profile.fullName || "Guest User"}</h1>
            <p className="text-sm text-gray-500">
              {profile.district || "—"}, {profile.state || "—"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 text-sm">
          <InfoItem label="Occupation" value={profile.occupation || "—"} />
          <InfoItem label="Category" value={profile.category || "—"} />
          <InfoItem label="Age" value={profile.age ? String(profile.age) : "—"} />
        </div>
        <button onClick={resetProfile} className="text-xs text-red-500 mt-4 hover:underline">
          Clear profile data
        </button>
      </Card>

      <Card>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <Bookmark size={18} className="text-brand-blue" /> Saved Schemes
        </h2>
        {savedSchemeIds.length === 0 ? (
          <p className="text-sm text-gray-500">No saved schemes yet.</p>
        ) : (
          <ul className="space-y-2">
            {savedSchemeIds.map((id) => (
              <li key={id} className="flex items-center justify-between text-sm border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2">
                <Link to={`/scheme/${id}`} className="text-brand-blue hover:underline">
                  {id}
                </Link>
                <button onClick={() => toggleSavedScheme(id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <History size={18} className="text-brand-blue" /> Past Searches
        </h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">No past searches yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id} className="text-sm border border-gray-100 dark:border-gray-800 rounded-xl px-3 py-2 flex justify-between">
                <span>
                  {h.profileSnapshot.occupation} • {h.profileSnapshot.state} • {h.profileSnapshot.category}
                </span>
                <span className="text-gray-400">{h.resultCount} schemes</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl px-3 py-2">
      <p className="text-gray-400 text-xs">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
