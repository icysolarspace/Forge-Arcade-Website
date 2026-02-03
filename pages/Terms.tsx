
import React from 'react';
import { ArrowLeft, FileText, Shield, UserCheck, Trash2, Database, ShieldAlert, Lock, Zap } from 'lucide-react';
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
      <h1 className="text-4xl font-black font-space tracking-tight text-white uppercase">Operational Terms</h1>
    </div>
    
    <div className="space-y-12 text-slate-400 font-light leading-relaxed">
      <section className="bg-slate-900/60 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Lock className="w-32 h-32 text-indigo-400" />
        </div>
        <h2 className="text-white font-black font-space text-2xl mb-6 uppercase tracking-tight flex items-center gap-3">
          <Shield className="w-6 h-6 text-indigo-400" /> User Data Sovereignty
        </h2>
        <p className="text-xl mb-6">You are in full control of your digital hangar. ForgeArcade is built on the principle that the creator should always own their output.</p>
        <ul className="space-y-4 text-slate-300">
          <li className="flex gap-4 items-center">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>We do <strong>not</strong> use your data for any internal purposes.</span>
          </li>
          <li className="flex gap-4 items-center">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>We do <strong>not</strong> sell or trade your data to third parties.</span>
          </li>
          <li className="flex gap-4 items-center">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span>We do <strong>not</strong> train AI models on your code or uploads.</span>
          </li>
        </ul>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" /> Local Storage
          </h2>
          <p className="text-sm">Your games, profile, and session info live 100% in your browser. We have no central database; you are the host of your own experience.</p>
        </section>
        <section className="bg-slate-900/40 p-8 rounded-3xl border border-slate-800">
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-400" /> Total Deletion
          </h2>
          <p className="text-sm">You have the power to wipe your entire presence instantly. Simply clear your browser's local storage or use the logout/reset tools.</p>
        </section>
      </div>

      <section className="bg-indigo-600/5 p-8 rounded-3xl border border-indigo-500/10">
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" /> Acceptance of Terms
        </h2>
        <p className="text-sm">By utilizing the ForgeArcade pipeline, you acknowledge that you are responsible for the content you upload and that you must maintain your own backups via the export feature in Settings.</p>
      </section>
      
      <div className="pt-10 border-t border-slate-800 text-[10px] uppercase tracking-widest text-slate-600 font-black text-center italic">
        Architecture Status: Secure • Identity Protocol: Anonymous • 2024
      </div>
    </div>
  </div>
);

export default Terms;
