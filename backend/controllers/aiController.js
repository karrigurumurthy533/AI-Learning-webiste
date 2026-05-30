import Document from "../models/Document.js";
import FlashCard from "../models/FlashCard.js";
import Quiz from "../models/Quiz.js";
import ChatHistory from "../models/ChatHistory.js"

import * as aiService from "../utils/geminiService.js";
import { findRelevantChunks } from '../utils/textChunker.js';


// @desc    Generate flashcards from text
// @route   POST /api/ai/flashcards
// @access  Public
export const generateFlashcards = async (req, res, next) => {
  try {
    const { documentId, count = 10 } = req.body;

    // ✅ Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400
      });
    }

    // ✅ Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404
      });
    }

    // ✅ Generate flashcards using OPENROUTER (NOT GEMINI)
    const cards = await aiService.generateFlashcards(
      document.extractedText,
      parseInt(count, 10)
    );

    // ✅ Save to DB
    const flashcardSet = await FlashCard.create({
      userId: req.user._id,
      documentId: document._id,
      cards: cards.map(card => ({
        question: card.question,
        answer: card.answer,
        difficulty: card.difficulty || "medium",
        reviewCount: 0,
        isStarred: false
      }))
    });

    // ✅ Response
    return res.status(200).json({
      success: true,
      message: "Flashcards generated successfully",
      data: flashcardSet,
      statusCode: 200
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Generate summary from text
// @route   POST /api/ai/summary
// @access  Public
; export const generatedSummary = async (req, res, next) => {
  try {
    const { documentId } = req.body;

    // ✅ Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
        statusCode: 400
      });
    }

    // ✅ Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
        statusCode: 404
      });
    }

    // ✅ Generate Summary
    const summary = await aiService.generateSummary(
      document.extractedText,
    );
    // ✅ Response
    return res.status(200).json({
      success: true,
      summary,
      message: "Summary generated successfully",
      title: document.title,
      statusCode: 200
    });


  } catch (error) {
    next(error);
  }
};

// @desc    Generate quiz (MCQs)
// @route   POST /api/ai/quiz
// @access  Public
export const generatedQuiz = async (req, res, next) => {
  try {
    const { documentId, numOfQuestions = 5, title } = req.body;

    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId",
      });
    }

    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready",
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
      });
    }

    const questions = await aiService.generateQuiz(
      document.extractedText,
      parseInt(numOfQuestions)
    );

    if (!questions.length) {
      return res.status(500).json({
        success: false,
        error: "Failed to generate quiz questions",
      });
    }

    const quiz = await Quiz.create({
      userId: req.user._id,
      documentId: document._id,
      title: title || `${document.title}-Quiz`,
      questions,
      totalQuestions: questions.length,
      userAnswers: [],
      score: 0,
    });

    res.status(200).json({
      success: true,
      data: quiz,
      message: "QUIZ Generated Successfully",
    });
  } catch (error) {
    console.error("Quiz Controller Error:", error);
    next(error);
  }
};
// @desc    Chat with AI
// @route   POST /api/ai/chat
// @access  Public


export const chat = async (req, res, next) => {
  try {
    const { documentId, question } = req.body;

    // Validate input
    if (!documentId || !question) {
      return res.status(400).json({
        success: false,
        error: "Please provide documentId and question",
      });
    }

    // Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        error: "Document not found or not ready",
      });
    }
    let relevantChunks = findRelevantChunks(document.chunks, question, 3);
    // Get relevant chunks
    // 🔥 fallback if nothing found
    if (!relevantChunks || relevantChunks.length === 0) {
      relevantChunks = document.chunks.slice(0, 3).map((chunk, index) => ({
        content: chunk.content || chunk,
        chunkIndex: index
      }));
    }

    const chunkIndices = relevantChunks.map(c => c.chunkIndex);

    // Get or create chat history
    let chatHistory = await ChatHistory.findOne({
      documentId: documentId,
      userId: req.user._id
    });

    if (!chatHistory) {
      chatHistory = await ChatHistory.create({
        documentId: documentId,
        userId: req.user._id,
        messages: []
      });
    }

    // Generate AI response
    const answer = await aiService.chatWithContext(question, relevantChunks);

    // Save conversation
    chatHistory.messages.push(
      {
        role: "user",
        content: question,
        timestamp: new Date(),
        relevantChunks: []
      },
      {
        role: "assistant",
        content: answer,
        timestamp: new Date(),
        relevantChunks: chunkIndices
      }
    );

    await chatHistory.save();

    // Response
    res.status(200).json({
      success: true,
      data: {
        question,
        answer,
        relevantChunks: chunkIndices,
        chatHistoryId: chatHistory._id
      },
      message: "Response Generated Successfully"
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Explain a concept
// @route   POST /api/ai/explain
// @access  Public

export const explainConcept = async (req, res, next) => {
  try {
    const { documentId, concept } = req.body;

    // ✅ Validate input
    if (!documentId || !concept) {
      return res.status(400).json({
        success: false,
        message: "documentId and concept are required"
      });
    }

    // ✅ Find document
    const document = await Document.findOne({
      _id: documentId,
      userId: req.user._id,
      status: "ready"
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found or not ready"
      });
    }

    // ✅ Get relevant chunks (with fallback)
    let relevantChunks = findRelevantChunks(document.chunks, concept, 3);

    if (!relevantChunks || relevantChunks.length === 0) {
      relevantChunks = document.chunks.slice(0, 3).map((chunk, index) => ({
        content: chunk.content || chunk,
        chunkIndex: index
      }));
    }

    const context = relevantChunks.map(c => c.content).join('\n\n');

    // ✅ Generate explanation using AI
    const explanation = await aiService.explainConcept(concept, context);



    // ✅ Response
    res.status(200).json({
      success: true,
      data: {
        concept,
        explanation,
        relevantChunks: relevantChunks.map(c => c.chunkIndex),
      },
      message: "Explanation generated successfully"
    });

  } catch (error) {
    next(error);
  }
};
// @desc    Get user chat history
// @route   GET /api/ai/history/:userId
// @access  Public


export const getChatHistory = async (req, res, next) => {
  try {
    const { documentId } = req.params;
    // ✅ Validate input
    if (!documentId) {
      return res.status(400).json({
        success: false,
        error: "please provide documentId",
        statusCode: 400
      });
    }


    const chatHistory = await ChatHistory.findOne({
      userId: req.user._id,
      documentId: documentId,
    }).select('messages')

    if (!chatHistory) {
      res.status(200).json({
        success: true,
        data:[],
        message:"No chat history Founded for this document"
      });

    }

    res.status(200).json({
      success: true,
      data:chatHistory.messages,
      message:"chat History retrieved SuccessFully"
    });

  } catch (error) {
    next(error);
  }
};