
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { GlobalSettings, Difficulty, Theme, Project } from './types';
import { getSettings, saveSettings, getProjects, saveProjects, initStorage } from './storage/localData';
import Home from './pages/Home';
import Studio from './pages/Studio';
import ProjectsList from './pages/ProjectsList';
import Settings from './pages/Settings';

interface AppContextType {
  settings: GlobalSettings;
  updateSettings: (s: GlobalSettings) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

const App: React.FC = () => {
  const [settings, setSettings] = useState<GlobalSettings>(getSettings());
  const [projects, setProjects] = useState<Project[]>(getProjects());

  useEffect(() => {
    initStorage();
  }, []);

  const updateSettings = (newSettings: GlobalSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const lastProjectId = projects.length > 0 ? projects[0].id : null;

  return (
    <AppContext.Provider value={{ settings, updateSettings, projects, setProjects }}>
      <Router>
        <div className={`min-h-screen flex flex-col transition-colors duration-300 ${settings.theme === Theme.DARK ? 'bg-slate-900 text-white' : 'bg-[#fcfcfc] text-slate-900'}`}>
          <nav className="no-print h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <span className="font-serif text-xl italic font-bold">Story Symphony</span>
            </Link>
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link to={lastProjectId ? `/studio/${lastProjectId}` : "/studio"} className="hover:text-blue-600 transition-colors">Studio</Link>
              <Link to="/projects" className="hover:text-blue-600 transition-colors">Projects</Link>
              <Link to="/settings" className="hover:text-blue-600 transition-colors">Settings</Link>
            </div>
          </nav>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/studio/:id" element={<Studio />} />
              <Route path="/projects" element={<ProjectsList />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<div className="p-20 text-center">Page not found</div>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppContext.Provider>
  );
};

export default App;
