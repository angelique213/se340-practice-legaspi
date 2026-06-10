import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { requireLogin, requireRole } from '../../middleware/auth.js';

import {
    registrationValidation,
    updateAccountValidation
} from '../../middleware/validation/forms.js';

import {
    emailExists,
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} from '../../models/forms/registration.js';

const router = Router();

/**
 * Shows the registration form.
 */
const showRegistrationForm = (req, res) => {
    res.render('forms/registration/form', {
        title: 'User Registration'
    });
};

/**
 * Creates a new user account.
 */
const processRegistration = async (req, res) => {
    const errors = validationResult(req);

    // Show validation errors.
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/register');
    }

    const { name, email, password } = req.body;

    try {
        const exists = await emailExists(email);

        if (exists) {
            req.flash('warning', 'An account with this email already exists.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await saveUser(name, email, hashedPassword);

        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/login');

    } catch (error) {
        console.error('Error registering user:', error);

        req.flash('error', 'Unable to register your account. Please try again later.');
        res.redirect('/register');
    }
};

/**
 * Shows the admin user list.
 */
const showAllUsers = async (req, res) => {
    let users = [];

    try {
        users = await getAllUsers();

    } catch (error) {
        console.error('Error retrieving users:', error);
    }

    res.render('forms/registration/list', {
        title: 'Registered Users',
        users,
        user: req.session?.user || null
    });
};

/**
 * Shows the edit account form.
 */
const showEditAccountForm = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    try {
        const targetUser = await getUserById(targetUserId);

        if (!targetUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/register/list');
        }

        // Users can edit themselves. Admins can edit anyone.
        const canEdit =
            currentUser.id === targetUserId ||
            currentUser.roleName === 'admin';

        if (!canEdit) {
            req.flash('error', 'You do not have permission to edit this account.');
            return res.redirect('/register/list');
        }

        res.render('forms/registration/edit', {
            title: 'Edit Account',
            user: targetUser
        });

    } catch (error) {
        console.error('Error loading edit account form:', error);

        req.flash('error', 'Unable to load the edit account page.');
        res.redirect('/register/list');
    }
};

/**
 * Updates account information.
 */
const processEditAccount = async (req, res) => {
    const errors = validationResult(req);
    const targetUserId = parseInt(req.params.id);

    // Show validation errors.
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/register/${targetUserId}/edit`);
    }

    const currentUser = req.session.user;
    const { name, email } = req.body;

    try {
        const targetUser = await getUserById(targetUserId);

        if (!targetUser) {
            req.flash('error', 'User not found.');
            return res.redirect('/register/list');
        }

        // Users can update themselves. Admins can update anyone.
        const canEdit =
            currentUser.id === targetUserId ||
            currentUser.roleName === 'admin';

        if (!canEdit) {
            req.flash('error', 'You do not have permission to edit this account.');
            return res.redirect('/register/list');
        }

        const emailTaken = await emailExists(email);

        if (emailTaken && targetUser.email !== email) {
            req.flash('error', 'An account with this email already exists.');
            return res.redirect(`/register/${targetUserId}/edit`);
        }

        await updateUser(targetUserId, name, email);

        // Keep session current if user edited their own account.
        if (currentUser.id === targetUserId) {
            req.session.user.name = name;
            req.session.user.email = email;
        }

        req.flash('success', 'Account updated successfully.');
        res.redirect('/register/list');

    } catch (error) {
        console.error('Error updating account:', error);

        req.flash('error', 'An error occurred while updating the account.');
        res.redirect(`/register/${targetUserId}/edit`);
    }
};

/**
 * Deletes a user account.
 */
const processDeleteAccount = async (req, res) => {
    const targetUserId = parseInt(req.params.id);
    const currentUser = req.session.user;

    // Only admins can delete accounts.
    if (currentUser.roleName !== 'admin') {
        req.flash('error', 'You do not have permission to delete accounts.');
        return res.redirect('/register/list');
    }

    // Admins cannot delete themselves.
    if (currentUser.id === targetUserId) {
        req.flash('error', 'You cannot delete your own account.');
        return res.redirect('/register/list');
    }

    try {
        const deleted = await deleteUser(targetUserId);

        if (deleted) {
            req.flash('success', 'User account deleted successfully.');
        } else {
            req.flash('error', 'User not found or already deleted.');
        }

    } catch (error) {
        console.error('Error deleting user:', error);

        req.flash('error', 'An error occurred while deleting the account.');
    }

    res.redirect('/register/list');
};

/**
 * Registration routes.
 */
router.get('/', showRegistrationForm);

router.post(
    '/',
    registrationValidation,
    processRegistration
);

/**
 * Admin-only user list route.
 */
router.get(
    '/list',
    requireRole('admin'),
    showAllUsers
);

/**
 * Edit account routes.
 */
router.get(
    '/:id/edit',
    requireLogin,
    showEditAccountForm
);

router.post(
    '/:id/edit',
    requireLogin,
    updateAccountValidation,
    processEditAccount
);

/**
 * Delete account route.
 */
router.post(
    '/:id/delete',
    requireLogin,
    processDeleteAccount
);

export default router;