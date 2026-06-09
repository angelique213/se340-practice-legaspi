const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
        next();
    } else {
        req.flash('error', 'You must be logged in to access that page.');
        res.redirect('/login');
    }
};

const requireAdmin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }

    if (req.session.user.role_name !== 'admin') {
        req.flash('error', 'You do not have permission to access that page.');
        return res.redirect('/dashboard');
    }

    next();
};

export { requireLogin, requireAdmin };