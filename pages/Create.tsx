
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Wand2, Sparkles, Send, Eye, Upload, Image as ImageIcon, 
  X, Loader2, RefreshCw, ChevronDown, Terminal, 
  Code as CodeIcon, Play, Save, AlertCircle, Cpu, Zap, Settings 
} from 'lucide-react';
import { User, GENRES, Genre } from '../types';
import { publishGame, getAppState } from '../store';
import { GoogleGenAI } from "@google/genai";
import { moderateContent } from '../moderation';

interface CreateProps {
  user: User;
  onPublish: () => void;
  t: any;
}

const GAME_PROMPT_POOL = [
  "Create a neon-lit infinite space shooter where the player is a glowing triangle.",
  "Build a classic snake game with a cosmic theme and teleporting walls.",
  "Develop a rhythm game where you click falling stars to the beat of an imaginary synthwave track.",
  "Design a 2D physics-based game where you toss junk into a black hole to score points.",
  "Create a memory match game using celestial bodies like planets, nebulas, and black holes.",
  "Build a platformer where gravity flips every 5 seconds.",
  "Construct a tower defense game where you protect a space station from incoming asteroids.",
  "Develop a clicker game about harvesting energy from a dying star.",
  "Design a simple typing game where you blast incoming comets by typing their names.",
  "Create a breakout clone where the bricks are alien ships that move side to side."
];

