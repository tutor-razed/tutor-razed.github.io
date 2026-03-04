
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Card, Button, StatChip } from '../components/UI';
import { Project, Difficulty, LayoutMode, VisualStyle } from '../types';
import { generateId } from '../utils/random';

const ProjectsList: React.FC = () => {
  const { projects, setProjects, settings } = useApp();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleNewProject = () => {
    const newId = generateId();
    const newP: Project = {
      id: newId,
      title: 'Untitled Symphony',
      text: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      difficulty: settings.defaultDifficulty,
      layoutMode: LayoutMode.LINEAR,
      visualStyle: VisualStyle.PAINT,
      promptId: 'free',
      constraints: []
    };
    setProjects([newP, ...projects]);
    navigate(`/studio/${newId}`);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this symphony?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleDuplicate = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    const dupe: Project = {
      ...p,
      id: generateId(),
      title: `${p.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setProjects([dupe, ...projects]);
  };

  const filtered = projects.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const exportAll = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my_story_symphonies.json';
    a.click();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-serif italic font-bold">Your Library</h1>
          <p className="text-slate-500">{projects.length} symphonies saved</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportAll} variant="outline">Export All</Button>
          <Button onClick={handleNewProject}>New Symphony</Button>
        </div>
      </div>

      <div className="mb-8">
        <input 
          type="text" 
          placeholder="Search by title..."
          className="w-full max-w-md bg-white border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <Card key={p.id} className="cursor-pointer hover:border-blue-400 transition-all group" onClick={() => navigate(`/studio/${p.id}`)}>
            <div className="flex justify-between items-start mb-4">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${p.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : p.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                {p.difficulty}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => handleDuplicate(p, e)} title="Duplicate" className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-blue-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg></button>
                <button onClick={(e) => handleDelete(p.id, e)} title="Delete" className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
              </div>
            </div>
            <h2 className="text-xl font-bold mb-1 truncate">{p.title}</h2>
            <p className="text-slate-400 text-xs mb-6">Last edited: {new Date(p.updatedAt).toLocaleDateString()}</p>
            
            <div className="flex gap-3">
              <StatChip label="Words" value={p.analysisCache?.summary.wordCount || 0} />
              <StatChip label="Style" value={(p.visualStyle || 'Paint').toUpperCase()} />
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">No symphonies found. Start a new one!</p>
          <Button onClick={handleNewProject} className="mt-4">New Project</Button>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
