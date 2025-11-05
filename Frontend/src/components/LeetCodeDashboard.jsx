import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Smart URL selection for LeetCode API
const getLeetCodeURL = () => {
  // For production, use our serverless function
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vercel.app')
  ) {
    return '/api/leetcode';
  }
  // For local development, use Vite proxy
  return '/graphql';
};

const LEETCODE_API_URL = getLeetCodeURL();
const TARGET_USERNAME = 'Levender';

// GraphQL Queries
const GET_BASIC_DATA_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      profile {
        ranking
        userAvatar
      }
      activeBadge {
        name
        icon
      }
      languageProblemCount {
        languageName
        problemsSolved
      }
    }
    allQuestionsCount {
      difficulty
      count
    }
  }
`;

const GET_CONTEST_DATA_QUERY = `
  query getContestRanking($username: String!) {
    userContestRanking(username: $username) {
      rating
      globalRanking
      attendedContestsCount
      topPercentage
    }
  }
`;

// Mock data updated to match real API response
const mockDashboardData = {
  profile: {
    username: 'Levender',
    tag: 'Levender',
    rank: '433,809',
    imageUrl:
      'https://assets.leetcode.com/users/Levender/avatar_1760581562.png',
  },
  contest: {
    rating: 1478,
    globalRank: '395,006',
    attended: 1,
    topPercent: 51.39,
  },
  solved: {
    total: 3721,
    current: 284,
    breakdown: {
      easy: { difficulty: 'Easy', count: 131, submissions: 279 },
      medium: { difficulty: 'Medium', count: 139, submissions: 310 },
      hard: { difficulty: 'Hard', count: 14, submissions: 22 },
    },
    attempting: 'N/A',
  },
  badges: {
    count: 1,
    recent: 'Annual Badge',
    imageUrl: 'https://assets.leetcode.com/static_assets/others/lg25100.png',
  },
  stats: {
    views: '+10',
    solution: '+9',
    reputation: '⭐⭐⭐⭐',
    languages: [
      { name: 'C++', solved: 272 },
      { name: 'MySQL', solved: 11 },
      { name: 'JavaScript', solved: 6 },
    ],
  },
};

const MOCK_TOTALS = {
  easy: 908,
  medium: 1936,
  hard: 877,
};

const getDifficultyColor = (key) => {
  switch (key) {
    case 'easy':
      return '#4CAF50';
    case 'medium':
      return '#FFB800';
    case 'hard':
      return '#FF4500';
    default:
      return '#363636';
  }
};

// Data transformation function
const transformLeetCodeData = (basicData, contestData = null) => {
  if (!basicData?.data?.matchedUser) {
    console.error('No user data found in basicData:', basicData);
    return null;
  }

  const user = basicData.data.matchedUser;
  const allQuestionsCount = basicData.data.allQuestionsCount;
  const totalProblems =
    allQuestionsCount.find((q) => q.difficulty === 'All')?.count || 0;

  const submissionStats = user.submitStats.acSubmissionNum;
  const totalSolved =
    submissionStats.find((s) => s.difficulty === 'All')?.count || 0;

  const getSubmissions = (difficulty) =>
    submissionStats.find((s) => s.difficulty === difficulty) || {
      difficulty,
      count: 0,
      submissions: 0,
    };

  const languageStats = user.languageProblemCount || [];
  const topLanguages = languageStats
    .sort((a, b) => b.problemsSolved - a.problemsSolved)
    .slice(0, 3)
    .map((lang) => ({
      name: lang.languageName,
      solved: lang.problemsSolved,
    }));

  const currentBadge = user.activeBadge;

  let contest = {
    rating: 0,
    globalRank: 'N/A',
    attended: 0,
    topPercent: 0,
  };

  if (contestData?.data?.userContestRanking) {
    const ranking = contestData.data.userContestRanking;
    contest = {
      rating: Math.round(ranking.rating) || 0,
      globalRank: ranking.globalRanking
        ? ranking.globalRanking.toLocaleString()
        : 'N/A',
      attended: ranking.attendedContestsCount || 0,
      topPercent: ranking.topPercentage ? Math.round(ranking.topPercentage) : 0,
    };
  }

  return {
    profile: {
      username: user.username,
      tag: user.username,
      rank: user.profile.ranking
        ? user.profile.ranking.toLocaleString()
        : 'N/A',
      imageUrl:
        user.profile.userAvatar ||
        'https://placehold.co/100x100/363636/ffffff?text=A',
    },
    contest,
    solved: {
      total: totalProblems,
      current: totalSolved,
      breakdown: {
        easy: getSubmissions('Easy'),
        medium: getSubmissions('Medium'),
        hard: getSubmissions('Hard'),
      },
      attempting: 'N/A',
    },
    badges: {
      count: currentBadge ? 1 : 0,
      recent: currentBadge?.name || 'No Active Badge',
      imageUrl: currentBadge?.icon || null,
    },
    stats: {
      views: 'N/A',
      solution: 'N/A',
      discuss: 'N/A',
      reputation: 0,
      languages: topLanguages,
    },
  };
};

// API fetch function with serverless function
const fetchLeetCodeData = async (retries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}: Fetching from ${LEETCODE_API_URL}`);

      // Fetch basic data
      const basicResponse = await fetch(LEETCODE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_BASIC_DATA_QUERY,
          variables: { username: TARGET_USERNAME },
        }),
      });

      console.log('📊 Response status:', basicResponse.status);
      console.log('✅ Response ok:', basicResponse.ok);

      if (!basicResponse.ok) {
        const errorText = await basicResponse.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`HTTP error! status: ${basicResponse.status}`);
      }

      const basicData = await basicResponse.json();
      console.log('📦 Basic data received:', basicData);

      if (basicData.errors || !basicData.data?.matchedUser) {
        throw new Error(
          `API error: ${
            basicData.errors?.map((e) => e.message).join(', ') ||
            'User not found'
          }`
        );
      }

      // Fetch contest data
      let contestData = null;
      try {
        const contestResponse = await fetch(LEETCODE_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: GET_CONTEST_DATA_QUERY,
            variables: { username: TARGET_USERNAME },
          }),
        });

        if (contestResponse.ok) {
          contestData = await contestResponse.json();
          console.log('🏆 Contest data received:', contestData);
          if (contestData.errors) {
            console.warn('Contest data errors:', contestData.errors);
          }
        }
      } catch (contestError) {
        console.warn(
          `Attempt ${attempt} - Failed to fetch contest data:`,
          contestError
        );
      }

      const transformedData = transformLeetCodeData(basicData, contestData);
      console.log('🎉 Transformed data:', transformedData);
      return transformedData;
    } catch (error) {
      console.error(
        `❌ Attempt ${attempt} - Error fetching LeetCode data:`,
        error.message
      );
      if (attempt < retries) {
        console.log(`⏳ Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
};

// COMPONENTS
const ProfileCard = ({ profile }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="bg-[#282828] p-4 rounded-xl shadow-lg h-full min-h-[300px] font-quicksand"
  >
    <div className="flex items-center mb-4">
      <img
        src={profile.imageUrl}
        alt={profile.username}
        className="w-14 h-14 rounded-full mr-3 border-2 border-green-500"
      />
      <div>
        <div className="text-white text-lg font-semibold">
          {profile.username}
        </div>
        <div className="text-gray-400 text-sm">{profile.tag}</div>
      </div>
    </div>
    <div className="text-white text-base mb-4">
      Global Rank{' '}
      <span className="text-2xl font-bold block">
        {profile.rank} <span className="text-sm font-normal">/~5,000,000</span>
      </span>
      <span className="text-2xl font-bold text-green-500">
        <span className="text-lg font-normal text-white"> Top: </span>
        {profile.rank && profile.rank !== 'N/A'
          ? `${(
              100 -
              (parseInt(profile.rank.replace(/,/g, '')) / 5000000) * 100
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
    className="bg-[#282828] p-4 rounded-xl shadow-lg mt-4 font-quicksand"
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
    className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-1 md:col-span-2 lg:col-span-3 font-quicksand"
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
          /~1,000,000
        </div>
      </div>
      <div className="text-center text-lg">{contest.attended}</div>
    </div>
    <div className="w-full h-1 bg-gray-700 rounded-full my-4 relative">
      <div
        className="absolute top-0 h-full bg-orange-400 rounded-full"
        style={{ width: `${Math.min((contest.rating / 3000) * 100, 100)}%` }}
      ></div>
      <div className="absolute -top-3 left-[50%] transform -translate-x-1/2 text-xs text-gray-400 py-6">
        {contest.rating}
      </div>
    </div>
    <div className="text-center text-sm text-gray-400 pt-4">Contest Stats</div>
  </motion.div>
);

const TopPerformanceCard = ({ topPercent }) => {
  const totalBars = 10;
  // Smaller topPercent means better rank → more orange bars
  const filledBars = Math.max(
    1,
    totalBars - Math.floor((topPercent / 100) * totalBars)
  );

  const barHeights = Array.from({ length: totalBars }, (_, i) => (i + 1) * 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-1 md:col-span-2 lg:col-span-1 font-quicksand"
    >
      <div className="text-gray-400 text-sm mb-2">Contest Top</div>

      <div className="text-white text-3xl font-bold mb-4">{topPercent}%</div>

      <div className="flex items-end h-20 space-x-1">
        {barHeights.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${
              i < filledBars ? 'bg-orange-500' : 'bg-gray-700'
            }`}
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>

      <p className="text-xs text-gray-400 pt-2">
        Better than {100 - topPercent}% of users.
      </p>
    </motion.div>
  );
};

const SolvedBreakdownCard = ({ solved }) => {
  const totalRatio = solved.current / solved.total;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-1 md:col-span-2 font-quicksand"
    >
      <div className="grid grid-cols-2 gap-4">
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
              style={{ fill: 'white', fontSize: '20px', fontWeight: 'bold' }}
            >
              {solved.current}
            </text>
            <text
              x="50"
              y="65"
              textAnchor="middle"
              style={{ fill: '#9CA3AF', fontSize: '12px' }}
            >
              /{solved.total}
            </text>
          </svg>
          <div className="text-gray-400 text-sm mt-2">Solved Problems</div>
          <div className="text-gray-400 text-xs mt-1">1.1K submissions</div>
        </div>
        <div className="flex flex-col justify-around py-2">
          {Object.entries(solved.breakdown).map(([key, item]) => {
            const totalForDifficulty = MOCK_TOTALS[key] || 1;
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
    className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-1 md:col-span-2 font-quicksand"
  >
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-white text-lg font-semibold">Active Badge</h3>
      <div className="text-white text-2xl font-bold">{badges.count}</div>
      <span className="text-gray-400 cursor-pointer hover:text-white transition">
        →
      </span>
    </div>
    <div className="flex items-center justify-between">
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

const ContributionGraphCard = () => {
  const totalSubmissions = 611;
  const totalActiveDays = 249;
  const maxStreak = 92;
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
      className="bg-[#282828] p-5 rounded-xl shadow-lg col-span-4 font-quicksand"
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
      <div className="grid grid-cols-[auto_1fr] gap-x-2">
        <div className="col-start-2 grid grid-cols-12 text-xs text-gray-400 mb-2">
          {MonthNames.map((m, i) => (
            <span key={i} className="text-left">
              {m}
            </span>
          ))}
        </div>
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

// MAIN DASHBOARD COMPONENT
const LeetCodeDashboard = () => {
  const [data, setData] = useState(mockDashboardData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const realData = await fetchLeetCodeData();

        if (realData) {
          setData(realData);
          setUsingMockData(false);
        } else {
          throw new Error('No data received from LeetCode API');
        }
      } catch (error) {
        console.error('Failed to fetch real LeetCode data:', error.message);
        setError(`Failed to fetch LeetCode data: ${error.message}`);
        setData(mockDashboardData);
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1e1e1e] flex items-center justify-center font-quicksand">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading LeetCode Stats...</p>
        </div>
      </div>
    );
  }

  return (
    <section
      id="leetcode"
      className="bg-[#282828] p-4 sm:p-6 lg:p-8 min-h-screen pb-20 font-quicksand"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center text-white mb-8 lg:mb-12">
          <motion.span
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold inline-block"
          >
            My{' '}
          </motion.span>
          <motion.span
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight inline-block"
            style={{
              WebkitTextStroke: '2px orange',
              color: 'transparent',
            }}
          >
            Leetcode
          </motion.span>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-900 text-yellow-100 p-4 rounded-lg mb-6 border border-yellow-700 max-w-2xl mx-auto"
          >
            ⚠️ {error} {usingMockData && '(Using Mock Data)'}
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-1 flex flex-col space-y-4 sm:space-y-6">
            <ProfileCard profile={data.profile} />
            <CommunityStatsCard stats={data.stats} />
          </div>
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <ContestRatingCard contest={data.contest} />
            <TopPerformanceCard topPercent={data.contest.topPercent} />
            <SolvedBreakdownCard solved={data.solved} />
            <BadgesCard badges={data.badges} />
            <div className="col-span-1 md:col-span-2 lg:col-span-4">
              <ContributionGraphCard />
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8 lg:mt-12">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            href="https://leetcode.com/u/Levender/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 sm:px-8 py-3 text-base sm:text-lg font-semibold text-white border-2 border-white rounded-full hover:bg-gray-800 transition-all duration-300 shadow-lg hover:scale-105"
          >
            View More on LeetCode
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default LeetCodeDashboard;
