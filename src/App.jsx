import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Modules from './pages/Modules';
import Simulations from './pages/Simulations';
import SimulationAnalytics from './pages/SimulationAnalytics';
import Portfolio from './pages/Portfolio';
import Reflections from './pages/Reflections';
import ReflectionDetail from './pages/ReflectionDetail';
import Trajectories from './pages/Trajectories';
import Facilitators from './pages/Facilitators';
import Monitoring from './pages/Monitoring';
import SBCM from './pages/SBCM';
import StudentClassroom from './pages/StudentClassroom';
import Login from './pages/Login';

import { LanguageProvider } from './components/shared/LanguageContext';
import { AuthProvider, useAuth } from './lib/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

function AppContent() {
    const { isAuthenticated, isLoadingAuth } = useAuth();

    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />
                        <Route path="students" element={<Students />} />
                        <Route path="modules" element={<Modules />} />
                        <Route path="simulations" element={<Simulations />} />
                        <Route path="simulations/analytics" element={<SimulationAnalytics />} />
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="reflections" element={<Reflections />} />
                        <Route path="reflections/:id" element={<ReflectionDetail />} />
                        <Route path="trajectories" element={<Trajectories />} />
                        <Route path="facilitators" element={<Facilitators />} />
                        <Route path="monitoring" element={<Monitoring />} />
                        <Route path="sbcm" element={<SBCM />} />
                        <Route path="student/classroom" element={<StudentClassroom />} />
                    </Route>
                </Routes>
            </Router>
        </LanguageProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
