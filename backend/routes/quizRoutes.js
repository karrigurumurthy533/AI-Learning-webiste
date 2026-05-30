import express from "express";
import {
  getQuizzes,
  getQuizById,
  submitQuiz,
  getQuizResults,
  deleteQuiz
} from "../controllers/quizController.js";

import { protect } from "../middlewares/auth.js";

const router = express.Router();


router.get("/:documentId", protect, getQuizzes);
router.get("/quiz/:id", protect,getQuizById );
router.get("/:id/results", protect, getQuizResults);
router.post("/:id/submit", protect,submitQuiz );
router.delete("/:id", protect, deleteQuiz);

export default router;