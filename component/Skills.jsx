'use client';

import React, { useEffect, useMemo, useState } from 'react';

/**
 * Skills with category tabs (Frontend / Backend / All)
 *
 * - Tabs at the top filter the skill cards by category.
 * - Cards are glassy/frosted with a mini linear bar and an animated donut chart.
 * - Animations re-run when you change tabs for a nice visual effect.
 *
 * Drop into components/Skills.jsx and import <Skills /> where needed.
 */

const SKILLS = [
  { id: 'react', title: 'React', category: 'Frontend', proficiency: 92, desc: 'Component-driven UI, hooks, SSR/CSR' },
  { id: 'next', title: 'Next.js', category: 'Frontend', proficiency: 88, desc: 'Hybrid rendering, app/router, optimizations' },
  { id: 'ts', title: 'TypeScript', category: 'Frontend', proficiency: 76, desc: 'Typed JS for safer apps' },
  { id: 'js', title: 'javaScript', category: 'Frontend', proficiency: 86, desc: 'Typed JS for safer apps' },
  { id: 'mongodb', title: 'mongodb', category: 'Database', proficiency: 85, desc: 'Relational DB, queries, indexing' },
   { id: 'Supa', title: 'supabase', category: 'Database', proficiency: 85, desc: 'Relational DB, queries, indexing' },
  { id: 'node', title: 'Node.js', category: 'Backend', proficiency: 84, desc: 'APIs, servers, tooling' },
   { id: 'python', title: 'Python', category: 'Programming Languages', proficiency: 84, desc: 'Coding' },
   { id: 'Java', title: 'Java', category: 'Programming Languages', proficiency: 84, desc: 'Core Java' }
  
];

const COLORS = {
  start: '#fb923c', // orange
  end: '#fb7185', // pink
  darkTrack: 'rgba(255,255,255,0.12)',
  // fallback background for browsers without backdrop-filter support
  cardBgFallback: 'rgba(10,10,10,0.7)',
};

const STAGGER_BASE_MS = 80;

function Donut({ id, percent = 75, size = 72, strokeWidth = 8, delay = 0, play = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (percent / 100) * circumference;

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(false);
    const t = setTimeout(() => setMounted(play), delay);
    return () => {
      clearTimeout(t);
    };
  }, [delay, play]);

  const gradId = `grad-${id}`;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'inline-block',
        position: 'relative',
      }}
      aria-hidden={false}
      role="img"
      aria-label={`Proficiency ${percent} percent`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="donut-svg" style={{ display: 'block' }}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.start} />
            <stop offset="100%" stopColor={COLORS.end} />
          </linearGradient>
        </defs>

        {/* background track */}
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={COLORS.darkTrack} strokeWidth={strokeWidth} fill="none" />

        {/* progress stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeDashoffset={mounted ? 0 : circumference}
          style={{
            transition: 'stroke-dashoffset 850ms cubic-bezier(.22,.9,.3,1), stroke-dasharray 850ms cubic-bezier(.22,.9,.3,1)',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            willChange: 'stroke-dashoffset, stroke-dasharray',
          }}
        />
      </svg>

      {/* center label */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          color: 'white',
          fontWeight: 700,
          fontSize: 13,
        }}
      >
        {percent}%
      </div>
    </div>
  );
}

