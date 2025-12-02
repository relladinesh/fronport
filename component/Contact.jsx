'use client';

import React, { useState, useRef } from 'react';

// Use a NEXT_PUBLIC_ env var so this value is available in the client bundle.
// Falls back to the previous localhost value if the env var is not set.
const CONTACT_URL = process.env.NEXT_PUBLIC_CONTACT_URL+'contacts';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honey: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success'|'error', text }
  const [errors, setErrors] = useState({});
  const confettiRef = useRef(null);

  function validate(values) {
    const e = {};
    if (!values.name.trim()) e.name = 'Please enter your name';
    if (!values.email.trim()) e.email = 'Please enter your email';
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(values.email.trim())) e.email = 'Please enter a valid email';
    }
    if (!values.message.trim() || values.message.trim().length < 8) e.message = 'Message must be at least 8 characters';
    if (values.honey) e.honey = 'Spam detected';
    return e;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setStatus(null);
  }

  function spawnConfetti(container) {
    if (!container) return;
    const colors = ['#ff6b6b', '#ffd93d', '#6bf0c1', '#6b9bff', '#c86bff'];
    const total = 18;
    for (let i = 0; i < total; i++) {
      const el = document.createElement('span');
      el.className = 'confetti-item';
      el.style.background = colors[i % colors.length];
      el.style.left = Math.random() * 100 + '%';
      el.style.opacity = String(0.9 - Math.random() * 0.5);
      el.style.transform = `translateY(0) rotate(${Math.random() * 360}deg)`;
      container.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    setStatus(null);
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.values(errs).find(Boolean);
      setStatus({ type: 'error', text: first || 'Validation error' });
      return;
    }

    setSending(true);
    try {
      const payload = { name: form.name, email: form.email, subject: form.subject, message: form.message };
      const res = await fetch(CONTACT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        const text = await res.text().catch(() => '<non-readable>');
        setStatus({ type: 'error', text: `Server responded with non-JSON: ${text}` });
        return;
      }

      if (res.ok && (data?.ok ?? true)) {
        // Show generic success message only — do NOT display id or raw server ok value
        setStatus({ type: 'success', text: 'Thanks — message sent.' });
        setForm({ name: '', email: '', subject: '', message: '', honey: '' });
        spawnConfetti(confettiRef.current);
      } else {
        const errMsg = data?.error || data?.message || `Server returned ${res.status}`;
        setStatus({ type: 'error', text: errMsg });
      }
    } catch (err) {
      console.error('[Contact] network error', err);
      setStatus({ type: 'error', text: 'Network error — could not send.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="contact">
      {/* confetti animation frames */}
      <style>{`
        .confetti-item {
          position: absolute;
          top: 0;
          width: 8px;
          height: 12px;
          border-radius: 2px;
          will-change: transform, opacity;
          animation: confetti-fall 900ms cubic-bezier(.2,.6,.2,1) forwards;
          z-index: 60;
        }
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          60% { transform: translateY(220px) rotate(160deg); opacity: 0.95; }
          100% { transform: translateY(420px) rotate(360deg); opacity: 0; }
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
        {/* Left: hero/info */}
        <div className="min-w-0">
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-black/50 to-black/30 border border-white/6 backdrop-blur-md shadow-lg">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 leading-tight">Let's build something memorable</h2>
            <p className="text-xs sm:text-sm md:text-sm text-slate-300 mb-4 sm:mb-6 max-w-xl break-words">
              Send a message — a quick hello, project idea, or anything you'd like me to review. I usually reply within a day.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 backdrop-blur-md border border-white/6 text-xs sm:text-sm min-w-0">
                <svg className="w-4 h-4 text-amber-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11z"/></svg>
                <div className="truncate">
                  <div className="text-sm font-semibold text-white leading-tight">Email</div>
                  <a className="text-xs sm:text-sm text-slate-300 truncate" href="mailto:hello@example.com">hello@example.com</a>
                </div>
              </div>

              <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/3 backdrop-blur-md border border-white/6 text-xs sm:text-sm">
                <svg className="w-4 h-4 text-pink-300 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 6 6 .5-4.5 3 1.8 6L12 15l-6.3 3.5L7.5 11 3 8l6-.5L12 2z"/></svg>
                <div>
                  <div className="text-sm font-semibold text-white leading-tight">Open to work</div>
                  <div className="text-xs sm:text-sm text-slate-300">Freelance & collaboration</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="min-w-0">
          <form onSubmit={handleSubmit} noValidate className="relative bg-white/6 border border-white/8 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-sm sm:text-base font-semibold text-white">Contact me</h3>
              <div className="text-xs sm:text-sm text-slate-300">{sending ? 'Sending…' : 'I usually reply within 24h'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {/* Name */}
              <div className="min-w-0">
                <label htmlFor="name" className="block text-xs sm:text-sm text-slate-300 mb-1">Name</label>
                <div className={`flex items-center rounded-lg border ${errors.name ? 'border-rose-400' : 'border-white/10'} bg-transparent min-w-0`}>
                  <span className="px-2 text-slate-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2-8 4v1h16v-1c0-2-3.582-4-8-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input
                    id="name"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full min-w-0 bg-transparent px-2 py-2 text-sm sm:text-sm placeholder-white/60 focus:outline-none"
                    aria-invalid={!!errors.name}
                    aria-describedby={errors.name ? 'err-name' : undefined}
                  />
                </div>
                {errors.name && <p id="err-name" role="alert" className="mt-1 text-rose-400 text-xs">{errors.name}</p>}
              </div>

              {/* Email */}
              <div className="min-w-0">
                <label htmlFor="email" className="block text-xs sm:text-sm text-slate-300 mb-1">Email</label>
                <div className={`flex items-center rounded-lg border ${errors.email ? 'border-rose-400' : 'border-white/10'} bg-transparent min-w-0`}>
                  <span className="px-2 text-slate-400">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M21 8V7a2 2 0 00-2-2H5a2 2 0 00-2 2v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full min-w-0 bg-transparent px-2 py-2 text-sm sm:text-sm placeholder-white/60 focus:outline-none"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'err-email' : undefined}
                  />
                </div>
                {errors.email && <p id="err-email" role="alert" className="mt-1 text-rose-400 text-xs">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-xs sm:text-sm text-slate-300 mb-1">Subject (optional)</label>
                <input
                  id="subject"
                  name="subject"
                  placeholder="What's this about?"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-2 text-sm sm:text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-xs sm:text-sm text-slate-300 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Write your message..."
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-transparent px-2 py-2 text-sm sm:text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-vertical min-h-[110px]"
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'err-message' : undefined}
                />
                {errors.message && <p id="err-message" role="alert" className="mt-1 text-rose-400 text-xs">{errors.message}</p>}
              </div>
            </div>

            {/* Honeypot */}
            <div style={{ position: 'absolute', left: '-9999px', top: 'auto' }} aria-hidden>
              <label>Leave empty</label>
              <input name="honey" value={form.honey} onChange={handleChange} tabIndex={-1} autoComplete="off" />
            </div>

            {/* Actions */}
            <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold shadow-md ${sending ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5 transform transition'} bg-gradient-to-r from-amber-300 via-pink-400 to-indigo-600 text-slate-900 text-sm`}
                aria-busy={sending}
              >
                <svg className={`w-4 h-4 ${sending ? 'animate-spin' : ''}`} viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" fill="currentColor" />
                </svg>
                <span>{sending ? 'Sending…' : 'Send'}</span>
              </button>

              <button
                type="button"
                onClick={() => { setForm({ name: '', email: '', subject: '', message: '', honey: '' }); setErrors({}); setStatus(null); }}
                className="w-full sm:w-auto px-3 py-2 rounded-md border border-white/10 text-sm text-slate-200 hover:bg-white/2 transition"
              >
                Reset
              </button>

              <div className="mt-2 sm:mt-0 sm:ml-auto" role="status" aria-live="polite">
                {status ? (
                  <div className={`px-3 py-2 rounded-md text-sm ${status.type === 'success' ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-200'}`}>
                    {status.text}
                  </div>
                ) : null}
              </div>
            </div>

            {/* confetti container */}
            <div ref={confettiRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
          </form>
        </div>
      </div>
    </section>
  );
}