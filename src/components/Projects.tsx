import React, { useState, useEffect } from 'react';

const GithubIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface TerminalPreviewProps {
  command: string;
  outputs: string[];
}

const TerminalPreview: React.FC<TerminalPreviewProps> = ({ command, outputs }) => {
  const [typedCommand, setTypedCommand] = useState('');
  const [visibleOutputs, setVisibleOutputs] = useState<string[]>([]);
  
  useEffect(() => {
    setTypedCommand('');
    setVisibleOutputs([]);
    
    let charIndex = 0;
    let outputTimer: ReturnType<typeof setInterval> | null = null;
    
    const typingTimer = setInterval(() => {
      if (charIndex < command.length) {
        // Capturing char synchronously before incrementing prevents skipping first character
        const char = command.charAt(charIndex);
        setTypedCommand(prev => prev + char);
        charIndex++;
      } else {
        clearInterval(typingTimer);
        
        // Command typed, now show outputs sequentially
        let outputIndex = 0;
        outputTimer = setInterval(() => {
          if (outputIndex < outputs.length) {
            setVisibleOutputs(prev => [...prev, outputs[outputIndex]]);
            outputIndex++;
          } else {
            if (outputTimer) clearInterval(outputTimer);
          }
        }, 150);
      }
    }, 25);
    
    return () => {
      clearInterval(typingTimer);
      if (outputTimer) clearInterval(outputTimer);
    };
  }, [command, outputs]);
  
  return (
    <div className="project-terminal-preview">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span className="terminal-title">bash — preview</span>
      </div>
      <div className="terminal-body">
        <div className="terminal-prompt-line">
          <span className="terminal-prompt">~/vedxntdev $</span>{' '}
          <span>{typedCommand}</span>
          <span className="terminal-cursor">|</span>
        </div>
        {visibleOutputs.map((line, idx) => (
          <div key={idx} className="terminal-output-line">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

interface Project {
  id: number;
  title: string;
  desc: string;
  tags: string[];
  githubUrl: string;
  date: string;
  command: string;
  outputs: string[];
}

// Move static projects list outside the component so references are stable
const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: 'Snoppy',
    desc: 'Interactive, Bun-based AI CLI tool designed for codebase planning, Q&A support, agent-driven automation workflows, and Telegram bot notification channels.',
    tags: ['TypeScript', 'Commander', 'Telegraf', 'Bun', 'LLM'],
    githubUrl: 'https://github.com/VedxntDev/Snoppy',
    date: 'July 2026',
    command: 'bun run snoppy start',
    outputs: [
      '✔ Config file loaded successfully',
      '✔ Telegram bot active (@SnoppyBot)',
      'ℹ Ingesting local repository logs...',
      '✔ Indexed 45 modules for Q&A reference',
      '⚡ Ready for developer agent commands'
    ]
  },
  {
    id: 2,
    title: 'Bloop',
    desc: 'Intelligent AI-powered CLI assistant streamlining Git and GitHub workflows. Automatically generates conventional commits, structures PR descriptions, and compiles diff updates.',
    tags: ['TypeScript', 'Commander', 'LLM', 'Node.js', 'Git'],
    githubUrl: 'https://github.com/VedxntDev/Bloop',
    date: 'July 2026',
    command: 'bloop commit --auto',
    outputs: [
      'ℹ Fetching current git status...',
      '✔ 3 modified files detected',
      '✔ Generating commit summary...',
      '  > "feat(ui): add glow sweeping lines to avatar"',
      '✔ Commit created! (hash: 7d2b91f)'
    ]
  }
];

export const Projects: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="projects" className="projects-section-container">
      {/* Decorative vertical grid line running down the side of the section */}
      <div className="section-grid-line-left"></div>

      <h3 className="section-title">Projects</h3>
      <p className="section-desc">
        A selection of recent development projects, illustrating technical design choices and engineering capabilities.
      </p>

      <div className="projects-grid">
        {PROJECTS_DATA.map((proj, index) => (
          <div 
            key={proj.id} 
            className="project-card-wrapper"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="project-card">
              <div className="project-card-glow"></div>

              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="project-header">
                  <div>
                    <h4 className="project-title">{proj.title}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{proj.date}</span>
                  </div>
                  <div className="project-links">
                    <a 
                      href={proj.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="project-icon-link"
                      title="View Source Code"
                    >
                      <GithubIcon size={18} />
                    </a>
                  </div>
                </div>

                <p className="project-desc">{proj.desc}</p>

                <div className="badge-container" style={{ marginTop: 'auto' }}>
                  {proj.tags.map((tag) => (
                    <span key={tag} className="badge" style={{ fontStyle: 'italic' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Float preview next to the card based on index column on desktop */}
            {hoveredIndex === index && (
              <div className={`project-preview-popup-container ${index % 2 === 0 ? 'pop-right' : 'pop-left'}`}>
                <TerminalPreview command={proj.command} outputs={proj.outputs} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
