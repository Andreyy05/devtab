import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import { GithubIcon } from './Icons';

export default function GitHubWidget({ username = 'Andreyy05', accentTheme }) {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const calculateStats = (events) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

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

    // Calculate streak
    let streak = 0;
    const sortedDays = Object.values(daysMap).sort((a, b) => b.date.localeCompare(a.date));
    
    for (const d of sortedDays) {
      if (d.commits > 0) {
        streak++;
      } else {
        const isCurrentDay = d.date === today.toISOString().split('T')[0];
        if (isCurrentDay) continue;
        break;
      }
    }

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
        if (age < 5 * 60 * 1000) {
          setUserData(parsed.user);
          setStats(parsed.stats);
          return;
        }
      } catch (e) {}
    }

    setLoading(true);
    setError(null);

    try {
      const [userRes, eventsRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(`https://api.github.com/users/${username}/events/public?per_page=100`),
      ]);

      if (!userRes.ok) throw new Error(`User not found`);
      const user = await userRes.json();

      let events = [];
      if (eventsRes.ok) {
        events = await eventsRes.json();
      }

      const calculated = calculateStats(events);
      setUserData(user);
      setStats(calculated);

      localStorage.setItem(
        cacheKey,
        JSON.stringify({
          user,
          stats: calculated,
          timestamp: Date.now(),
        })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    fetchGitHubData();
  }, [fetchGitHubData]);

  return (
    <div className="w-full bg-white/[0.04] border border-white/[0.08] rounded-3xl p-5 backdrop-blur-2xl shadow-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0">
            <GithubIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-white hover:underline flex items-center gap-1"
              >
                @{username}
                <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
              </a>
              {stats?.todayCommits > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#30d158] inline-block" title="Pushed today" />
              )}
            </div>
            <p className="text-[11px] text-neutral-400 font-normal">
              {userData?.public_repos || 0} repositories
            </p>
          </div>
        </div>

        <button
          onClick={() => fetchGitHubData(true)}
          disabled={loading}
          className="w-7 h-7 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-neutral-400 hover:text-white flex items-center justify-center transition-colors disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-white' : ''}`} />
        </button>
      </div>

      {/* Metrics in Apple Card Style */}
      <div className="grid grid-cols-3 gap-2.5 my-3.5">
        <div className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-3 text-center">
          <div className="text-xl font-medium tracking-tight text-white">
            {stats ? `${stats.streak}d` : '—'}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">Streak</span>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-3 text-center">
          <div className="text-xl font-medium tracking-tight text-white">
            {stats ? stats.todayCommits : '—'}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">Today</span>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.04] rounded-2xl p-3 text-center">
          <div className="text-xl font-medium tracking-tight text-white">
            {stats ? stats.totalCommits : '—'}
          </div>
          <span className="text-[10px] text-neutral-400 font-medium">14 Days</span>
        </div>
      </div>

      {/* 14-day Apple Activity Rhythm dots */}
      {stats?.days && (
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-3">
          <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-2 font-medium">
            <span>Activity</span>
            <span>{stats.totalCommits} contributions</span>
          </div>
          <div
            className="gap-1 sm:gap-1.5"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}
          >
            {stats.days.map((d, idx) => {
              const isToday = idx === stats.days.length - 1;
              let bg = 'bg-white/[0.08]';
              if (d.commits > 0) bg = 'bg-[#30d158]/50';
              if (d.commits >= 3) bg = 'bg-[#30d158]';

              return (
                <div
                  key={d.date}
                  className="flex flex-col items-center gap-1 group relative"
                  title={`${d.date}: ${d.commits} commits`}
                >
                  <div
                    className={`w-full aspect-square rounded-md transition-all ${bg} ${
                      isToday ? 'ring-1.5 ring-white' : ''
                    }`}
                  />
                  <span className="text-[8px] text-neutral-400 font-medium">
                    {d.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top repo */}
      {stats?.topRepo && (
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-neutral-400 px-1">
          <span className="truncate">Top: <strong className="text-white/80 font-normal">{stats.topRepo.name}</strong></span>
          <span className="text-neutral-400 shrink-0 text-[10px]">{stats.topRepo.commits} commits</span>
        </div>
      )}
    </div>
  );
}
