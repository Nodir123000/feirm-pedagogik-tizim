import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Modules from './pages/Modules';
import Simulations from './pages/Simulations';
import SimulationAnalytics from './pages/SimulationAnalytics';
import Portfolio from './pages/Portfolio';
import Reflections from './pages/Reflections';
import Trajectories from './pages/Trajectories';
import Facilitators from './pages/Facilitators';
import Monitoring from './pages/Monitoring';
import SBCM from './pages/SBCM';
import ContentGenerator from './pages/ContentGenerator';

import { LanguageProvider } from './components/shared/LanguageContext';

function App() {
    return (
        <LanguageProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="students" element={<Students />} />
                        <Route path="modules" element={<Modules />} />
                        <Route path="simulations" element={<Simulations />} />
                        <Route path="simulations/analytics" element={<SimulationAnalytics />} />
                        <Route path="portfolio" element={<Portfolio />} />
                        <Route path="reflections" element={<Reflections />} />
                        <Route path="trajectories" element={<Trajectories />} />
                        <Route path="facilitators" element={<Facilitators />} />
                        <Route path="monitoring" element={<Monitoring />} />
                        <Route path="sbcm" element={<SBCM />} />
                        <Route path="content-generator" element={<ContentGenerator />} />
                    </Route>
                </Routes>
            </Router>
        </LanguageProvider>
    );
}

export default App;
