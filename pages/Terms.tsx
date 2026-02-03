
import React from 'react';
import { ArrowLeft, FileText, Shield, ExternalLink, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-20 animate-in fade-in duration-700">
    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors uppercase font-bold text-xs tracking-widest">
      <ArrowLeft className="w-4 h-4" /> Back to Base
    </Link>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-indigo-600/20 rounded-2xl flex items-center justify-center">
        <FileText className="w-6 h-6 text-indigo-400" />
      </div>
      <h1 className="text-4xl font-black font-space tracking-tight text-white uppercase">Simple Terms</h1>
    </div>
    
    <div className="space-y-10 text-slate-400 font-light leading-relaxed">
      <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" /> 1. You Always Stay in Control
        </h2>
        <p>Using this website means you agree to these simple rules. Everything you build here belongs to you. We do not own your games, and we cannot "see" your private work. You are 100% in control of your account and your code.</p>
      </section>
      
      <section>
        <h2 className="text-white font-bold text-lg mb-4">2. Powered by Google Gemini</h2>
        <p>The AI features on this site are handled directly by <strong>Google Gemini</strong>. When you use your API key to build a game, your instructions are sent straight to Google. Our company is just the interface—we never take, store, or view your API data or the code you generate.</p>
        <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-white mt-3 transition-colors">
          View Google's Third-Party Terms <ExternalLink className="w-3 h-3" />
        </a>
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-4">3. No Training, No Harvesting</h2>
        <p>We believe in a safe internet. We never train AI models on your code or data. Your creative prompts and game logic stay private to your browser session. We do not "scrape" your content for any reason.</p>
      </section>

      <section className="bg-red-500/5 p-6 rounded-2xl border border-red-500/10">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-400" /> 4. Delete Everything Instantly
        </h2>
        <p>Because we don't store your data on our servers, you have the ultimate power to delete it. To erase all your games, keys, and history, simply <strong>clear your browser's cookies and local storage</strong>. Once you do that, your data is gone forever from your device.</p>
      </section>
      
      <div className="pt-10 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-600 font-bold text-center">
        Status: Secure & User-Owned • Last Updated: Oct 2023
      </div>
    </div>
  </div>
);

export default Terms;
