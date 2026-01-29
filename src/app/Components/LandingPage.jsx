'use client';

import React from 'react';
import { Upload, FileText, Briefcase } from 'lucide-react';

const LandingPage = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
            Job Management
            <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
              Made Simple
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload images, create jobs, and manage your workflow with ease. 
            A modern solution for efficient job tracking.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => onNavigate('signin')}
            className="px-8 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Sign In
          </button>
          <button
            onClick={() => onNavigate('signup')}
            className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            Get Started
          </button>
        </div>

        <div className="grid text-black grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          {[
            { icon: Upload, title: 'Easy Upload', desc: 'Upload up to 100 images per job' },
            { icon: Briefcase, title: 'Track Jobs', desc: 'Monitor all your jobs in one place' },
            { icon: FileText, title: 'Get Reports', desc: 'Download detailed PDF reports' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
