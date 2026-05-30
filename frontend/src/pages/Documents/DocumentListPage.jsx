import React, { useEffect, useState } from "react";
import {
  Plus,
  FileText,
  Clock,
  BookOpen,
  BrainCircuit,
  Upload,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import documentService from "../../services/documentService";
import toast from "react-hot-toast";

const DocumentListPage = () => {
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  // 🧠 TIME FUNCTION
  const getTimeAgo = (date) => {
    if (!date) return "Unknown time";

    const now = new Date();
    const uploaded = new Date(date);
    const diffMs = now - uploaded;

    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  // FETCH
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const data = await documentService.getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // 🚀 OPEN DOCUMENT DETAILS
  const handleOpenDocument = (doc) => {
    const id = doc._id || doc.id;
    navigate(`/documents/${id}`);
  };

  // UPLOAD
  const handleUpload = async () => {
    if (!title || !file) {
      toast.error("Please Provide  Valid File format and Title");
      return;
    }
    if (!title || title.trim().length <= 3) {
      toast.error("Please provide a valid title");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Only pdf files are allowed");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);

      await documentService.uploadDocument(formData);
      toast.success("Document Uploaded SuccessFully");

      setTitle("");
      setFile(null);
      setShowModal(false);

      fetchDocuments();
    } catch (err) {
      toast.error("Upload document failed");
    }
  };

  // DELETE
  const handleDeleteClick = (doc) => {
    setSelectedDoc(doc);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await documentService.deleteDocument(
        selectedDoc._id || selectedDoc.id
      );

      setDocuments((prev) =>
        prev.filter(
          (d) => (d._id || d.id) !== (selectedDoc._id || selectedDoc.id)
        )
      );
      toast.success("Document deleted successfully");

      setShowDeleteModal(false);
      setSelectedDoc(null);
    } catch (err) {
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="p-6 text-white min-h-screen">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Documents</h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload and manage your documents
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 transition px-4 py-2 rounded-lg font-medium"
        >
          <Plus size={16} />
          Upload Document
        </button>
      </div>

      {/* LOADING */}
      {loading && <p className="text-slate-400">Loading...</p>}

      {/* ERROR */}
      {error && <p className="text-red-400">{error}</p>}

      {/* GRID */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {documents.length > 0 ? (
            documents.map((doc, index) => {
              const key = doc._id || doc.id || index;

              const flashcardCount = doc.flashcards?.length || 0;
              const quizCount = doc.quizzes?.length || 0;
              const uploadedTime = getTimeAgo(doc.createdAt);

              return (
                <div
                  key={key}
                  onClick={() => handleOpenDocument(doc)}
                  className="relative group bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-emerald-500 transition cursor-pointer"
                >

                  {/* DELETE ICON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🚨 prevents navigation
                      handleDeleteClick(doc);
                    }}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition bg-red-500/20 hover:bg-red-500/40 p-2 rounded-lg"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>

                  {/* TITLE */}
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={18} className="text-emerald-400" />
                    <h2 className="font-semibold">{doc.title}</h2>
                  </div>

                  {/* SIZE */}
                  <p className="text-sm text-slate-400 mb-3">
                    Size: {doc.fileSize}
                  </p>

                  {/* STATS */}
                  <div className="flex gap-6 text-sm mb-3 text-slate-300">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} className="text-fuchsia-500" />
                      {doc.flashcardCount} Flashcards
                    </div>

                    <div className="flex items-center gap-1">
                      <BrainCircuit size={16} className="text-blue-500" />
                      {doc.quizCount} Quizzes
                    </div>
                  </div>

                  {/* TIME */}
                  <div className="flex gap-1 text-xs text-slate-400">
                    <Clock size={14} />
                    Uploaded {uploadedTime}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-slate-400">No documents found</p>
          )}
        </div>
      )}

      {/* UPLOAD MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-6 rounded-2xl w-full max-w-lg border border-slate-700">

            <h2 className="text-lg font-semibold mb-4 text-center">
              Upload Document
            </h2>

            <input
              type="text"
              placeholder="Enter document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-2 rounded-lg bg-slate-800 border border-slate-700"
            />

            <div
              onClick={() => document.getElementById("fileInput").click()}
              className="border-2 border-dashed border-emerald-400 p-18  text-center cursor-pointer m-12 rounded-2xl "
            >
              <Upload className="mx-auto text-emerald-400" />
              <p className="text-sm">Click to upload PDF</p>
              {file && (
                <p className="text-xs text-emerald-400">
                  {file.name}
                </p>
              )}
              <input
                id="fileInput"
                type="file"
                hidden
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 bg-slate-700 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpload}
                className="w-1/2 bg-emerald-500 py-2 rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-900 p-16 rounded-2xl w-full max-w-lg text-center border border-slate-700">

            <h2 className="text-lg font-semibold mb-4">
              Delete Document
            </h2>

            <p className="text-sm text-slate-400 mb-16">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">
                {selectedDoc?.title}
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

    </div>
  );
};

export default DocumentListPage;