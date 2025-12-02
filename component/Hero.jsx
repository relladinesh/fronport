'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import OrbitIcons from './OrbitIcons';

/**
 * Hero.jsx (with added animations)
 *
 * - Entrance animations for left content and orbit panel using Framer Motion.
 * - Orbit panel receives a slow floating (y) animation loop.
 * - CTA buttons have subtle hover/tap animations.
 * - TypingText (mobile) is preserved.
 *
 * Drop this file as components/Hero.jsx (requires framer-motion installed).
 */

function TypingText({ text = 'Web developer', typeSpeed = 80, deleteSpeed = 40, pause = 1100 }) {
  const [display, setDisplay] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [pos, setPos] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted.current) return;
    let timeout;

    if (!isDeleting && pos <= text.length) {
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setDisplay(text.slice(0, pos));
        setPos((p) => p + 1);
      }, typeSpeed);

      if (pos === text.length) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(true);
          setPos((p) => p - 1);
        }, pause);
      }
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        if (!mounted.current) return;
        setDisplay(text.slice(0, pos));
        setPos((p) => p - 1);
      }, deleteSpeed);

      if (pos <= 0) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (!mounted.current) return;
          setIsDeleting(false);
          setPos(1);
        }, 250);
      }
    }

    return () => clearTimeout(timeout);
  }, [pos, isDeleting, text, typeSpeed, deleteSpeed, pause]);

  return (
    <span>
      {display}
      <span className="ml-1 inline-block w-[8px] text-transparent bg-transparent">
        <span className="text-white animate-pulse">|</span>
      </span>
    </span>
  );
}

export default function Hero({ character = null }) {
  const controls = useAnimation();
  const orbitWrapRef = useRef(null);

  const [orbitSize, setOrbitSize] = useState(260);
  const [orbitRadius, setOrbitRadius] = useState(96);
  const [orbitSpeed, setOrbitSpeed] = useState(16);

  useEffect(() => {
    // start with hidden -> visible animation
    controls.set('hidden');

    function measure() {
      const el = orbitWrapRef.current;
      if (!el) return;
      const w = el.clientWidth || el.offsetWidth || 0;
      const computedSize = Math.max(140, Math.min(520, Math.round(w * 0.9)));
      setOrbitSize(computedSize);
      const r = Math.round(Math.max(44, Math.min(260, computedSize * 0.36)));
      setOrbitRadius(r);
      setOrbitSpeed(w < 420 ? 12 : 16);
    }

    measure();

    const t = setTimeout(() => {
      // animate in
      controls.start('visible');
    }, 120);

    window.addEventListener('resize', measure);
    let ro;
    if (typeof ResizeObserver !== 'undefined' && orbitWrapRef.current) {
      ro = new ResizeObserver(measure);
      ro.observe(orbitWrapRef.current);
    }

    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      if (ro && orbitWrapRef.current) ro.unobserve(orbitWrapRef.current);
    };
  }, [controls]);

  const leftVariants = {
    hidden: { opacity: 0, x: -22 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.2, 0.9, 0.3, 1] } },
  };

  const rightVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.2, 0.9, 0.3, 1], delay: 0.08 },
    },
  };

  const ctaWhileTap = { scale: 0.98 };
  const ctaWhileHover = { y: -3 };

  return (
    <section
      id="hero"
      style={{ scrollMarginTop: '96px' }}
      className="rounded-2xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-[rgba(255,255,255,0.02)] to-transparent border border-white/5 shadow-2xl relative overflow-hidden mx-auto"
    >
      <div className="absolute w-full h-full bg-gradient-to-br from-orange-500/30 to-pink-400/10 blur-3xl rounded-tl-full pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-8">
        {/* Left content (animated) */}
        <motion.div
          className="md:flex-1 pb-6 md:pb-0 flex flex-col justify-center"
          variants={leftVariants}
          initial="hidden"
          animate={controls}
        >
          <p className="text-sm sm:text-base font-semibold text-orange-400 mb-3">Hey, I am Rella</p>

          {/* Mobile: typing effect */}
          <h1 className="text-4xl sm:hidden font-extrabold leading-tight tracking-tight mb-4">
            <TypingText text="Web developer" />
          </h1>

          {/* Desktop & tablet: original static heading */}
          <h1 className="hidden sm:block text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-4">
            Web developer
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-prose mb-6">
            I build delightful web experiences — animations, UI, and interactive hero sections.
          </p>

          <div className="flex gap-3 flex-wrap">
            <motion.a
              href="https://github.com/relladinesh"
              className="inline-block px-5 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg"
              whileHover={ctaWhileHover}
              whileTap={ctaWhileTap}
              initial={{ scale: 1 }}
            >
              See my work
            </motion.a>

            <motion.a
              href="#contact"
              className="inline-block px-5 py-3 rounded-full text-slate-200 font-medium bg-white/5 hover:bg-white/8"
              whileHover={ctaWhileHover}
              whileTap={ctaWhileTap}
              initial={{ scale: 1 }}
            >
              Contact
            </motion.a>
          </div>
        </motion.div>

        {/* Right: responsive orbit panel (animated entrance + slow float) */}
        <motion.div
          ref={orbitWrapRef}
          className="relative mx-auto md:mx-0 flex-shrink-0 w-full max-w-[680px] md:w-[520px] lg:w-[640px]"
          variants={rightVariants}
          initial="hidden"
          animate={controls}
        >
          {/* slow float loop */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="relative w-full rounded-lg shadow-inner sm:h-[380px] md:h-[460px] lg:h-[520px] flex items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <OrbitIcons size={orbitSize} radius={orbitRadius} speed={orbitSpeed} />
            </div>

            {/* subtle animated hub pulse overlay (improves perceived motion) */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: [0, 0.12, 0], scale: [0.96, 1.02, 0.96] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.6 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 40% 35%, rgba(255,160,110,0.06), transparent 40%)' }}
            />

            <motion.div
              animate={{ opacity: [0, 1], y: [8, 0] }}
              transition={{ duration: 0.7, ease: [0.2, 0.9, 0.3, 1] }}
              className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto"
            >
              {/* optional center character image or caption could go here */}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        #hero :global(h1) { text-shadow: 0 6px 28px rgba(0,0,0,0.6); }
        @media (max-width: 640px) {
          #hero { padding-top: 20px; padding-bottom: 20px; }
        }
      `}</style>
    </section>
  );
}