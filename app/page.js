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

/**
 * Page with fixed loader overlay that fully covers the viewport
 *
 * Changes:
 * - Overlay now uses a solid black background (no transparency) so nothing shows through.
 * - Overlay blocks pointer events while visible.
 * - While the loader is visible, document.body overflow is hidden to prevent scrolling.
 */

export default function Page() {
  // control whether loader is mounted at all (removed after fade completes)
  const [showLoader, setShowLoader] = useState(true);
  // control overlay opacity/visibility for fade animation (not strictly required here)
  const [overlayVisible, setOverlayVisible] = useState(true);

  // Configuration
  const loaderDurationMs = 6000; // show loader for exactly 5 seconds (change as needed)
  const fadeOutMs = 420; // duration of fade out (ms)

  // Prevent page scrolling while loader is visible
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
    // start the fixed timer on mount
    const t = setTimeout(() => {
      // start fade-out visually (if you want smooth fade)
      setOverlayVisible(false);
      // after fade completes, unmount loader completely
      const u = setTimeout(() => {
        setShowLoader(false);
      }, fadeOutMs);
      // cleanup inner timeout if component unmounts early
      return () => clearTimeout(u);
    }, loaderDurationMs);

    return () => {
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Full-screen loader overlay (renders only while showLoader is true) */}
      {showLoader && (
        <div
          aria-hidden={!overlayVisible}
          // solid black full-screen overlay. pointer-events-auto ensures it blocks interactions.
          className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black pointer-events-auto transition-opacity duration-400 ${
            overlayVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            // extra safety: ensure it covers everything visually (in case of other high-z elements)
            backgroundColor: '#000',
          }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* D letter 3D loader - client component */}
            <DLetter3DLoader size={220} depth={60} colorA="#ff7ab6" colorB="#ffd36b" speed={7.6} />
            <div className="text-sm text-slate-200/90">Loading — preparing the experience</div>
          </div>
        </div>
      )}

      {/* Main page content (rendered under the loader) */}
      <Nav />
      <main>
        <Hero character="/character.png" />

        <section
          id="blobs-section"
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
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

          <Skills />
          <ExperienceJourney />
          <Projects />
          <Contact />
        </section>

        <ScrollToTop />
      </main>
    </>
  );
}