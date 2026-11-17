import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Flame, GitCommit, GitFork, ExternalLink, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function GitHubWidget({ username = 'Andreyy05', accentTheme }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [lastSynced, setLastSynced] = useState(null);

  const calculateStats = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Group pushes by day for last 14 days
    const daysMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      daysMap[key] = { date: key, commits: 0, dayName: d.toLocaleDateString(undefined, { weekday: 'narrow' }) };
    }

    const repoCounts = {};
    let todayCommits = 0;
    let totalCommits = 0;

    (events || []).forEach((ev) => {
      if (ev.type === 'PushEvent') {
        const evDate = new Date(ev.created_at);
        const dayKey = evDate.toISOString().split('T')[0];
        const count = ev.payload?.commits?.length || 1;

        totalCommits += count;
        if (daysMap[dayKey]) {
          daysMap[dayKey].commits += count;
        }

        const isToday = evDate >= today;
        if (isToday) {
          todayCommits += count;
        }

        const repoName = ev.repo?.name;
        if (repoName) {
          repoCounts[repoName] = (repoCounts[repoName] || 0) + count;
        }
      }
    });

    // Calculate current streak
    let streak = 0;
    const sortedDays = Object.values(daysMap).sort((a, b) => b.date.localeCompare(a.date));
    
    // Check if committed today or yesterday to start streak
    let activeStreak = false;
    for (const d of sortedDays) {
      if (d.commits > 0) {
        streak++;
        activeStreak = true;
      } else {
        // If today has 0 commits, streak isn't broken yet if yesterday had commits
        const isCurrentDay = d.date === today.toISOString().split('T')[0];
        if (isCurrentDay) {
          continue;
        }
        break;
      }
    }

    // Top repo
    let topRepo = null;
    let maxRepoCommits = 0;
    for (const [r, count] of Object.entries(repoCounts)) {
      if (count > maxRepoCommits) {
        maxRepoCommits = count;
        topRepo = { name: r, commits: count };
      }
    }

    return {
      totalCommits,
      todayCommits,
      streak: Math.max(streak, todayCommits > 0 ? 1 : 0),
      days: Object.values(daysMap),
      topRepo,
    };
  };

  const fetchGitHubData = useCallback(async (force = false) => {
    if (!username) return;

    const cacheKey = `devtab_gh_${username}`;
    const cached = localStorage.getItem(cacheKey);

    if (!force && cached) {
      try {
        const parsed = JSON.parse(cached);
        const age = Date.now() - parsed.timestamp;
        // Use cache if under 5 minutes
        if (age < 5 * 60 * 1000) {
          setUserData(parsed.user);
          setStats(parsed.stats);
          setLastSynced(new Date(parsed.timestamp));
          return;
        }
      } catch (e) {
        console.error('Failed to parse cached GitHub data', e);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const [userRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
      ]);

      if (!userRes.ok) throw new Error(`User not found (${userRes.status})`);
      const user = await userRes.json();

      let events = [];
      if (eventsRes.ok) {
        events = await eventsRes.json();
      }

      const calculated = calculateStats(events);

      setUserData(user);
      setStats(calculated);
      const now = new Date();
      setLastSynced(now);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          user,
          stats: calculated,
          timestamp: now.getTime(),
        })
      );
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  return (
    <div className="w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-xl relative overflow-hidden shadow-xl">
      {/* Background Accent glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-800/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-800 border border-neutral-700/60 flex items-center justify-center shrink-0">
            <GithubIcon className="w-5 h-5 text-neutral-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1"
              >
                @{username}
                <ExternalLink className="w-3 h-3 text-neutral-500" />
              </a>
              {stats?.todayCommits > 0 && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Active Today
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400">
              {userData?.bio || `${userData?.public_repos || 0} public repositories`}
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchGitHubData(true)}
          disabled={loading}
          className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors disabled:opacity-50"
          title="Refresh GitHub stats"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Streak & Today's Metric Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4">
        {/* Streak */}
        <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono leading-none">
              {stats ? `${stats.streak}d` : '...'}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Current Streak
            </span>
          </div>
        </div>

        {/* Commits Today */}
        <div className="bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono leading-none">
              {stats ? stats.todayCommits : '...'}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Pushed Today
            </span>
          </div>
        </div>

        {/* Total 14d Output */}
        <div className="col-span-2 sm:col-span-1 bg-neutral-950/60 border border-neutral-800/60 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold text-white font-mono leading-none">
              {stats ? stats.totalCommits : '...'}
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
              Last 14 Days
            </span>
          </div>
        </div>
      </div>

      {/* 14-Day Activity Sparkline Blocks */}
      {stats?.days && (
        <div className="bg-neutral-950/40 border border-neutral-800/50 rounded-xl p-3">
          <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-2 font-medium">
            <span>14-Day Activity Rhythm</span>
            <span>{stats.totalCommits} commits total</span>
          </div>
          <div
            className="gap-1.5 sm:gap-2"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
          >
            {stats.days.map((d, idx) => {
              const isToday = idx === stats.days.length - 1;
              let bg = 'bg-neutral-800/60';
              if (d.commits > 0) bg = 'bg-emerald-900/60 border border-emerald-700/60';
              if (d.commits >= 3) bg = 'bg-emerald-600 border border-emerald-500';
              if (d.commits >= 6) bg = 'bg-emerald-400 text-black shadow-sm shadow-emerald-500/50';

              return (
                <div
                  key={d.date}
                  className="flex flex-col items-center gap-1 group relative"
                  title={`${d.date}: ${d.commits} commits`}
                >
                  <div
                    className={`w-full aspect-square rounded-md transition-transform group-hover:scale-110 ${bg} ${
                      isToday ? 'ring-2 ring-emerald-400/50' : ''
                    }`}
                  />
                  <span className="text-[9px] font-mono text-neutral-400 font-semibold">
                    {d.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Info / Top Active Repo */}
      {stats?.topRepo && (
        <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-neutral-400">Top repo:</span>
            <a
              href={`https://github.com/${stats.topRepo.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-200 hover:text-emerald-400 font-mono font-medium truncate"
            >
              {stats.topRepo.name}
            </a>
          </div>
          <span className="text-emerald-400/90 font-mono text-[10px] shrink-0 font-medium">
            {stats.topRepo.commits} commits
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs text-rose-400/90 flex items-center gap-1.5 bg-rose-950/20 border border-rose-900/30 p-2 rounded-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
