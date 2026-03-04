
import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { GoogleGenAI, Modality } from "@google/genai";
import { getArticleById } from '../lib/storage';
import { Article } from '../types';
import Header from '../components/Header';
import NewsTicker from '../components/NewsTicker';
import { generateRelatedHeadlines, getFictionalAds, getClassifieds } from '../lib/generator';
import { decodeBase64, decodeAudioData } from '../lib/audio';

const ArticlePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [isReading, setIsReading] = useState(false);

  // Generate some random newspaper-y stuff on mount
  const ads = useMemo(() => getFictionalAds(3), []);
  const classifieds = useMemo(() => getClassifieds(5), []);

  useEffect(() => {
    if (id) {
      const found = getArticleById(id);
      if (found) setArticle(found);
    }
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <h1 className="text-3xl font-serif-display mb-4">Article Not Found</h1>
        <p className="mb-6 text-gray-600">The story you are looking for doesn't exist or was removed.</p>
        <Link to="/" className="bg-black text-white px-6 py-2 rounded font-bold hover:bg-gray-800">
          Return to Workshop
        </Link>
      </div>
    );
  }

  const dateStr = new Date(article.dateISO).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  const readTime = Math.ceil(article.body.split(/\s+/).length / 200);
  const relatedHeadlines = generateRelatedHeadlines(article.section, article.tone);
  
  // Find a pull quote: get a sentence from middle
  const sentences = article.body.split(/[.!?]/).filter(s => s.trim().length > 30);
  const pullQuote = sentences.length > 2 ? sentences[Math.floor(sentences.length / 2)].trim() : null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied to clipboard!");
  };

  const handleReadArticle = async () => {
    if (isReading) return;
    setIsReading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      const prompt = `Read this news article with a professional news anchor voice. 
      Headline: ${article.headline}. 
      Subheadline: ${article.subheadline}. 
      Byline: By ${article.author}. 
      Story: ${article.body}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      
      if (base64Audio) {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.onended = () => setIsReading(false);
        source.start(0);
      } else {
        throw new Error("No audio data returned");
      }
    } catch (error) {
      console.error("TTS generation failed:", error);
      alert("Sorry, audio generation is currently unavailable.");
      setIsReading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      <Header />
      <NewsTicker />

      <main className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content */}
        <article className="lg:col-span-8">
          <div className="mb-4">
            <span className="inline-block bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 mb-4">
              {article.section}
            </span>
            <h1 className="font-serif-display text-4xl md:text-6xl font-black leading-tight mb-4 text-black">
              {article.headline}
            </h1>
            <h2 className="font-serif-body text-xl md:text-2xl italic text-gray-600 leading-snug border-b pb-6">
              {article.subheadline}
            </h2>
          </div>

          <div className="flex items-center justify-between border-b py-3 mb-8 text-xs font-bold uppercase text-gray-500 tracking-tight">
            <div className="flex gap-4">
              <span>By <span className="text-black underline cursor-pointer">{article.author}</span></span>
              <span>•</span>
              <span>{dateStr}</span>
            </div>
            <div className="flex gap-4">
              <span>{readTime} Min Read</span>
              <button 
                onClick={handleReadArticle} 
                disabled={isReading}
                className={`hover:text-black flex items-center gap-1 font-bold ${isReading ? 'text-gray-300' : 'text-blue-600 underline'}`}
              >
                {isReading ? '🔊 Generating Audio...' : '🔈 Listen to Article'}
              </button>
              <button onClick={() => window.print()} className="hover:text-black">Print</button>
              <button onClick={handleCopyLink} className="hover:text-black">Share</button>
            </div>
          </div>

          {/* Featured Image Placeholder */}
          <div className="mb-8 bg-gray-100 aspect-video relative overflow-hidden group">
            <img 
              src={`https://picsum.photos/seed/${id}/1200/800`} 
              alt="Feature" 
              className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-xs italic">
              Above: An artist's rendering of the {article.section} event. Photo: Chronicle Archives.
            </div>
          </div>

          <div className="font-serif-body text-lg md:text-xl leading-relaxed text-gray-900 space-y-6">
            {article.body.split('\n').filter(p => p.trim()).map((para, idx) => (
              <React.Fragment key={idx}>
                <p className={idx === 0 ? "first-letter:text-7xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:font-serif-display first-letter:leading-none" : ""}>
                  {para}
                </p>
                {/* In-article Ad */}
                {idx === 1 && (
                  <div className="my-10 p-6 border-2 border-gray-100 bg-gray-50 flex gap-6 items-center rounded-lg">
                    <img src={`https://picsum.photos/seed/${ads[0].title}/150/150`} className="w-24 h-24 rounded-full bg-white shadow-inner" />
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Sponsored Content</span>
                      <h4 className="font-bold text-lg mb-1">{ads[0].title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{ads[0].desc}</p>
                      <button className="text-xs font-bold bg-black text-white px-4 py-1 rounded hover:bg-gray-800">Learn More</button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {pullQuote && (
            <blockquote className="my-12 border-y-4 border-black py-8 px-4 text-center">
              <p className="font-serif-display text-3xl md:text-4xl italic leading-tight text-gray-800">
                "{pullQuote}."
              </p>
            </blockquote>
          )}

          <div className="mt-12 border-t pt-8">
            <Link to="/" className="inline-flex items-center gap-2 text-red-600 font-bold hover:underline bg-red-50 px-4 py-2 rounded-lg">
              ← Return to Writing Workshop
            </Link>
          </div>

          {/* Bottom Grid: More Stories */}
          <section className="mt-20 border-t-2 border-gray-100 pt-12">
            <h3 className="font-serif-display text-3xl font-black mb-8 border-b-2 border-black inline-block">More from the Chronicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedHeadlines.slice(0, 3).map((h, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-gray-100 mb-4 overflow-hidden">
                    <img src={`https://picsum.photos/seed/${h}/400/300`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <h4 className="font-bold text-lg leading-tight group-hover:underline">
                    {h}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 uppercase font-bold tracking-tight">{article.section} • 5 mins ago</p>
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          
          {/* Snapshots Widget */}
          <section className="bg-gray-50 p-6 border rounded-xl">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Snapshot</h3>
               <span className="text-[10px] font-bold text-green-600">LIVE</span>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold">Weather: Cloud-Shaped Dogs</span>
                  <span className="text-xl">☀️</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-sm font-bold italic">Imagination Index</span>
                   <span className="text-green-600 font-bold">+4.2%</span>
                </div>
             </div>
          </section>

          {/* Most Read */}
          <section className="border-t-4 border-black pt-4">
            <h3 className="font-serif-display text-2xl font-black mb-6 border-b pb-2">Most Read</h3>
            <ul className="space-y-6">
              {relatedHeadlines.map((h, i) => (
                <li key={i} className="flex gap-4 group cursor-pointer">
                  <span className="text-4xl font-serif-display text-gray-200 group-hover:text-red-600 transition-colors">{i + 1}</span>
                  <p className="font-bold text-sm leading-tight hover:underline">
                    {h}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Sidebar Ad */}
          <section className="p-4 border-2 border-dashed border-gray-200 bg-gray-50 text-center">
            <span className="text-[8px] font-bold text-gray-400 uppercase block mb-4">Advertisement</span>
            <img src={`https://picsum.photos/seed/${ads[1].title}/300/200`} className="w-full mb-4 grayscale" />
            <h4 className="font-bold mb-1 uppercase tracking-tighter">{ads[1].title}</h4>
            <p className="text-xs text-gray-500 mb-4">{ads[1].desc}</p>
            <button className="w-full bg-black text-white py-2 text-xs font-bold rounded uppercase">Shop the Collection</button>
          </section>

          {/* Classifieds */}
          <section>
            <h3 className="font-serif-display text-2xl font-black mb-4 border-b pb-2">Classifieds</h3>
            <div className="space-y-6">
              {classifieds.map((c, i) => (
                <div key={i} className="text-xs leading-snug border-b border-gray-50 pb-4">
                  <span className="font-black text-red-700 uppercase mr-2">{c.cat}:</span>
                  <span className="font-serif-body">{c.text}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 text-[10px] font-black text-gray-400 hover:text-black uppercase tracking-widest underline">Place an ad →</button>
          </section>

          {/* Newsletter */}
          <section className="bg-gray-900 text-white p-6 rounded-2xl shadow-2xl">
            <h3 className="font-serif-display text-xl mb-2">Morning Briefing</h3>
            <p className="text-xs text-gray-400 mb-6">The biggest stories from our newsroom, delivered to your inbox every morning.</p>
            <div className="space-y-3">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-gray-800 border-gray-700 p-3 text-sm rounded-lg"
              />
              <button className="w-full bg-red-600 text-white font-bold py-3 text-sm rounded-lg hover:bg-red-700 transition-colors shadow-lg">
                SIGN UP FREE
              </button>
            </div>
          </section>

        </aside>
      </main>

      <footer className="mt-20 border-t border-gray-200 bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-gray-500 font-bold uppercase tracking-widest">
          <div className="space-y-2">
            <p className="text-black mb-4">Sections</p>
            <p className="hover:text-black cursor-pointer">Politics</p>
            <p className="hover:text-black cursor-pointer">Business</p>
            <p className="hover:text-black cursor-pointer">Tech</p>
            <p className="hover:text-black cursor-pointer">Science</p>
          </div>
          <div className="space-y-2">
            <p className="text-black mb-4">About Us</p>
            <p className="hover:text-black cursor-pointer">The Journal</p>
            <p className="hover:text-black cursor-pointer">Careers</p>
            <p className="hover:text-black cursor-pointer">Events</p>
            <p className="hover:text-black cursor-pointer">Contact</p>
          </div>
          <div className="space-y-2">
            <p className="text-black mb-4">Social</p>
            <p className="hover:text-black cursor-pointer">Twitter / X</p>
            <p className="hover:text-black cursor-pointer">LinkedIn</p>
            <p className="hover:text-black cursor-pointer">Instagram</p>
            <p className="hover:text-black cursor-pointer">TikTok</p>
          </div>
          <div className="space-y-2 text-right md:text-left">
            <h4 className="font-serif-display text-lg text-black lowercase italic mb-4">the daily chronicle</h4>
            <p>&copy; 2025 Creative Classroom Tools</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ArticlePage;
