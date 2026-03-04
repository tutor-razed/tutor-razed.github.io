
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GradeLevel, 
  Tone, 
  Improbability, 
  Article, 
  Template, 
  WordBank 
} from '../types';
import { 
  TEMPLATES, 
  WORD_BANKS, 
  CONSTRAINTS, 
  SECTIONS 
} from '../constants';
import { 
  generateHeadline, 
  generateSubheadline, 
  autoPickSection, 
  getRandomItem,
  getRemixPrompt
} from '../lib/generator';
import { saveArticle, saveDraft, getDraft, clearDraft } from '../lib/storage';

const WriterPage: React.FC = () => {
  const navigate = useNavigate();
  const existingDraft = getDraft() || {};

  // Settings
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>(existingDraft.gradeLevel || 'middle');
  const [tone, setTone] = useState<Tone>(existingDraft.tone || 'serious');
  const [improbability, setImprobability] = useState<Improbability>(existingDraft.improbability || 'unusual');
  const [constraintsEnabled, setConstraintsEnabled] = useState(true);

  // MadLib State
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(() => {
    return TEMPLATES.find(t => t.id === existingDraft.selectedTemplateId) || TEMPLATES[0];
  });
  const [words, setWords] = useState(existingDraft.words || {
    adj: '',
    subject: '',
    verb: '',
    obj: '',
    location: ''
  });

  // Generated Fields
  const [headline, setHeadline] = useState(existingDraft.headline || '');
  const [subheadline, setSubheadline] = useState(existingDraft.subheadline || '');
  const [section, setSection] = useState(existingDraft.section || 'Local');
  const [author, setAuthor] = useState(existingDraft.author || '');
  const [remixHint, setRemixHint] = useState('');

  // Story Body
  const [body, setBody] = useState(existingDraft.body || '');
  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;
  
  const minWords = gradeLevel === 'elementary' ? 60 : gradeLevel === 'middle' ? 150 : 300;

  // Derive visible bank (subset of 10) whenever gradeLevel or improbability changes
  const visibleWords = useMemo(() => {
    const bank = WORD_BANKS[gradeLevel][improbability];
    const shuffleAndSlice = (arr: string[]) => [...arr].sort(() => 0.5 - Math.random()).slice(0, 10);
    
    return {
      adjectives: shuffleAndSlice(bank.adjectives),
      subjects: shuffleAndSlice(bank.subjects),
      verbs: shuffleAndSlice(bank.verbs),
      objects: shuffleAndSlice(bank.objects),
      locations: shuffleAndSlice(bank.locations)
    };
  }, [gradeLevel, improbability]);

  // Hover state for tooltip
  const [showTooltip, setShowTooltip] = useState(false);

  // Map internal slot keys to WordBank property keys
  const slotToBankKey: Record<string, keyof WordBank> = {
    adj: 'adjectives',
    subject: 'subjects',
    verb: 'verbs',
    obj: 'objects',
    location: 'locations'
  };

  // Validation logic
  const validation = {
    hasHeadline: !!headline,
    hasAuthor: !!author.trim(),
    hasMinWords: wordCount >= minWords,
    hasBody: body.trim().length > 0
  };

  const isFormComplete = validation.hasHeadline && 
                       validation.hasAuthor && 
                       validation.hasMinWords && 
                       validation.hasBody;

  // Save draft on every change
  useEffect(() => {
    saveDraft({
      gradeLevel,
      tone,
      improbability,
      headline,
      subheadline,
      section,
      author,
      body,
      words,
      selectedTemplateId: selectedTemplate.id
    });
  }, [gradeLevel, tone, improbability, headline, subheadline, section, author, body, words, selectedTemplate]);

  // Helpers
  const randomizeWords = () => {
    setWords({
      adj: getRandomItem(visibleWords.adjectives),
      subject: getRandomItem(visibleWords.subjects),
      verb: getRandomItem(visibleWords.verbs),
      obj: getRandomItem(visibleWords.objects),
      location: getRandomItem(visibleWords.locations)
    });
  };

  const handleGenerate = () => {
    if (!words.adj || !words.subject || !words.verb || !words.obj || !words.location) {
      alert("Please fill in all the slots first!");
      return;
    }
    const h = generateHeadline(selectedTemplate, words);
    const sh = generateSubheadline(h, tone);
    const s = autoPickSection(h, tone);
    setHeadline(h);
    setSubheadline(sh);
    setSection(s);
  };

  const handleRemix = () => {
    setRemixHint(getRemixPrompt(tone));
  };

  const handleReset = () => {
    if (confirm("Clear all writing and reset the workshop?")) {
      clearDraft();
      window.location.reload();
    }
  };

  const handlePublish = () => {
    if (!isFormComplete) return;

    const newArticle: Article = {
      id: Math.random().toString(36).substr(2, 9),
      headline,
      subheadline,
      section,
      author,
      dateISO: new Date().toISOString(),
      tone,
      gradeLevel,
      improbability,
      constraints: CONSTRAINTS[gradeLevel],
      body
    };

    saveArticle(newArticle);
    navigate(`/article/${newArticle.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Panel */}
        <section className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold flex items-center gap-2">
              ⚙️ Workshop Settings
            </h2>
            <button 
              onClick={handleReset}
              className="text-xs text-red-500 font-bold hover:underline"
              title="Reset everything"
            >
              RESET
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Grade Level</label>
            <select 
              className="w-full border rounded-md p-2"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
            >
              <option value="elementary">Elementary</option>
              <option value="middle">Middle School</option>
              <option value="high">High School</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tone</label>
            <select 
              className="w-full border rounded-md p-2"
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
            >
              <option value="serious">Serious News</option>
              <option value="satire">Satire / Funny</option>
              <option value="horror">Horror / Spooky</option>
              <option value="inspirational">Inspirational</option>
              <option value="sci-fi">Sci-Fi</option>
              <option value="mystery">Mystery</option>
              <option value="fairy_tale">Fairy Tale</option>
              <option value="cynical">Cynical</option>
              <option value="random">Random</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Improbability</label>
            <div className="grid grid-cols-1 gap-2">
              {['realistic', 'unusual', 'weird', 'absurd', 'unhinged'].map((i) => (
                <button
                  key={i}
                  onClick={() => setImprobability(i as Improbability)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                    ${improbability === i ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                >
                  {i.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t">
            <span className="text-sm font-semibold text-gray-700">Enable Constraints</span>
            <input 
              type="checkbox" 
              className="w-5 h-5 accent-blue-600"
              checked={constraintsEnabled}
              onChange={(e) => setConstraintsEnabled(e.target.checked)}
            />
          </div>

          {constraintsEnabled && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-bold text-blue-800 mb-2 uppercase tracking-tighter">Assignment Constraints</h3>
              <ul className="text-xs space-y-2 text-blue-700 italic">
                {CONSTRAINTS[gradeLevel].map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span>•</span> {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Headline Generator */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              📰 1. Build Your Headline
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Template</label>
                <select 
                  className="w-full border-b-2 border-gray-100 p-2 font-serif text-lg focus:outline-none focus:border-blue-400"
                  onChange={(e) => setSelectedTemplate(TEMPLATES.find(t => t.id === e.target.value)!)}
                  value={selectedTemplate.id}
                >
                  {TEMPLATES.map(t => <option key={t.id} value={t.id}>{t.structure}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(['adj', 'subject', 'verb', 'obj', 'location'] as const).map(slot => (
                  <div key={slot}>
                    <label className="text-[10px] font-bold text-blue-500 uppercase">{slot}</label>
                    <select
                      className="w-full border rounded p-1 text-sm bg-blue-50 border-blue-100"
                      value={words[slot]}
                      onChange={(e) => setWords(prev => ({ ...prev, [slot]: e.target.value }))}
                    >
                      <option value="">Select...</option>
                      {visibleWords[slotToBankKey[slot]].map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={randomizeWords}
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-black"
                >
                  Randomize Slots
                </button>
                <button 
                  onClick={handleGenerate}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
                >
                  Generate Lead
                </button>
              </div>

              {(headline || gradeLevel === 'high') && (
                <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold bg-yellow-400 px-2 py-0.5 rounded uppercase">Preview Article Header</span>
                    <button 
                      onClick={() => {setHeadline(''); setSubheadline('');}} 
                      className="text-gray-400 hover:text-red-500"
                    >✕</button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <select 
                      className="text-[10px] font-bold bg-gray-200 px-2 py-0.5 rounded uppercase appearance-none"
                      value={section}
                      onChange={(e) => setSection(e.target.value)}
                    >
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  
                  {gradeLevel === 'high' ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Custom Headline (High School Only)</label>
                        <input 
                          type="text" 
                          className="w-full bg-transparent font-serif-display text-2xl md:text-3xl font-bold leading-tight border-b-2 border-yellow-300 focus:border-yellow-500 outline-none"
                          placeholder="Type your own headline..."
                          value={headline}
                          onChange={(e) => setHeadline(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Subheadline</label>
                        <textarea 
                          className="w-full bg-transparent font-serif-body italic text-gray-600 border-l-2 border-gray-300 pl-4 focus:border-yellow-500 outline-none resize-none"
                          placeholder="Provide context for your headline..."
                          value={subheadline}
                          onChange={(e) => setSubheadline(e.target.value)}
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="font-serif-display text-2xl md:text-3xl font-bold leading-tight mb-2 text-black">
                        {headline}
                      </h1>
                      <p className="font-serif-body italic text-gray-600 border-l-2 border-gray-300 pl-4">
                        {subheadline}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Story Composition */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ✍️ 2. Write the Story
            </h2>
            
            <div className="mb-4 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Byline (Author)</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-end">
                <button 
                  onClick={handleRemix}
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  ✨ Remix My Idea
                </button>
                {remixHint && (
                  <p className="text-[11px] text-blue-500 mt-1 italic max-w-xs text-right animate-pulse">
                    Hint: {remixHint}
                  </p>
                )}
              </div>
            </div>

            <div className="relative">
              <textarea 
                placeholder="Once upon a time..."
                className="w-full h-80 border-2 rounded-xl p-6 font-serif-body text-lg leading-relaxed focus:border-blue-500 outline-none resize-none"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="absolute bottom-4 right-6 flex items-center gap-4">
                <div className={`text-xs font-bold px-3 py-1 rounded-full ${wordCount >= minWords ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {wordCount} / {minWords} Words
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end relative">
              {/* Requirement Tooltip */}
              {!isFormComplete && showTooltip && (
                <div className="absolute bottom-full mb-4 right-0 w-64 bg-gray-900 text-white text-xs p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
                  <div className="font-bold mb-2 uppercase tracking-widest text-[10px] text-gray-400 border-b border-gray-700 pb-1">Publishing Requirements</div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      {validation.hasHeadline ? '✅' : '❌'}
                      <span className={validation.hasHeadline ? 'text-gray-400' : 'text-red-400'}>Enter a headline</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {validation.hasAuthor ? '✅' : '❌'}
                      <span className={validation.hasAuthor ? 'text-gray-400' : 'text-red-400'}>Enter author name</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {validation.hasBody ? '✅' : '❌'}
                      <span className={validation.hasBody ? 'text-gray-400' : 'text-red-400'}>Write your story</span>
                    </li>
                    <li className="flex items-center gap-2">
                      {validation.hasMinWords ? '✅' : '❌'}
                      <span className={validation.hasMinWords ? 'text-gray-400' : 'text-red-400'}>At least {minWords} words (current: {wordCount})</span>
                    </li>
                  </ul>
                  <div className="absolute bottom-[-8px] right-8 w-4 h-4 bg-gray-900 rotate-45"></div>
                </div>
              )}

              <div 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <button 
                  disabled={!isFormComplete}
                  onClick={handlePublish}
                  className={`px-10 py-4 rounded-xl font-bold text-lg shadow-lg transition-all
                    ${isFormComplete ? 'bg-black text-white hover:scale-105 hover:bg-gray-900 active:scale-95' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  PUBLISH ARTICLE
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default WriterPage;
