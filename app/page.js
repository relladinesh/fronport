'use client';

import React, { useEffect, useState } from 'react';
import MetaballsBg from '../component/MetaballsBg';
import Nav from '../component/Nav';
import Hero from '../component/Hero';
import Skills from '../component/Skills';
import ExperienceJourney from '../component/Exp';
import Projects from '../component/Projects';
import Contact from '@/component/Contact';
import ScrollToTop from '../component/ScrollToTop';
import DLetter3DLoader from '../component/Dloader';
import DebugAnimations from '@/component/motion';

/**
 * Page with a black main background so all components render on a dark canvas.
 * - Wraps the whole app content in a root container with bg-black and text-white.
 * - Adds a small helper class .app-main that ensures children can use their own glassy backgrounds
 *   and that text defaults to white unless components explicitly override it.
 *
 * Drop this file into app/page.jsx replacing your existing file.
 */

export default function Page() {
  const [showLoader, setShowLoader] = useState(true);
  const [overlayVisible, setOverlayVisible] = useState(true);

  const loaderDurationMs = 6000;
  const fadeOutMs = 420;

  useEffect(() => {
    if (showLoader) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return undefined;
  }, [showLoader]);

  useEffect(() => {
    const t = setTimeout(() => {
      setOverlayVisible(false);
      const u = setTimeout(() => setShowLoader(false), fadeOutMs);
      return () => clearTimeout(u);
    }, loaderDurationMs);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {showLoader && (
        <div
          aria-hidden={!overlayVisible}
          className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black pointer-events-auto transition-opacity duration-400 ${
            overlayVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: '#000' }}
        >
          <div className="flex flex-col items-center gap-6">
            <DLetter3DLoader size={220} depth={60} colorA="#ff7ab6" colorB="#ffd36b" speed={7.6} />
            <div className="text-sm text-slate-200/90">Loading — preparing the experience</div>
          </div>
        </div>
      )}

      <div className="app-root bg-black text-white min-h-screen">
        <style>{`
          /* Ensures default body-level background is black for any non-tailwind consumers */
          .app-root { background-color: #000 !important; color: #fff !important; }
          /* Make sure any images/svg that rely on currentColor will be visible */
          .app-root svg { color: inherit; }
          /* When a component uses glass/translucent backgrounds we keep text readable */
          .app-root .hero-light-wrapper,
          .app-root .skill-card,
          .app-root .project-card,
          .app-root .contact-card {
            /* don't inherit the page text color blindly, allow their own styling */
            color: inherit;
          }
        `}</style>

        <Nav />
        <main className="app-main">
          {/* Keep Hero wrapper to guard against forced dark transformations if needed */}
          <div className="hero-light-wrapper" style={{ position: 'relative' }}>
            <Hero character="/character.png" />
          </div>

          <section id="blobs-section" style={{ position: 'relative', overflow: 'hidden' }}>
            <MetaballsBg
              count={6}
              color="255,140,90"
              minR={60}
              maxR={180}
              speed={30}
              blur={16}
              z={-1}
              fixed={false}
              autoReduce={true}
              debug={false}
              interactive={true}
            />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <Skills />
              <ExperienceJourney />
              <Projects />
              <Contact />
            </div>
          </section>

          <ScrollToTop />
        </main>
      </div>
    </>
  );
}