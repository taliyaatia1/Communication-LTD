const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require("../db-config");
const validator = require('validator');
const badPasswords = ["mypassword", "password1234", "1234567890", "0987654321"];
const history = process.env.PASSWORD_HISTORY || 3;

router.get('/', function (req, res) {
    return res.status(200).render('choosePassword.ejs', { messages: null });
});

router.post('/', async function (req, res) {
    if (!req.session || !req.session.email) {
        return res.redirect('/login');  // Ensure correct redirect path
    }
    const email = req.session.email;
    const { newPassword, newPasswordConfirm } = req.body;

    if (badPasswords.includes(newPassword)) {
        return res.status(400).render('choosePassword.ejs', { messages: 'Password is too weak!' });
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 10 })) {
        return res.status(400).render('choosePassword.ejs', { messages: 'The password must be at least 10 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character.' });
    }

    if (newPassword !== newPasswordConfirm) {
        return res.status(400).render('choosePassword.ejs', { messages: 'Passwords do not match!' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const getUserPasswordHistoryQuery = `SELECT password_history FROM users WHERE email = ?`;
    const [historyRows] = await query(getUserPasswordHistoryQuery, [email]);
    const passwordHistory = historyRows[0]?.password_history ? JSON.parse(historyRows[0].password_history) : [];

    const previousPasswords = passwordHistory.slice(0, history).map((password) => bcrypt.compareSync(newPassword, password));
    if (previousPasswords.some((match) => match)) {
        return res.status(400).render('choosePassword.ejs', { messages: 'The new password must not match any of the last three passwords.' });
    }

    const previousPasswordHashes = passwordHistory.slice(0, history - 1).map((password) => bcrypt.hashSync(password, 10));
    const currentPasswordHashed = bcrypt.hashSync(newPassword, 10);
    const updatedPasswordHistory = [currentPasswordHashed, ...previousPasswordHashes];

    const updatePasswordHistoryQuery = `UPDATE users SET password_history = ? WHERE email = ?`;
    await query(updatePasswordHistoryQuery, [JSON.stringify(updatedPasswordHistory), email]);

    const updatePasswordQuery = `UPDATE users SET password = ? WHERE email = ?`;
    await query(updatePasswordQuery, [hashedPassword, email]);

    res.redirect('/login');  // Ensure correct redirect path
});

module.exports = router;
