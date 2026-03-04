
import React, { useState, useMemo } from 'react';
import { RESOURCES, SUBJECTS } from '../constants';
import ResourceCard from '../components/ResourceCard';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredResources = useMemo(() => {
    return RESOURCES.filter(res => {
      const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            res.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || res.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [searchTerm, selectedSubject]);

  return (
    <div className="pt-32 pb-24 bg-indigo-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-indigo-900 mb-6">Explore the Fun Library</h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Click on a subject to see cool games, videos, and books!</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          <input 
            type="text"
            placeholder="Search for something fun (e.g. 'Space' or 'Art')..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-8 py-6 bg-white rounded-[2.5rem] shadow-xl border-4 border-transparent focus:border-yellow-400 transition-all outline-none text-xl font-bold text-indigo-900"
          />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl">ðŸ”</span>
        </div>

        {/* Subject Filter Chips */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {SUBJECTS.map(subject => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-8 py-3 rounded-2xl font-black text-lg transition-all shadow-sm ${selectedSubject === subject ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-white text-indigo-900 hover:bg-indigo-100'}`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Resource Grid */}
        <div>
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredResources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onClick={() => {}} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border-4 border-dashed border-indigo-100">
              <span className="text-6xl mb-8 block">ðŸ§</span>
              <h3 className="text-3xl font-black text-indigo-900 mb-4">We couldn't find that!</h3>
              <p className="text-xl text-gray-500 font-medium mb-10">Try a different word or click "All" to see everything.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedSubject('All');}}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-all"
              >
                Show All Resources
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Resources;

