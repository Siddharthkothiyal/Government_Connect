import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, EligibilityResponse, Language, SearchHistoryItem, UserProfile } from "@/types";

const emptyProfile: UserProfile = {
  fullName: "",
  age: "",
  gender: "",
  state: "",
  district: "",
  occupation: "",
  annualIncome: "",
  category: "",
  disability: "",
  student: "",
};

interface AppState {
  profile: UserProfile;
  setProfile: (p: Partial<UserProfile>) => void;
  resetProfile: () => void;

  results: EligibilityResponse | null;
  setResults: (r: EligibilityResponse | null) => void;

  savedSchemeIds: string[];
  toggleSavedScheme: (id: string) => void;

  history: SearchHistoryItem[];
  addHistoryItem: (item: SearchHistoryItem) => void;

  chatMessages: ChatMessage[];
  addChatMessage: (m: ChatMessage) => void;
  clearChat: () => void;

  language: Language;
  setLanguage: (l: Language) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      setProfile: (p) => set({ profile: { ...get().profile, ...p } }),
      resetProfile: () => set({ profile: emptyProfile }),

      results: null,
      setResults: (r) => set({ results: r }),

      savedSchemeIds: [],
      toggleSavedScheme: (id) => {
        const current = get().savedSchemeIds;
        set({
          savedSchemeIds: current.includes(id)
            ? current.filter((x) => x !== id)
            : [...current, id],
        });
      },

      history: [],
      addHistoryItem: (item) => set({ history: [item, ...get().history].slice(0, 20) }),

      chatMessages: [],
      addChatMessage: (m) => set({ chatMessages: [...get().chatMessages, m] }),
      clearChat: () => set({ chatMessages: [] }),

      language: "en",
      setLanguage: (l) => set({ language: l }),

      darkMode: false,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),
    }),
    { name: "schemewise-ai-storage" }
  )
);
