import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_ENDPOINT = 'http://localhost:3001/api/leetcode-stats';

// ... (mockDashboardData, MOCK_TOTALS, getDifficultyColor, and all Card Components remain the same) ...

const mockDashboardData = {
  profile: {
    username: 'Akhil Kushwaha',
    tag: 'Levender',
    rank: '435,493', // Overall Ranking
    imageUrl: 'https://placehold.co/100x100/363636/ffffff?text=A',
  },
  contest: {
    rating: 1478,
    globalRank: '39,506', // Global Ranking
    attended: 241,
    topPercent: 51.39,
  },
  solved: {
    total: 3721, // Total problems on LeetCode
    current: 282, // Total problems solved
    breakdown: {
      easy: { difficulty: 'Easy', count: 130, submissions: 150 },
      medium: { difficulty: 'Medium', count: 138, submissions: 190 },
      hard: { difficulty: 'Hard', count: 14, submissions: 25 },
    },
    attempting: 'N/A', // Data not available in API
  },
  badges: {
    count: 1,
    recent: '100 Days Badge 2025',
    imageUrl: 'https://static.leetcode.cn/cn-data/badge/100-days-2025.png',
  },
  stats: {
    views: 'N/A',
    solution: 'N/A',
    discuss: 'N/A',
    reputation: 0,
    languages: [
      { name: 'C++', solved: 270 },
      { name: 'Python', solved: 12 },
    ],
  },
};

// --- HELPER DATA ---
// Mock Total problems for accurate percentage calculation in Solved Breakdown Card
const MOCK_TOTALS = {
  easy: 908,
  medium: 1936,
  hard: 877,
};

// Function to get the color for a difficulty level
const getDifficultyColor = (key) => {
  switch (key) {
    case 'easy':
      return '#4CAF50'; // Green
    case 'medium':
      return '#ffb800'; // Yellow/Amber
    case 'hard':
      return '#FF4500'; // Red/Orange
    default:
      return '#363636';
  }
};

// --- COMPONENTS ---

