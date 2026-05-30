import express from "express";
import { body } from "express-validator";
import {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
} from "../controllers/authenticationController.js";
import {protect} from "../middlewares/auth.js";

const router = express.Router();

// Validation
const registerValidation = [
    body("username")
        .trim()
        .isLength({ min: 3 })
        .notEmpty()
        .withMessage("userName is required"),
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email required"),
    body("password")
        .isLength({ min: 6 })
        .withMessage("Min 6 chars"),
];

const loginValidation = [
    body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email required"),
    body("password")
        .notEmpty()
        .withMessage("Password required"),
];

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);


//protected Routes
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
router.post("/change-password", protect, changePassword);

export default router;