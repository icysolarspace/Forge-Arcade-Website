
import { createClient } from '@supabase/supabase-js';
import { Game, User, AppState, Language } from './types';

// Supabase Credentials (Provided by User)
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

/**
 * Gets the current SESSION state from LocalStorage (who is logged in).
 * The games list will be populated by fetchGlobalData separately.
 */
export const getAppState = (): AppState => {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) return DEFAULT_STATE;
  
  try {
    const parsed = JSON.parse(rawData);
    return {
      ...DEFAULT_STATE,
      ...parsed,
      communityGames: []
    };
  } catch (e) {
    return DEFAULT_STATE;
  }
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

/**
 * Fetches all games and users from the Supabase global database.
 */
export const fetchGlobalData = async (): Promise<{ games: Game[], users: User[] }> => {
  try {
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')
      .order('createdAt', { ascending: false });

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (gamesError || usersError) throw gamesError || usersError;

    return {
      games: games || [],
      users: users || []
    };
  } catch (err) {
    console.error("Global fetch failed:", err);
    return { games: [], users: [] };
  }
};

export const publishGame = async (gameData: Omit<Game, 'id' | 'createdAt' | 'plays' | 'reactions' | 'userReactions' | 'moderated'>) => {
  const newGame: Partial<Game> = {
    ...gameData,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    plays: 0,
    reactions: { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 },
    userReactions: {},
    moderated: true,
    isLive: true 
  };

  const { data, error } = await supabase
    .from('games')
    .insert([newGame])
    .select();

  if (error) throw error;
  return data[0];
};

export const deleteGame = async (gameId: string) => {
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId);
  
  if (error) throw error;
};

export const updateGame = async (updatedGame: Game) => {
  const { error } = await supabase
    .from('games')
    .update({ 
      title: updatedGame.title,
      description: updatedGame.description,
      genre: updatedGame.genre,
      htmlCode: updatedGame.htmlCode,
      coverImage: updatedGame.coverImage,
      moderated: true
    })
    .eq('id', updatedGame.id);

  if (error) throw error;
};

export const logoutUser = () => {
  const state = getAppState();
  state.currentUser = null;
  saveAppState(state);
};

export const loginUser = async (username: string): Promise<User | null> => {
  const cleanUsername = username.trim().toLowerCase();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .ilike('username', cleanUsername)
    .single();

  if (error || !data) return null;

  const state = getAppState();
  state.currentUser = data;
  saveAppState(state);
  return data;
};

export const registerUser = async (username: string): Promise<User | null> => {
  const cleanUsername = username.trim();
  
  // Check if exists
  const { data: existing } = await supabase
    .from('users')
    .select('username')
    .ilike('username', cleanUsername)
    .single();

  if (existing) return null;

  const newUser: User = { 
    username: cleanUsername, 
    joinedAt: Date.now() 
  };
  
  const { data, error } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) throw error;

  const state = getAppState();
  state.currentUser = data;
  saveAppState(state);
  return data;
};

export const addReaction = async (gameId: string, emoji: string, username: string) => {
  const { data: game, error: fetchError } = await supabase
    .from('games')
    .select('*')
    .eq('id', gameId)
    .single();

  if (fetchError || !game) return;

  const reactions = game.reactions || { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 };
  const userReactions = game.userReactions || {};

  const existingReaction = userReactions[username];
  if (existingReaction === emoji) return;

  if (existingReaction) {
    reactions[existingReaction] = Math.max(0, (reactions[existingReaction] || 0) - 1);
  }

  userReactions[username] = emoji;
  reactions[emoji] = (reactions[emoji] || 0) + 1;

  const { error: updateError } = await supabase
    .from('games')
    .update({ reactions, userReactions })
    .eq('id', gameId);

  if (updateError) throw updateError;
};

export const setLanguage = (lang: Language) => {
  const state = getAppState();
  state.language = lang;
  saveAppState(state);
};

// Fix: Implement downloadUserData for session backup
export const downloadUserData = (format: 'json' | 'html', user: User, games: Game[]) => {
  const data = JSON.stringify({ user, games, timestamp: Date.now() });
  const filename = `forge_vault_${user.username}_${new Date().toISOString().split('T')[0]}`;
  
  let blob: Blob;
  if (format === 'json') {
    blob = new Blob([data], { type: 'application/json' });
  } else {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head><title>ForgeArcade Vault Archive</title></head>
<body>
  <h1>ForgeArcade Vault Archive</h1>
  <p>User: ${user.username}</p>
  <script id="vault-data" type="application/json">${data}</script>
  <p>To restore, upload this file in ForgeArcade settings.</p>
</body>
</html>`;
    blob = new Blob([htmlContent], { type: 'text/html' });
  }

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format}`;
  link.click();
  URL.revokeObjectURL(url);
};

// Fix: Implement importData to restore session from a vault file
export const importData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    if (!parsed || !parsed.user) return false;
    
    const state = getAppState();
    state.currentUser = parsed.user;
    saveAppState(state);
    return true;
  } catch (e) {
    return false;
  }
};
