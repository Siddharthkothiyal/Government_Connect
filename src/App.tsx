import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import Landing from "@/pages/Landing";
import UserInputForm from "@/pages/UserInputForm";
import Results from "@/pages/Results";
import SchemeDetail from "@/pages/SchemeDetail";
import Chat from "@/pages/Chat";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { useAppStore } from "@/context/useAppStore";

export default function App() {
  const darkMode = useAppStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/apply" element={<UserInputForm />} />
          <Route path="/results" element={<Results />} />
          <Route path="/scheme/:id" element={<SchemeDetail />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
