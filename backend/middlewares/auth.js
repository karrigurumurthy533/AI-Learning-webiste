import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔐 Protect routes
export const protect = async (req, res, next) => {
    let token;

    // Check for Authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Extract token
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from DB (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not authorized, user not found',
                    statusCode: 401
                });
            }

            // Continue to next middleware/controller
            return next();

        } catch (error) {
            console.error('Auth middleware error:', error.message);

            // Token expired
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    success: false,
                    error: 'Token has expired',
                    statusCode: 401
                });
            }

            // Invalid token
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed',
                statusCode: 401
            });
        }
    }

    //  No token provided
    return res.status(401).json({
        success: false,
        message: 'Not authorized, no token',
        statusCode: 401
    });
};