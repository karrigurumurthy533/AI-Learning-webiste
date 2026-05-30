import express from "express";
import upload from "../config/multer.js";
import { protect } from "../middlewares/auth.js";
import {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
} from "../controllers/documentController.js";

const router = express.Router();

router.use(protect);

router.post("/uploads", upload.single("file"), uploadDocument);
router.get("/", getDocuments);
router.get("/:id", getDocument);
router.delete("/:id", deleteDocument);


export default router;