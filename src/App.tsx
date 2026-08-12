import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Experience } from './components/Experience';
import { Projects } from './components/Projects';
import { Stats } from './components/Stats';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import GridBeams from './components/ui/animated-beams-grid-background';

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

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeSection, setActiveSection] = useState('about');
  const [view, setView] = useState<'portfolio' | 'blog'>('portfolio');

  // Handle Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  // Scroll to top when view changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);

  // Determine Active Section on Scroll
  useEffect(() => {
    if (view !== 'portfolio') return;

    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects', 'contact'];
      const scrollPosition = window.scrollY + 120; // offset

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [view]);

  return (
    <div className="app-container">
      {/* Animated Beams Grid Background (Aceternity UI inspired) */}
      <GridBeams className="animated-beams-bg" beamColor={["#10b981", "#34d399", "#14b8a6"]} />

      <Header 
        currentTheme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        currentView={view}
        onViewChange={setView}
      />

      <main className="content-container">
        {view === 'portfolio' ? (
          <>
            <Hero />
            <Experience />
            <Projects />
            <Stats />
            <Contact />
          </>
        ) : (
          <Blog />
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>{new Date().getFullYear()} © Vedant</span>
            </div>
            
            <div className="social-links">
              <a 
                href="https://github.com/VedxntDev" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link"
                title="GitHub Profile"
              >
                <GithubIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
