const db = require('../config/db');

// === A) INNER JOIN — Users who have at least one role ===
exports.usersWithRoles = (req, res) => {
  const sql = `
    SELECT u.id, u.email, r.role_name
    FROM users u
    INNER JOIN user_roles ur ON ur.user_id = u.id
    INNER JOIN roles r ON r.id = ur.role_id
    ORDER BY u.id, r.role_name;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === B) LEFT JOIN — All users (with profile info if present) ===
exports.usersWithProfiles = (req, res) => {
  const sql = `
    SELECT u.id, u.email, p.phone, p.city, p.country
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    ORDER BY u.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === C) RIGHT JOIN — Keep all roles even if unassigned ===
exports.rolesRightJoin = (req, res) => {
  const sql = `
    SELECT r.role_name, u.id AS user_id, u.email
    FROM users u
    RIGHT JOIN user_roles ur ON ur.user_id = u.id
    RIGHT JOIN roles r ON r.id = ur.role_id
    ORDER BY r.role_name, user_id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === D) FULL OUTER JOIN (emulated with UNION) — Profiles vs Users ===
exports.profilesFullOuter = (req, res) => {
  const sql = `
    SELECT u.id AS user_id, u.email, p.id AS profile_id
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    UNION
    SELECT u.id AS user_id, u.email, p.id AS profile_id
    FROM users u
    RIGHT JOIN profiles p ON p.user_id = u.id
    ORDER BY user_id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === E) CROSS JOIN — Every user × every role ===
exports.userRoleCombos = (req, res) => {
  const sql = `
    SELECT u.id AS user_id, u.email, r.role_name
    FROM users u
    CROSS JOIN roles r
    ORDER BY u.id, r.role_name;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === F) SELF JOIN — Who referred whom ===
exports.referrals = (req, res) => {
  const sql = `
    SELECT ref.referrer_user_id, u1.email AS referrer_email,
           ref.referred_user_id, u2.email AS referred_email,
           ref.referred_at
    FROM referrals ref
    INNER JOIN users u1 ON u1.id = ref.referrer_user_id
    INNER JOIN users u2 ON u2.id = ref.referred_user_id
    ORDER BY ref.referred_at DESC;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

// === G) Bonus — Latest login per user ===
exports.latestLogin = (req, res) => {
  const sql = `
    SELECT u.id, u.email, la.ip_address, la.occurred_at
    FROM users u
    LEFT JOIN (
      SELECT l1.user_id, l1.ip_address, l1.occurred_at
      FROM login_audit l1
      WHERE l1.occurred_at = (
        SELECT MAX(l2.occurred_at)
        FROM login_audit l2
        WHERE l2.user_id = l1.user_id
      )
    ) la ON la.user_id = u.id
    ORDER BY u.id;
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
