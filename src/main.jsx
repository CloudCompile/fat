import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowDown, ArrowUpRight, AtSign, Camera, Code2, Cpu, Database, Dumbbell,
  Gamepad2, GitFork, Globe, Heart, Mail, Radio, Sparkles, Star, Trophy, Tv,
  Waves, Zap,
} from 'lucide-react';
import './styles.css';
import './liquid.css';
import GlassSurface from './glass/GlassSurface.jsx';

const GITHUB = 'https://github.com/sneezejayhauser';
const INSTAGRAM = 'https://www.instagram.com/sneezejayhauser';

/* ---------- data ---------- */

const HOBBIES = [
  { icon: Trophy, name: 'Tennis', note: 'Footwork, rallies, and the occasional serve that actually lands.', tag: 'on the court' },
  { icon: Waves, name: 'Swim', note: 'Laps on laps. The one place with zero notifications.', tag: 'in the pool' },
  { icon: Gamepad2, name: 'Anime games', note: 'The main quest. Played way too much, per the official tagline.', tag: 'too much' },
  { icon: Tv, name: 'Anime & TV', note: 'Watching a lot of TV is a personality trait and I stand by that.', tag: 'always on' },
  { icon: Code2, name: 'Coding', note: 'Shipping real things — scroll down for the 900-commit evidence.', tag: 'shipping' },
];

const PROJECTS = [
  {
    icon: Sparkles,
    name: 'Lumiverse',
    kicker: 'FULL-STACK AI CHAT SUITE',
    desc: 'A full-featured AI chat application: data layer, real-time event bus, LLM generation pipeline, and an extension runtime — built on Bun + Hono with zero ORM.',
    link: 'https://github.com/CloudCompile/Lumiverse',
    linkLabel: 'CloudCompile/Lumiverse',
    accent: 'violet',
    stats: [
      { icon: Code2, value: '900+', label: 'commits' },
      { icon: Cpu, value: 'Bun + Hono', label: 'runtime' },
      { icon: Database, value: 'SQLite WAL', label: 'zero ORM' },
      { icon: Radio, value: 'Realtime', label: 'WS event bus' },
    ],
  },
  {
    icon: Zap,
    name: 'MCPollinations',
    kicker: 'MCP SERVER · GENERATIVE AI',
    desc: 'A Model Context Protocol server that lets AI assistants generate images, text, and audio through the Pollinations API — part of a platform with 5,100+ stars and 1,100+ forks.',
    link: 'https://github.com/CloudCompile/MCPollinations',
    linkLabel: 'CloudCompile/MCPollinations',
    accent: 'cyan',
    stats: [
      { icon: Star, value: '5.1k★', label: 'pollinations' },
      { icon: GitFork, value: '1.1k', label: 'forks' },
      { icon: Zap, value: '3 modes', label: 'img · text · audio' },
      { icon: Globe, value: 'MCP', label: 'any AI client' },
    ],
  },
  {
    icon: Gamepad2,
    name: 'cj-about-me',
    kicker: 'THIS VERY SITE',
    desc: 'Liquid glass, animated everything, zero templates. The site you are looking at right now — yes, it counts as a project.',
    link: 'https://github.com/CloudCompile/fat',
    linkLabel: 'CloudCompile/fat',
    accent: 'mint',
    stats: [
      { icon: Sparkles, value: '100%', label: 'liquid glass' },
      { icon: Code2, value: 'React', label: '+ Vite' },
    ],
  },
];

const FAVORITES = [
  { icon: Gamepad2, title: 'Anime games', note: 'Ranked #1. This is not up for debate.' },
  { icon: Tv, title: 'Watching TV', note: 'A lot of it. Proudly. Professionally, even.' },
  { icon: Trophy, title: 'Tennis', note: 'Best sport. Fight me.' },
  { icon: Waves, title: 'Swimming', note: 'Where the cardio happens.' },
  { icon: Code2, title: 'Coding', note: 'Where the websites happen.' },
  { icon: Star, title: 'Winning', note: 'The stated objective of this entire website.' },
];

const TICKER = ['TENNIS', 'SWIM', 'ANIME', 'ANIME GAMES', 'CODING', 'TV MARATHONS', 'WINNING', 'LIQUID GLASS'];

/* ---------- hooks ---------- */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.1 },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useCountUp(target, active, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const tick = now => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - (1 - p) ** 4)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return value;
}

/* ---------- components ---------- */

