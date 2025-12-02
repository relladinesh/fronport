'use client';

import React, { useState, useRef } from 'react';

// Build API URL robustly; remove trailing slash if present and append '/contacts'
const base = (process.env.NEXT_PUBLIC_CONTACT_URL || '').replace(/\/+$/, '');
const CONTACT_URL = base ? `${base}/contacts` : '/contacts';

if (typeof window !== 'undefined') {
  // debug log to verify built URL in the browser console (remove after testing)
  // eslint-disable-next-line no-console
  console.log('[Contact] CONTACT_URL =', CONTACT_URL);
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', honey: '' });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);
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
      const payload = { name: form.name, email: form.email, subject: form.subject, message: form.message, honey: form.honey };
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
        setStatus({ type: 'success', text: 'Thanks — message sent.' });
        setForm({ name: '', email: '', subject: '', message: '', honey: '' });
        spawnConfetti(confettiRef.current);
      } else {
        const errMsg = data?.error || data?.message || `Server returned ${res.status}`;
        setStatus({ type: 'error', text: errMsg });
      }
    } catch (err) {
      // network or CORS error
      // eslint-disable-next-line no-console
      console.error('[Contact] network error', err);
      setStatus({ type: 'error', text: 'Network error — could not send.' });
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="contact" className="w-full max-w-6xl mx-auto px-4 py-8">
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

      <form onSubmit={handleSubmit} noValidate className="relative bg-white/6 border rounded-3xl p-6">
        {/* simplified form fields for brevity (use your own markup/styles) */}
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (optional)" />
        <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required />
        {/* honeypot */}
        <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden>
          <label>Leave empty</label>
          <input name="honey" value={form.honey} onChange={handleChange} autoComplete="off" tabIndex={-1} />
        </div>

        <div>
          <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send'}</button>
        </div>

        {status && (
          <div style={{ marginTop: 12, color: status.type === 'success' ? 'green' : 'red' }}>
            {status.text}
          </div>
        )}

        <div ref={confettiRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden />
      </form>
    </section>
  );
}