
import React from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-in fade-in duration-700">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-10 transition-colors uppercase font-bold text-xs tracking-widest">
        <ArrowLeft className="w-4 h-4" /> BACK TO THE HUB
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center text-indigo-400">
              <Mail className="w-7 h-7" />
            </div>
            <h1 className="text-5xl font-black font-space tracking-tight text-white uppercase">{t.nav.contact}</h1>
          </div>
          
          <p className="text-slate-400 font-light text-xl leading-relaxed">
            Have questions about the Forge? Found a glitch in the matrix? Our team of digital architects is ready to assist.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-500">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
               <span className="text-xs font-black uppercase tracking-widest">100% Free Communication</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
               <span className="text-xs font-black uppercase tracking-widest">Global Support Coverage</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
               <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4" /></div>
               <span className="text-xs font-black uppercase tracking-widest">Privacy Protected Sessions</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-2 shadow-2xl relative overflow-hidden h-[600px] flex items-center justify-center">
           <iframe 
             src="https://docs.google.com/forms/d/e/1FAIpQLSd6EmbtA3L2tRDLANoqVOMpLrfzl01y-hUOUfuqrwpIukcOBg/viewform?embedded=true" 
             className="w-full h-full border-0 rounded-[2rem]"
             frameBorder="0" 
             marginHeight={0} 
             marginWidth={0}
           >
             Loading…
           </iframe>
        </div>
      </div>
    </div>
  );
};

export default Contact;
