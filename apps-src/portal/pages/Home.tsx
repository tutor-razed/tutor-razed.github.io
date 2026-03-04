import React from "react";
import { MOCK_RESOURCES } from "../constants";
import ResourceCard from "../components/ResourceCard";

const Home: React.FC = () => {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4 bg-gradient-to-b from-indigo-50 to-white">
        <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-20 pointer-events-none">
          {/* Fun blobs */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-300 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block px-6 py-2 rounded-full bg-pink-100 text-pink-600 font-black text-sm mb-8 border-2 border-pink-200 rotate-[-2deg]">
              FUN LEARNING ADVENTURE ✨
            </span>
            <h1 className="text-6xl lg:text-8xl font-black text-indigo-900 leading-[1.1] mb-8">
              Learn <span className="text-pink-500">Big</span>. <br />
              Have{" "}
              <span className="text-yellow-500 underline decoration-indigo-200 underline-offset-8">
                Fun
              </span>
              .
            </h1>
            <p className="text-2xl text-gray-600 mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Find the coolest tools,games, videos, and books to help you become
              a superstar in class!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
              <a
                href="#/resources"
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-2 transition-all flex items-center justify-center"
              >
                Go to Library 🚀
              </a>
            </div>
          </div>

          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                src="https://images.unsplash.com/photo-1605627079912-97c3810a11a4?q=80&w=1107&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Kids learning"
                className="w-full h-auto"
              />
            </div>
            {/* Floating badges for fun */}
            <div className="absolute -top-10 -right-10 bg-pink-500 p-8 rounded-full shadow-2xl z-20 hidden md:block border-4 border-white animate-pulse">
              <span className="text-4xl">🎨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div>
              <h2 className="text-5xl font-black text-indigo-900 mb-6">
                Top Picks for You
              </h2>
              <p className="text-xl text-gray-500 font-medium">
                Check out what other students are loving today!
              </p>
            </div>
            <a
              href="#/resources"
              className="mt-8 md:mt-0 px-8 py-4 bg-yellow-400 text-yellow-900 font-black rounded-2xl hover:bg-yellow-500 transition-all"
            >
              See All Fun Stuff →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {MOCK_RESOURCES.slice(0, 3).map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onClick={() => {}}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-indigo-900 overflow-hidden relative">
        <div className="max-w-5xl mx-auto text-center text-white relative z-10">
          <h2 className="text-5xl md:text-7xl font-black mb-10">
            Start Asking!
          </h2>
          <p className="text-2xl text-indigo-200 mb-16 max-w-2xl mx-auto font-medium">
            Resources to make learning fun and easy for everyone. Dive in and
            discover something new today!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-8">
            <a
              href="#/resources"
              className="px-12 py-6 bg-pink-500 text-white rounded-[2rem] font-black text-2xl shadow-xl hover:bg-pink-600 hover:scale-105 transition-all"
            >
              Jump In!
            </a>
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mt-16"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mb-32"></div>
      </section>

      <footer className="bg-gray-100 text-gray-500 py-20 border-t-2 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white">
              TR
            </div>
            <span className="text-2xl font-black text-indigo-900">
              Tutor Razed
            </span>
          </div>
          <p className="font-bold text-lg mb-4">
            Making school more fun, one click at a time.
          </p>
          <p className="text-sm">© 2026 Tutor Razed</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
