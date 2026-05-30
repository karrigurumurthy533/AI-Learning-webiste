import Quiz from "../models/Quiz.js";
import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";

/**
 * 📊 GET USER DASHBOARD STATS
 * @route GET api/progress/dashboard
 * @access Private
 */
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // =========================
    // 📁 BASIC COUNTS
    // =========================
    const totalDocuments = await Document.countDocuments({ userId });
    const totalFlashcardSets = await FlashCard.countDocuments({ userId });
    const totalQuizzes = await Quiz.countDocuments({ userId });

    const completedQuizzes = await Quiz.countDocuments({
      userId,
      completedAt: { $ne: null },
    });

    //
    // FLASHCARD STATS
    // 
    const flashcards = await FlashCard.find({ userId });

    let totalFlashcards = 0;
    let totalReviewedFlashcards = 0;
    let starredFlashcards = 0;

    flashcards.forEach((set) => {
      const cards = set.cards || [];

      totalFlashcards += cards.length;

      totalReviewedFlashcards += cards.filter(
        (c) => c?.reviewCount > 0
      ).length;

      starredFlashcards += cards.filter(
        (c) => c?.isStarred === true
      ).length;
    });

    // =========================
    // 🧠 QUIZ STATS
    // =========================
    const quizzes = await Quiz.find({
      userId,
      completedAt: { $ne: null },
    });

    const totalScore = quizzes.reduce(
      (sum, q) => sum + (q.score || 0),
      0
    );

    const averageScore =
      quizzes.length > 0
        ? Math.round(totalScore / quizzes.length)
        : 0;

    // =========================
    // 📚 RECENT DOCUMENTS
    // =========================
    const recentDocuments = await Document.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(5)
      .select("title fileName lastAccessed status");

    // =========================
    // 🧠 RECENT QUIZZES
    // =========================
    const recentQuizzes = await Quiz.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("documentId", "title")
      .select("title score totalQuestions createdAt completedAt");

    // =========================
    // 🔥 STUDY STREAK (TEMP MOCK)
    // =========================
    const studyStreak = Math.floor(Math.random() * 7) + 1;

    // =========================
    // 🚀 RESPONSE
    // =========================
    res.status(200).json({
      success: true,
      data: {
        totalDocuments,
        totalFlashcardSets,
        totalFlashcards,
        totalReviewedFlashcards,
        starredFlashcards,

        totalQuizzes,
        completedQuizzes,
        averageScore,
        studyStreak,
      },
      recentActivity: {
        documents: recentDocuments,
        quizzes: recentQuizzes,
      },
    });
  } catch (error) {
    next(error);
  }
};