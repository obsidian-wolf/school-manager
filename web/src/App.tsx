import { HomePageContent } from './app/(home)/content';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChatPageContent } from './app/chat/content';
import LoginPage from './app/login';
import ProtectedRoute from './protected_route';

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
                            <Routes>
                                <Route path="/" element={<HomePageContent />} />
                            </Routes>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
