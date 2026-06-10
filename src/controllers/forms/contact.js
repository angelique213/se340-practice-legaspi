import { Router } from 'express';
import { validationResult } from 'express-validator';

import { createContactForm, getAllContactForms } from '../../models/forms/contact.js';
import { requireRole } from '../../middleware/auth.js';
import { contactValidation } from '../../middleware/validation/forms.js';

const router = Router();

/**
 * Shows the contact form page.
 */
const showContactForm = (req, res) => {
    res.render('forms/contact/form', {
        title: 'Contact Us'
    });
};

/**
 * Saves a valid contact form submission.
 */
const handleContactSubmission = async (req, res) => {
    const errors = validationResult(req);

    // Send validation errors back to the user.
    if (!errors.isEmpty()) {
        errors.array().forEach(error => {
            req.flash('error', error.msg);
        });

        return res.redirect('/contact');
    }

    const { subject, message } = req.body;

    try {
        await createContactForm(subject, message);

        req.flash('success', 'Thank you for contacting us! We will respond soon.');
        res.redirect('/contact');

    } catch (error) {
        console.error('Error saving contact form:', error);

        req.flash('error', 'Unable to submit your message. Please try again later.');
        res.redirect('/contact');
    }
};

/**
 * Shows all contact responses for admins.
 */
const showContactResponses = async (req, res) => {
    let contactForms = [];

    try {
        contactForms = await getAllContactForms();

    } catch (error) {
        console.error('Error retrieving contact forms:', error);
    }

    res.render('forms/contact/responses', {
        title: 'Contact Form Submissions',
        contactForms
    });
};

/**
 * Contact routes.
 */
router.get('/', showContactForm);
router.post('/', contactValidation, handleContactSubmission);

/**
 * Admin-only contact responses route.
 */
router.get('/responses', requireRole('admin'), showContactResponses);

export default router;