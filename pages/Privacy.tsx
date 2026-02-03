
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Trash2, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-20 animate-in fade-in duration-700">
    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors uppercase font-bold text-xs tracking-widest">
      <ArrowLeft className="w-4 h-4" /> Back to Base
    </Link>
    <div className="flex items-center gap-4 mb-8">
      <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center">
        <ShieldCheck className="w-6 h-6 text-purple-400" />
      </div>
      <h1 className="text-4xl font-black font-space tracking-tight text-white uppercase">Privacy Protocol</h1>
    </div>
    
    <div className="space-y-10 text-slate-400 font-light leading-relaxed">
      <section className="bg-indigo-600/5 p-8 rounded-[2rem] border border-indigo-500/10">
        <h2 className="text-white font-bold text-xl mb-4 flex items-center gap-3">
          <Lock className="w-6 h-6 text-indigo-400" /> No Server, No Secrets
        </h2>
        <p className="text-lg">Our company <strong>never</strong> takes, stores, or views any of your data. We have no central database. Your profile, your API keys, and your games live 100% inside your own web browser.</p>
      </section>
      
      <section>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" /> Google Gemini API
        </h2>
        <p>This website is an interface for <strong>Google Gemini</strong>. When you forge a game, your instructions are sent to Google to turn them into code. Because you use your own API key, your relationship is directly with Google. We recommend checking Google's third-party terms to understand how they handle data processed through their API.</p>
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-4">No AI Training</h2>
        <p>We do not "scrape" or "harvest" your code to train AI models. Your work is your own. We believe in a private internet where your creativity belongs to you, not a machine-learning algorithm.</p>
      </section>

      <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-400" /> How to Delete Your Data
        </h2>
        <p>You stay in full control. To remove every trace of your activity from this site, you can:</p>
        <ul className="list-disc ml-6 mt-4 space-y-2 text-sm">
          <li>Use the "Log Out" button in Settings.</li>
          <li>Clear your browser's <strong>Cookies and Local Storage</strong> for this website.</li>
        </ul>
        <p className="mt-4">Once cleared, we have no way to recover your data because we never had it in the first place.</p>
      </section>
      
      <div className="pt-10 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-600 font-bold">
        Status: 100% Client-Side • Secure Connection
      </div>
    </div>
  </div>
);

export default Privacy;
