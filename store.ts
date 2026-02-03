
import { Game, User, AppState, Language } from './types';

const STORAGE_KEY = 'forge_arcade_vault_v1';

const DEFAULT_STATE: AppState = {
  currentUser: null,
  allUsers: [],
  games: [],
  language: 'en',
  codingKey: '',
  imageKey: ''
};

export const getAppState = (): AppState => {
  const rawData = localStorage.getItem(STORAGE_KEY);
  if (!rawData) return DEFAULT_STATE;
  
  try {
    const parsed = JSON.parse(rawData);
    const state: AppState = {
      ...DEFAULT_STATE,
      ...parsed,
      allUsers: parsed.allUsers || (parsed.currentUser ? [parsed.currentUser] : []),
      games: parsed.games || [],
      codingKey: parsed.codingKey || '',
      imageKey: parsed.imageKey || ''
    };
    return state;
  } catch (e) {
    console.error("Vault corruption detected. Returning defaults to prevent crash.");
    return DEFAULT_STATE;
  }
};

export const saveAppState = (state: AppState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const setLanguage = (lang: Language) => {
  const state = getAppState();
  state.language = lang;
  saveAppState(state);
};

export const updateKeys = (codingKey: string, imageKey: string) => {
  const state = getAppState();
  state.codingKey = codingKey;
  state.imageKey = imageKey;
  saveAppState(state);
};

export const isUsernameTaken = (username: string): boolean => {
  const state = getAppState();
  const clean = username.trim().toLowerCase();
  return state.allUsers.some(u => u.username.toLowerCase() === clean);
};

export const registerUser = (username: string): User | null => {
  const cleanUsername = username.trim();
  if (isUsernameTaken(cleanUsername)) return null;
  
  const state = getAppState();
  const newUser: User = { 
    username: cleanUsername, 
    joinedAt: Date.now() 
  };
  
  state.allUsers.push(newUser);
  state.currentUser = newUser;
  saveAppState(state);
  return newUser;
};

export const loginUser = (username: string): User | null => {
  const state = getAppState();
  const cleanUsername = username.trim().toLowerCase();
  const user = state.allUsers.find(u => u.username.toLowerCase() === cleanUsername);
  
  if (user) {
    state.currentUser = user;
    saveAppState(state);
    return user;
  }
  return null;
};

export const logoutUser = () => {
  const state = getAppState();
  state.currentUser = null;
  saveAppState(state);
};

export const publishGame = (game: Omit<Game, 'id' | 'createdAt' | 'plays' | 'reactions' | 'userReactions' | 'moderated'>) => {
  const state = getAppState();
  const newGame: Game = {
    ...game,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now(),
    plays: 0,
    reactions: { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 },
    userReactions: {},
    moderated: true // Games published through the UI are moderated
  };
  state.games.unshift(newGame);
  saveAppState(state);
  return newGame;
};

export const updateGame = (updatedGame: Game) => {
  const state = getAppState();
  state.games = state.games.map(g => g.id === updatedGame.id ? { ...updatedGame, moderated: true } : g);
  saveAppState(state);
};

export const deleteGame = (gameId: string) => {
  const state = getAppState();
  state.games = state.games.filter(g => g.id !== gameId);
  saveAppState(state);
};

export const addReaction = (gameId: string, emoji: string, username: string) => {
  const state = getAppState();
  const game = state.games.find(g => g.id === gameId);
  if (game) {
    if (!game.userReactions) game.userReactions = {};
    if (!game.reactions) game.reactions = { '👍': 0, '❤️': 0, '🚀': 0, '🔥': 0, '🕹️': 0 };

    const existingReaction = game.userReactions[username];
    if (existingReaction === emoji) return;

    if (existingReaction) {
      game.reactions[existingReaction] = Math.max(0, (game.reactions[existingReaction] || 0) - 1);
    }

    game.userReactions[username] = emoji;
    game.reactions[emoji] = (game.reactions[emoji] || 0) + 1;
    
    saveAppState(state);
  }
};

export const importData = (jsonData: string): boolean => {
  try {
    const parsed = JSON.parse(jsonData);
    const vault = parsed.fullVault || parsed;
    
    if (vault && typeof vault === 'object') {
      const cleanVault = {
        ...DEFAULT_STATE,
        ...vault,
        allUsers: vault.allUsers || (vault.currentUser ? [vault.currentUser] : []),
        games: vault.games || []
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanVault));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};

export const downloadUserData = (format: 'json' | 'html', user: User, games: Game[]) => {
  const state = getAppState();
  const userGames = games.filter(g => g.creator === user.username);
  
  const data = {
    accountInfo: {
      username: user.username,
      joinedAt: user.joinedAt,
      profilePicture: user.profilePicture,
      exportDate: Date.now()
    },
    stats: {
      totalGames: userGames.length,
      totalPlays: userGames.reduce((acc, g) => acc + g.plays, 0)
    },
    myGames: userGames,
    fullVault: state 
  };

  let blob: Blob;
  let filename: string;

  if (format === 'json') {
    blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    filename = `forge_backup_${user.username}_${new Date().toISOString().split('T')[0]}.json`;
  } else {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>ForgeArcade Archive - ${user.username}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; background: #020617; color: white; line-height: 1.6; }
          .container { max-width: 800px; margin: 0 auto; }
          .game { border: 1px solid #1e293b; padding: 20px; border-radius: 12px; margin-bottom: 20px; background: #0f172a; }
          h1 { color: #818cf8; margin-bottom: 5px; }
          .meta { color: #64748b; font-size: 0.9em; margin-bottom: 20px; }
          .profile-pic { width: 100px; height: 100px; border-radius: 20px; object-fit: cover; border: 2px solid #334155; }
          #vault-data { display: none; }
          pre { background: #000; padding: 15px; border-radius: 8px; overflow-x: auto; color: #10b981; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>ForgeArcade Archive: ${user.username}</h1>
          <div class="meta">Joined: ${new Date(user.joinedAt).toLocaleString()}</div>
          ${user.profilePicture ? `<img src="${user.profilePicture}" class="profile-pic" />` : ''}
          <div id="vault-data">${JSON.stringify(data)}</div>
          <hr style="border: 0; border-top: 1px solid #1e293b; margin: 40px 0;" />
          <h2>My Portfolio</h2>
          ${userGames.length ? userGames.map(g => `
            <div class="game">
              <h3>${g.title}</h3>
              <p class="meta">${g.genre} | Plays: ${g.plays}</p>
              <p>${g.description}</p>
              <details>
                <summary style="cursor: pointer; color: #818cf8;">Source Code</summary>
                <pre><code>${g.htmlCode.replace(/</g, '&lt;')}</code></pre>
              </details>
            </div>
          `).join('') : '<p>No games found.</p>'}
        </div>
      </body>
      </html>
    `;
    blob = new Blob([htmlContent], { type: 'text/html' });
    filename = `forge_archive_${user.username}.html`;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
