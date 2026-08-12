import React, { useState, useEffect } from 'react';

interface DayData {
  date: string;
  level: number;
  count: number;
}

interface ContributionCalendarProps {
  data: DayData[];
  loading: boolean;
  colorScheme?: 'green' | 'yellow';
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ data, loading, colorScheme = 'green' }) => {
  const dataMap = React.useMemo(() => {
    const m: { [key: string]: DayData } = {};
    data.forEach(d => { m[d.date] = d; });
    return m;
  }, [data]);

  // Generate 53 weeks, ending today, starting on Sunday
  const weeks = React.useMemo(() => {
    const list: string[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    // Align to Sunday
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);
    let cur = new Date(startDate);
    for (let w = 0; w < 53; w++) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(cur.toISOString().split('T')[0]);
        cur.setDate(cur.getDate() + 1);
      }
      list.push(week);
    }
    return list;
  }, []);

  // Month labels: figure out which week column each month starts
  const monthLabels = React.useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const d = new Date(week[0]);
      const m = d.getMonth();
      if (m !== lastMonth) {
        labels.push({
          label: d.toLocaleString('default', { month: 'short' }),
          col: wIdx,
        });
        lastMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  const getColor = (level: number) => {
    if (colorScheme === 'yellow') {
      const colors = ['#161b22', '#ffdd44', '#ffc107', '#ff9800', '#e65100'];
      return colors[Math.min(level, 4)];
    }
    const colors = ['#161b22', '#0e4429', '#196127', '#239a3b', '#2dba4e'];
    return colors[Math.min(level, 4)];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Loading heatmap…
      </div>
    );
  }

  return (
    <div className="tuf-calendar-wrapper" style={{ overflowX: 'auto' }}>
      {/* Month labels row */}
      <div style={{ display: 'flex', paddingLeft: '28px', marginBottom: '4px' }}>
        {monthLabels.map(({ label, col }) => (
          <div
            key={`${label}-${col}`}
            style={{
              position: 'absolute',
              left: `calc(28px + ${col} * 13px)`,
              fontSize: '10px',
              color: 'var(--text-muted)',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        ))}
      </div>
      <div style={{ position: 'relative', paddingTop: '18px' }}>
        <div className="calendar-grid">
          {/* Day labels */}
          <div className="calendar-days-labels" style={{ paddingTop: '2px' }}>
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          {/* Week columns */}
          <div className="calendar-weeks-container">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="calendar-week-column">
                {week.map((dateStr) => {
                  const d = dataMap[dateStr];
                  const level = d ? d.level : 0;
                  const count = d ? d.count : 0;
                  return (
                    <div
                      key={dateStr}
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '2px',
                        backgroundColor: getColor(level),
                        margin: '1.5px',
                        cursor: count > 0 ? 'pointer' : 'default',
                        transition: 'transform 0.1s',
                      }}
                      title={`${dateStr}: ${count} submission${count !== 1 ? 's' : ''}`}
                      onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.4)'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="calendar-footer" style={{ marginTop: '8px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Less</span>
        <div style={{ display: 'flex', gap: '3px', margin: '0 6px' }}>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: getColor(l) }} />
          ))}
        </div>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>More</span>
      </div>
    </div>
  );
};

// ── GitHub Contributions ──────────────────────────────────────────────────────
const useGitHubContributions = (username: string) => {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then(res => {
        if (!res.ok) throw new Error(`GitHub API ${res.status}`);
        return res.json();
      })
      .then(res => {
        if (res && Array.isArray(res.contributions)) {
          setData(res.contributions.map((c: { date: string; level: number; count: number }) => ({
            date: c.date,
            level: c.level,
            count: c.count,
          })));
        }
      })
      .catch(err => console.warn('GitHub heatmap fetch failed:', err))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading };
};

// ── LeetCode Contributions ────────────────────────────────────────────────────
const useLeetCodeContributions = (username: string) => {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use the faisalshohag Vercel API (CORS-friendly, returns submissionCalendar)
    fetch(`https://leetcode-api-faisalshohag.vercel.app/${username}`)
      .then(res => {
        if (!res.ok) throw new Error(`LeetCode API ${res.status}`);
        return res.json();
      })
      .then(res => {
        const cal = res.submissionCalendar;
        if (cal && typeof cal === 'object') {
          const entries: DayData[] = Object.entries(cal).map(([epoch, count]) => {
            const date = new Date(parseInt(epoch) * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const c = Number(count);
            // Normalise to 0-4 levels
            let level = 0;
            if (c >= 10) level = 4;
            else if (c >= 5) level = 3;
            else if (c >= 2) level = 2;
            else if (c >= 1) level = 1;
            return { date: dateStr, level, count: c };
          });
          setData(entries);
        }
      })
      .catch(err => console.warn('LeetCode heatmap fetch failed:', err))
      .finally(() => setLoading(false));
  }, [username]);

  return { data, loading };
};

// ── Stats Section ─────────────────────────────────────────────────────────────
export const Stats: React.FC = () => {
  const github = useGitHubContributions('VedxntDev');
  const leetcode = useLeetCodeContributions('vedxntdev');

  return (
    <section id="stats" className="stats-section-container">
      <div className="section-grid-line-left"></div>

      <h3 className="section-title">Coding Activity</h3>
      <p className="section-desc">
        Live contribution and submission heatmaps pulled directly from GitHub and LeetCode.
      </p>

      <div className="stats-list">
        {/* GitHub Card */}
        <div className="stats-card github-card">
          <div className="stats-card-header">
            <h4 className="stats-card-title">GitHub Contributions</h4>
            <a href="https://github.com/VedxntDev" target="_blank" rel="noopener noreferrer" className="stats-card-link">
              @VedxntDev
            </a>
          </div>
          <div className="stats-card-body github-body">
            <ContributionCalendar data={github.data} loading={github.loading} colorScheme="green" />
          </div>
        </div>

        {/* LeetCode Card */}
        <div className="stats-card leetcode-card">
          <div className="stats-card-header">
            <h4 className="stats-card-title">LeetCode Submissions</h4>
            <a href="https://leetcode.com/u/vedxntdev/" target="_blank" rel="noopener noreferrer" className="stats-card-link">
              @vedxntdev
            </a>
          </div>
          <div className="stats-card-body github-body">
            <ContributionCalendar data={leetcode.data} loading={leetcode.loading} colorScheme="yellow" />
          </div>
        </div>
      </div>
    </section>
  );
};
