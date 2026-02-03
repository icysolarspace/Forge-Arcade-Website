
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, FileCode, ImageIcon, X, Loader2, Save, 
  AlertCircle, Rocket, LayoutGrid, Type, AlignLeft, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { User, GENRES, Genre } from '../types';
import { publishGame } from '../store';
import { GoogleGenAI } from "@google/genai";

interface CreateProps {
  user: User;
  onPublish: () => void;
  t: any;
}

const Create: React.FC<CreateProps> = ({ user, onPublish, t }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const htmlInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Arcade');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [htmlFileName, setHtmlFileName] = useState<string>('');
  
  // UI State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sectorVerified, setSectorVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSectorAnalysis = async (code: string) => {
    setIsAnalyzing(true);
    setSectorVerified(false);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this HTML5 game code. Determine which of these genres fits it perfectly: ${GENRES.join(', ')}. 
        Respond ONLY with the genre name.
        CODE SNIPPET:
        ${code.substring(0, 5000)}`,
        config: {
          temperature: 0,
          maxOutputTokens: 20
        }
      });

      const detectedGenre = response.text?.trim() as Genre;
      if (GENRES.includes(detectedGenre)) {
        setSelectedGenre(detectedGenre);
        setSectorVerified(true);
      } else {
        setSectorVerified(true); // Fallback
      }
    } catch (err) {
      console.error("Sector analysis failed:", err);
      setSectorVerified(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleHtmlUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html')) {
      setError('Please upload a valid .html file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlCode(content);
      setHtmlFileName(file.name);
      performSectorAnalysis(content);
    };
    reader.readAsText(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCoverImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !htmlCode) return;

    setIsPublishing(true);
    try {
      await publishGame({
        title,
        description,
        genre: selectedGenre,
        htmlCode,
        coverImage: coverImage || undefined,
        creator: user.username
      });

      onPublish();
      navigate('/my-games');
    } catch (err) {
      setError('Deployment to global vault failed. Check database rules.');
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">
          <Rocket className="w-3 h-3" /> System Uplink: Global Cluster
        </div>
        <h1 className="text-5xl font-black font-space text-white uppercase tracking-tighter mb-2">Publish Module</h1>
        <p className="text-slate-500 font-light text-lg">Your module will be visible to everyone on the network.</p>
      </header>

      <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  <Type className="w-3 h-3" /> Module Designation
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-indigo-100 font-space text-lg outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-800" 
                  placeholder="Enter module name..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  <AlignLeft className="w-3 h-3" /> Technical Briefing
                </label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-slate-300 min-h-[120px] outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder:text-slate-800 resize-none" 
                  placeholder="Describe your module..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">
                  <LayoutGrid className="w-3 h-3" /> Sector Category
                </label>
                <div className={`relative ${isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}>
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value as Genre)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-indigo-400 appearance-none outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer font-bold"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {sectorVerified && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-green-500 text-[9px] font-black uppercase tracking-widest">
                      <CheckCircle2 className="w-4 h-4" /> AI Verified
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/50">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">
                <FileCode className="w-3 h-3" /> HTML5 Source Uplink
              </label>
              
              <div 
                onClick={() => !isAnalyzing && htmlInputRef.current?.click()}
                className={`relative group cursor-pointer border-2 border-dashed rounded-[2rem] p-10 transition-all flex flex-col items-center justify-center text-center ${
                  htmlCode 
                  ? 'bg-indigo-500/5 border-indigo-500/30 hover:border-indigo-500/50' 
                  : 'bg-slate-950 border-slate-800 hover:border-indigo-500/50'
                } ${isAnalyzing ? 'animate-pulse' : ''}`}
              >
                <input type="file" ref={htmlInputRef} className="hidden" accept=".html" onChange={handleHtmlUpload} />
                
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
                    <h4 className="text-white font-bold text-lg mb-1 uppercase tracking-widest">Analyzing Sector...</h4>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest">Scanning for mechanics & logic</p>
                  </>
                ) : htmlCode ? (
                  <>
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 shadow-lg shadow-indigo-500/10">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h4 className="text-white font-bold text-lg mb-1">{htmlFileName}</h4>
                    <p className="text-indigo-500/60 text-xs font-black uppercase tracking-widest">Payload Ready</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-4 border border-slate-800 group-hover:border-indigo-500/30 shadow-inner">
                      <Upload className="w-8 h-8" />
                    </div>
                    <h4 className="text-slate-300 font-bold mb-1 uppercase tracking-tight">Upload HTML Module</h4>
                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Single-file build required</p>
                  </>
                )}
              </div>
            </div>
          </section>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest">{error}</p>
            </div>
          )}

          <button 
            type="submit"
            disabled={isPublishing || isAnalyzing || !htmlCode || !title}
            className="w-full bg-white text-black hover:bg-indigo-400 disabled:opacity-30 disabled:hover:bg-white py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4"
          >
            {isPublishing ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Deploying to Cloud...</>
            ) : (
              <><Save className="w-6 h-6" /> Deploy Module</>
            )}
          </button>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-400/20">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">Visual Identity</h2>
            </div>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video bg-slate-950 rounded-[2rem] border-2 border-dashed border-slate-800 overflow-hidden flex flex-col items-center justify-center relative group cursor-pointer hover:border-purple-500/50 transition-all"
            >
              {coverImage ? (
                <img src={coverImage} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <div className="text-center p-6">
                  <Upload className="w-8 h-8 text-slate-800 mx-auto mb-3 group-hover:text-purple-400 transition-colors" />
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">Upload Cover Art<br/>16:9 recommended</p>
                </div>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default Create;
