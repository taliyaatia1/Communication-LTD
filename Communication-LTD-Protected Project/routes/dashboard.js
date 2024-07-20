const express = require('express');
const router = express.Router();
const requireAuth = require('../auth');
const db = require("../db-config");
const validator = require('validator');

// Add Morgan logging middleware
const morgan = require('morgan');
router.use(morgan('tiny'));

router.post('/search', requireAuth, function (req, res) {
    const { searchQuery } = req.body;
    if (searchQuery != null) {
        let selectQuery = ` WHERE firstname LIKE ? OR lastname LIKE ? OR email LIKE ? OR phoneNumber LIKE ? `;
        const searchQueryResult = `SELECT * FROM clients ${selectQuery}`;
        const searchTerm = `%${searchQuery}%`;
        db.clientDbConfig.query(searchQueryResult, [searchTerm, searchTerm, searchTerm, searchTerm], function (error, results, fields) {
            if (error) {
                console.log("database error:", error);
                req.flash('error', 'An error occurred while fetching clients. Please try again later.');
                res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, user: req.session.user, searchQuery: searchQuery });
            } else {
                res.render('home.ejs', { fullName: req.session.user.fullName, user: req.session.user, searchQueryResult: results, searchQuery: searchQuery });
            }
        });
    } else {
        res.render('home.ejs', { fullName: req.session.user.fullName, user: req.session.user, searchQueryResult: [], searchQuery: null });
    }
});

router.get('/', requireAuth, (req, res) => {
    if (req.session.user) {
        const fullName = req.session.user.fullName;
        res.render('home.ejs', { fullName, user: req.session.user, searchQueryResult: [], searchQuery: null });
    } else {
        res.redirect('/login');
    }
});

router.get('/addClient', requireAuth, (req, res) => {
    if (req.session.user) {
        res.render('addclient.ejs', { fullName: req.session.user.fullName });
    } else {
        res.redirect('/login');
    }
});

router.post('/addClient', function (req, res) {
    if (req.session.user) {
        const { firstname, lastname, email, phoneNumber } = req.body;

        if (!validator.isEmail(email)) {
            req.flash('error', 'Invalid email format.');
            return res.status(400).render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, ...req.body });
        }

        const selectQuery = 'SELECT * FROM clients WHERE email = ?';
        db.clientDbConfig.query(selectQuery, [email], function (error, results, fields) {
            if (error) {
                console.error("Database error while checking email:", error);
                req.flash('error', 'An error occurred while checking if the email is already registered. Please try again later.');
                return res.status(500).render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, ...req.body });
            } else if (results.length > 0) {
                req.flash('error', 'This email is already registered. Please try a different email.');
                return res.status(400).render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, ...req.body });
            } else {
                const insertQuery = 'INSERT INTO clients (firstname, lastname, email, phoneNumber) VALUES (?, ?, ?, ?)';
                db.clientDbConfig.query(insertQuery, [firstname, lastname, email, phoneNumber], function (error, results, fields) {
                    if (error) {
                        console.error("Database error while adding client:", error);
                        req.flash('error', 'An error occurred while adding the client. Please try again later.');
                        return res.status(500).render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName, ...req.body });
                    } else {
                        req.flash('success', `${firstname} added successfully.`);
                        return res.status(200).render('home.ejs', { messages: req.flash('success'), fullName: req.session.user.fullName });
                    }
                });
            }
        });
    }
});

router.post('/deleteClient', requireAuth, function (req, res) {
    const { clientId } = req.body;

    const deleteQuery = 'DELETE FROM clients WHERE id = ?';
    db.clientDbConfig.query(deleteQuery, [clientId], function (error, results, fields) {
        if (error) {
            console.error("Database error while deleting client:", error);
            req.flash('error', 'An error occurred while deleting the client. Please try again later.');
            res.render('home.ejs', { messages: req.flash('error'), fullName: req.session.user.fullName });
        } else {
            req.flash('success', 'Client deleted successfully.');
            res.status(200).redirect('/dashboard');
        }
    });
});

module.exports = router;
