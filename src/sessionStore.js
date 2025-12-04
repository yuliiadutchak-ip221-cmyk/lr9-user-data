const session = require('express-session');

function createSessionMiddleware() {
  const secret = process.env.SESSION_SECRET || 'dev-secret';

  return session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 // 1 hour
    }
  });
}

module.exports = { createSessionMiddleware };
