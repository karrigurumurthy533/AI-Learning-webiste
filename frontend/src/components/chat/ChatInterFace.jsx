import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Send, User, Sparkles, BrainCircuit } from "lucide-react";

import aiService from "../../services/aiService.js";
import documentService from "../../services/documentService.js";

const limitText = (text, maxWords = 250) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length <= maxWords
    ? text
    : words.slice(0, maxWords).join(" ") + "...";
};

const ChatInterface = () => {
  const { id } = useParams();
  const bottomRef = useRef(null);

  const [document, setDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  // 📄 LOAD DOCUMENT
  useEffect(() => {
    const loadDocument = async () => {
      try {
        const res = await documentService.getDocumentById(id);
        const doc = res?.data;

        setDocument(doc);

        setMessages([
          {
            role: "assistant",
            content: `Hi 👋 I can answer questions about "${doc?.title}". Ask me anything.`,
          },
        ]);
      } catch (err) {
        setError(err?.message || "Failed to load document");
      }
    };

    loadDocument();
  }, [id]);

  // 🔥 AUTO SCROLL
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  // 🚀 SEND MESSAGE
  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const question = input;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setSending(true);

    try {
      const res = await aiService.chat(id, question);
      const answer = limitText(res?.data?.answer, 250);

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Server error. Please try again later.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-[calc(100vh)] flex flex-col text-white bg-slate-800">

      {/* ERROR */}
      {error && (
        <div className="p-3 text-red-400">{error}</div>
      )}

      {/* CHAT AREA (ONLY SCROLLS) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
              }`}
          >
            {/* AI ICON */}
            {msg.role === "assistant" && (
              <div className="bg-emerald-500 p-2 rounded-full">
                <Sparkles size={16} className="text-black" />
              </div>
            )}

            {/* MESSAGE */}
            <div
              className={`px-3 py-2 rounded-xl text-sm max-w-[70%] whitespace-pre-wrap ${msg.role === "user"
                  ? "bg-emerald-500 text-black text-xs"
                  : "bg-emerald-500 text-black text-md "
                }`}
            >
              {msg.content}
            </div>

            {/* USER ICON */}
            {msg.role === "user" && (

                <div className="flex items-center justify-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-md font-bold">
                    <User size={16} className="text-black"/>
                  </div>
                </div>
  
            )}
          </div>
        ))}

        {/* ✅ FIXED: thinking stays inside chat flow */}
        {sending && (
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <BrainCircuit size={16} className="animate-pulse" />
            AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* INPUT (FIXED FOOTER) */}
      <div className="p-3 border-t border-slate-700 flex gap-2 bg-slate-800 shrink-0 rounded-5xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something about this document..."
          className="flex-1 p-2 rounded-lg bg-slate-800 outline-none"
        />

        <button
          onClick={handleSend}
          disabled={sending}
          className="bg-emerald-500 px-4 rounded-lg disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;