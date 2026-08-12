import React from 'react';
import { Briefcase } from 'lucide-react';

interface ExperienceItem {
  id: number;
  role: string;
  company: string;
  period: string;
  desc: string;
  skills: string[];
}

export const Experience: React.FC = () => {
  const experiences: ExperienceItem[] = [
    {
      id: 1,
      role: 'AI Frontend Intern',
      company: 'FlyRankAI',
      period: 'August 2026 – Present',
      desc: 'Collaborate on design and development of AI-driven front-end interfaces, leveraging modern web frameworks to create responsive and interactive user experiences.',
      skills: ['JavaScript', 'Node.js', 'React', 'Tailwind CSS', 'Next.js', 'REST APIs']
    },
    {
      id: 2,
      role: 'Intra Institutional Intern',
      company: 'Ramaiah Institute of Technology',
      period: '2026',
      desc: 'Developed Swift-based responsive iOS applications, including a Gamified Programming Learning iOS app designed to teach core programming concepts through interactive game challenges.',
      skills: ['Swift', 'iOS SDK', 'Xcode', 'Playgrounds', 'UIKit']
    }
  ];

  return (
    <section id="experience" className="experience-section-container">
      {/* Decorative vertical grid line running down the side of the section */}
      <div className="section-grid-line-left"></div>

      <h3 className="section-title">Experience</h3>
      <p className="section-desc">
        A timeline of my professional journey, showcasing engineering roles and contributions.
      </p>

      <div className="timeline">
        {experiences.map((exp) => (
          <div key={exp.id} className="experience-card">
            <div className="exp-header">
              <div className="exp-icon-box">
                <Briefcase size={20} />
              </div>
              <div className="exp-details">
                <div className="exp-role-row">
                  <div>
                    <span className="exp-role">{exp.role}</span>
                    <span style={{ margin: '0 0.5rem', color: 'var(--text-muted)' }}>•</span>
                    <span className="exp-company">{exp.company}</span>
                  </div>
                  <span className="exp-date">{exp.period}</span>
                </div>
              </div>
            </div>
            
            <p className="exp-desc">{exp.desc}</p>
            
            <div className="badge-container">
              {exp.skills.map((skill) => (
                <span key={skill} className="badge">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
