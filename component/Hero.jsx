'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import OrbitIcons from './OrbitIcons';

/**
 * Hero.jsx
 *
 * - Same simplified Hero you tested, but the orbit panel gets brighter while it floats.
 * - Uses a CSS filter brightness animation in the floating motion wrapper and keeps reduced-motion respect.
 * - You can tune `BRIGHTNESS_PEAK` and `FLOAT_DISTANCE` below.
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
  const orbitWrapRef = useRef(null);
  const [orbitSize, setOrbitSize] = useState(260);
  const [orbitRadius, setOrbitRadius] = useState(96);
  const [orbitSpeed, setOrbitSpeed] = useState(16);

  // Use simple boolean visible flag to animate (avoids useAnimation races)
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Tweak these to change how bright / how far it floats
  const BRIGHTNESS_PEAK = 1.14; // 1 = normal, >1 = brighter; tune as desired
  const FLOAT_DISTANCE = 8; // px, how far up it floats

  useEffect(() => {
    console.log('[Hero] mounted');
    console.log('[Hero] prefers-reduced-motion:', shouldReduceMotion);

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

    // measure immediately
    measure();

    // set visible after a short delay so initial state can be seen
    const t = setTimeout(() => {
      // If reduced motion, set visible immediately to avoid entrance animations
      setVisible(true);
      console.log('[Hero] setting visible = true (animation start)');
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
      console.log('[Hero] unmounted');
    };
  }, [shouldReduceMotion]);

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

  // Build the float animate object; include filter brightness if allowed
  const floatAnimate = shouldReduceMotion
    ? {}
    : {
        y: [0, -FLOAT_DISTANCE, 0],
        filter: [`brightness(1)`, `brightness(${BRIGHTNESS_PEAK})`, `brightness(1)`],
      };

  const floatTransition = shouldReduceMotion
    ? {}
    : { duration: 6, repeat: Infinity, ease: 'easeInOut' };

  return (
    <section
      id="hero"
      style={{ scrollMarginTop: '96px' }}
      className="rounded-2xl p-6 sm:p-8 md:p-10 bg-gradient-to-br from-[rgba(220,238,238,0.09)]  border border-white/5 shadow-2xl relative overflow-hidden mx-auto bg-black z-1"
    >
      <div className="absolute w-full h-full bg-gradient-to-br from-orange-500/30 to-pink-400/10 blur-3xl rounded-tl-full pointer-events-none hero-glow-overlay" />

      <div className="relative z-10 flex flex-col md:flex-row items-stretch gap-8">
        {/* Left content (animated, state-driven) */}
        <motion.div
          className="md:flex-1 pb-6 md:pb-0 flex flex-col justify-center"
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
          variants={leftVariants}
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
            <span className="block text-lg font-medium text-white/90">
              Fueled by curiosity and craft — I design motion-led interfaces that tell stories and solve real problems.
            </span>
            <span className="block mt-2 text-sm text-gray-300/90">
              I care about clarity, delight, and the tiny moments that make a product feel intentional.
            </span>
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

        {/* Right: orbit panel */}
        <motion.div
          ref={orbitWrapRef}
          className="relative mx-auto md:mx-0 flex-shrink-0 w-full max-w-[680px] md:w-[520px] lg:w-[640px]"
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
          variants={rightVariants}
          style={{ willChange: 'transform, filter' }}
        >
          {/* slow float loop (disabled when user requests reduced motion) */}
          <motion.div
            animate={floatAnimate}
            transition={floatTransition}
            className="relative w-full rounded-lg shadow-inner sm:h-[380px] md:h-[460px] lg:h-[520px] flex items-center justify-center overflow-hidden"
            style={{ willChange: 'transform, filter' }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <OrbitIcons size={orbitSize} radius={orbitRadius} speed={orbitSpeed} />
            </div>

            {/* subtle animated hub pulse overlay (improves perceived motion) */}
            <motion.div
              aria-hidden
              initial={{ opacity: 0, scale: 0.96 }}
              animate={shouldReduceMotion ? { opacity: 0 } : { opacity: [0, 0.12, 0], scale: [0.96, 1.02, 0.96] }}
              transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 3.8, ease: 'easeInOut', delay: 0.6 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle at 40% 35%, rgba(255,160,110,0.06), transparent 40%)' }}
            />

            <motion.div
              animate={shouldReduceMotion ? {} : { opacity: [0, 1], y: [8, 0] }}
              transition={shouldReduceMotion ? {} : { duration: 0.7, ease: [0.2, 0.9, 0.3, 1] }}
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
         @keyframes heroGlowPulse {
          0% {
            transform: scale(0.950);
            opacity: 0.92;
            filter: blur(26px);
          }
          50% {
            transform: scale(1.090);
            opacity: 1;
            filter: blur(30px);
          }
          100% {
            transform: scale(0.950);
            opacity: 0.92;
            filter: blur(26px);
          }
        }

        .hero-glow-overlay {
          animation: heroGlowPulse 3s ease-in-out infinite;
          will-change: transform, opacity, filter;
        }
      `}</style>
    </section>
  );
}