
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Wand2, Sparkles, Send, Eye, Upload, Image as ImageIcon, 
  X, Loader2, RefreshCw, ChevronDown, Terminal, 
  Code as CodeIcon, Play, Save, AlertCircle, Cpu, Zap, Settings, ArrowLeft, Bug 
} from 'lucide-react';
import { User, GENRES, Genre, Game } from '../types';
import { updateGame, getAppState } from '../store';
import { GoogleGenAI } from "@google/genai";
import { moderateContent } from '../moderation';

interface EditGameProps {
  user: User;
  games: Game[];
  onUpdate: () => void;
  t: any;
}

const FIX_PROMPT_POOL = [
  "Improve player movement fluidity and acceleration",
  "Add a 'high score' local storage save system",
  "Make the enemies spawn 15% faster and add more variety",
  "Add a 'pause' menu with a resume and restart button",
  "Improve the UI responsiveness for various screen sizes",
  "Add a 'tutorial' text overlay at the start of the game",
  "Change the color palette to be more neon-retro and vibrant",
  "Add a screen shake effect when taking damage or scoring",
  "Implement a level progression system with increasing difficulty",
  "Add sound effect triggers for jumps, shoots, and hits",
  "Fix any potential memory leaks in the animation loop",
  "Improve collision detection precision for smaller objects",
  "Add a particles effect system for explosions and impacts",
  "Optimize the code for better performance on low-end devices",
  "Add a 'game over' screen with a final score display",
  "Implement a power-up system with at least 2 unique buffs",
  "Add a background music loop toggle",
  "Improve the sprite rendering to be sharper",
  "Add smooth transitions between different game states",
  "Implement a leaderboard visual (local only)",
  "Fix logic bugs where entities go off-screen",
  "Add a combo system that rewards rapid success",
  "Improve text readability by adding contrasting outlines",
  "Implement a shadow effect for all game entities",
  "Refine the AI behavior to be more challenging",
  "Add a countdown timer before the game starts",
  "Implement a 'lives' system with a heart UI",
  "Add a smooth camera follow system",
  "Improve the input handling for mobile touch controls",
  "Add a wave-based enemy system with boss encounters",
  "Refine the projectile trajectories to be more predictable",
  "Add a shop system to buy simple upgrades (placeholder logic)",
  "Fix issues with frame rate drops during heavy action",
  "Add a mini-map or radar system",
  "Improve the main menu aesthetics with animated backgrounds",
  "Add a 'daily goal' system placeholder",
  "Implement a better random number generator for loot",
  "Add a 'wind' or 'current' effect that affects movement",
  "Improve the contrast of the game's interactive elements",
  "Add a 'retry' button that instantly resets the game state"
];

