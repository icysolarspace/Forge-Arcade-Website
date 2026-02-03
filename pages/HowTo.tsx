
import React from 'react';
import { ArrowLeft, HelpCircle, Key, Gamepad, Sparkles, Wand2, Cpu, Image as ImageIcon, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorialStep: React.FC<{ icon: React.ReactNode, title: string, content: string }> = ({ icon, title, content }) => (
  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex items-start gap-4">
    <div className="w-12 h-12 bg-indigo-600/20 rounded-xl flex items-center justify-center shrink-0 text-indigo-400">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{content}</p>
    </div>
  </div>
);

const HowTo: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-20">
    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors">
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    
    <div className="mb-16 text-center">
      <h1 className="text-5xl font-black font-space tracking-tight text-white mb-6 uppercase">SYSTEM MANUAL</h1>
      <p className="text-slate-400 font-light text-xl max-w-2xl mx-auto">
        Learn how to configure your account and build games using the new dual-AI system.
      </p>
    </div>

    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold font-space text-indigo-400 mb-6 uppercase tracking-wider">The Key System</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Coding API Key</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              This key powers the "Architect" module. It is used exclusively for writing game code, logic, and fixes. 
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-500">
              Compatible with: Gemini, ChatGPT, or DeepSeek API keys.
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
            <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
              <ImageIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Image API Key</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Required for generating high-quality game cover art and profile avatars. 
            </p>
            <div className="bg-slate-950 p-4 rounded-xl text-xs text-slate-500">
              Requirement: Must be a valid Google AI Studio (Gemini) API key.
            </div>
          </div>
        </div>

        <div className="bg-indigo-600/5 border border-indigo-500/20 p-6 rounded-2xl flex items-start gap-4">
          <Key className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
          <div className="text-sm text-slate-400 leading-relaxed">
            <strong className="text-white block mb-1">Switching Keys:</strong>
            To update or change keys, navigate to <strong>Settings</strong> and look for the "API Connections" section. You can test each key individually to ensure they are working before starting a new build.
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold font-space text-indigo-400 mb-6 uppercase tracking-wider">Forge Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TutorialStep 
            icon={<Wand2 />} 
            title="1. Describe Idea" 
            content="Describe your game in the Architect tab. Be specific about mechanics, score systems, and win conditions."
          />
          <TutorialStep 
            icon={<Sparkles />} 
            title="2. Generate Art" 
            content="Use your Image Key to create unique cover art. The AI will look at your title and description to match the style."
          />
          <TutorialStep 
            icon={<Gamepad />} 
            title="3. Instant Test" 
            content="Use the 'Play' tab to run your game instantly. If it needs tweaks, use the 'Fixer' tab to describe the changes."
          />
          <TutorialStep 
            icon={<Upload />} 
            title="4. Data Backup" 
            content="Always download your data from Settings. This file includes your games, profile, and creation history for full restoration."
          />
        </div>
      </section>

      <section className="pt-12">
        <h2 className="text-2xl font-bold font-space text-purple-400 mb-6 uppercase tracking-wider">Common Questions</h2>
        <div className="space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h4 className="font-bold text-white mb-2">Can I use one key for both?</h4>
            <p className="text-slate-400 text-sm">Yes! If you have a Google Gemini key, you can paste it into both the Coding and Image fields. It will handle both tasks perfectly.</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h4 className="font-bold text-white mb-2">Why did my restoration fail?</h4>
            <p className="text-slate-400 text-sm">Ensure you are uploading the exact JSON or HTML file you downloaded. The system looks for a specific 'fullVault' signature to rebuild your account.</p>
          </div>
        </div>
      </section>
    </div>

    <div className="mt-20 py-10 border-t border-slate-800 text-center">
      <Link to="/settings" className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/30">
        Update My Keys
      </Link>
    </div>
  </div>
);

export default HowTo;
