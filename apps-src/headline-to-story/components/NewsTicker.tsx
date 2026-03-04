
import React from 'react';
import { generateTickerItems } from '../lib/generator';

const NewsTicker: React.FC = () => {
  const items = generateTickerItems();

  return (
    <div className="bg-red-700 text-white py-2 overflow-hidden whitespace-nowrap border-b border-red-900 flex">
      <div className="font-bold px-4 bg-red-800 z-10 flex-shrink-0">BREAKING NEWS:</div>
      <div className="animate-marquee inline-block">
        {items.map((item, idx) => (
          <span key={idx} className="mx-8 uppercase text-sm tracking-wide">
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: inline-block;
          padding-left: 100%;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
