const { readLogs } = require('./logger');

function groupByAction(logs) {
  const counts = {};
  logs.forEach((log) => {
    const action = log.action || 'unknown';
    counts[action] = (counts[action] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count);
}

function groupByDay(logs) {
  const counts = {};
  logs.forEach((log) => {
    const date = log.timestamp ? new Date(log.timestamp) : null;
    if (!date || Number.isNaN(date.getTime())) return;
    const dayKey = date.toISOString().slice(0, 10);
    counts[dayKey] = (counts[dayKey] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([day, count]) => ({ day, count }))
    .sort((a, b) => (a.day > b.day ? 1 : -1));
}

function groupLast24Hours(logs) {
  const now = new Date();
  const buckets = [];

  for (let i = 23; i >= 0; i -= 1) {
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    start.setHours(now.getHours() - i);

    const label = `${start.getHours().toString().padStart(2, '0')}:00`;
    buckets.push({ label, start });
  }

  const items = buckets.map((bucket, index) => {
    const next = buckets[index + 1];
    const end = next ? next.start : now;
    const count = logs.filter((log) => {
      const ts = new Date(log.timestamp);
      if (Number.isNaN(ts.getTime())) return false;
      return ts >= bucket.start && ts < end;
    }).length;
    return { label: bucket.label, count };
  });

  const total = items.reduce((sum, item) => sum + item.count, 0);
  return { items, total };
}

function buildStats() {
  const logs = readLogs();
  const byAction = groupByAction(logs);
  const byDay = groupByDay(logs);
  const last24h = groupLast24Hours(logs);

  const recent = logs.slice(-10).reverse();
  return {
    totalEvents: logs.length,
    uniqueActions: byAction.length,
    byAction,
    byDay,
    last24h,
    recent,
  };
}

module.exports = { buildStats };
