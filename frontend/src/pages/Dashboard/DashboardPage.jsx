import React, { useEffect, useState } from "react";
import progressService from "../../services/progressService";
import { FileText, Layers, BrainCircuit, Clock } from "lucide-react";
import Spinner from "../../components/common/Spinner.jsx";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [data, setData] = useState({});
  const [activity, setActivity] = useState({
    documents: [],
    quizzes: [],
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "No date";
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await progressService.getDashboardProgress();

      setData(res?.data || {});
      setActivity(
        res?.recentActivity || {
          documents: [],
          quizzes: [],
        }
      );
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Track your learning progress activity
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white/5 border border-emerald-500/10 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-300">Total Documents</h2>
            <FileText className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-3">
            {data?.totalDocuments ?? 0}
          </p>
        </div>

        <div className="bg-white/5 border border-emerald-500/10 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-300">Total Flashcards</h2>
            <Layers className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-3">
            {data?.totalFlashcards ?? 0}
          </p>
        </div>

        <div className="bg-white/5 border border-emerald-500/10 rounded-xl p-4 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-slate-300">Total Quizzes</h2>
            <BrainCircuit className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold mt-3">
            {data?.totalQuizzes ?? 0}
          </p>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="mt-6 bg-white/5 border border-emerald-500/10 rounded-xl p-4 backdrop-blur-lg">

        <h2 className="font-semibold mb-4 flex items-center gap-2">
          <Clock size={18} /> Recent Activity
        </h2>

        <div className="space-y-2">

          {/* DOCUMENTS */}
          {activity.documents.map((item, index) => (
            <div
              key={`doc-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-emerald-400"></span>

                <div>
                  <p className="text-sm text-slate-200">
                    Accessed Document - {item.title || item.fileName}
                  </p>

                  <p className="text-xs text-slate-400">
                    Last Accessed: {formatDate(item.lastAccessed)}
                  </p>
                </div>
              </div>

              {/* VIEW BUTTON */}
              <button
                onClick={() => navigate("/documents")}
                className="text-xs text-emerald-400 hover:underline"
              >
                View
              </button>
            </div>
          ))}

          {/* QUIZZES */}
          {activity.quizzes.map((item, index) => (
            <div
              key={`quiz-${index}`}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10"
            >
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 mt-2 rounded-full bg-emerald-400"></span>

                <div>
                  <p className="text-sm text-slate-200">
                    Attempted Quiz - {item.title || "Quiz"}
                  </p>

                  <p className="text-xs text-slate-400">
                    {item.completedAt
                      ? `Completed: ${formatDate(item.completedAt)}`
                      : `Created: ${formatDate(item.createdAt)}`}
                  </p>
                </div>
              </div>

              {/* VIEW BUTTON */}
              <button
                onClick={() => navigate("/quizzes")}
                className="text-xs text-emerald-400 hover:underline"
              >
                View
              </button>
            </div>
          ))}

          {/* EMPTY */}
          {activity.documents.length === 0 &&
            activity.quizzes.length === 0 && (
              <p className="text-slate-400 text-sm">
                No recent activity found
              </p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;