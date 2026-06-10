const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        next();
    } else {
        req.flash('error', 'You must be logged in to access that page.');
        res.redirect('/login');
    }
};

/**
 * Middleware factory to require specific role
 */
const requireRole = (roleName) => {
    return (req, res, next) => {

        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        if (req.session.user.roleName !== roleName) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }

        next();
    };
};

export { requireLogin, requireRole };