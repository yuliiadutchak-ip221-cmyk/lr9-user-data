const path = require('path');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { createSessionMiddleware } = require('./sessionStore');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 6500;

app.use(cors());
app.use(bodyParser.json());
app.use(createSessionMiddleware());

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'form.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
