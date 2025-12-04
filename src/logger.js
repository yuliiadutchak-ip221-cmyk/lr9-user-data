const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '..', 'data');
const LOG_FILE = path.join(LOG_DIR, 'logs.jsonl');

function ensureLogFile() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
  if (!fs.existsSync(LOG_FILE)) {
    fs.writeFileSync(LOG_FILE, '', 'utf8');
  }
}

function normalizeTimestamp(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function logEvent(entry = {}) {
  ensureLogFile();
  const record = {
    ...entry,
    timestamp: normalizeTimestamp(entry.timestamp),
  };

  try {
    fs.appendFileSync(LOG_FILE, `${JSON.stringify(record)}\n`, 'utf8');
  } catch (err) {
    // Avoid throwing to keep the main flow working even if logging fails.
    console.error('Не вдалося записати лог події', err);
  }
}

function readLogs() {
  ensureLogFile();
  const content = fs.readFileSync(LOG_FILE, 'utf8');
  return content
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch (err) {
        return null;
      }
    })
    .filter(Boolean);
}

module.exports = {
  logEvent,
  readLogs,
  LOG_FILE,
};
