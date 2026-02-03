
import React from 'react';
import { ArrowLeft, FileText, Shield, ExternalLink } from 'lucide-react';
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
          <Shield className="w-5 h-5 text-indigo-400" /> 1. You Are In Control
        </h2>
        <p>Using this website means you agree to these simple rules. Everything you build here belongs to you. We don't own your games, and we don't have a "back door" to see what you're doing. You are the captain of this ship.</p>
      </section>
      
      <section>
        <h2 className="text-white font-bold text-lg mb-4">2. Powered by Google Gemini</h2>
        <p>The AI features on this site are powered directly by <strong>Google Gemini</strong>. When you use your API key, your data goes straight to Google's servers to be processed. Our company does not sit in the middle—we never see, store, or view your API data or the code you generate.</p>
        <a href="https://ai.google.dev/terms" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-white mt-3 transition-colors">
          View Google's API Terms <ExternalLink className="w-3 h-3" />
        </a>
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-4">3. We Never Train on Your Data</h2>
        <p>We do not use your code, prompts, or games to train AI models. Your creative work stays private to your browser session. This website is a safe space for you to experiment and build without being "watched" or used as training data.</p>
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-4">4. Deleting Everything</h2>
        <p>Since we don't store your data on our own servers, you have the ultimate "kill switch." If you want to wipe everything—your keys, your games, and your profile—simply clear your browser's cookies and local storage. Once you do that, it's gone forever from your device.</p>
      </section>
      
      <div className="pt-10 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
        Last Updated: October 2023 • All Systems Safe
      </div>
    </div>
  </div>
);

export default Terms;
