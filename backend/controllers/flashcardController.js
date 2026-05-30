import Flashcard from "../models/FlashCard.js";




//@desc    Get flashcards of a specific set
//@route   GET /api/flashcards/:id
//@access  Private

export const getFlashcards = async (req, res, next) => {
    try {
        const flashcards = await Flashcard.find({
            userId: req.user._id,
            documentId: req.params.documentId

        })
            .populate("documentId", "title fileName")
            .sort({ createdAt: -1 });

        if (!flashcards) {
            return res.status(404).json({
                success: false,
                message: "Flashcard set not found"
            });
        }


        res.status(200).json({
            success: true,
            count: flashcards.length,
            data: flashcards
        });

    } catch (error) {
        next(error);
    }
};


//@desc    Get all flashcard sets for logged-in user
//@route   GET /api/flashcards
//@access  Private

export const getAllFlashcardSets = async (req, res, next) => {
    try {
        const flashcardSets = await Flashcard.find({ userId: req.user._id })
            .populate("documentId", "title fileName")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: flashcardSets.length,
            data: flashcardSets
        });
    } catch (error) {
        next(error);
    }
};



//@desc    Review a flashcard (update stats)
//@route   PUT /api/flashcards/review/:setId/:cardId
//@access  Private

export const reviewFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        })
        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: "Flashcard set not found",
                statusCode: 404
            });
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Card Not found in set",
                statusCode: 404
            });
        }
        //update review Info
        flashcardSet.cards[cardIndex].lastReviewed = new Date();
        flashcardSet.cards[cardIndex].reviewCount += 1;
        await flashcardSet.save();

        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: "Flashcard reviewed SuccessFully",

        });
    } catch (error) {
        next(error);
    }
};

//@desc    Toggle star/favorite flashcard
//@route   PATCH /api/flashcards/star/:setId/:cardId
// @access  Private

export const toggleStarFlashcard = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            'cards._id': req.params.cardId,
            userId: req.user._id
        })

        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: "Flashcard set not found",
                statusCode: 404
            });
        }
        const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Card Not found in set",
                statusCode: 404
            });
        }
        //toggle star
        flashcardSet.cards[cardIndex].isStarred = !flashcardSet.cards[cardIndex].isStarred;
        await flashcardSet.save();


        res.status(200).json({
            success: true,
            data: flashcardSet,
            message: `Flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'Stared' : 'unStared'}`,

        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete flashcard set
// @route   DELETE /api/flashcards/:id
//@access  Private

export const deleteFlashcardSet = async (req, res, next) => {
    try {
        const flashcardSet = await Flashcard.findOne({
            _id: req.params.id,
            userId: req.user._id
        })


        if (!flashcardSet) {
            return res.status(404).json({
                success: false,
                message: "Flashcard set not found",
                statusCode: 404
            });
        }

        await flashcardSet.deleteOne();

        res.status(200).json({
            success: true,
            message: "Flashcard set deleted successfully"
        });

    } catch (error) {
        next(error);
    }
};