function SplashScreen({ onFinish }) {
  const [closing, setClosing] = useState(false);
  useEffect(() => {
    const closeTimer = setTimeout(() => setClosing(true), 4600);
    const finishTimer = setTimeout(onFinish, 5600);
    return () => { clearTimeout(closeTimer); clearTimeout(finishTimer); };
  }, [onFinish]);
  return (
    <div className={`splash-screen ${closing ? 'splash-closing' : ''}`} role="dialog" aria-label="Welcome">
      <div className="splash-content">
        <p className="splash-line splash-brand"><SplashText text="CJ" /></p>
        <p className="splash-line splash-meta"><SplashText text="A PERSON WHO PLAYS ANIME GAMES TOO MUCH" /></p>
        <p className="splash-line splash-credit"><SplashText text="@sneezejayhauser" /></p>
      </div>
    </div>
  );
}

function SplashText({ text }) {
  return [...text].map((ch, i) => (
    <span className="splash-letter" style={{ '--letter-index': i }} key={`${ch}-${i}`}>
      {ch === ' ' ? ' ' : ch}
    </span>
  ));
}

function HeroStat({ value, suffix, label, active, delay }) {
  const n = useCountUp(value, active);
  return (
    <div className="hero-stat reveal" style={{ '--reveal-delay': `${delay}ms` }}>
      <strong>{n.toLocaleString()}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [statsActive, setStatsActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [eggTaps, setEggTaps] = useState(0);
  const [eggOpen, setEggOpen] = useState(false);
  const shellRef = useRef(null);
  useReveal();

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (showSplash) return;
    const t = setTimeout(() => setStatsActive(true), 500);
    return () => clearTimeout(t);
  }, [showSplash]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;
    const move = e => {
      shell.style.setProperty('--mx', `${(e.clientX / innerWidth) * 100}%`);
      shell.style.setProperty('--my', `${(e.clientY / innerHeight) * 100}%`);
    };
    addEventListener('pointermove', move);
    return () => removeEventListener('pointermove', move);
  }, []);

  const tapEgg = () => {
    const next = eggTaps + 1;
    setEggTaps(next);
    if (next >= 3) { setEggOpen(true); setEggTaps(0); }
  };

  return (
    <div className="shell" ref={shellRef}>
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      <div className="progress" style={{ transform: `scaleX(${progress})` }} />

      <header className="topbar">
        <a className="brand" href="#top"><span className="brand-mark"><Sparkles size={18} /></span>CJ</a>
        <nav className="top-links">
          <a href="#about">About</a>
          <a href="#hobbies">Hobbies</a>
          <a href="#projects">Projects</a>
          <a href="#favorites">Favorites</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="top-actions">
          <a className="button button-ghost" href={GITHUB} target="_blank" rel="noreferrer"><Globe size={15} /> GitHub</a>
        </div>
      </header>

      <main className="app-shell" id="top">
        {/* ---------- HERO ---------- */}
        <section className="hero">
          <div className="hero-main">
            <p className="eyebrow reveal">PLAYER PROFILE <span className="eyebrow-dot" /></p>
            <h1 className="reveal" style={{ '--reveal-delay': '80ms' }}>
              CJ plays anime games <em>too much.</em>
            </h1>
            <p className="hero-copy reveal" style={{ '--reveal-delay': '160ms' }}>
              Tennis, swim, coding, and an objectively unhealthy amount of anime games.
              Also watches a lot of TV. This is the official record.
            </p>
            <div className="hero-actions reveal" style={{ '--reveal-delay': '240ms' }}>
              <a className="button button-primary" href="#about">Meet CJ <ArrowDown size={15} /></a>
              <a className="button button-ghost" href={INSTAGRAM} target="_blank" rel="noreferrer"><Camera size={15} /> @sneezejayhauser</a>
            </div>
          </div>
          <GlassSurface className="hero-stats" borderRadius={28} tintOpacity={0.14}>
            <HeroStat value={900} suffix="+" label="commits on Lumiverse" active={statsActive} delay={0} />
            <HeroStat value={5100} suffix="★" label="on the Pollinations platform" active={statsActive} delay={90} />
            <HeroStat value={5} suffix="" label="hobbies in the rotation" active={statsActive} delay={180} />
            <HeroStat value={1} suffix="" label="legendary fun fact (find it)" active={statsActive} delay={270} />
          </GlassSurface>
        </section>

        {/* ---------- TICKER ---------- */}
        <div className="ticker glass-panel" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, i) => (
              <span key={i} className="ticker-item">{item}<Sparkles size={13} /></span>
            ))}
          </div>
        </div>

        {/* ---------- ABOUT ---------- */}
        <section className="section" id="about">
          <p className="section-kicker reveal">ABOUT</p>
          <h2 className="reveal">A person of <em>many lanes.</em></h2>
          <div className="about-grid">
            <GlassSurface className="about-card reveal" borderRadius={26} tintOpacity={0.12}>
              <p>
                CJ splits time between the tennis court, the pool, and a keyboard — and whatever
                hours are left go straight into anime games and TV. It is a full schedule and
                every slot is defended fiercely.
              </p>
              <p>
                The coding part is not a hobby-lobby filler line either: 900+ commits deep into
                a full-stack AI chat suite, plus an MCP server plugged into a 5,100-star
                generative AI platform. Scroll down, the receipts are there.
              </p>
            </GlassSurface>
            <div className="glass-panel fact-card reveal" style={{ '--reveal-delay': '120ms' }}>
              <p className="section-kicker">CERTIFIED FUN FACT</p>
              <button className={`fact-seal ${eggOpen ? 'fact-open' : ''}`} onClick={tapEgg} aria-live="polite">
                {eggOpen
                  ? <span className="fact-reveal-text">I eat my boogers still and I'm proud and love it.</span>
                  : <span className="fact-teaser"><Heart size={18} /> {eggTaps > 0 ? `${3 - eggTaps} more tap${3 - eggTaps === 1 ? '' : 's'}…` : 'Tap to reveal. You were warned.'}</span>}
              </button>
            </div>
          </div>
        </section>

        {/* ---------- HOBBIES ---------- */}
        <section className="section" id="hobbies">
          <p className="section-kicker reveal">HOBBIES</p>
          <h2 className="reveal">The <em>rotation.</em></h2>
          <div className="hobby-grid">
            {HOBBIES.map((h, i) => (
              <article className="glass-panel hobby-card reveal" style={{ '--reveal-delay': `${i * 70}ms` }} key={h.name}>
                <span className="hobby-icon"><h.icon size={22} /></span>
                <h3>{h.name}</h3>
                <p>{h.note}</p>
                <span className="hobby-tag">{h.tag}</span>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- PROJECTS ---------- */}
        <section className="section" id="projects">
          <p className="section-kicker reveal">PROJECTS</p>
          <h2 className="reveal">Things that <em>shipped.</em></h2>
          <div className="project-grid">
            {PROJECTS.map((p, i) => (
              <GlassSurface className={`project-card project-${p.accent} reveal`} borderRadius={26} tintOpacity={0.12} style={{ '--reveal-delay': `${i * 90}ms` }} key={p.name}>
                <div className="project-top">
                  <span className="project-icon"><p.icon size={20} /></span>
                  <p className="section-kicker">{p.kicker}</p>
                </div>
                <h3>{p.name}</h3>
                <p className="project-desc">{p.desc}</p>
                <div className="project-stats">
                  {p.stats.map(s => (
                    <div className="project-stat" key={s.label}>
                      <s.icon size={14} />
                      <strong>{s.value}</strong>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
                <a className="project-link" href={p.link} target="_blank" rel="noreferrer">
                  {p.linkLabel} <ArrowUpRight size={14} />
                </a>
              </GlassSurface>
            ))}
          </div>
        </section>

        {/* ---------- FAVORITES ---------- */}
        <section className="section" id="favorites">
          <p className="section-kicker reveal">FAVORITE THINGS</p>
          <h2 className="reveal">The hall of <em>fame.</em></h2>
          <div className="fav-grid">
            {FAVORITES.map((f, i) => (
              <div className="glass-panel fav-card reveal" style={{ '--reveal-delay': `${i * 60}ms` }} key={f.title}>
                <span className="fav-rank">{String(i + 1).padStart(2, '0')}</span>
                <f.icon size={20} />
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CONTACT ---------- */}
        <section className="section" id="contact">
          <p className="section-kicker reveal">CONTACT</p>
          <h2 className="reveal">Say <em>hi.</em></h2>
          <div className="contact-grid">
            <a className="glass-panel contact-card reveal" href={GITHUB} target="_blank" rel="noreferrer">
              <AtSign size={22} />
              <div><h3>GitHub</h3><p>@sneezejayhauser</p></div>
              <ArrowUpRight size={16} />
            </a>
            <a className="glass-panel contact-card reveal" style={{ '--reveal-delay': '90ms' }} href={INSTAGRAM} target="_blank" rel="noreferrer">
              <Camera size={22} />
              <div><h3>Instagram</h3><p>@sneezejayhauser</p></div>
              <ArrowUpRight size={16} />
            </a>
            <div className="glass-panel contact-card contact-note reveal" style={{ '--reveal-delay': '180ms' }}>
              <Mail size={22} />
              <div><h3>Everything else</h3><p>Find me on the court, in the pool, or mid anime-game session.</p></div>
            </div>
          </div>
        </section>

        <footer>
          <span>CJ · @sneezejayhauser</span>
          <span>Built with too much liquid glass · {new Date().getFullYear()}</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
