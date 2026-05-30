import React, { useEffect, useState } from "react";
import {
    Plus,
    BookOpen,
    Clock,
    Trash2,
    BrainCircuit,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import flashcardService from "../../services/flashcardService";
import toast from "react-hot-toast";
import aiService from "../../services/aiService";

const FlashcardInterface = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [flashcardSets, setFlashcardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedSet, setSelectedSet] = useState(null);

    const [showGenerateModal, setShowGenerateModal] = useState(false);
    const [docTitle, setDocTitle] = useState("");
    const [numCards, setNumCards] = useState(5);
    const [generating, setGenerating] = useState(false);

    const getId = (set) => set?._id || set?.id;

    // 📅 DATE FORMAT
    const formatDate = (date) => {
        if (!date) return "Unknown date";

        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // FETCH FLASHCARDS
    const fetchFlashcardSets = async () => {
        try {
            setLoading(true);
            const res = await flashcardService.getFlashcards(id);
            setFlashcardSets(res?.data || []);
        } catch (err) {
            setError(err?.message || "Failed to load flashcards");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFlashcardSets();
    }, [id]);

    // OPEN SET
    const handleOpenSet = (set) => {
        const setId = getId(set);
        navigate(`/documents/${documentId}/flashcards/${setId}`);
    };

    // DELETE
    const handleDeleteClick = (set) => {
        setSelectedSet(set);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!selectedSet) return;

        try {
            await flashcardService.deleteFlashcardSet(getId(selectedSet));

            setFlashcardSets((prev) =>
                prev.filter((s) => getId(s) !== getId(selectedSet))
            );

            toast.success("Flashcard set deleted");

            setShowDeleteModal(false);
            setSelectedSet(null);
        } catch (err) {
            toast.error(err?.message || "Delete failed");
        }
    };

    // GENERATE FLASHCARDS
    const handleGenerate = async () => {
        if (generating) return;

        try {
            setGenerating(true);

            const res = await aiService.generateFlashcards(id, {
                title: docTitle,
                count: numCards,
            });

            console.log(res);

            toast.success("Flashcards generated!");

            setShowGenerateModal(false);
            setDocTitle("");
            setNumCards(5);

            fetchFlashcardSets();
        } catch (err) {
            toast.error(err?.message || "Generation failed");
        } finally {
            setGenerating(false);
        }
    };

    const handleNumCardsChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value)) setNumCards(value);
    };

    return (
        <div className="p-6 text-white min-h-screen">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Your Flashcards</h1>

                    <p className="text-slate-400 text-sm mt-1">
                        {flashcardSets.length} sets available
                    </p>
                </div>

                <button
                    onClick={() => setShowGenerateModal(true)}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
                >
                    <Plus size={16} />
                    Generate New Set
                </button>
            </div>

            {/* STATES */}
            {loading && <p className="text-slate-400">Loading...</p>}
            {error && <p className="text-red-400">{error}</p>}

            {/* GRID */}
            {!loading && !error && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

                    {flashcardSets.length > 0 ? (
                        flashcardSets.map((set, index) => {
                            const key = getId(set) || index;

                            return (
                                <div
                                    key={key}
                                    onClick={() => handleOpenSet(set)}
                                    className="relative group bg-slate-800 p-4 rounded-xl cursor-pointer border border-slate-700 hover:border-emerald-500"
                                >
                                    {/* DELETE */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(set);
                                        }}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={16} className="text-red-400" />
                                    </button>

                                    {/* TITLE */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <BookOpen size={18} className="text-emerald-400" />

                                        <div className="text-sm font-semibold text-white">
                                            Flashcard Set
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                                        <BrainCircuit size={14} className="text-blue-400" />
                                        {set.cards?.length || 0} Cards
                                    </div>

                                    {/* DATE */}
                                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                                        <Clock size={14} />
                                        Created {formatDate(set.createdAt)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-slate-400">
                            No flashcard sets found. Click “Generate Flashcards” to create one.
                        </p>
                    )}
                </div>
            )}
            {/* DELETE MODAL */}
            {showDeleteModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center"
                    onClick={() => setShowDeleteModal(false)}
                >
                    <div
                        className="bg-slate-900 p-6 rounded-2xl w-full max-w-md text-center border border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Delete Flashcard Set
                        </h2>

                        <p className="text-sm text-slate-400 mb-6">
                            Are you sure you want to delete{" "}
                            <span className="text-white font-medium">
                                {selectedSet?.title}
                            </span>
                            ?
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="w-1/2 py-2 bg-slate-700 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={confirmDelete}
                                className="w-1/2 py-2 bg-red-500 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* GENERATE MODAL */}
            {showGenerateModal && (
                <div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center"
                    onClick={() => setShowGenerateModal(false)}
                >
                    <div
                        className="bg-slate-900 p-6 rounded-2xl w-full max-w-md border border-slate-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold mb-4">
                            Generate Flashcards
                        </h2>

                        <input
                            type="number"
                            min="1"
                            max="50"
                            value={numCards}
                            onChange={handleNumCardsChange}
                            className="w-full mb-4 p-2 rounded bg-slate-800 border border-slate-600"
                        />

                        <p className="text-sm text-slate-400 mb-6">
                            Generate flashcards using AI for this document?
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowGenerateModal(false)}
                                className="w-1/2 py-2 bg-slate-700 rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleGenerate}
                                disabled={generating || numCards < 1}
                                className="w-1/2 py-2 bg-emerald-500 rounded-lg"
                            >
                                {generating ? "Generating..." : "Generate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FlashcardInterface;