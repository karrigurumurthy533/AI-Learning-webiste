import { useParams, useNavigate, NavLink, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import documentService from "../../services/documentService";

const DocumentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [document, setDocument] = useState(null);

  const navItems = [
    { name: "Content", path: "" },
    { name: "Chat", path: "chat" },
    { name: "AI Actions", path: "actions" },
    { name: "Flashcards", path: "flashcards" },
    { name: "Quizzes", path: "quizzes" },
  ];

  // FETCH DOCUMENT DETAILS
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDocument();
  }, [id]);

  return (
    <div className="p-6 text-white min-h-screen overflow-y-auto">

      {/* BACK */}
      <button
        onClick={() => navigate("/documents")}
        className="mb-2 text-emerald-400 hover:text-emerald-300"
      >
        ← Back to Documents
      </button>

      {/* TITLE */}
      <h1 className="text-2xl font-bold">
        {document?.data?.title}
      </h1>

      {/* NAVIGATION */}
      <div className="flex flex-wrap gap-3 border-b border-slate-700 pb-3 my-6">

        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={`/documents/${id}/${item.path}`}
            end={item.path === ""}
            className={({ isActive }) =>
              `px-3 py-1 rounded-lg text-sm transition ${
                isActive
                  ? "bg-emerald-500 text-black"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}

      </div>

      {/* 👇 THIS IS REQUIRED */}
      <div className="pb-10">
        <Outlet />
      </div>

    </div>
  );
};

export default DocumentDetailsPage;