
import { createClient } from '@supabase/supabase-js';
import { Game, User, AppState, Language } from './types';

// Supabase Credentials
const SUPABASE_URL = 'https://ikjiwaxclggssyvzozivv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlraml3YXhjbGdzc3l2em9jaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMzcwMTcsImV4cCI6MjA4NTcxMzAxN30._plOEdSdoV8T2mG5epHW1CeMFtWrPFDrtKrj1sEfZ6M';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const STORAGE_KEY = 'forge_arcade_vault_v1';

const DEFAULT_STATE: AppState = {
  currentUser: null,
  allUsers: [],
  games: [], 
  language: 'en',
  communityGames: []
};

export const getAppState = (): AppState => {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) return DEFAULT_STATE;
  try {
    const parsed = JSON.parse(rawData);
    return { ...DEFAULT_STATE, ...parsed, communityGames: [] };
  } catch (e) {
    return DEFAULT_STATE;
  }
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const fetchGlobalData = async (): Promise<{ games: Game[], users: User[], online: boolean, error?: string }> => {
  try {
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .order('createdAt', { ascending: false });

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (gamesError || usersError) {
      const errMsg = gamesError?.message || usersError?.message || "Unknown Database Error";
      const local = getAppState();
      return { games: local.games || [], users: local.allUsers || [], online: false, error: errMsg };
    }

    const local = getAppState();
    // Merge logic: Keep local games that might not be in the cloud yet
    const cloudIds = new Set((games || []).map(g => g.id));
    const localOnlyGames = (local.games || []).filter(g => !cloudIds.has(g.id));
    
    const newState = { 
      ...local, 
      games: [...(games || []), ...localOnlyGames], 
      allUsers: users || [] 
    };
    saveAppState(newState);

    return {
      games: games || [],
      users: users || [],
      online: true
    };
  } catch (err: any) {
    const local = getAppState();
    return { games: local.games || [], users: local.allUsers || [], online: false, error: err.message };
  }
};

/**
 * Pushes any games found in local storage that aren't in the cloud.
 */
export const syncLocalToCloud = async (): Promise<{ success: number, failed: number }> => {
  const local = getAppState();
  const localGames = local.games || [];
  
  // 1. Get current cloud IDs
  const { data: cloudGames } = await supabase.from('games').select('id');
  const cloudIds = new Set((cloudGames || []).map(g => g.id));
  
  // 2. Identify missing games
  const toUpload = localGames.filter(g => !cloudIds.has(g.id));
  
  let successCount = 0;
  let failCount = 0;

  for (const game of toUpload) {
    try {
      const { error } = await supabase.from('games').insert([game]);
      if (error) failCount++;
      else successCount++;
    } catch (e) {
      failCount++;
    }
  }

  return { success: successCount, failed: failCount };
};

export const publishGame = async (gameData: Omit<Game, 'id' | 'createdAt' | 'plays' | 'reactions' | 'userReactions' | 'moderated'>) => {
  const newGame: Game = {
    ...gameData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    plays: 0,
    reactions: { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 },
    userReactions: {},
    moderated: true,
    isLive: true 
  };

  try {
    const { data, error } = await supabase.from('games').insert([newGame]).select();
    if (!error && data) return data[0];
  } catch (e) {}

  const state = getAppState();
  state.games = [newGame, ...state.games];
  saveAppState(state);
  return newGame;
};

export const deleteGame = async (gameId: string) => {
  try {
    await supabase.from('games').delete().eq('id', gameId);
  } catch (e) {}
  const state = getAppState();
  state.games = state.games.filter(g => g.id !== gameId);
  saveAppState(state);
};

export const updateGame = async (updatedGame: Game) => {
  try {
    await supabase.from('games').update({ 
      title: updatedGame.title,
      description: updatedGame.description,
      genre: updatedGame.genre,
      htmlCode: updatedGame.htmlCode,
      coverImage: updatedGame.coverImage,
    }).eq('id', updatedGame.id);
  } catch (e) {}
  const state = getAppState();
  state.games = state.games.map(g => g.id === updatedGame.id ? updatedGame : g);
  saveAppState(state);
};

export const logoutUser = () => {
  const state = getAppState();
  state.currentUser = null;
  saveAppState(state);
};

export const loginUser = async (username: string): Promise<User | null> => {
  const cleanUsername = username.trim().toLowerCase();
  try {
    const { data, error } = await supabase.from('users').select('*').ilike('username', cleanUsername).single();
    if (!error && data) {
      const state = getAppState();
      state.currentUser = data;
      saveAppState(state);
      return data;
    }
  } catch (e) {}
  const state = getAppState();
  const localUser = state.allUsers.find(u => u.username.toLowerCase() === cleanUsername);
  if (localUser) {
    state.currentUser = localUser;
    saveAppState(state);
    return localUser;
  }
  return null;
};

export const registerUser = async (username: string): Promise<User | null> => {
  const cleanUsername = username.trim();
  const newUser: User = { username: cleanUsername, joinedAt: Date.now() };
  try {
    const { data, error } = await supabase.from('users').insert([newUser]).select().single();
    if (!error && data) {
      const state = getAppState();
      state.currentUser = data;
      saveAppState(state);
      return data;
    }
  } catch (e) {}
  const state = getAppState();
  if (state.allUsers.some(u => u.username.toLowerCase() === cleanUsername.toLowerCase())) return null;
  state.allUsers.push(newUser);
  state.currentUser = newUser;
  saveAppState(state);
  return newUser;
};

export const addReaction = async (gameId: string, emoji: string, username: string) => {
  try {
    const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single();
    if (game) {
      const reactions = game.reactions || { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 };
      const userReactions = game.userReactions || {};
      const existingReaction = userReactions[username];
      if (existingReaction === emoji) return;
      if (existingReaction) reactions[existingReaction] = Math.max(0, (reactions[existingReaction] || 0) - 1);
      userReactions[username] = emoji;
      reactions[emoji] = (reactions[emoji] || 0) + 1;
      await supabase.from('games').update({ reactions, userReactions }).eq('id', gameId);
    }
  } catch (e) {}
};

export const setLanguage = (lang: Language) => {
  const state = getAppState();
  state.language = lang;
  saveAppState(state);
};

export const downloadUserData = (format: 'json' | 'html', user: User, games: Game[]) => {
  const data = JSON.stringify({ user, games, timestamp: Date.now() });
  const blob = format === 'json' 
    ? new Blob([data], { type: 'application/json' })
    : new Blob([`<!DOCTYPE html><html><body><script id="vault-data" type="application/json">${data}</script></body></html>`], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `forge_vault_${user.username}.${format}`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    if (!parsed || !parsed.user) return false;
    const state = getAppState();
    state.currentUser = parsed.user;
    if (parsed.games) state.games = [...parsed.games, ...state.games];
    saveAppState(state);
    return true;
  } catch (e) { return false; }
};