const ProfileCard = ({ profile }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-[#282828] p-4 rounded-xl shadow-lg h-full min-h-[300px]"
  >
    <div className="flex items-center mb-4">
      <img
        src={profile.imageUrl}
        alt={profile.username}
        className="w-14 h-14 rounded-full mr-3 border-2 border-green-500"
      />
      <div>
        <div className="text-white text-lg font-semibold">Akhil Kushwaha</div>
        <div className="text-gray-400 text-sm">{profile.tag}</div>
      </div>
    </div>
    <div className="text-white text-base mb-4">
      Global Rank{' '}
      <span className="text-2xl font-bold block">
        {profile.rank} <span className="text-sm font-thin">/~5,000,000</span>
      </span>
      <span className="text-2xl font-bold text-green-500">
        <span className="text-lg font-thin text-white"> Top: &nbsp;</span>
        {profile.rank && profile.rank !== 'N/A'
          ? `${(
              100 -
              (1 - parseInt(profile.rank.replace(/,/g, '')) / 5000000) * 100
            ).toFixed(2)}%`
          : 'N/A'}
      </span>
    </div>
    <a
      href="https://leetcode.com/u/Levender/"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-[#4CAF50] hover:bg-[#43a047] text-white font-medium py-2 rounded-lg text-center transition duration-200"
    >
      View Profile
    </a>
  </motion.div>
);

const CommunityStatsCard = ({ stats }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.3 }}
    className="bg-[#282828] p-4 rounded-xl shadow-lg mt-4"
  >
    <h3 className="text-white text-lg font-semibold mb-4">Community Stats</h3>

    <div className="space-y-3 text-sm">
      {Object.entries({
        Views: stats.views || '+10',
        Solution: stats.solution || 15,
        Discuss: stats.discuss,
        Reputation: stats.reputation || '⭐⭐⭐⭐',
      }).map(([key, value]) => (
        <div
          key={key}
          className="flex justify-between items-center text-gray-300"
        >
          <div className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${
                key === 'Views'
                  ? 'bg-blue-500'
                  : key === 'Solution'
                  ? 'bg-green-500'
                  : 'bg-gray-500'
              }`}
            ></span>
            {key}
          </div>
          <span className="font-medium text-white">{value}</span>
        </div>
      ))}
    </div>

    <div className="mt-6">
      <h4 className="text-white text-sm font-semibold mb-2">Top Languages</h4>
      <div className="flex flex-wrap gap-2">
        {stats.languages.length > 0 ? (
          stats.languages.map((lang) => (
            <div
              key={lang.name}
              className="bg-[#363636] text-gray-300 px-3 py-1 text-xs rounded-full"
            >
              {lang.name}{' '}
              <span className="text-green-400">({lang.solved})</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No language data found.</p>
        )}
      </div>
    </div>
  </motion.div>
);

const ContestRatingCard = ({ contest }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-3 md:col-span-3 lg:col-span-3"
  >
    <div className="grid grid-cols-3 gap-4 border-b border-gray-700 pb-3 mb-3 text-sm text-gray-400">
      <div className="text-center">Contest Rating</div>
      <div className="text-center">Contest Global Rank</div>
      <div className="text-center">Attended</div>
    </div>

    <div className="grid grid-cols-3 gap-4 text-white font-bold text-xl mb-4">
      <div className="text-center text-3xl text-orange-400">
        {contest.rating}
      </div>
      <div className="text-center text-lg">
        {contest.globalRank}
        <div className="text-xs font-normal text-gray-400 pt-1">
          {/* Mock Total Rank: Global Rank is dynamic, Total is hard to get */}
          /~1,000,000
        </div>
        <br />
      </div>
      <div className="text-center text-lg">{contest.attended}</div>
    </div>

    {/* Simplified Rating Graph/Timeline */}
    <div className="w-full h-1 bg-gray-700 rounded-full my-4 relative">
      <div
        className="absolute top-0 h-full bg-orange-400 rounded-full"
        style={{ width: `${(contest.rating / 3000) * 100}%` }}
      ></div>
      <br />

      <div className="absolute -top-3 left-[50%] transform -translate-x-1/2 text-xs text-gray-400 py-6 ">
        {contest.rating}
      </div>
    </div>

    <div className="text-center text-sm text-gray-400 pt-4">Contest Stats</div>
  </motion.div>
);

const TopPerformanceCard = ({ topPercent }) => (
  <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.4 }}
    className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-2 md:col-span-3 lg:col-span-1"
  >
    <div className="text-gray-400 text-sm mb-2">Contest Top</div>
    <div className="text-white text-3xl font-bold mb-4">{topPercent}%</div>

    <div className="flex items-end h-20 space-x-1">
      {[10, 20, 30, 40, 70, 80, 50, 60, 90, 100].map((h, i) => (
        <div
          key={i}
          className={`w-1/12 rounded-t-sm ${
            // Highlight the bar representing the top percentage visually
            h > 100 - topPercent ? 'bg-orange-500' : 'bg-gray-700'
          }`}
          style={{ height: `${h}%` }}
        ></div>
      ))}
    </div>
    <p className="text-xs text-gray-400 pt-2">
      Better than {topPercent}% of users.
    </p>
  </motion.div>
);

const SolvedBreakdownCard = ({ solved }) => {
  const totalRatio = solved.current / solved.total;

  // A safer approach is to mock the total available problems for each difficulty:
  const MOCK_TOTALS = {
    easy: 908,
    medium: 1936,
    hard: 877,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-2"
    >
      <div className="grid grid-cols-2 gap-4">
        {/* Progress Ring */}
        <div className="flex flex-col items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-24 h-24">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#363636"
              strokeWidth="5"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#50C878"
              strokeWidth="5"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={2 * Math.PI * 45 * (1 - totalRatio)}
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="45"
              textAnchor="middle"
              className="text-xl font-bold fill-white"
            >
              {solved.current}
            </text>
            <text
              x="50"
              y="65"
              textAnchor="middle"
              className="text-xs fill-gray-400"
            >
              /{solved.total}
            </text>
          </svg>
          <div className="text-gray-400 text-sm mt-2">Solved Problems</div>
          <div className="text-gray-400 text-xs mt-1">15 Attempting</div>
        </div>

        {/* Breakdown List (Updated to use MOCK_TOTALS for bar width) */}
        <div className="flex flex-col justify-around py-2">
          {Object.entries(solved.breakdown).map(([key, item]) => {
            const totalForDifficulty = MOCK_TOTALS[key] || 1; // Fallback
            const solvedCount = item.count;
            const percentage = (solvedCount / totalForDifficulty) * 100;

            return (
              <div key={key} className="flex items-center mb-2">
                <div
                  className="w-12 text-sm font-semibold mr-2"
                  style={{ color: getDifficultyColor(key) }}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
                <div className="flex-grow bg-[#363636] h-2 rounded-full mr-2">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getDifficultyColor(key),
                    }}
                  ></div>
                </div>
                <span className="text-white text-sm">
                  {solvedCount}/{totalForDifficulty}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

const BadgesCard = ({ badges }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.6 }}
    className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-2"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-white text-lg font-semibold">Active Badge</h3>
      <div className="text-white text-2xl font-bold">{badges.count}</div>
      <span className="text-gray-400 cursor-pointer hover:text-white transition">
        →
      </span>
    </div>

    <div className="flex items-center justify-between">
      {/* Dynamic Badge Image/Fallback */}
      <div className="flex gap-4">
        {badges.imageUrl ? (
          <img
            src={badges.imageUrl}
            alt={badges.recent}
            className="w-16 h-16 object-contain"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center text-xs text-white">
            No Badge
          </div>
        )}
      </div>

      <div className="text-right">
        <div className="text-gray-400 text-sm">Current Active Badge:</div>
        <div className="text-white font-medium">{badges.recent}</div>
      </div>
    </div>
  </motion.div>
);

// Contribution Graph Card - Needs actual LeetCode Contribution API data, which is complex.
const ContributionGraphCard = () => {
  const totalSubmissions = 1050; // Mocked
  const totalActiveDays = 249; // Mocked
  const maxStreak = 92; // Mocked
  const contributionGrid = Array(30 * 12)
    .fill(0)
    .map(() => Math.floor(Math.random() * 5));

  const getColor = (level) => {
    const colors = ['#393939', '#007A3E', '#00A859', '#00C96F', '#00E676'];
    return colors[level];
  };

  const MonthNames = [
    'Oct',
    'Nov',
    'Dec',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-4"
    >
      <div className="text-white text-lg font-semibold mb-4">
        {totalSubmissions} submissions in the past one year
      </div>

      <div className="flex justify-between items-center text-gray-400 text-sm mb-4">
        <span>
          Total active days: {totalActiveDays} | Max streak: {maxStreak}
        </span>
        <span className="text-green-400 cursor-pointer">Current ↓</span>
      </div>

      {/* Grid Layout for Contributions */}
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        {/* Month Labels (Simplified) */}
        <div className="col-start-2 grid grid-cols-12 text-xs text-gray-400 mb-2">
          {MonthNames.map((m, i) => (
            <span key={i} className="text-left">
              {m}
            </span>
          ))}
        </div>

        {/* Contribution Blocks (Simplified to represent 12 months) */}
        <div className="col-start-2 grid grid-cols-52 gap-0.5 w-full">
          {contributionGrid.slice(0, 364).map((level, index) => (
            <div
              key={index}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: getColor(level) }}
              title={`Day ${index + 1}: Level ${level}`}
            ></div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// --- MAIN DASHBOARD COMPONENT ---

const LeetCodeDashboard = () => {
  const [data, setData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(true); // Start loading true
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRealData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(API_ENDPOINT);
        const realData = await response.json();

        if (response.status !== 200) {
          // Handle API errors like username not found (404) or server error (500)
          setError(
            realData.error || 'Failed to fetch data with an unknown error.'
          );
          setData(mockDashboardData); // Fallback to mock data on API error
        } else {
          setData(realData);
        }
      } catch (e) {
        console.error('Network or CORS error fetching LeetCode data:', e);
        setError(
          'Could not connect to the API server (Check your server.js status).'
        );
        setData(mockDashboardData); // Fallback to mock data on network error
      } finally {
        setLoading(false);
      }
    };

    fetchRealData();
  }, []); // Run only once on component mount

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center">
        <p className="text-white text-xl">Loading LeetCode Dashboard...</p>
      </div>
    );
  }

  return (
    <section
      id="leetcode"
      className="bg-[#1e1e1e] p-6 sm:p-8 min-h-screen pb-20 "
    >
      <div className="max-w-7xl mx-auto">
        {/* Updated Header with Animation */}
        <div className="text-center text-white pb-15">
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-4xl lg:text-5xl font-bold inline-block"
          >
            My{' '}
          </motion.span>

          <motion.span
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-4xl lg:text-6xl font-bold leading-tight inline-block"
            style={{
              WebkitTextStroke: '2px orange',
              color: 'transparent',
              textStroke: '2px white',
            }}
          >
            Leetcode
          </motion.span>
        </div>

        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-6 border border-red-700">
            ⚠️ Error: {error} - Showing Last Update Data. Please check your
            **server.js** and its terminal.
          </div>
        )}

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column (Profile, Community Stats) */}
          <div className="col-span-1 flex flex-col space-y-6">
            <ProfileCard profile={data.profile} />
            <CommunityStatsCard stats={data.stats} />
          </div>

          {/* Right Column (Contest, Solved Breakdown, Badges, Graph) */}
          <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Top Row: Contest Rating and Top Performance */}
            <ContestRatingCard contest={data.contest} />
            <TopPerformanceCard topPercent={data.contest.topPercent} />

            {/* Middle Row: Solved Breakdown and Badges */}
            <SolvedBreakdownCard solved={data.solved} />
            <BadgesCard badges={data.badges} />

            {/* Bottom Row: Contribution Graph (spans all columns) */}
            <div className="col-span-full">
              <ContributionGraphCard />
            </div>
          </div>
        </div>

        {/* --- NEWLY ADDED BUTTON AT THE BOTTOM --- */}
        <div className="flex justify-center mt-10">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
            href="https://leetcode.com/u/Levender/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-gray-800 transition-colors shadow-lg hover:scale-105"
          >
            View More on LeetCode
          </motion.a>
        </div>
        {/* ------------------------------------- */}
      </div>
    </section>
  );
};

export default LeetCodeDashboard;
