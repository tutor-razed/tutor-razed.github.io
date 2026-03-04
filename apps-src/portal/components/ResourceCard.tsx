import React from "react";
import { Resource } from "../types";

interface ResourceCardProps {
  resource: Resource;
  onClick: (id: string) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onClick }) => {
  const getSubjectColor = (subject: string) => {
    switch (subject) {
      case "Math":
        return "bg-blue-500 text-white";
      case "Science":
        return "bg-green-500 text-white";
      case "Reading":
        return "bg-orange-500 text-white";
      case "Writing":
        return "bg-purple-500 text-white";
      case "Coding":
        return "bg-indigo-500 text-white";
      case "Art":
        return "bg-pink-500 text-white";
      case "Music":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Video":
        return "🎥";
      case "Game":
        return "🎮";
      case "Worksheet":
        return "📝";
      case "Book":
        return "📖";
      default:
        return "📄";
    }
  };

  const handleGoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(resource.downloadUrl, "_blank");
  };

  return (
    <div
      onClick={() => onClick(resource.id)}
      className="bg-white rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border-4 border-transparent hover:border-yellow-400 cursor-pointer group flex flex-col h-full"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={resource.thumbnail}
          alt={resource.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4">
          <span
            className={`px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider shadow-sm ${getSubjectColor(resource.subject)}`}
          >
            {resource.subject}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-2xl flex items-center shadow-sm border border-white">
          <span className="text-xl mr-1">{getTypeIcon(resource.type)}</span>
          <span className="text-xs font-black text-gray-800 uppercase">
            {resource.type}
          </span>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-black text-indigo-900 group-hover:text-pink-500 transition-colors mb-3 leading-tight">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-md mb-6 line-clamp-2 font-medium">
          {resource.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-gray-50">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg mr-3 shadow-inner ${getSubjectColor(resource.subject)}`}
            ></div>
            <div></div>
          </div>
          <button
            onClick={handleGoClick}
            className="bg-yellow-100 text-yellow-700 font-black p-3 rounded-2xl hover:bg-yellow-400 hover:text-white transition-all"
          >
            GO!
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
