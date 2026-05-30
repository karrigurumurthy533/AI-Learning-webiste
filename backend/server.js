import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js'; // ✅ fixed
import express from 'express';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import errorHandler from './middlewares/errorHandler.js'; // ✅ fixed


import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'
import flashcardRoutes from './routes/flashcardRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import progressRoutes from './routes/progressRoutes.js'



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// DB connect
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes (add later)
app.use('/api/auth',authRoutes)
app.use('/api/documents',documentRoutes)
app.use('/api/flashcards',flashcardRoutes)
app.use('/api/ai',aiRoutes)
app.use('/api/quizzes',quizRoutes)
app.use('/api/progress',progressRoutes)





// Error handler
app.use(errorHandler);

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route Not Found"
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Fix this also
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  process.exit(1); // ✅ correct
});