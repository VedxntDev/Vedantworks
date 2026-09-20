import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Sparkles, Menu, X, CalendarCheck } from 'lucide-react';
import { GlowButton } from './GlowButton';

export interface NavItem {
  id: string;
  label: string;
}

export interface NovaGlowNavProps {
  currentTheme: 'dark' | 'light';
  toggleTheme: () => void;
  activeSection: string;
  currentView: 'portfolio' | 'blog';
  onViewChange: (view: 'portfolio' | 'blog') => void;
  logoText?: string;
}

export const NovaGlowNav: React.FC<NovaGlowNavProps> = ({
  currentTheme,
  toggleTheme,
  activeSection,
  currentView,
  onViewChange,
  logoText = 'VEDANT',
}) => {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (id === 'blog') {
      onViewChange('blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentView !== 'portfolio') {
      onViewChange('portfolio');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const offset = 90;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = el.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          window.scrollTo({
            top: elementPosition - offset,
            behavior: 'smooth',
          });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onViewChange('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (id: string) => {
    if (id === 'blog') return currentView === 'blog';
    return currentView === 'portfolio' && activeSection === id;
  };

  return (
    <header className={`nova-header-container ${isScrolled ? 'is-scrolled' : ''}`}>
      <nav className="nova-nav-pill">
        {/* Ambient Nova Glow Effect */}
        <div className="nova-glow-layer" />
        <div className="nova-border-highlight" />

        {/* Brand Name */}
        <a href="#" className="nova-logo-btn" onClick={handleLogoClick}>
          <span className="nova-logo-text">
            {logoText}
            <span className="nova-logo-dot">.</span>
          </span>
        </a>

        {/* Desktop Nav Items */}
        <div className="nova-items-desktop">
          {navItems.map((item) => {
            const active = isItemActive(item.id);
            const isHovered = hoveredTab === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                onMouseLeave={() => setHoveredTab(null)}
                className={`nova-nav-item ${active ? 'active' : ''}`}
              >
                {/* Active Indicator Pill */}
                {active && (
                  <motion.div
                    layoutId="nova-active-pill"
                    className="nova-active-indicator"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Hover Glow Highlight */}
                {isHovered && !active && (
                  <motion.div
                    layoutId="nova-hover-pill"
                    className="nova-hover-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                <span className="nova-item-label">{item.label}</span>
              </a>
            );
          })}
        </div>

        {/* Action Buttons: Theme Toggle & Cal Link */}
        <div className="nova-actions">
          <GlowButton
            href="https://cal.com/hemric-icflka/letschat?overlayCalendar=true"
            target="_blank"
            variant="glow"
            size="sm"
            glowColor="#10b981"
            icon={<Sparkles size={13} className="nova-cta-icon" />}
            title="Book a 15-min chat"
          >
            Let's Talk
          </GlowButton>

          <button
            onClick={toggleTheme}
            className="nova-theme-toggle"
            aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <motion.div
              key={currentTheme}
              initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.2 }}
            >
              {currentTheme === 'dark' ? (
                <Sun size={17} className="nova-icon-sun" />
              ) : (
                <Moon size={17} className="nova-icon-moon" />
              )}
            </motion.div>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            className="nova-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer with Smooth Framer Animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="nova-mobile-menu"
          >
            <div className="nova-mobile-links">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`nova-mobile-link ${isItemActive(item.id) ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                </a>
              ))}
              <a
                href="https://cal.com/hemric-icflka/letschat?overlayCalendar=true"
                target="_blank"
                rel="noopener noreferrer"
                className="nova-mobile-cta"
                onClick={() => setMobileMenuOpen(false)}
              >
                <CalendarCheck size={16} />
                <span>Book a Call</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NovaGlowNav;
