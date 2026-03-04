
import React, { useState } from 'react';
import { useApp } from '../App';
import { Card, Select, Button } from '../components/UI';
import { Difficulty, Theme, MoodCategory } from '../types';

const Settings: React.FC = () => {
  const { settings, updateSettings, setProjects } = useApp();
  const [activeTab, setActiveTab] = useState<'preferences' | 'lexicon'>('preferences');

  const handleClearAll = () => {
    if (confirm('DANGER: This will delete ALL your stories permanently. This action cannot be undone. Continue?')) {
      setProjects([]);
      localStorage.clear();
      window.location.href = '/';
    }
  };

  const updateLexicon = (type: 'mood' | 'sensory', key: string, value: string) => {
    const words = value.split(',').map(w => w.trim()).filter(w => w !== '');
    const newLexicon = { ...settings.customLexicon };
    if (type === 'mood') {
      newLexicon.mood = { ...newLexicon.mood, [key]: words };
    } else {
      newLexicon.sensory = { ...newLexicon.sensory, [key]: words };
    }
    updateSettings({ ...settings, customLexicon: newLexicon });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-4xl font-serif italic font-bold">Settings</h1>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preferences' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Preferences
          </button>
          <button 
            onClick={() => setActiveTab('lexicon')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'lexicon' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Lexicon Manager
          </button>
        </div>
      </div>
      
      <div className="space-y-6">
        {activeTab === 'preferences' ? (
          <>
            <Card>
              <h2 className="text-xl font-bold mb-6">Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select 
                  label="Default Difficulty"
                  value={settings.defaultDifficulty}
                  onChange={(v) => updateSettings({ ...settings, defaultDifficulty: v as Difficulty })}
                  options={[
                    { value: Difficulty.BEGINNER, label: 'Beginner' },
                    { value: Difficulty.INTERMEDIATE, label: 'Intermediate' },
                    { value: Difficulty.ADVANCED, label: 'Advanced' }
                  ]}
                />
                <Select 
                  label="Appearance"
                  value={settings.theme}
                  onChange={(v) => updateSettings({ ...settings, theme: v as Theme })}
                  options={[
                    { value: Theme.LIGHT, label: 'Light' },
                    { value: Theme.DARK, label: 'Dark' }
                  ]}
                />
              </div>
              <div className="mt-8 flex flex-col gap-4">
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={settings.reduceMotion} 
                      onChange={(e) => updateSettings({ ...settings, reduceMotion: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold group-hover:text-blue-600 transition-colors">Reduce Motion</div>
                      <div className="text-sm text-slate-500">Simplify animations for comfort.</div>
                    </div>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={settings.focusModeDefault} 
                      onChange={(e) => updateSettings({ ...settings, focusModeDefault: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-bold group-hover:text-blue-600 transition-colors">Auto Focus Mode</div>
                      <div className="text-sm text-slate-500">Start new projects in Focus Mode.</div>
                    </div>
                 </label>
              </div>
            </Card>

            <Card className="border-red-100 bg-red-50/20">
              <h2 className="text-xl font-bold mb-2 text-red-600">Danger Zone</h2>
              <p className="text-sm text-red-500 mb-6">These actions cannot be undone.</p>
              <Button onClick={handleClearAll} variant="danger" className="w-full sm:w-auto">
                Delete All Data
              </Button>
            </Card>
          </>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <strong>Tip:</strong> Add custom words to influence how the symphony visualizes your story. Separate multiple words with commas. These words will be added to the built-in phrase banks.
            </div>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Emotional Keywords
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(MoodCategory).filter(m => m !== MoodCategory.NEUTRAL).map(category => (
                  <Card key={category} className="p-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{category}</label>
                    <textarea 
                      placeholder="joyful, victory, bright..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      value={settings.customLexicon.mood[category]?.join(', ') || ''}
                      onChange={(e) => updateLexicon('mood', category, e.target.value)}
                    />
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                Sensory Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['sight', 'sound', 'smell', 'taste', 'touch'].map(type => (
                  <Card key={type} className="p-4">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">{type}</label>
                    <textarea 
                      placeholder="shimmer, resonate, aroma..."
                      className="w-full h-24 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                      value={settings.customLexicon.sensory[type]?.join(', ') || ''}
                      onChange={(e) => updateLexicon('sensory', type, e.target.value)}
                    />
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
