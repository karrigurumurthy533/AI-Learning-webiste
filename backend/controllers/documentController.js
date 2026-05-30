import Document from "../models/Document.js";
import { extractTextFromPDF } from '../utils/pdfParser.js';
import { chunkText } from '../utils/textChunker.js';
import fs from 'fs/promises';
import mongoose from 'mongoose';
import FlashCard from '../models/FlashCard.js';
import Quiz from '../models/Quiz.js'
//@desc  Upload PDF document
//@route POST /api/document/upload
//@access Private
export const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({
      success: false,
      error: "please upload a PDF file",
      statusCode: 400
    });
    const { title } = req.body;
    if (!title) {
      //delete upload file if no title provided
      await fs.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        error: "please upload a PDF file",
        statusCode: 400
      });

    }
    //construct url for the uploaded file
    const baseUrl = `http://localhost:${process.env.PORT || 8000}`;
    const fileUrl = `${baseUrl}/uploads/documents/${req.file.filename}`;
    //create document record
    const document = await Document.create({
      userId: req.user._id,
      title,
      fileName: req.file.originalname,
      filePath: fileUrl, //store the URL instead of  the local path
      fileSize: req.file.size,
      status: 'processing'
    });
    //Process Pdf in background in production ,use a queue like bull)
    processPDF(document._id, req.file.path).catch(err => {
      console.error('Pdf processing error :', err);
    });

    res.status(201).json({
      success: true,
      data: {
        data: document,
        message: 'document uploaded successFully processing in progress'
      }
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => { });
    }
    next(error);
  }
};

//helper function to process pdf 
const processPDF = async (documentId, filePath) => {
  try {
    const { text } = await extractTextFromPDF(filePath);

    //Create chunks
    const chunks = chunkText(text, 500, 50);

    //upload document 
    await Document.findByIdAndUpdate(documentId, {
      extractedText: text,
      chunks: chunks,
      status: 'ready'
    });
    console.log(`document ${documentId} processed successFully`);

  } catch (error) {
    console.error(`Error processing document ${documentId}`, error);
    await Document.findByIdAndUpdate(documentId, {
      status: 'failed'
    });

  }
}

//@desc  Get all documents
//@route GET /api/document
//@access Private
export const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(req.user._id)
        }
      },
      {
        $lookup: {
          from: "flashcards",
          localField: "_id",
          foreignField: "documentId",
          as: "flashcardSets"
        }
      },
      {
        $lookup: {
          from: "quizzes",
          localField: "_id",
          foreignField: "documentId",
          as: "quizzes"
        }
      },
      {
        $addFields: {
          flashcardCount: { $size: "$flashcardSets" },
          quizCount: { $size: "$quizzes" }
        }
      },
      {
        $project: {
          extractedText: 0,
          chunks: 0,
          flashcardSets: 0,
          quizzes: 0
        }
      },
      {
        $sort: {
          uploadDate: -1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      count: documents.length,
      data: documents
    });

  } catch (err) {
    next(err); // better error handling
  }
};

//@desc  Get single document
//@route GET /api/document/:id
//@access Private
export const getDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document is not found",
        statusCode: 404
      });
    }
    //Get counts of Associated flashcards and Quizzes
    const flashcardCount = await FlashCard.countDocuments({ documentId: document._id, userId: req.user._id });
    const quizCount = await Quiz.countDocuments({ documentId: document._id, userId: req.user._id })
    //update last accessed
    const documentData = document.toObject();
    documentData.flashcardCount = flashcardCount;
    documentData.quizCount = quizCount;



    res.status(200).json({
      success: true,
      data: documentData,
      message: "Getting single document",
      statusCode: 200

    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//@desc  Delete document
//@route DELETE /api/document/:id
//@access Private
export const deleteDocument = async (req, res,next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document is not found",
        statusCode: 404
      });
    }

    //delete file from filesystem
    await fs.unlink(document.flashPath).catch(() => { })

    //Delete document
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: " Document Deleted successfully",
      statusCode:200
    });

  } catch (error) {
    next(error);
  }
};