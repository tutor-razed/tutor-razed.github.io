
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../App';
import { Button, Card } from '../components/UI';
import { PROMPTS } from '../data/lexicons';
import { Project, Difficulty, LayoutMode } from '../types';
import { generateId } from '../utils/random';

const Home: React.FC = () => {
  const { projects, setProjects, settings } = useApp();
  const navigate = useNavigate();

  const handleStartNew = () => {
    navigate('/studio');
  };

  const handleRandomPrompt = () => {
    const randomPrompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const newProject: Project = {
      id: generateId(),
      title: 'Untitled Symphony',
      text: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      difficulty: settings.defaultDifficulty,
      layoutMode: LayoutMode.LINEAR,
      promptId: randomPrompt.id,
      constraints: []
    };
    setProjects([newProject, ...projects]);
    navigate(`/studio/${newProject.id}`);
  };

  const lastProject = projects.length > 0 ? projects[0] : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-serif italic font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-700 to-purple-800">Turn your words into waves.</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Story Symphony transforms your prose into a unique generative masterpiece. Watch as your rhythm, mood, and complexity paint a living canvas.
        </p>
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button onClick={handleStartNew} className="px-10 py-5 text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all">
            Start Writing
          </Button>
          <Button onClick={handleRandomPrompt} variant="outline" className="px-10 py-5 text-xl rounded-2xl">
            Random Prompt
          </Button>
          {lastProject && (
            <Button onClick={() => navigate(`/studio/${lastProject.id}`)} variant="secondary" className="px-10 py-5 text-xl rounded-2xl">
              Resume: {lastProject.title}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        <FeatureTile 
          title="Linguistic Painting" 
          description="Nouns create substance, verbs add motion, and adjectives breathe color. Your grammar dictates the artistic anatomy."
          icon={<svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
        />
        <FeatureTile 
          title="The Finale" 
          description="Playback your story's evolution in a cinematic animated sequence that maps the emotional arc of your journey."
          icon={<svg className="w-10 h-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <FeatureTile 
          title="Printable Legacy" 
          description="Export high-resolution posters of your visual symphony. Every story has a face; every paragraph has a pattern."
          icon={<svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>}
        />
      </div>
    </div>
  );
};

const FeatureTile: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
  </Card>
);

export default Home;
