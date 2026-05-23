import { useEffect, useRef, useState } from 'react';
import { skills, tierConfig, type SkillTier } from '../lib/data';

const tierOrder: Record<SkillTier, number> = { core: 0, proficient: 1, familiar: 2 };
const sorted = [...skills].sort(
  (a, b) => tierOrder[a.tier] - tierOrder[b.tier] || a.category.localeCompare(b.category),
);

const STATUS_COLOR: Record<SkillTier, { text: string; bar: string; glow: string }> = {
  core: {
    text: 'text-accent',
    bar: 'bg-accent',
    glow: 'shadow-[0_0_6px_rgba(34,211,238,0.5)]',
  },
  proficient: {
    text: 'text-terminal-green',
    bar: 'bg-terminal-green',
    glow: 'shadow-[0_0_6px_rgba(74,222,128,0.4)]',
  },
  familiar: {
    text: 'text-terminal-amber',
    bar: 'bg-terminal-amber',
    glow: 'shadow-[0_0_4px_rgba(251,191,36,0.3)]',
  },
};

const BAR_WIDTHS: Record<SkillTier, number> = { core: 100, proficient: 60, familiar: 30 };

function UptimeBar({ tier, animate }: { tier: SkillTier; animate: boolean }) {
  const style = STATUS_COLOR[tier];
  const width = BAR_WIDTHS[tier];
  return (
    <div className="w-20 h-1.5 rounded-full bg-ink-200/40 dark:bg-ink-700/40 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar} ${style.glow}`}
        style={{ width: animate ? `${width}%` : '0%' }}
      />
    </div>
  );
}

export default function SkillTiers() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="terminal overflow-hidden">
      {/* Terminal chrome */}
      <div className="terminal-header">
        <span className="terminal-dot bg-terminal-red" />
        <span className="terminal-dot bg-terminal-amber" />
        <span className="terminal-dot bg-terminal-green" />
        <span className="ml-2 font-mono text-xs text-ink-500 dark:text-ink-400">
          skill-monitor — shahirul@dev
        </span>
      </div>

      <div className="p-3 sm:p-4">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_80px_80px_80px] gap-x-2 px-2 py-1.5 mb-1 text-[10px] sm:text-xs font-mono font-semibold uppercase tracking-wider text-ink-400 dark:text-ink-500 border-b border-ink-200/60 dark:border-ink-700/60">
          <span>Process</span>
          <span className="text-center">Category</span>
          <span className="text-center">Status</span>
          <span className="text-center">Uptime</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-ink-100/60 dark:divide-ink-800/50">
          {sorted.map((s, i) => {
            const style = STATUS_COLOR[s.tier];
            const config = tierConfig[s.tier];
            return (
              <div
                key={s.name}
                className="grid grid-cols-[1fr_80px_80px_80px] gap-x-2 items-center px-2 py-2 font-mono text-xs sm:text-sm transition-colors hover:bg-ink-100/50 dark:hover:bg-ink-800/30 group"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(4px)',
                  transition: `opacity 400ms ease ${i * 40}ms, transform 400ms ease ${i * 40}ms`,
                }}
              >
                <span className="text-ink-800 dark:text-ink-100 truncate font-medium">
                  {s.name}
                </span>
                <span className="text-center text-[10px] sm:text-xs text-ink-400 dark:text-ink-500 truncate">
                  {s.category}
                </span>
                <span className={`text-center text-[10px] sm:text-xs font-semibold ${style.text}`}>
                  {config.label}
                </span>
                <div className="flex justify-center">
                  <UptimeBar tier={s.tier} animate={visible} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-3 pt-2 border-t border-ink-200/60 dark:border-ink-700/60 flex flex-wrap items-center gap-x-4 gap-y-1 px-2 font-mono text-[10px] sm:text-xs text-ink-400 dark:text-ink-500">
          <span>
            Tasks: <span className="text-ink-700 dark:text-ink-200 font-medium">{skills.length}</span>
          </span>
          <span>
            Core: <span className="text-accent font-medium">{skills.filter((s) => s.tier === 'core').length}</span>
          </span>
          <span>
            Proficient: <span className="text-terminal-green font-medium">{skills.filter((s) => s.tier === 'proficient').length}</span>
          </span>
          <span>
            Familiar: <span className="text-terminal-amber font-medium">{skills.filter((s) => s.tier === 'familiar').length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
