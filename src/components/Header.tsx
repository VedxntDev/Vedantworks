import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentTheme: 'dark' | 'light';
  toggleTheme: () => void;
  activeSection: string;
  currentView: 'portfolio' | 'blog';
  onViewChange: (view: 'portfolio' | 'blog') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTheme, 
  toggleTheme, 
  activeSection, 
  currentView, 
  onViewChange 
}) => {
  const navItems = [
    { id: 'contact', label: 'contact me' },
    { id: 'blog', label: 'blog' }
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (id === 'blog') {
      onViewChange('blog');
      return;
    }
    
    if (currentView !== 'portfolio') {
      onViewChange('portfolio');
      // Delay scrolling slightly to let the page render first
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onViewChange('portfolio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isItemActive = (id: string) => {
    if (id === 'blog') {
      return currentView === 'blog';
    }
    return currentView === 'portfolio' && activeSection === id;
  };

  return (
    <header className="header">
      <div className="header-nav">
        <a href="#" className="logo-link" onClick={handleLogoClick}>
          <span className="logo-text">VEDANT<span className="logo-dot">.</span></span>
        </a>

        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`nav-item ${isItemActive(item.id) ? 'active' : ''}`}
            >
              {item.label}
            </a>
          ))}

          <button 
            onClick={toggleTheme} 
            className="theme-toggle-btn" 
            aria-label={`Toggle to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {currentTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
