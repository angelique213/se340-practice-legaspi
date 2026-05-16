const addLocalVariables = (req, res, next) => {
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
    res.locals.currentYear = new Date().getFullYear();
    res.locals.timestamp = new Date().toISOString();
    res.locals.queryParams = req.query || {};

    const hour = new Date().getHours();

    if (hour < 12) {
        res.locals.greeting = 'Good Morning';
    } else if (hour < 18) {
        res.locals.greeting = 'Good Afternoon';
    } else {
        res.locals.greeting = 'Good Evening';
    }

    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

    next();
};

export { addLocalVariables };