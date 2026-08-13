import React from 'react';
import { Mail } from 'lucide-react';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg 
    viewBox="0 0 24 24" 
    width={size} 
    height={size} 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const CONTACT_EMAIL = 'vedantsinghbaghelsocial@gmail.com';

export const Contact: React.FC = () => {
  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${CONTACT_EMAIL}`;
  };

  return (
    <section id="contact" className="contact-section">
      <h3 className="section-title">Get In Touch</h3>
      <p className="section-desc">
        Feel free to reach out if you'd like to collaborate, talk about technology, or just say hello!
      </p>

      <div className="contact-grid">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={handleEmail}
          className="contact-btn"
        >
          <Mail size={18} />
          <span>Email Me</span>
        </a>
        <a href="https://github.com/VedxntDev" target="_blank" rel="noopener noreferrer" className="contact-btn">
          <GithubIcon size={18} />
          <span>GitHub</span>
        </a>
        <a href="https://www.linkedin.com/in/vedantsbaghel" target="_blank" rel="noopener noreferrer" className="contact-btn">
          <LinkedinIcon size={18} />
          <span>LinkedIn</span>
        </a>
      </div>
    </section>
  );
};
