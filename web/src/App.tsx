import { HomePageContent } from './app/(home)/content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPageContent } from './app/chat/content';
import LoginPage from './app/login';
import ProtectedRoute from './protected_route';
import ParentsPage from './app/parents/page';
import StudentsPage from './app/students/page';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatPageContent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute isAdmin>
                            <HomePageContent />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/parents"
                    element={
                        <ProtectedRoute isAdmin>
                            <ParentsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/parents/:id"
                    element={
                        <ProtectedRoute isAdmin>
                            <StudentsPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
