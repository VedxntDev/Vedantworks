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

  // 53 weeks ending today, aligned to Sunday
  const weeks = React.useMemo(() => {
    const list: string[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // align to Sunday
    const cur = new Date(startDate);
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

  // Month labels — one per unique month start
  const monthLabels = React.useMemo(() => {
    const labels: { label: string; col: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wIdx) => {
      const d = new Date(week[0]);
      const m = d.getMonth();
      if (m !== lastMonth) {
        labels.push({ label: d.toLocaleString('default', { month: 'short' }), col: wIdx });
        lastMonth = m;
      }
    });
    return labels;
  }, [weeks]);

  const getColor = (level: number) => {
    if (colorScheme === 'yellow') {
      const colors = ['#1e1e1e', '#6b5900', '#a07d00', '#d4a600', '#fcc200'];
      return colors[Math.min(level, 4)];
    }
    const colors = ['#161b22', '#0e4429', '#196127', '#239a3b', '#2dba4e'];
    return colors[Math.min(level, 4)];
  };

  const CELL = 11; // px
  const GAP = 2;   // px between cells / columns
  const DAY_LABEL_WIDTH = 26;
  const totalWidth = DAY_LABEL_WIDTH + 53 * (CELL + GAP);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '110px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Loading heatmap…
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'visible', WebkitOverflowScrolling: 'touch' as const }}>
      <div style={{ width: `${totalWidth}px`, paddingBottom: '2px' }}>

        {/* ── Month labels ── */}
        <div style={{ position: 'relative', height: '16px', marginLeft: `${DAY_LABEL_WIDTH}px`, marginBottom: '4px' }}>
          {monthLabels.map(({ label, col }) => (
            <span
              key={`${label}-${col}`}
              style={{
                position: 'absolute',
                left: `${col * (CELL + GAP)}px`,
                fontSize: '10px',
                color: 'var(--text-muted)',
                userSelect: 'none' as const,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* ── Grid row: day labels + weeks ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start' }}>
          {/* Day-of-week labels (Mon / Wed / Fri only) */}
          <div style={{
            width: `${DAY_LABEL_WIDTH}px`,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: `${GAP}px`,
          }}>
            {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
              <div key={i} style={{ height: `${CELL}px`, fontSize: '9px', color: 'var(--text-muted)', lineHeight: `${CELL}px` }}>
                {label}
              </div>
            ))}
          </div>

          {/* Week columns */}
          <div style={{ display: 'flex', gap: `${GAP}px`, flex: 1 }}>
            {weeks.map((week, wIdx) => (
              <div key={wIdx} style={{ display: 'flex', flexDirection: 'column', gap: `${GAP}px` }}>
                {week.map((dateStr) => {
                  const d = dataMap[dateStr];
                  const level = d ? d.level : 0;
                  const count = d ? d.count : 0;
                  return (
                    <div
                      key={dateStr}
                      style={{
                        width: `${CELL}px`,
                        height: `${CELL}px`,
                        borderRadius: '2px',
                        backgroundColor: getColor(level),
                        flexShrink: 0,
                        cursor: count > 0 ? 'pointer' : 'default',
                        transition: 'transform 0.1s ease',
                      }}
                      title={`${dateStr}: ${count} submission${count !== 1 ? 's' : ''}`}
                      onMouseEnter={e => { (e.target as HTMLElement).style.transform = 'scale(1.5)'; }}
                      onMouseLeave={e => { (e.target as HTMLElement).style.transform = 'scale(1)'; }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '8px', gap: '4px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Less</span>
          {[0, 1, 2, 3, 4].map(l => (
            <div key={l} style={{ width: `${CELL}px`, height: `${CELL}px`, borderRadius: '2px', backgroundColor: getColor(l) }} />
          ))}
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>More</span>
        </div>
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
