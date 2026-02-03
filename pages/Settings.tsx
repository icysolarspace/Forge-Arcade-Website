
import React, { useState, useRef, useEffect } from 'react';
import { User, Game, Language } from '../types';
import { getAppState, saveAppState, downloadUserData, importData, setLanguage, updateKeys } from '../store';
import { 
  User as UserIcon, LogOut, Download, ShieldCheck, FileJson, 
  FileCode, CheckCircle, Info, Upload, Image as ImageIcon, Sparkles, Loader2, RefreshCw, AlertTriangle, Globe, Key, Activity, XCircle, Mail
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Link } from 'react-router-dom';

interface SettingsProps {
  user: User;
  onUpdate: () => void;
  onLogout: () => void;
  t: any;
  currentLang: Language;
}

const Settings: React.FC<SettingsProps> = ({ user, onUpdate, onLogout, t, currentLang }) => {
  const state = getAppState();
  const [username, setUsername] = useState(user.username);
  const [saved, setSaved] = useState(false);
  const [isGeneratingPic, setIsGeneratingPic] = useState(false);
  const [picPrompt, setPicPrompt] = useState('');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // API Key States
  const [codingKey, setCodingKey] = useState(state.codingKey || '');
  const [imageKey, setImageKey] = useState(state.imageKey || '');
  const [codingStatus, setCodingStatus] = useState<'idle' | 'valid' | 'invalid' | 'loading'>('idle');
  const [imageStatus, setImageStatus] = useState<'idle' | 'valid' | 'invalid' | 'loading'>('idle');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateUsername = () => {
    const appState = getAppState();
    if (appState.currentUser) {
      const oldUsername = appState.currentUser.username;
      appState.currentUser.username = username;
      appState.allUsers = appState.allUsers.map(u => u.username === oldUsername ? { ...u, username } : u);
      appState.games = appState.games.map(g => g.creator === oldUsername ? { ...g, creator: username } : g);
      saveAppState(appState);
      onUpdate();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleUpdateKeys = () => {
    updateKeys(codingKey, imageKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    onUpdate();
  };

  const testKey = async (key: string, setStatus: (s: any) => void) => {
    if (!key) return;
    setStatus('loading');
    try {
      const ai = new GoogleGenAI({ apiKey: key });
      await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "test",
        config: { maxOutputTokens: 1 }
      });
      setStatus('valid');
    } catch (e) {
      console.error(e);
      setStatus('invalid');
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = e.target.value as Language;
    setLanguage(lang);
    onUpdate();
  };

  const handleGenerateProfilePic = async () => {
    const activeKey = imageKey || state.imageKey || process.env.API_KEY;
    if (!picPrompt.trim() || !activeKey) return;
    setIsGeneratingPic(true);
    try {
      const ai = new GoogleGenAI({ apiKey: activeKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: `A professional, stylized profile avatar of a ${picPrompt}. Digital art, clean composition.` }] },
        config: { imageConfig: { aspectRatio: "1:1" } },
      });

      const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
      if (part?.inlineData) {
        const appState = getAppState();
        const b64 = `data:image/png;base64,${part.inlineData.data}`;
        if (appState.currentUser) {
          appState.currentUser.profilePicture = b64;
          appState.allUsers = appState.allUsers.map(u => u.username === user.username ? { ...u, profilePicture: b64 } : u);
          saveAppState(appState);
          onUpdate();
          setPicPrompt('');
        }
      }
    } catch (error) {
      console.error(error);
      alert("Avatar failed. Check your Image API Key.");
    } finally {
      setIsGeneratingPic(false);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      let jsonData = content;
      if (file.name.endsWith('.html')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        jsonData = doc.getElementById('vault-data')?.textContent || '';
      }

      const success = importData(jsonData);
      if (success) {
        setImportStatus('success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setImportStatus('error');
        setTimeout(() => setImportStatus('idle'), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <header className="mb-12">
        <h1 className="text-4xl font-black font-space text-white uppercase tracking-tighter mb-2">{t.settings.title}</h1>
        <p className="text-slate-500 font-light">{t.settings.sub}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          {/* Support Section */}
          <section className="bg-indigo-600/10 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform">
              <Mail className="w-32 h-32" />
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between relative z-10">
              <div>
                 <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight mb-2">{t.settings.contactSupport}</h2>
                 <p className="text-slate-400 text-sm font-light">Direct line to the architects.</p>
              </div>
              <a 
                href="https://docs.google.com/forms/d/e/1FAIpQLSd6EmbtA3L2tRDLANoqVOMpLrfzl01y-hUOUfuqrwpIukcOBg/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" /> Message Us
              </a>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
                <Key className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.settings.apiKeys.title}</h2>
            </div>

            <div className="space-y-8">
              {/* Coding Key */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.settings.apiKeys.codingLabel}</label>
                  <StatusBadge status={codingStatus} t={t} />
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-indigo-400 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={codingKey}
                    onChange={(e) => { setCodingKey(e.target.value); setCodingStatus('idle'); }}
                    placeholder="Enter Coding API Key..."
                  />
                  <button 
                    onClick={() => testKey(codingKey, setCodingStatus)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                    title={t.settings.apiKeys.validate}
                  >
                    <Activity className={`w-5 h-5 ${codingStatus === 'loading' ? 'animate-pulse text-indigo-400' : ''}`} />
                  </button>
                </div>
                <p className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  {t.settings.apiKeys.codingDesc}
                </p>
              </div>

              {/* Image Key */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t.settings.apiKeys.imageLabel}</label>
                  <StatusBadge status={imageStatus} t={t} />
                </div>
                <div className="flex gap-2">
                  <input 
                    type="password"
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-indigo-400 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={imageKey}
                    onChange={(e) => { setImageKey(e.target.value); setImageStatus('idle'); }}
                    placeholder="Enter Image API Key..."
                  />
                  <button 
                    onClick={() => testKey(imageKey, setImageStatus)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 transition-colors"
                    title={t.settings.apiKeys.validate}
                  >
                    <Activity className={`w-5 h-5 ${imageStatus === 'loading' ? 'animate-pulse text-purple-400' : ''}`} />
                  </button>
                </div>
                <p className="mt-2 text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  {t.settings.apiKeys.imageDesc}
                </p>
              </div>

              <button 
                onClick={handleUpdateKeys}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
              >
                Save Connection Config
              </button>
            </div>
          </section>

          {/* Avatar Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.settings.avatarTitle}</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="w-32 h-32 rounded-3xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner group relative">
                {user.profilePicture ? (
                  <img src={user.profilePicture} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <UserIcon className="w-12 h-12 text-slate-800" />
                )}
              </div>
              <div className="flex-grow space-y-4 w-full">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.settings.avatarSub}</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-300 outline-none focus:border-indigo-500"
                    value={picPrompt}
                    onChange={(e) => setPicPrompt(e.target.value)}
                  />
                  <button 
                    onClick={handleGenerateProfilePic}
                    disabled={isGeneratingPic || !picPrompt}
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-3 rounded-xl transition-all"
                  >
                    {isGeneratingPic ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Identity Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 border border-indigo-400/20">
                <UserIcon className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.settings.identity}</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">{t.settings.username}</label>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-indigo-400 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <button 
                    onClick={handleUpdateUsername}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg active:scale-95"
                  >
                    {t.settings.save}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          {/* Data Management Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 flex items-center justify-center text-purple-400 border border-purple-400/20">
                <Download className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold font-space text-white uppercase tracking-tight">{t.settings.dataTitle}</h2>
            </div>
            <p className="text-slate-500 text-sm font-light mb-8 leading-relaxed">
              {t.settings.dataSub}
            </p>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <button 
                onClick={() => downloadUserData('json', user, state.games)}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-5 rounded-2xl transition-all text-left flex items-center gap-4 group"
              >
                <FileJson className="w-8 h-8 text-indigo-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{t.settings.downloadJson}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Full Session Snapshot</p>
                </div>
              </button>
              
              <button 
                onClick={() => downloadUserData('html', user, state.games)}
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-5 rounded-2xl transition-all text-left flex items-center gap-4 group"
              >
                <FileCode className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-widest">{t.settings.downloadHtml}</h3>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Standalone Portable Archive</p>
                </div>
              </button>
            </div>

            <div className="pt-6 border-t border-slate-800">
               <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4">{t.settings.importTitle}</h3>
               <button 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-xs ${
                  importStatus === 'success' ? 'bg-green-500/10 border-green-500 text-green-400' :
                  importStatus === 'error' ? 'bg-red-500/10 border-red-500 text-red-400' :
                  'bg-slate-950 border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-white'
                }`}
               >
                 {importStatus === 'success' ? <CheckCircle className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                 {importStatus === 'success' ? 'RESTORED' : importStatus === 'error' ? 'RESTORATION FAILED' : t.settings.importBtn}
               </button>
               <input type="file" ref={fileInputRef} className="hidden" accept=".json,.html" onChange={handleImportFile} />
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <ShieldCheck className="w-32 h-32 text-green-500" />
            </div>
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-bold font-space text-white uppercase tracking-tight">{t.settings.privacyTitle}</h2>
            </div>
            <div className="space-y-4 relative z-10">
              <div className="flex gap-4 p-4 bg-green-500/5 border border-green-500/10 rounded-2xl">
                <Info className="w-5 h-5 text-green-500 shrink-0" />
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  {t.settings.privacyText}
                </p>
              </div>
            </div>
          </section>

          {/* Logout Section */}
          <section className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8">
            <button 
              onClick={onLogout}
              className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 py-4 rounded-2xl border border-red-500/20 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              {t.settings.logout}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatusBadge: React.FC<{ status: string, t: any }> = ({ status, t }) => {
  if (status === 'valid') return <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1"><CheckCircle className="w-2.5 h-2.5" /> {t.settings.apiKeys.valid}</span>;
  if (status === 'invalid') return <span className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1"><XCircle className="w-2.5 h-2.5" /> {t.settings.apiKeys.invalid}</span>;
  return <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{t.settings.apiKeys.notSet}</span>;
};

export default Settings;
