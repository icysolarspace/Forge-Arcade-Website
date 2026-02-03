
import React from 'react';
import { ArrowLeft, Upload, Gamepad, LayoutGrid, FileCode, ShieldCheck, Download } from 'lucide-react';
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
        Learn how to publish your HTML5 games to the ForgeArcade system.
      </p>
    </div>

    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold font-space text-indigo-400 mb-6 uppercase tracking-wider">Publication Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TutorialStep 
            icon={<FileCode />} 
            title="1. Prepare Your Build" 
            content="Your game must be a single .html file containing all necessary logic, styles, and assets (or linking to external CDNs)."
          />
          <TutorialStep 
            icon={<Upload />} 
            title="2. Upload Module" 
            content="Go to the Create page and upload your build. Add a title, genre, and a catchy description for the community."
          />
          <TutorialStep 
            icon={<LayoutGrid />} 
            title="3. Add Visuals" 
            content="Upload a cover image to help your game stand out in the arcade. 16:9 aspect ratio works best."
          />
          <TutorialStep 
            icon={<Gamepad />} 
            title="4. Play & Share" 
            content="Once published, your game is instantly playable. Share the link with friends to start racking up plays!"
          />
        </div>
      </section>

      <section className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl">
        <div className="flex items-center gap-4 mb-6">
           <ShieldCheck className="w-8 h-8 text-green-500" />
           <h2 className="text-2xl font-bold font-space text-white uppercase tracking-tight">Security & Privacy</h2>
        </div>
        <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
          <p>
            <strong>Local Storage:</strong> All data is stored directly in your browser's local storage. We do not host your games on a centralized server.
          </p>
          <p>
            <strong>Sandboxing:</strong> Every game runs inside a sandboxed iframe. This ensures that the code you upload cannot access your personal profile data or other games.
          </p>
        </div>
      </section>

      <section className="pt-12">
        <h2 className="text-2xl font-bold font-space text-purple-400 mb-6 uppercase tracking-wider">Backups</h2>
        <TutorialStep 
          icon={<Download />} 
          title="Keep a Backup" 
          content="Since everything is local to your browser, clearing your cache will erase your games. Go to Settings and use 'Download JSON' to keep a secure backup of your entire portfolio."
        />
      </section>
    </div>

    <div className="mt-20 py-10 border-t border-slate-800 text-center">
      <Link to="/create" className="bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-4 rounded-full font-bold transition-all shadow-xl shadow-indigo-600/30 uppercase tracking-[0.2em] text-xs">
        Publish My First Game
      </Link>
    </div>
  </div>
);

export default HowTo;