export default function Skills() {
  const [selected, setSelected] = useState('All');
  const [animateStart, setAnimateStart] = useState(false);

  // compute categories from SKILLS, keep 'All' first
  const categories = useMemo(() => {
    const cats = Array.from(new Set(SKILLS.map((s) => s.category)));
    return ['All', ...cats];
  }, []);

  const filtered = useMemo(() => {
    if (selected === 'All') return SKILLS;
    return SKILLS.filter((s) => s.category === selected);
  }, [selected]);

  // (re)start animations when selected changes
  useEffect(() => {
    setAnimateStart(false);
    const t = setTimeout(() => setAnimateStart(true), 80);
    return () => clearTimeout(t);
  }, [selected]);

  return (
    <section id="skills" style={{ scrollMarginTop: '96px' }} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <style>{`
        :root {
          --glass-bg-top: rgba(255,255,255,0.06);
          --glass-bg-bottom: rgba(255,255,255,0.03);
          --glass-border: rgba(255,255,255,0.06);
          --glass-inner-shadow: rgba(0,0,0,0.6);
          --glass-glow: rgba(255,138,90,0.06);
          --glass-radius: 14px;
          --glass-padding: 18px;
          --glass-blur: 18px;
        }

        /* GLASSY card with explicit rgba and backdrop filters */
        .skill-card {
          background: linear-gradient(180deg, var(--glass-bg-top), var(--glass-bg-bottom));
          background-color: rgba(255,255,255,0.04);
          -webkit-backdrop-filter: blur(var(--glass-blur));
          backdrop-filter: blur(var(--glass-blur));
          border: 1px solid var(--glass-border);
          border-radius: var(--glass-radius);
          padding: var(--glass-padding);
          display: flex;
          gap: 18px;
          align-items: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(2,6,23,0.6), 0 1px 0 rgba(255,255,255,0.02) inset;
          transition: transform 280ms ease, box-shadow 280ms ease, opacity 240ms ease;
        }

        .skill-card:hover { transform: translateY(-6px); box-shadow: 0 18px 40px rgba(2,6,23,0.7); }

        .skill-card::before {
          content: '';
          pointer-events: none;
          position: absolute;
          inset: 1px;
          border-radius: calc(var(--glass-radius) - 1px);
          box-shadow: inset 0 2px 6px rgba(255,255,255,0.02), inset 0 -18px 40px rgba(0,0,0,0.45);
        }

        /* top-right mini bar */
        .mini-bar { position: absolute; right: 18px; top: 18px; width: 120px; height: 10px; border-radius: 9999px; background: rgba(255,255,255,0.03); overflow: hidden; border: 1px solid rgba(255,255,255,0.02); }
        .mini-bar .fill { height: 100%; background: linear-gradient(90deg, ${COLORS.start}, ${COLORS.end}); width: 0%; transition: width 900ms cubic-bezier(.22,.9,.3,1); border-radius: 9999px; box-shadow: 0 4px 12px rgba(251,146,60,0.14); }

        .skill-meta { flex: 1 1 auto; }
        .skill-title { font-weight: 700; color: white; font-size: 1rem; }
        .skill-sub { color: rgba(255,255,255,0.66); font-size: 0.85rem; margin-top: 4px; }
        .skill-desc { color: rgba(255,255,255,0.78); margin-top: 8px; font-size: 0.95rem; }

        .badge { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background: rgba(255,255,255,0.03); color: rgba(255,255,255,0.9); font-size:12px; border-radius:999px; margin-right:8px; border:1px solid rgba(255,255,255,0.02); }

        /* Tab styles */
        .tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:18px; }
        .tab-btn {
          padding:8px 14px;
          border-radius:999px;
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.04);
          cursor:pointer;
          font-weight:600;
          transition: transform .12s ease, background .12s ease, box-shadow .12s ease;
        }
        .tab-btn:hover { transform: translateY(-3px); }
        .tab-btn[aria-pressed="true"] {
          background: linear-gradient(90deg, ${COLORS.start}, ${COLORS.end});
          color: #081019;
          box-shadow: 0 8px 24px rgba(251,146,60,0.12);
          border-color: rgba(255,255,255,0.06);
        }

        @media (max-width: 640px) {
          .mini-bar { width: 88px; right: 12px; top: 12px; }
          .skill-card { padding: 14px; gap: 12px; }
        }
      `}</style>

      <header className="mb-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Skills</h2>
        <p className="mt-2 text-sm text-gray-300 max-w-2xl">Tools, frameworks and languages I use frequently — filter by category.</p>
      </header>

      <div className="tabs" role="tablist" aria-label="Skill categories">
        {categories.map((c) => (
          <button
            key={c}
            role="tab"
            aria-pressed={selected === c}
            aria-label={`Show ${c} skills`}
            tabIndex={0}
            className="tab-btn"
            onClick={() => setSelected(c)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(c); } }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
        {filtered.map((s, idx) => {
          const delayMs = STAGGER_BASE_MS * idx;
          return (
            <article
              key={s.id}
              className="skill-card"
              style={{
                opacity: animateStart ? 1 : 0,
                transform: animateStart ? 'translateY(0)' : 'translateY(8px)',
                transitionDelay: `${delayMs}ms`,
              }}
            >
              <div className="mini-bar" aria-hidden>
                <div
                  className="fill"
                  style={{
                    width: animateStart ? `${s.proficiency}%` : '0%',
                    transitionDelay: `${delayMs}ms`,
                  }}
                />
              </div>

              <div style={{ flex: '0 0 auto' }}>
                <Donut id={`${s.id}-${idx}`} percent={s.proficiency} size={84} strokeWidth={8} delay={animateStart ? delayMs + 60 : 0} play={animateStart} />
              </div>

              <div className="skill-meta">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div className="skill-title">{s.title}</div>
                    <div className="skill-sub">{s.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} className="mt-4">
                    <span className="badge">Proficiency</span>
                    <span style={{ background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: 999, color: 'white', fontWeight: 700 }}>{s.proficiency}%</span>
                  </div>
                </div>

                <div className="skill-desc">{s.desc}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}