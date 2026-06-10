import { Router } from 'express';
import { validationResult } from 'express-validator';

import { findUserByEmail, verifyPassword } from '../../models/forms/login.js';
import { loginValidation } from '../../middleware/validation/forms.js';

const router = Router();

/**
 * Shows the login form.
 */
const showLoginForm = (req, res) => {
    res.render('forms/login/form', {
        title: 'User Login'
    });
};

/**
 * Logs in a user if credentials are valid.
 */
const processLogin = async (req, res) => {
    const errors = validationResult(req);

    // Send validation errors back to the user.
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        const passwordMatches = await verifyPassword(password, user.password);

        if (!passwordMatches) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }

        // Never store the password in the session.
        delete user.password;

        req.session.user = user;

        req.flash('success', `Welcome, ${user.name}!`);
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error logging in:', error);

        req.flash('error', 'Unable to log in. Please try again later.');
        res.redirect('/login');
    }
};

/**
 * Logs out the current user.
 */
const processLogout = (req, res) => {
    if (!req.session) {
        return res.redirect('/');
    }

    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.clearCookie('connect.sid');
            return res.redirect('/');
        }

        res.clearCookie('connect.sid');
        res.redirect('/');
    });
};

/**
 * Shows the logged-in user's dashboard.
 */
const showDashboard = (req, res) => {
    const user = req.session.user;
    const sessionData = req.session;

    // Extra safety: remove password if it ever appears.
    if (user && user.password) {
        console.error('Security error: password found in user object');
        delete user.password;
    }

    if (sessionData.user && sessionData.user.password) {
        console.error('Security error: password found in sessionData.user');
        delete sessionData.user.password;
    }

    res.render('dashboard', {
        title: 'Dashboard',
        user,
        sessionData
    });
};

/**
 * Login routes.
 */
router.get('/', showLoginForm);
router.post('/', loginValidation, processLogin);

export default router;
export { processLogout, showDashboard };