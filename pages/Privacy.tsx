
import React from 'react';
import { ArrowLeft, ShieldCheck, Lock, Trash2, Globe, EyeOff } from 'lucide-react';
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
          <Lock className="w-6 h-6 text-indigo-400" /> We Don't See Your Data
        </h2>
        <p className="text-lg">Our company <strong>never</strong> takes, stores, or views any of your data. We don't even have a database. Your profile, your API keys, and your games live 100% inside your own web browser.</p>
      </section>
      
      <section>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-blue-400" /> Google Gemini handles the AI
        </h2>
        <p>This website is an interface for <strong>Google Gemini</strong>. When you create a game, your instructions go straight to Google's API to be processed. We recommend checking Google's third-party privacy terms for more details on how they handle data processed through their AI models.</p>
      </section>

      <section>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <EyeOff className="w-5 h-5 text-green-400" /> No AI Training
        </h2>
        <p>We do not use your code, prompts, or history to train any AI. Your creative work is your own property. The platform is safe to use and built to respect your privacy.</p>
      </section>

      <section className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-red-400" /> Wipe Everything Anytime
        </h2>
        <p>You are in full control. If you want to delete all your data, you don't need to ask us. Simply:</p>
        <ul className="list-disc ml-6 mt-4 space-y-2 text-sm">
          <li>Use the "Log Out" button in your settings.</li>
          <li><strong>Clear your local cookies and storage</strong> for this site in your browser settings.</li>
        </ul>
        <p className="mt-4">Once you clear your local data, it is gone forever. We have no way to recover it because we never had it in the first place.</p>
      </section>
      
      <div className="pt-10 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-600 font-bold text-center">
        ForgeArcade AI: Safe, Private, and Powered by You.
      </div>
    </div>
  </div>
);

export default Privacy;
