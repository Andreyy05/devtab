export const ACCENT_THEMES = {
  emerald: {
    id: 'emerald',
    name: 'Emerald (Default)',
    primary: '#10b981',
    glow: 'rgba(16, 185, 129, 0.25)',
    border: 'border-emerald-500/40',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    ring: 'focus:ring-emerald-500',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
  },
  cyan: {
    id: 'cyan',
    name: 'Cyber Cyan',
    primary: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.25)',
    border: 'border-cyan-500/40',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    ring: 'focus:ring-cyan-500',
    btn: 'bg-cyan-600 hover:bg-cyan-500 text-white',
  },
  violet: {
    id: 'violet',
    name: 'Electric Violet',
    primary: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.25)',
    border: 'border-violet-500/40',
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    ring: 'focus:ring-violet-500',
    btn: 'bg-violet-600 hover:bg-violet-500 text-white',
  },
  amber: {
    id: 'amber',
    name: 'Neon Amber',
    primary: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.25)',
    border: 'border-amber-500/40',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    ring: 'focus:ring-amber-500',
    btn: 'bg-amber-600 hover:bg-amber-500 text-black font-medium',
  },
  rose: {
    id: 'rose',
    name: 'Retro Rose',
    primary: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.25)',
    border: 'border-rose-500/40',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    ring: 'focus:ring-rose-500',
    btn: 'bg-rose-600 hover:bg-rose-500 text-white',
  },
};

export const SEARCH_ENGINES = {
  google: {
    id: 'google',
    name: 'Google',
    url: 'https://www.google.com/search?q=',
    placeholder: 'Search Google or type a URL...',
    icon: 'Search',
  },
  github: {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/search?q=',
    placeholder: 'Search GitHub repos, issues, code...',
    icon: 'Github',
  },
  duckduckgo: {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=',
    placeholder: 'Search DuckDuckGo with privacy...',
    icon: 'Shield',
  },
  stackoverflow: {
    id: 'stackoverflow',
    name: 'StackOverflow',
    url: 'https://stackoverflow.com/search?q=',
    placeholder: 'Search Stack Overflow questions & answers...',
    icon: 'Layers',
  },
  mdn: {
    id: 'mdn',
    name: 'MDN Docs',
    url: 'https://developer.mozilla.org/en-US/search?q=',
    placeholder: 'Search MDN Web Docs (HTML, CSS, JS)...',
    icon: 'BookOpen',
  },
  perplexity: {
    id: 'perplexity',
    name: 'Perplexity AI',
    url: 'https://www.perplexity.ai/search?q=',
    placeholder: 'Ask Perplexity AI anything...',
    icon: 'Sparkles',
  },
};

export const DEFAULT_BOOKMARKS = [
  // Quick Access
  { id: '1', title: 'GitHub', url: 'https://github.com', category: 'Daily Dev', icon: 'github' },
  { id: '2', title: 'ChatGPT', url: 'https://chatgpt.com', category: 'Daily Dev', icon: 'sparkles' },
  { id: '3', title: 'Claude', url: 'https://claude.ai', category: 'Daily Dev', icon: 'bot' },
  { id: '4', title: 'YouTube', url: 'https://youtube.com', category: 'Media', icon: 'play' },
  { id: '5', title: 'Stack Overflow', url: 'https://stackoverflow.com', category: 'Daily Dev', icon: 'code' },
  { id: '6', title: 'Gmail', url: 'https://mail.google.com', category: 'Daily Dev', icon: 'mail' },

  // Dev Tools & Docs
  { id: '7', title: 'MDN Web Docs', url: 'https://developer.mozilla.org', category: 'Reference', icon: 'book' },
  { id: '8', title: 'DevDocs', url: 'https://devdocs.io', category: 'Reference', icon: 'book-open' },
  { id: '9', title: 'Tailwind CSS', url: 'https://tailwindcss.com/docs', category: 'Reference', icon: 'wind' },
  { id: '10', title: 'Regex101', url: 'https://regex101.com', category: 'Tools', icon: 'terminal' },
  { id: '11', title: 'Bundlephobia', url: 'https://bundlephobia.com', category: 'Tools', icon: 'package' },
  { id: '12', title: 'Ray.so Code Images', url: 'https://ray.so', category: 'Tools', icon: 'image' },

  // Cloud & DB
  { id: '13', title: 'Vercel', url: 'https://vercel.com/dashboard', category: 'Cloud', icon: 'cloud' },
  { id: '14', title: 'Supabase', url: 'https://supabase.com/dashboard', category: 'Cloud', icon: 'database' },
  { id: '15', title: 'Cloudflare', url: 'https://dash.cloudflare.com', category: 'Cloud', icon: 'shield' },
];

export const DEV_QUOTES = [
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "Deleted code is debugged code.", author: "Jeff Sickel" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Truth can only be found in one place: the code.", author: "Robert C. Martin" },
];