const EditGame: React.FC<EditGameProps> = ({ user, games, onUpdate, t }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const appState = getAppState();
  
  const originalGame = games.find(g => g.id === id);

  // Playground State
  const [activeTab, setActiveTab] = useState<'metadata' | 'source' | 'preview' | 'logs'>('metadata');
  const [fixPrompt, setFixPrompt] = useState('');
  const [isFixing, setIsFixing] = useState(false);
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

  useEffect(() => {
    if (originalGame) {
      if (originalGame.creator !== user.username) {
        navigate('/');
        return;
      }
      setTitle(originalGame.title);
      setDescription(originalGame.description);
      setSelectedGenre(originalGame.genre);
      setGeneratedCode(originalGame.htmlCode);
      setCoverImage(originalGame.coverImage || null);
    }
  }, [originalGame, user, navigate]);

  const addLog = (type: 'info' | 'error' | 'success' | 'warning', message: string) => {
    setLogs(prev => [{ type, message, timestamp: new Date().toLocaleTimeString() }, ...prev]);
  };

  const handleRandomFix = () => {
    const randomIdx = Math.floor(Math.random() * FIX_PROMPT_POOL.length);
    setFixPrompt(FIX_PROMPT_POOL[randomIdx]);
    addLog('info', `Suggestion: ${FIX_PROMPT_POOL[randomIdx]}`);
  };

  const handleFix = async () => {
    const activeKey = appState.codingKey || process.env.API_KEY;
    if (!fixPrompt.trim() || !generatedCode || !activeKey) return;

    setIsFixing(true);
    setStatus('moderating');
    addLog('info', 'Scanning update request...');
    
    try {
      const modResult = await moderateContent(fixPrompt, activeKey);
      if (!modResult.isSafe) {
        addLog('error', `Update violation: ${modResult.reason}`);
        setStatus('error');
        setIsFixing(false);
        return;
      }

      addLog('info', 'Updating game...');
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const fullPrompt = `You are an expert game developer. Take the following HTML/JS/CSS code and apply this fix/improvement: "${fixPrompt}". 
      Requirements: 
      1. DO NOT BREAK existing features. 
      2. Refine the logic while keeping the single-file structure. 
      3. Maintain the current modern dark UI style. 
      4. Return ONLY the full updated code block.
      
      Current Code:
      ${generatedCode}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: fullPrompt,
        config: { temperature: 0.5 },
      });
      
      const code = response.text || '';
      const cleaned = code.replace(/```html|```/g, '').trim();
      setGeneratedCode(cleaned);
      addLog('success', 'Game updated.');
      setActiveTab('preview');
      setStatus('idle');
    } catch (error: any) {
      addLog('error', `Error: ${error.message}`);
      setStatus('error');
    } finally {
      setIsFixing(false);
    }
  };

  const handleGenerateImage = async () => {
    const activeKey = appState.imageKey || process.env.API_KEY;
    if (!imagePrompt.trim() || !activeKey) return;
    setIsGeneratingImage(true);
    addLog('info', 'Scanning cover prompt...');
    try {
      const modResult = await moderateContent(imagePrompt, activeKey);
      if (!modResult.isSafe) {
        addLog('error', `Visual violation: ${modResult.reason}`);
        setIsGeneratingImage(false);
        return;
      }

      addLog('info', 'Updating cover...');
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A high-quality cosmic game cover art for a game titled "${title}": ${imagePrompt}. Style: Cinematic, digital art, vibrant cosmic colors.` }] },
        config: { imageConfig: { aspectRatio: "16:9" } },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        setCoverImage(`data:image/png;base64,${part.inlineData.data}`);
        addLog('success', 'Cover updated.');
      }
    } catch (error: any) {
      addLog('error', `Error: ${error.message}`);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUpdate = async () => {
    if (!originalGame) return;
    const activeKey = appState.codingKey || process.env.API_KEY;
    if (!activeKey) return addLog('error', 'Key required for safety scan.');

    setStatus('moderating');
    addLog('info', 'Verifying safety of changes...');

    try {
      const fullContentToMod = `Title: ${title}\nDescription: ${description}\nCode Snippet: ${generatedCode.substring(0, 1000)}`;
      const modResult = await moderateContent(fullContentToMod, activeKey);

      if (!modResult.isSafe) {
        addLog('error', `Changes rejected: ${modResult.reason}`);
        setStatus('error');
        return;
      }

      updateGame({
        ...originalGame,
        title,
        description,
        genre: selectedGenre,
        htmlCode: generatedCode,
        coverImage: coverImage || undefined
      });

      setStatus('success');
      addLog('success', `Game "${title}" saved.`);
      onUpdate();
      setTimeout(() => navigate(`/play/${originalGame.id}`), 1500);
    } catch (error) {
      addLog('error', 'Safety verification failed.');
      setStatus('error');
    }
  };

  if (!originalGame) return null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/play/${originalGame.id}`} className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <div>
            <h1 className="text-xl font-black font-space text-white uppercase tracking-tighter leading-none">EDITING: {originalGame.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">EDITOR MODE</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleUpdate}
            disabled={status === 'success' || status === 'moderating'}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-indigo-600/20"
          >
            {status === 'moderating' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {status === 'moderating' ? 'Verifying...' : t.create.commit}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
              <Settings className="w-4 h-4" /> {t.create.metadata}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">{t.create.gameTitle}</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-indigo-400 outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">{t.create.genre}</label>
                <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value as Genre)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 outline-none">
                  {GENRES.map(g => <option key={g} value={g}>{t.genres[g] || g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-700 uppercase tracking-widest mb-1.5">{t.create.description}</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-400 min-h-[80px] outline-none" />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-6 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> {t.create.visualCore}
            </h2>
            <div className="space-y-4">
              <div className="aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center relative group">
                {coverImage ? <img src={coverImage} className="w-full h-full object-cover" alt="Cover" /> : <ImageIcon className="w-8 h-8 text-slate-900" />}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
                  <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white"><Upload className="w-4 h-4" /></button>
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
              <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 min-h-[60px] outline-none" placeholder="Image description..." />
              <button onClick={handleGenerateImage} disabled={isGeneratingImage || !imagePrompt} className="w-full bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-600/30 transition-all flex items-center justify-center gap-2">
                {isGeneratingImage ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />} {t.create.renderVisual}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-9 flex flex-col min-h-[600px]">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex-grow flex flex-col">
            <div className="bg-slate-950/80 border-b border-slate-800 px-4 flex items-center gap-1 overflow-x-auto no-scrollbar">
              <TabButton active={activeTab === 'metadata'} onClick={() => setActiveTab('metadata')} icon={<Bug className="w-3.5 h-3.5" />} label={t.create.fixTab} />
              <TabButton active={activeTab === 'source'} onClick={() => setActiveTab('source')} icon={<CodeIcon className="w-3.5 h-3.5" />} label={t.create.sourceTab} />
              <TabButton active={activeTab === 'preview'} onClick={() => setActiveTab('preview')} icon={<Play className="w-3.5 h-3.5" />} label={t.create.previewTab} />
              <TabButton active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Terminal className="w-3.5 h-3.5" />} label={t.create.consoleTab} />
            </div>

            <div className="flex-grow p-0 relative overflow-hidden">
              {activeTab === 'metadata' && (
                <div className="h-full flex flex-col p-8 animate-in slide-in-from-right duration-300">
                  <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.create.fixTitle}</h3>
                    <button onClick={handleRandomFix} className="text-[10px] font-black text-indigo-400 hover:text-white flex items-center gap-2 uppercase tracking-widest">
                      <RefreshCw className="w-3 h-3" /> {t.create.randomFix}
                    </button>
                  </div>
                  <textarea 
                    value={fixPrompt}
                    onChange={(e) => setFixPrompt(e.target.value)}
                    className="flex-grow w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-indigo-100 font-light text-lg outline-none no-scrollbar placeholder:text-slate-800 resize-none mb-6"
                    placeholder="Tell AI what to change..."
                  />
                  <button onClick={handleFix} disabled={isFixing || !fixPrompt} className="w-full bg-white text-black hover:bg-indigo-400 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all disabled:opacity-30">
                    {isFixing ? <span className="flex items-center justify-center gap-3"><Loader2 className="w-5 h-5 animate-spin" /> {t.create.fixing}</span> : <span className="flex items-center justify-center gap-3"><Bug className="w-5 h-5" /> {t.create.fixBtn}</span>}
                  </button>
                </div>
              )}

              {activeTab === 'source' && (
                <textarea value={generatedCode} onChange={(e) => setGeneratedCode(e.target.value)} className="h-full w-full bg-[#1e1e1e] text-[#d4d4d4] p-6 outline-none resize-none font-mono text-sm leading-relaxed" spellCheck={false} />
              )}

              {activeTab === 'preview' && (
                <div className="h-full bg-black flex items-center justify-center">
                  <iframe srcDoc={generatedCode} className="w-full h-full border-0" sandbox="allow-scripts allow-modals allow-forms" />
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="h-full bg-[#1e1e1e] p-6 font-mono text-xs overflow-y-auto space-y-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${active ? 'text-white border-indigo-500 bg-slate-900/40' : 'text-slate-600 border-transparent hover:text-slate-400'}`}>{icon}{label}</button>
);

export default EditGame;
