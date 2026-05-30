import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  generateFlashcards,
  generatedQuiz,
  generatedSummary,
  chat,
  explainConcept,
  getChatHistory

} from "../controllers/aiController.js";

const router = express.Router();

router.use(protect);

router.post("/generate-flashcards", generateFlashcards);
router.post("/generate-quiz", generatedQuiz);
router.post("/generate-summary",generatedSummary );
router.post("/chat",chat );
router.post("/explain-concept", explainConcept);
router.post("/chat-history/:documentId", getChatHistory);
export default router;