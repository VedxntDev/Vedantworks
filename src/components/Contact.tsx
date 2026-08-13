import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const CONTACT_EMAIL = 'vedantsinghbaghelsocial@gmail.com';

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const el = document.createElement('textarea');
      el.value = CONTACT_EMAIL;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleMailApp = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  return (
    <section id="contact" className="contact-section contact-minimal">
      <div className="contact-minimal-inner">
        <p className="contact-label">Contact</p>
        <h2 className="contact-headline">Let's build something.</h2>
        <p className="contact-subtext">
          Open to internships, full‑stack collaborations, and side projects.
          <br />Drop a line anytime.
        </p>

        <div className="contact-actions">
          {/* Email pill — click copies address */}
          <button
            className={`contact-email-pill ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Click to copy email"
          >
            <span className="contact-email-icon">
              {copied
                ? <Check size={13} strokeWidth={2.5} />
                : <Copy size={13} strokeWidth={2} />
              }
            </span>
            <span className="contact-email-text">{CONTACT_EMAIL}</span>
            {copied && <span className="contact-copied-badge">Copied!</span>}
          </button>

          {/* Open mail app link */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            onClick={handleMailApp}
            className="contact-open-mail"
          >
            or open mail app&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
};
