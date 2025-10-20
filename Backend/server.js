const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// ========== MIDDLEWARE ==========
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:3001',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));
}

mongoose
  .connect(process.env.MONGO_URI, {
    // <-- use MONGO_URI, not MONGODB_URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB Atlas Connected!'))
  .catch((err) => console.error('❌ MongoDB Atlas Error:', err));

// ========== LEETCODE CONFIGURATION (UNCHANGED) ==========
const TARGET_USERNAME = 'Levender';
const LEETCODE_API_URL = 'https://leetcode.com/graphql';

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

const GET_CALENDAR_DATA_QUERY = `
  query getRecentAcSubmissions($username: String!) {
    matchedUser(username: $username) {
      submissionCalendar
    }
  }
`;

const transformData = (basicData, contestData = null, calendarData = null) => {
  const user = basicData.data.matchedUser;
  if (!user) return null;

  const allQuestionsCount = basicData.data.allQuestionsCount;
  const totalProblems =
    allQuestionsCount.find((q) => q.difficulty === 'All')?.count || 0;

  const submissionStats = user.submitStats.acSubmissionNum;
  const totalSolved =
    submissionStats.find((s) => s.difficulty === 'All')?.count || 0;

  const getSubmissions = (difficulty) =>
    submissionStats.find((s) => s.difficulty === difficulty);

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
  if (contestData && contestData.data.userContestRanking) {
    const ranking = contestData.data.userContestRanking;
    contest = {
      rating: Math.round(ranking.rating) || 0,
      globalRank: ranking.globalRanking
        ? ranking.globalRanking.toLocaleString()
        : 'N/A',
      attended: ranking.attendedContestsCount || 0,
      topPercent: Math.round(ranking.topPercentage) || 0,
    };
  }

  let contributionCalendar = {};
  if (calendarData && calendarData.data.matchedUser?.submissionCalendar) {
    try {
      const calendarString = calendarData.data.matchedUser.submissionCalendar;
      contributionCalendar = JSON.parse(calendarString);
    } catch (e) {
      console.warn('Failed to parse submissionCalendar JSON string:', e);
      contributionCalendar = {};
    }
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
      languages: topLanguages,
    },
    contributionCalendar: contributionCalendar,
  };
};

// ========== ROUTES ==========

// 🟢 LEETCODE ROUTE (UNCHANGED)
app.get('/api/leetcode-stats', async (req, res) => {
  try {
    const basicResponse = await axios.post(
      LEETCODE_API_URL,
      { query: GET_BASIC_DATA_QUERY, variables: { username: TARGET_USERNAME } },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (basicResponse.data.errors) {
      return res.status(500).json({
        error: 'Basic data fetch failed',
        details: basicResponse.data.errors,
      });
    }

    let contestResponse = null;
    try {
      contestResponse = await axios.post(
        LEETCODE_API_URL,
        {
          query: GET_CONTEST_DATA_QUERY,
          variables: { username: TARGET_USERNAME },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (contestResponse.data.errors) contestResponse = null;
    } catch (contestErr) {
      console.warn('Contest fetch failed:', contestErr.message);
      contestResponse = null;
    }

    let calendarResponse = null;
    try {
      calendarResponse = await axios.post(
        LEETCODE_API_URL,
        {
          query: GET_CALENDAR_DATA_QUERY,
          variables: { username: TARGET_USERNAME },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (calendarResponse.data.errors) calendarResponse = null;
    } catch (calendarErr) {
      console.warn('Calendar fetch failed:', calendarErr.message);
      calendarResponse = null;
    }

    const transformedData = transformData(
      basicResponse.data,
      contestResponse?.data,
      calendarResponse?.data
    );
    if (!transformedData) {
      return res
        .status(404)
        .json({ error: `User not found: ${TARGET_USERNAME}` });
    }

    res.json(transformedData);
  } catch (err) {
    console.error('Overall fetch failed:', err.message);
    res.status(500).json({
      error: 'Failed to fetch LeetCode data',
      details: err.response?.data || err.message,
    });
  }
});

// 🔴 CONTACT FORM ROUTE (Atlas Ready!)
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, website, message } = req.body;
    const Contact = require('./models/Contact');

    const contact = new Contact({
      name: name || '',
      email: email || '',
      website: website || '',
      message: message || '',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    await contact.save();

    res.status(201).json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
      data: { id: contact._id, name: contact.name, email: contact.email },
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Submission failed',
    });
  }
});

// 🔴 ADMIN ROUTE (Atlas Ready!)
app.get('/api/contact/admin', async (req, res) => {
  try {
    const Contact = require('./models/Contact');
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ========== PRODUCTION ROUTING ==========
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// ========== ERROR HANDLING ==========
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});

// ========== START SERVER ==========
app.listen(port, () => {
  console.log('\n🚀 FULL SERVER RUNNING (LeetCode + MongoDB Atlas!)');
  console.log(`→ LeetCode: http://localhost:${port}/api/leetcode-stats`);
  console.log(`→ Contact: http://localhost:${port}/api/contact`);
  console.log(`→ Admin:   http://localhost:${port}/api/contact/admin`);
  console.log(`Target user: ${TARGET_USERNAME}\n`);
});
