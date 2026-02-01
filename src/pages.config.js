/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import Dashboard from './pages/Dashboard';
import Facilitators from './pages/Facilitators';
import Modules from './pages/Modules';
import Monitoring from './pages/Monitoring';
import Portfolio from './pages/Portfolio';
import Reflections from './pages/Reflections';
import SBCM from './pages/SBCM';
import Simulations from './pages/Simulations';
import Students from './pages/Students';
import Trajectories from './pages/Trajectories';
import ContentGenerator from './pages/ContentGenerator';
import SimulationAnalytics from './pages/SimulationAnalytics';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Facilitators": Facilitators,
    "Modules": Modules,
    "Monitoring": Monitoring,
    "Portfolio": Portfolio,
    "Reflections": Reflections,
    "SBCM": SBCM,
    "Simulations": Simulations,
    "Students": Students,
    "Trajectories": Trajectories,
    "ContentGenerator": ContentGenerator,
    "SimulationAnalytics": SimulationAnalytics,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};