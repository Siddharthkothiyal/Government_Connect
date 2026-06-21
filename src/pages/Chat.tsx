import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Mic, Trash2 } from "lucide-react";
import { useAppStore } from "@/context/useAppStore";
import { sendChatMessage } from "@/services/api";
import { useT } from "@/utils/i18n";

export default function Chat() {
  const { chatMessages, addChatMessage, clearChat } = useAppStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = useT();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, loading]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, text, timestamp: Date.now() };
    addChatMessage(userMsg);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChatMessage(text, chatMessages);
      addChatMessage({ id: crypto.randomUUID(), role: "assistant", text: reply, timestamp: Date.now() });
    } finally {
      setLoading(false);
    }
  }

  function handleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onresult = (e: any) => setInput(e.results[0][0].transcript);
    recognition.start();
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Bot className="text-brand-blue" /> {t("assistant")}
        </h1>
        <button onClick={clearChat} className="text-gray-400 hover:text-red-500" aria-label="Clear chat">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">
            Try asking: "Am I eligible for Ayushman Bharat?" or "How to apply for PM Awas?"
          </div>
        )}
        {chatMessages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-brand-softblue flex items-center justify-center shrink-0">
                <Bot size={16} className="text-brand-blue" />
              </div>
            )}
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-brand-blue text-white rounded-br-sm"
                  : "bg-gray-100 dark:bg-gray-800 rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-400 pl-10">Typing...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
        <button onClick={handleVoiceInput} className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Voice input">
          <Mic size={18} />
        </button>
        <input
          className="input-field"
          value={input}
          placeholder={t("chatPlaceholder")}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend} className="btn-primary p-3" aria-label="Send message">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
