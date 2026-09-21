import { useEffect, useRef, useState } from 'react';
import { skills, tierConfig, type Skill, type SkillTier } from '../lib/data';

/*
 * Skills rendered as a package-manifest listing (composer.json /
 * package.json style): grouped by category as manifest sections,
 * tier shown as a real install-status word (stable / installed /
 * dev-tag) rather than a fabricated version number — there's no
 * honest way to assign "PHP: ^4.1" a specific digit, so the tier
 * stays a category, the same coarseness the git-log graph encodes
 * through lane/trunk placement.
 */

const CATEGORY_ORDER = ['Backend', 'Frontend', 'Database', 'DevOps', 'Tools'] as const;

const CATEGORY_KEY: Record<string, string> = {
  Backend: 'require',
  Frontend: 'require-frontend',
  Database: 'require-db',
  DevOps: 'require-dev',
  Tools: 'require-tools',
};

const TIER_ORDER: Record<SkillTier, number> = { core: 0, proficient: 1, familiar: 2 };

function slug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .split('/')[0]
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function vendor(category: string): string {
  const v: Record<string, string> = {
    Backend: 'lang',
    Frontend: 'web',
    Database: 'db',
    DevOps: 'ops',
    Tools: 'dev',
  };
  return v[category] || 'pkg';
}

// Real install-status vocabulary, not a fabricated version number.
// The tier is a category (how well he knows it), never a measurement,
// so the label reads like a lockfile status rather than pretending
// to be a specific release.
const TIER_STATUS: Record<SkillTier, string> = {
  core: 'stable',
  proficient: 'installed',
  familiar: 'dev-tag',
};

const TIER_COLOR: Record<SkillTier, string> = {
  core: 'text-accent',
  proficient: 'text-terminal-green',
  familiar: 'text-ink-400 dark:text-ink-500',
};

type Row = { skill: Skill; status: string };

function groupByCategory(): { category: string; rows: Row[] }[] {
  return CATEGORY_ORDER.map((category) => {
    const rows = skills
      .filter((s) => s.category === category)
      .sort((a, b) => TIER_ORDER[a.tier] - TIER_ORDER[b.tier])
      .map((skill) => ({ skill, status: TIER_STATUS[skill.tier] }));
    return { category, rows };
  }).filter((g) => g.rows.length > 0);
}

export default function SkillManifest() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const groups = groupByCategory();

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.15 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  let rowIndex = 0;

  return (
    <div ref={ref} className="terminal overflow-hidden">
      <div className="terminal-header">
        <span className="terminal-dot bg-terminal-red" />
        <span className="terminal-dot bg-terminal-amber" />
        <span className="terminal-dot bg-terminal-green" />
        <span className="ml-2 font-mono text-xs text-ink-500 dark:text-ink-400">
          cat composer.json — shahirul@dev
        </span>
      </div>

      <div className="p-3 sm:p-4 font-mono text-xs sm:text-sm overflow-x-auto">
        <div className="min-w-[320px]">
          <span className="text-ink-400 dark:text-ink-500">{'{'}</span>

          {groups.map((g, gi) => (
            <div key={g.category} className="pl-3 sm:pl-4 mt-1">
              <span className="text-ink-500 dark:text-ink-400">"{CATEGORY_KEY[g.category]}"</span>
              <span className="text-ink-400 dark:text-ink-600">: {'{'}</span>
              <span className="ml-2 text-ink-300 dark:text-ink-700 select-none">// {g.category}</span>

              {g.rows.map((r) => {
                const delay = rowIndex++ * 30;
                return (
                  <div
                    key={r.skill.name}
                    className="pl-3 sm:pl-4 flex items-baseline justify-between gap-3 py-0.5 group"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateY(3px)',
                      transition: `opacity 350ms ease ${delay}ms, transform 350ms ease ${delay}ms`,
                    }}
                    title={tierConfig[r.skill.tier].label}
                  >
                    <span className="text-ink-700 dark:text-ink-300 truncate">
                      <span className="text-ink-400 dark:text-ink-600">"</span>
                      <span className="group-hover:text-ink-900 dark:group-hover:text-ink-50 transition-colors">
                        {vendor(r.skill.category)}/{slug(r.skill.name)}
                      </span>
                      <span className="text-ink-400 dark:text-ink-600">"</span>
                      <span className="text-ink-400 dark:text-ink-600">:</span>
                    </span>
                    <span className={`shrink-0 font-semibold ${TIER_COLOR[r.skill.tier]}`}>
                      "{r.status}"
                    </span>
                  </div>
                );
              })}

              <div className="pl-2 sm:pl-3 text-ink-400 dark:text-ink-600">
                {'}'}
                {gi < groups.length - 1 ? ',' : ''}
              </div>
            </div>
          ))}

          <span className="text-ink-400 dark:text-ink-500">{'}'}</span>
        </div>

        {/* Legend / detail line */}
        <div className="mt-3 pt-2 border-t border-ink-200/60 dark:border-ink-700/60 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] sm:text-xs text-ink-400 dark:text-ink-500">
          <span className="flex items-center gap-1.5">
            <span className="text-accent font-semibold">stable</span> — {tierConfig.core.label.toLowerCase()}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-terminal-green font-semibold">installed</span> — {tierConfig.proficient.label.toLowerCase()}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-ink-400 dark:text-ink-500 font-semibold">dev-tag</span> — {tierConfig.familiar.label.toLowerCase()}
          </span>
        </div>
      </div>
    </div>
  );
}
