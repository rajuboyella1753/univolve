const express = require('express');
const axios = require('axios');
const router = express.Router();

// Proxy Arbeitnow
router.get('/arbeitnow', async (req, res) => {
  const resp = await axios.get('https://www.arbeitnow.com/api/job-board-api');
  return res.json(resp.data.data);
});

// Proxy Remotive (avoid CORS in frontend)
router.get('/remotive', async (req, res) => {
  const resp = await axios.get('https://remotive.io/api/remote-jobs');
  return res.json(resp.data.jobs);
});

// Your proxy of the Reddit “Internships API” if you subscribe
router.get('/internships', async (req, res) => {
  const resp = await axios.get('https://api.example.com'); // replace
  return res.json(resp.data);
});

router.get('/', async (req, res) => {
  const all = [];
  try {
    const [a, r] = await Promise.all([
      axios.get('https://www.arbeitnow.com/api/job-board-api'),
      axios.get('https://remotive.io/api/remote-jobs'),
    ]);
    all.push(...(a.data.data || []), ...(r.data.jobs || []));
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: 'Failed to aggregate sources' });
  }
});

module.exports = router;
