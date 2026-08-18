// Minimal structured logger for security-relevant events.
// Rule: NEVER pass passwords, password_hash, full JWTs, or DATABASE_URL
// into this logger. Only pass safe identifiers (user id, email, route,
// IP, event type).
function logSecurityEvent(eventType, details = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    event: eventType,
    ...details
  };
  // In a real production system this would go to a dedicated log
  // sink/SIEM rather than stdout. Kept simple and readable for this task.
  console.log(`[SECURITY] ${JSON.stringify(entry)}`);
}

module.exports = { logSecurityEvent };
