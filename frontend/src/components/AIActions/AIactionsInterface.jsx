import React, { useState, useEffect } from "react";
import { Sparkles, Brain, BookOpen } from "lucide-react";
import aiService from "../../services/aiService.js";
import documentService from "../../services/documentService.js";
import { useParams } from "react-router-dom";

const AIactionsInterface = () => {
    const { id } = useParams();

    const [loadingSummary, setLoadingSummary] = useState(false);
    const [loadingExplain, setLoadingExplain] = useState(false);

    const [concept, setConcept] = useState("");
    const [document, setDocument] = useState(null);

    // SUMMARY MODAL
    const [showSummaryModal, setShowSummaryModal] = useState(false);
    const [summary, setSummary] = useState("");

    // EXPLAIN MODAL (NEW)
    const [showExplainModal, setShowExplainModal] = useState(false);
    const [explanation, setExplanation] = useState("");

    const [messages, setMessages] = useState([]);
    const [error, setError] = useState(null);

    // 📄 LOAD DOCUMENT
    useEffect(() => {
        if (!id) return;

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

    // 📌 GENERATE SUMMARY
    const handleGenerateSummary = async () => {
        if (!document?._id) return;

        try {
            setLoadingSummary(true);

            const res = await aiService.generateSummary(document._id);
            const result = res?.summary || "No summary returned.";

            setSummary(result);
            setShowSummaryModal(true);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: result },
            ]);

        } catch (err) {
            setError(err?.message || "Failed to generate summary");
        } finally {
            setLoadingSummary(false);
        }
    };

    // 📌 EXPLAIN CONCEPT (MODAL ADDED)
    const handleExplainConcept = async () => {
        if (!document?._id || !concept.trim()) return;

        try {
            setLoadingExplain(true);

            const res = await aiService.explainConcept(document._id, concept);
            const result = res?.data?.explanation || "No explanation returned.";

            setExplanation(result);
            setShowExplainModal(true);

            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: result },
            ]);

            setConcept("");
        } catch (err) {
            setError(err?.message || "Failed to explain concept");
        } finally {
            setLoadingExplain(false);
        }
    };

    return (
        <div className="p-2 text-white max-w-8xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="bg-slate-800 border border-emerald-500/20 rounded-xl p-8 flex items-center gap-4">
                <div className="bg-emerald-500 p-3 rounded-2xl">
                    <Sparkles size={20} />
                </div>

                <div>
                    <h2 className="text-lg font-semibold">AI Assistance</h2>
                    <p className="text-sm text-slate-400">
                        Use AI tools to enhance your documents and learning
                    </p>
                </div>
            </div>

            {/* ERROR */}
            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-300 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* ACTION CARDS */}
            <div className="flex flex-col gap-5">

                {/* SUMMARY */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3">
                            <BookOpen className="text-emerald-400" size={20} />
                            <h3 className="font-semibold text-lg">Generate Summary</h3>
                        </div>
                        <p className="text-sm text-slate-400">
                            Create summaries, flashcards, and quizzes from your content.
                        </p>
                    </div>

                    <button
                        onClick={handleGenerateSummary}
                        disabled={loadingSummary}
                        className="w-28 bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg"
                    >
                        {loadingSummary ? "Loading..." : "Generate"}
                    </button>
                </div>

                {/* EXPLAIN */}
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                        <Brain className="text-emerald-400" size={20} />
                        <h3 className="font-semibold text-lg">Explain Concept</h3>
                    </div>

                    <p className="text-sm text-slate-400 mb-3">
                        Get simple explanations for complex topics instantly.
                    </p>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={concept}
                            onChange={(e) => setConcept(e.target.value)}
                            placeholder="e.g. Explain useState Hook"
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"
                        />

                        <button
                            onClick={handleExplainConcept}
                            disabled={loadingExplain}
                            className="w-28 bg-emerald-500 hover:bg-emerald-600 py-2 rounded-lg"
                        >
                            {loadingExplain ? "Thinking..." : "Explain"}
                        </button>
                    </div>
                </div>
            </div>

            {/* ================= SUMMARY MODAL ================= */}
            {showSummaryModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl w-[90%] max-w-2xl p-6 relative">

                        <button
                            onClick={() => setShowSummaryModal(false)}
                            className="absolute top-3 right-3 text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-emerald-400 font-semibold mb-4">
                            AI Summary
                        </h2>

                        <div className="text-sm text-slate-200 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                            {summary}
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EXPLAIN MODAL ================= */}
            {showExplainModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl w-[90%] max-w-2xl p-6 relative">

                        <button
                            onClick={() => setShowExplainModal(false)}
                            className="absolute top-3 right-3 text-white"
                        >
                            ✕
                        </button>

                        <h2 className="text-emerald-400 font-semibold mb-4">
                            Explanation
                        </h2>

                        <div className="text-sm text-slate-200 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                            {explanation}
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AIactionsInterface;