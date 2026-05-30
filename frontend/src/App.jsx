import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import NotFoundPage from './pages/Quizzes/NotFoundPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import DocumentDetailPage from './pages/Documents/DocumentDetailPage';
import DocumentListPage from './pages/Documents/DocumentListPage';
import ProfilePage from './pages/Profile/ProfilePage';
import QuizTakePage from './pages/Quizzes/QuizTakePage';
import QuizResultPage from './pages/Quizzes/QuizResultPage';

//Add these imports
import ProtectedRoute from './components/auth/ProtectedRoute';

import FlashcardsListPage from './pages/Flashcards/FlashcardsListPage';
import { useAuth } from './context/authContext';
import DocumentViewer from './components/documents/DocumentViewer';
import ChatInterface from './components/chat/ChatInterFace';
import AIActionsInterface from './components/AIActions/AIactionsInterface';
import QuizInterface from './components/quizzes/QuizInterface';
import FlashcardInterface from './components/flashcards/FlashcardInterface';


const App = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    return (

        <Routes>

            <Route
                path="/"
                element={
                    isAuthenticated
                        ? <Navigate to="/dashboard" replace />
                        : <Navigate to="/login" replace />
                }
            />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/documents" element={<DocumentListPage />} />
                <Route path="/documents/:id" element={<DocumentDetailPage />}>
                    <Route index element={<DocumentViewer />} />
                    <Route path="chat" element={<ChatInterface />} />
                    <Route path="actions" element={<AIActionsInterface />} />
                    <Route path="flashcards" element={<FlashcardInterface />} />
                    <Route path="quizzes" element={<QuizInterface />} />
                </Route>
             
                <Route path="/documents/:id" element={<FlashcardsListPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/quizzes/:quizId" element={<QuizTakePage />} />
                <Route path="/quizzes/:quizId/results" element={<QuizResultPage />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
};

export default App;