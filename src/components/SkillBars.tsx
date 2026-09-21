import { useEffect, useMemo, useRef, useState } from 'react';
import { skills, tierConfig, type Skill, type SkillTier } from '../lib/data';

/*
 * Renders the skill set as a `git log --graph --all` commit graph.
 * Lanes = categories (branches). Nodes = skills (commits).
 * Core-tier skills merge into a "main" trunk lane on the left, since
 * they're the daily-driver stack everything else branches from.
 */

const CATEGORY_ORDER = ['Backend', 'Database', 'DevOps', 'Frontend', 'Tools'] as const;

const CATEGORY_COLOR: Record<string, string> = {
  Backend: '#22d3ee', // accent
  Database: '#4ade80', // terminal-green
  DevOps: '#fbbf24', // terminal-amber
  Frontend: '#f87171', // terminal-red
  Tools: '#94a3b8', // ink-400
};

const MAIN_COLOR = '#22d3ee';

const TIER_ORDER: Record<SkillTier, number> = { core: 0, proficient: 1, familiar: 2 };

type Row = {
  skill: Skill;
  laneX: number;
  mainX: number | null; // set when tier === core, node also drawn on trunk
  y: number;
  color: string;
};

function buildRows(width: number, rowHeight: number): { rows: Row[]; laneXs: Record<string, number>; mainX: number; height: number } {
  const lanePad = 28;
  const laneGap = (width - lanePad * 2) / (CATEGORY_ORDER.length + 1); // +1 slot reserved for main trunk spacing
  const mainX = lanePad + laneGap * 0.6;
  const laneXs: Record<string, number> = {};
  CATEGORY_ORDER.forEach((cat, i) => {
    laneXs[cat] = mainX + laneGap * (i + 1);
  });

  const ordered = [...skills].sort((a, b) => {
    const ci = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    if (ci !== 0) return ci;
    return TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
  });

  const topPad = 30;
  const rows: Row[] = ordered.map((skill, i) => ({
    skill,
    laneX: laneXs[skill.category],
    mainX: skill.tier === 'core' ? mainX : null,
    y: topPad + i * rowHeight,
    color: CATEGORY_COLOR[skill.category] || '#94a3b8',
  }));

  return { rows, laneXs, mainX, height: topPad + ordered.length * rowHeight + 20 };
}

function shortSha(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16).slice(0, 7).padStart(7, '0');
}

