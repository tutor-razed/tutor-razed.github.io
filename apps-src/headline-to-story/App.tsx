
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import WriterPage from './pages/WriterPage';
import ArticlePage from './pages/ArticlePage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WriterPage />} />
        <Route path="/article/:id" element={<ArticlePage />} />
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <a href="/" className="text-blue-600 underline">Back to Writer</a>
          </div>
        } />
      </Routes>
    </HashRouter>
  );
};

export default App;
