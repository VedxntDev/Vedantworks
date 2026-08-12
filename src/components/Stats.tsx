import React, { useState, useEffect } from 'react';

interface DayData {
  date: string;
  level: number;
  count: number;
}

interface ContributionCalendarProps {
  data: DayData[];
  loading: boolean;
  colorScheme?: 'green' | 'yellow'; // green for GitHub/TUF, yellow for LeetCode
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ data, loading, colorScheme = 'green' }) => {
  // Build a map from date string to level
  const dataMap = React.useMemo(() => {
    const m: { [key: string]: DayData } = {};
    data.forEach(d => { m[d.date] = d; });
    return m;
  }, [data]);

  // Generate weeks for the last 53 weeks
  const weeks = React.useMemo(() => {
    const list: string[][] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364);
    const startDay = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDay);
    let currentDate = new Date(startDate);
    for (let w = 0; w < 53; w++) {
      const week: string[] = [];
      for (let d = 0; d < 7; d++) {
        week.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      list.push(week);
    }
    return list;
  }, []);

  const getColorClass = (level: number) => {
    const scheme = colorScheme === 'yellow' ? 'lc' : 'gh';
    if (level <= 0) return 'level-0';
    if (level === 1) return `level-1-${scheme}`;
    if (level === 2) return `level-2-${scheme}`;
    if (level === 3) return `level-3-${scheme}`;
    return `level-4-${scheme}`;
  };

  if (loading) {
    return (
      <div className="calendar-loading">
        <div className="calendar-skeleton"></div>
      </div>
    );
  }

  return (
    <div className="tuf-calendar-wrapper">
      <div className="calendar-grid">
        <div className="calendar-days-labels">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
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
                    className={`calendar-day-square ${getColorClass(level)}`}
                    title={`${dateStr}: ${count} submissions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-footer">
        <span>Less</span>
        <div className="calendar-legend-squares">
          <div className={`calendar-day-square level-0`}></div>
          <div className={`calendar-day-square level-1-${colorScheme === 'yellow' ? 'lc' : 'gh'}`}></div>
          <div className={`calendar-day-square level-2-${colorScheme === 'yellow' ? 'lc' : 'gh'}`}></div>
          <div className={`calendar-day-square level-3-${colorScheme === 'yellow' ? 'lc' : 'gh'}`}></div>
          <div className={`calendar-day-square level-4-${colorScheme === 'yellow' ? 'lc' : 'gh'}`}></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

// Hook to fetch GitHub contributions via public API
const useGitHubContributions = (username: string) => {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then(res => res.json())
      .then(res => {
        if (res && Array.isArray(res.contributions)) {
          setData(res.contributions.map((c: any) => ({
            date: c.date,
            level: c.level,
            count: c.count,
          })));
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [username]);

  return { data, loading };
};

// Hook to fetch LeetCode calendar via public API
const useLeetCodeContributions = (username: string) => {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use the unofficial leetcode stats API to fetch submission calendar
    fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      .then(res => res.json())
      .then(res => {
        if (res && res.submissionCalendar) {
          // submissionCalendar is a JSON string mapping epoch timestamps to counts
          const calendar = typeof res.submissionCalendar === 'string'
            ? JSON.parse(res.submissionCalendar)
            : res.submissionCalendar;

          const entries: DayData[] = Object.entries(calendar).map(([epoch, count]) => {
            const date = new Date(parseInt(epoch) * 1000);
            const dateStr = date.toISOString().split('T')[0];
            const c = Number(count);
            let level = 0;
            if (c >= 8) level = 4;
            else if (c >= 4) level = 3;
            else if (c >= 2) level = 2;
            else if (c >= 1) level = 1;
            return { date: dateStr, level, count: c };
          });
          setData(entries);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [username]);

  return { data, loading };
};

export const Stats: React.FC = () => {
  const github = useGitHubContributions('VedxntDev');
  const leetcode = useLeetCodeContributions('vedxntdev');

  return (
    <section id="stats" className="stats-section-container">
      <div className="section-grid-line-left"></div>

      <h3 className="section-title">Coding Activity</h3>
      <p className="section-desc">
        A real-time overview of my development activity and problem-solving stats across GitHub and LeetCode.
      </p>

      <div className="stats-list">
        {/* GitHub Contributions Card (Priority #1) */}
        <div className="stats-card github-card">
          <div className="stats-card-header">
            <h4 className="stats-card-title">GitHub Contributions</h4>
            <a
              href="https://github.com/VedxntDev"
              target="_blank"
              rel="noopener noreferrer"
              className="stats-card-link"
            >
              @VedxntDev
            </a>
          </div>
          <div className="stats-card-body github-body">
            <ContributionCalendar data={github.data} loading={github.loading} colorScheme="green" />
          </div>
        </div>

        {/* LeetCode Heatmap Card (Priority #2) */}
        <div className="stats-card leetcode-card">
          <div className="stats-card-header">
            <h4 className="stats-card-title">LeetCode Submissions</h4>
            <a
              href="https://leetcode.com/u/vedxntdev/"
              target="_blank"
              rel="noopener noreferrer"
              className="stats-card-link"
            >
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