const Create: React.FC<CreateProps> = ({ user, onPublish, t }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appState = getAppState();
  
  // Playground State
  const [activeTab, setActiveTab] = useState<'architect' | 'source' | 'preview' | 'logs'>('architect');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const [logs, setLogs] = useState<{ type: 'info' | 'error' | 'success' | 'warning', message: string, timestamp: string }[]>([]);
  
  // Image Generation/Upload
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  // Metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<Genre>('Arcade');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'moderating'>('idle');

  const addLog = (type: 'info' | 'error' | 'success' | 'warning', message: string) => {
    setLogs(prev => [{ type, message, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleRandomPrompt = () => {
    const randomIdx = Math.floor(Math.random() * GAME_PROMPT_POOL.length);
    setPrompt(GAME_PROMPT_POOL[randomIdx]);
    addLog('info', `Suggestion: ${GAME_PROMPT_POOL[randomIdx]}`);
  };

  const handleGenerate = async () => {
    const activeKey = appState.codingKey || process.env.API_KEY;
    if (!prompt.trim() || !activeKey) {
      addLog('error', 'Missing Coding API Key. Check Settings.');
      return;
    }

    setIsGenerating(true);
    setStatus('moderating');
    addLog('info', t.create.moderation.checking);
    
    try {
      // Step 1: Moderation Check
      const modResult = await moderateContent(prompt, activeKey);
      if (!modResult.isSafe) {
        addLog('error', `${t.create.moderation.unsafe} REASON: ${modResult.reason}`);
        setStatus('error');
        setIsGenerating(false);
        return;
      }

      addLog('success', 'Prompt cleared moderation.');
      addLog('info', 'Connecting to Logic AI...');
      
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const fullPrompt = `Generate a fully functional, single-file HTML5 game based on this request: "${prompt}". 
      Requirements: 1. Vanilla JS/HTML/CSS only. 2. Modern dark UI. 3. Playable with mouse/keyboard. 
      Return ONLY the code block. Start with <!DOCTYPE html>.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: fullPrompt,
        config: { temperature: 0.7 },
      });
      
      const code = response.text || '';
      const cleaned = code.replace(/```html|```/g, '').trim();
      setGeneratedCode(cleaned);
      addLog('success', 'Game code ready.');
      setActiveTab('source');
      setStatus('idle');
    } catch (error: any) {
      addLog('error', `Logic Error: ${error.message}`);
      setStatus('error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    const activeKey = appState.imageKey || process.env.API_KEY;
    if (!imagePrompt.trim() || !activeKey) {
      addLog('error', 'Missing Image API Key. Check Settings.');
      return;
    }
    setIsGeneratingImage(true);
    addLog('info', 'Scanning image prompt...');
    try {
      const modResult = await moderateContent(imagePrompt, activeKey);
      if (!modResult.isSafe) {
        addLog('error', `Visual violation: ${modResult.reason}`);
        setIsGeneratingImage(false);
        return;
      }

      addLog('info', 'Connecting to Visual AI...');
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A high-quality cosmic game cover art for a game titled "${title || 'Untitled'}": ${imagePrompt}. Style: Cinematic, digital art, vibrant cosmic colors.` }] },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        setCoverImage(`data:image/png;base64,${part.inlineData.data}`);
        addLog('success', 'Image created.');
      } else {
        throw new Error("No image data.");
      }
    } catch (error: any) {
      addLog('error', `Visual Error: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedCode) return addLog('error', 'No code to save.');
    if (!title) return addLog('error', 'Game title is required.');

    const activeKey = appState.codingKey || process.env.API_KEY;
    if (!activeKey) return addLog('error', 'Key required for final safety scan.');

    setStatus('moderating');
    addLog('info', 'Performing final safety scan for publication...');

    try {
      const fullContentToMod = `Title: ${title}\nDescription: ${description}\nCode Snippet: ${generatedCode.substring(0, 1000)}`;
      const modResult = await moderateContent(fullContentToMod, activeKey);

      if (!modResult.isSafe) {
        addLog('error', `Publication rejected: ${modResult.reason}`);
        setStatus('error');
        return;
      }

      publishGame({
        title,
        description,
        genre: selectedGenre,
        htmlCode: generatedCode,
        coverImage: coverImage || undefined,
        creator: user.username
      });

      setStatus('success');
      addLog('success', `Game "${title}" saved.`);
      onPublish();
      setTimeout(() => navigate('/my-games'), 1500);
    } catch (error) {
      addLog('error', 'Final scan failed.');
      setStatus('error');
    }
  };

  const isKeyMissing = !(appState.codingKey || process.env.API_KEY);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black font-space text-white uppercase tracking-tighter leading-none">{t.create.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${isKeyMissing ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {isKeyMissing ? t.create.statusOffline : t.create.statusOnline}
              </span>
            </div>
          </div>
        </div>

        {isKeyMissing && (
          <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">{t.create.noApiKey}</span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button 
            onClick={handlePublish}
            disabled={!generatedCode || status === 'success' || status === 'moderating'}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20"
          >
            {status === 'moderating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'moderating' ? 'Scanning...' : t.create.commit}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <Settings className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-widest">{t.create.metadata}</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">{t.create.gameTitle}</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-indigo-400 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
                  placeholder="My New Game"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">{t.create.genre}</label>
                <div className="relative">
                  <select 
                    value={selectedGenre} 
                    onChange={(e) => setSelectedGenre(e.target.value as Genre)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 appearance-none outline-none focus:border-indigo-500 transition-all"
                  >
                    {GENRES.map(g => <option key={g} value={g}>{t.genres[g] || g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-700 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5 ml-1">{t.create.description}</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-400 min-h-[80px] focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
                  placeholder="Tell people about your game..."
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <ImageIcon className="w-4 h-4" />
              <h2 className="text-xs font-black uppercase tracking-widest">{t.create.visualCore}</h2>
            </div>
            
            <div className="space-y-4">
              <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative group">
                {coverImage ? (
                  <img src={coverImage} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-slate-900" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white" title="Upload">
                    <Upload className="w-4 h-4" />
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if(f) {
                      const r = new FileReader();
                      r.onload = (ev) => setCoverImage(ev.target?.result as string);
                      r.readAsDataURL(f);
                    }
                  }} />
                </div>
              </div>
              <textarea 
                value={imagePrompt} 
                onChange={(e) => setImagePrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-400 min-h-[60px] focus:border-indigo-500 outline-none transition-all placeholder:text-slate-800" 
                placeholder="Image style description..."
              />
              <button 
                onClick={handleGenerateImage}
                disabled={isGeneratingImage || !imagePrompt}
                className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                {t.create.renderVisual}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 flex flex-col min-h-[600px]">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-grow flex flex-col">
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <TabButton active={activeTab === 'architect'} onClick={() => setActiveTab('architect')} icon={<Wand2 className="w-3.5 h-3.5" />} label={t.create.architectTab} />
              <TabButton active={activeTab === 'source'} onClick={() => setActiveTab('source')} icon={<CodeIcon className="w-3.5 h-3.5" />} label={t.create.sourceTab} />
              <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Play className="w-3.5 h-3.5" />} label={t.create.previewTab} />
              <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Terminal className="w-3.5 h-3.5" />} label={t.create.consoleTab} />
            </div>

            <div className="flex-grow p-0 relative overflow-hidden">
              {activeTab === 'architect' && (
                <div className="h-full flex flex-col p-8 animate-in slide-in-from-right duration-300">
                  <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.create.builderTitle}</h3>
                    <button 
                      onClick={handleRandomPrompt}
                      className="text-[10px] font-black text-indigo-400 hover:text-white flex items-center gap-2 uppercase tracking-widest transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {t.create.randomPrompt}
                    </button>
                  </div>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-indigo-100 font-light text-lg outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all no-scrollbar placeholder:text-slate-800 resize-none mb-6"
                    placeholder="Describe your game idea here..."
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full bg-white text-black hover:bg-indigo-400 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all active:scale-[0.98] disabled:opacity-30"
                  >
                    {isGenerating ? (
                      <span className="flex items-center justify-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {status === 'moderating' ? 'Scanning...' : t.create.generating}
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-3">
                        <Send className="w-5 h-5" />
                        {t.create.generateBtn}
                      </span>
                    )}
                  </button>
                </div>
              )}

              {activeTab === 'source' && (
                <div className="h-full bg-[#1e1e1e] p-0 flex flex-col font-mono text-sm animate-in slide-in-from-right duration-300">
                  <div className="bg-[#252526] px-4 py-2 border-b border-slate-800/30 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">source.html</span>
                  </div>
                  <textarea 
                    value={generatedCode}
                    onChange={(e) => setGeneratedCode(e.target.value)}
                    className="flex-grow w-full bg-[#1e1e1e] text-[#d4d4d4] p-6 outline-none resize-none no-scrollbar font-mono leading-relaxed selection:bg-indigo-500/30"
                    placeholder="<!-- Code will appear here -->"
                    spellCheck={false}
                  />
                </div>
              )}

              {activeTab === 'preview' && (
                <div className="h-full bg-black flex items-center justify-center animate-in zoom-in-95 duration-300">
                  {generatedCode ? (
                    <iframe 
                      srcDoc={generatedCode}
                      title="Playground Preview"
                      className="w-full h-full border-0"
                      sandbox="allow-scripts allow-modals allow-forms"
                    />
                  ) : (
                    <div className="text-center">
                      <Zap className="w-16 h-16 text-slate-900 mx-auto mb-4 animate-pulse" />
                      <p className="text-slate-700 font-bold uppercase tracking-widest text-xs">Waiting for game code</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="h-full bg-[#1e1e1e] p-6 font-mono text-xs overflow-y-auto no-scrollbar animate-in slide-in-from-right duration-300">
                  {logs.length === 0 ? (
                    <div className="text-slate-800">Waiting for activity...</div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((log, i) => (
                        <div key={i} className={`flex gap-3 ${
                          log.type === 'error' ? 'text-red-400' : 
                          log.type === 'success' ? 'text-green-400' : 
                          log.type === 'warning' ? 'text-amber-400' :
                          'text-indigo-400'
                        }`}>
                          <span className="opacity-30">[{log.timestamp}]</span>
                          <span>{log.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
      active ? 'text-white border-indigo-500 bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-400'
    }`}
  >
    {icon}
    {label}
  </button>
);

export default Create;