export default function SkillGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(480);
  const [hovered, setHovered] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      setWidth(entries[0].contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setVisible(true)),
      { threshold: 0.1 },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  const rowHeight = 26;
  const { rows, laneXs, mainX, height } = useMemo(
    () => buildRows(width, rowHeight),
    [width],
  );

  const labelStartX = width - 4; // labels drawn in HTML column instead, svg stays graph-only
  const svgWidth = Math.min(width, 220);

  const hoveredRow = hovered !== null ? rows[hovered] : null;

  return (
    <div ref={containerRef} className="terminal overflow-hidden select-none">
      <div className="terminal-header">
        <span className="terminal-dot bg-terminal-red" />
        <span className="terminal-dot bg-terminal-amber" />
        <span className="terminal-dot bg-terminal-green" />
        <span className="ml-2 font-mono text-xs text-ink-500 dark:text-ink-400">
          git log --graph --all — shahirul@dev
        </span>
      </div>

      <div className="p-3 sm:p-4 overflow-x-auto">
        <div className="flex items-start gap-3" style={{ minWidth: 360 }}>
          {/* Graph column */}
          <svg
            width={svgWidth}
            height={height}
            viewBox={`0 0 ${svgWidth} ${height}`}
            className="flex-shrink-0"
          >
            {/* Main trunk line */}
            <line
              x1={mainX}
              y1={8}
              x2={mainX}
              y2={height - 8}
              stroke={MAIN_COLOR}
              strokeWidth={1.5}
              style={{ opacity: visible ? 0.5 : 0, transition: 'opacity 600ms ease' }}
            />

            {/* Category lane lines (drawn only across the span their commits occupy) */}
            {CATEGORY_ORDER.map((cat) => {
              const laneRows = rows.filter((r) => r.skill.category === cat);
              if (laneRows.length === 0) return null;
              const y0 = laneRows[0].y;
              const y1 = laneRows[laneRows.length - 1].y;
              return (
                <line
                  key={cat}
                  x1={laneXs[cat]}
                  y1={y0}
                  x2={laneXs[cat]}
                  y2={y1}
                  stroke={CATEGORY_COLOR[cat]}
                  strokeWidth={1.5}
                  style={{ opacity: visible ? 0.35 : 0, transition: 'opacity 600ms ease' }}
                />
              );
            })}

            {/* Merge curves from lane into trunk for core commits */}
            {rows.map((r, i) => {
              if (r.mainX === null) return null;
              const d = `M ${r.laneX} ${r.y} C ${(r.laneX + r.mainX) / 2} ${r.y}, ${(r.laneX + r.mainX) / 2} ${r.y}, ${r.mainX} ${r.y}`;
              return (
                <path
                  key={`merge-${i}`}
                  d={d}
                  fill="none"
                  stroke={r.color}
                  strokeWidth={1.25}
                  style={{
                    opacity: visible ? 0.45 : 0,
                    transition: `opacity 500ms ease ${i * 25}ms`,
                  }}
                />
              );
            })}

            {/* Commit nodes */}
            {rows.map((r, i) => {
              const isHovered = hovered === i;
              const isCore = r.skill.tier === 'core';
              const isProficient = r.skill.tier === 'proficient';
              const radius = isHovered ? 5.5 : 4;
              return (
                <g
                  key={r.skill.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 400ms ease ${i * 20}ms`,
                  }}
                >
                  {/* trunk node for core skills */}
                  {r.mainX !== null && (
                    <circle
                      cx={r.mainX}
                      cy={r.y}
                      r={isHovered ? 4.5 : 3.5}
                      fill={MAIN_COLOR}
                      stroke={MAIN_COLOR}
                    />
                  )}
                  {/* lane node */}
                  <circle
                    cx={r.laneX}
                    cy={r.y}
                    r={radius}
                    fill={isCore || isProficient ? r.color : 'transparent'}
                    stroke={r.color}
                    strokeWidth={isHovered ? 2 : 1.5}
                  />
                  {/* invisible wide hit area for easier hover */}
                  <rect x={0} y={r.y - rowHeight / 2} width={svgWidth} height={rowHeight} fill="transparent" />
                </g>
              );
            })}
          </svg>

          {/* Commit message column */}
          <div className="flex-1 min-w-0" style={{ paddingTop: 30 - 7 }}>
            {rows.map((r, i) => {
              const isHovered = hovered === i;
              return (
                <div
                  key={r.skill.name}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-baseline gap-2 font-mono text-xs sm:text-sm cursor-pointer rounded px-1.5 -mx-1.5 transition-colors"
                  style={{
                    height: rowHeight,
                    opacity: visible ? 1 : 0,
                    transition: `opacity 400ms ease ${i * 20}ms, background-color 150ms`,
                    backgroundColor: isHovered ? 'var(--row-hover)' : 'transparent',
                  }}
                >
                  <span className="text-ink-400 dark:text-ink-600 tabular-nums">{shortSha(r.skill.name)}</span>
                  <span className={isHovered ? 'text-ink-900 dark:text-ink-50' : 'text-ink-700 dark:text-ink-300'}>
                    {r.skill.name}
                  </span>
                  {r.skill.tier === 'core' && (
                    <span className="text-[10px] text-accent border border-accent/30 rounded px-1 leading-4">
                      main
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend / detail line */}
        <div className="mt-3 pt-2 border-t border-ink-200/60 dark:border-ink-700/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-1 font-mono text-[10px] sm:text-xs text-ink-400 dark:text-ink-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {CATEGORY_ORDER.map((cat) => (
              <span key={cat} className="flex items-center gap-1.5">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLOR[cat] }}
                />
                {cat}
              </span>
            ))}
          </div>
          <div className="min-h-[1.1em]">
            {hoveredRow ? (
              <span>
                <span style={{ color: hoveredRow.color }}>{tierConfig[hoveredRow.skill.tier].label}</span>
                <span className="text-ink-300 dark:text-ink-600"> · </span>
                {hoveredRow.skill.category}
              </span>
            ) : (
              <span className="text-ink-300 dark:text-ink-700">hover a commit for detail</span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        :root { --row-hover: rgba(15, 23, 42, 0.04); }
        .dark { --row-hover: rgba(241, 245, 249, 0.06); }
      `}</style>
    </div>
  );
}
