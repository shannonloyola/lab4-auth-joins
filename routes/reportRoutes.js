const express = require('express');
const router = express.Router();
const reportCtrl = require('../controllers/reportController');
const auth = require('../middleware/auth'); // assumes JWT middleware

// Protect all report routes
router.use(auth(true));

// A) INNER JOIN
router.get('/reports/users-with-roles', reportCtrl.usersWithRoles);

// B) LEFT JOIN
router.get('/reports/users-with-profiles', reportCtrl.usersWithProfiles);

// C) RIGHT JOIN
router.get('/reports/roles-right-join', reportCtrl.rolesRightJoin);

// D) FULL OUTER JOIN (emulated)
router.get('/reports/profiles-full-outer', reportCtrl.profilesFullOuter);

// E) CROSS JOIN
router.get('/reports/user-role-combos', reportCtrl.userRoleCombos);

// F) SELF JOIN
router.get('/reports/referrals', reportCtrl.referrals);

// G) Bonus — Latest login
router.get('/reports/latest-login', reportCtrl.latestLogin);

module.exports = router;
