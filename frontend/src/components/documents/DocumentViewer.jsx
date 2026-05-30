import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import documentService from "../../services/documentService";
import Spinner from "../common/Spinner";


const DocumentViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);

        const res = await documentService.getDocumentById(id);

        // ✅ FIX HERE (IMPORTANT)
        setDocument(res?.data);
      } catch (err) {
        setError(err?.message || "Failed to load document");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // ✅ PDF URL FIX (your field = filePath, not fileUrl)
  const fileUrl = document?.filePath
    ? document.filePath.startsWith("http")
      ? document.filePath
      : `http://localhost:8000${document.filePath}`
    : null;

  return (
    <div className="p-6 text-white min-h-screen overflow-y-auto">

      {/* LOADING */}
      {loading && <Spinner />}

      {/* ERROR */}
      {error && <p className="text-red-400">{error}</p>}

      {/* CONTENT */}
      {!loading && !error && document && (
        <div className="space-y-6">

          
          {/* PDF VIEWER */}
          {fileUrl ? (
            <iframe
              src={fileUrl}
              className="w-full h-screen border border-slate-700 rounded-lg"
              title="PDF Viewer"
            />
          ) : (
            <p className="text-slate-400">No PDF available</p>
          )}

        </div>
      )}
    </div>
  );
};

export default DocumentViewer;