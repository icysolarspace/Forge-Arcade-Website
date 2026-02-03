
import React from 'react';
import { ArrowLeft, Upload, Gamepad, LayoutGrid, FileCode, ShieldCheck, Download, Zap, Rocket, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const TutorialStep: React.FC<{ icon: React.ReactNode, title: string, content: string, number: string }> = ({ icon, title, content, number }) => (
  <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 flex flex-col gap-6 group hover:border-indigo-500/50 transition-all duration-500 relative overflow-hidden">
    <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
      {icon}
    </div>
    <div className="flex items-center justify-between">
      <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-400/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-5xl font-black font-space text-slate-800/50">{number}</span>
    </div>
    <div>
      <h3 className="text-2xl font-black font-space text-white mb-3 uppercase tracking-tight group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed font-light">{content}</p>
    </div>
  </div>
);

const HowTo: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 py-20 animate-in fade-in duration-1000">
    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors uppercase font-bold text-xs tracking-widest">
      <ArrowLeft className="w-4 h-4" /> Back to Home
    </Link>
    
    <header className="mb-24 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-8">
        <Zap className="w-3 h-3" /> Digital Architecture Manual
      </div>
      <h1 className="text-6xl md:text-8xl font-black font-space tracking-tighter text-white mb-8 uppercase italic leading-none">THE PROTOCOL</h1>
      <p className="text-slate-400 font-light text-xl max-w-2xl mx-auto leading-relaxed">
        A step-by-step guide to deploying your modules and navigating the ForgeArcade ecosystem.
      </p>
    </header>

    <div className="space-y-32">
      <section>
        <div className="flex items-center gap-4 mb-16">
          <h2 className="text-xs font-black text-indigo-500 uppercase tracking-[0.5em] whitespace-nowrap">Phase 1: Deployment</h2>
          <div className="h-px flex-grow bg-slate-800/50"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <TutorialStep 
            number="01"
            icon={<FileCode className="w-10 h-10" />} 
            title="Build Code" 
            content="Ensure your game is a single index.html file. It must contain all necessary scripts and styles, or link to reliable external CDNs."
          />
          <TutorialStep 
            number="02"
            icon={<Upload className="w-10 h-10" />} 
            title="Upload" 
            content="Go to the 'Publish' section and upload your build. Our system will initialize the module and prepare it for the arcade listing."
          />
          <TutorialStep 
            number="03"
            icon={<LayoutGrid className="w-10 h-10" />} 
            title="Organize" 
            content="Add a category, description, and cover image. These help other pilots discover your work in the hangar."
          />
          <TutorialStep 
            number="04"
            icon={<Rocket className="w-10 h-10" />} 
            title="Launch" 
            content="Once confirmed, your game is instantly playable. Share your creation and start tracking play metrics."
          />
        </div>
      </section>

      <section className="bg-slate-900/40 border border-slate-800 p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-20 opacity-5 pointer-events-none group-hover:rotate-6 transition-transform duration-1000">
           <ShieldCheck className="w-64 h-64 text-green-500" />
        </div>
        
        <div className="max-w-3xl">
          <h2 className="text-4xl font-black font-space text-white uppercase tracking-tight mb-8">Play Protocol</h2>
          <p className="text-slate-400 text-lg font-light mb-12 leading-relaxed">
            ForgeArcade modules run in isolated sectors, ensuring high performance and total privacy for every session.
          </p>
          
          <div className="space-y-6">
            <div className="flex gap-6 items-start">
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
                  <Gamepad className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-white font-bold uppercase tracking-tight text-lg mb-1">Instant Execution</h4>
                  <p className="text-slate-500 text-sm">No downloads. Click play, and the module loads directly in your browser's local sandbox.</p>
               </div>
            </div>
            <div className="flex gap-6 items-start">
               <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0 border border-purple-500/20">
                  <CheckCircle2 className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="text-white font-bold uppercase tracking-tight text-lg mb-1">Session Vault</h4>
                  <p className="text-slate-500 text-sm">Your play metrics and feedback are stored securely in your local profile vault.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      <section className="text-center pt-20">
        <div className="bg-slate-900/60 p-12 md:p-20 rounded-[4rem] border border-slate-800 shadow-2xl inline-block w-full">
           <Download className="w-16 h-16 text-indigo-500 mx-auto mb-8 animate-bounce" />
           <h2 className="text-4xl font-black font-space text-white uppercase mb-6 tracking-tighter italic">Secure Your Work</h2>
           <p className="text-slate-400 text-lg font-light mb-12 max-w-xl mx-auto leading-relaxed">
             Everything is local. Don't forget to export your <strong>JSON Vault</strong> from Settings to keep your creations safe from cache resets.
           </p>
           <Link to="/create" className="bg-white text-black hover:bg-indigo-400 px-16 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] transition-all shadow-2xl shadow-white/10 hover:scale-105 active:scale-95 inline-block">
             Begin New Project
           </Link>
        </div>
      </section>
    </div>
  </div>
);

export default HowTo;
