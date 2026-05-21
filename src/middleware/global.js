/**
 * Adds dynamic CSS and JS asset management.
 * This lets routes load only the files they actually need.
 */
const setHeadAssetsFunctionality = (res) => {
    // Arrays to store styles and scripts
    res.locals.styles = [];
    res.locals.scripts = [];

    // Add CSS files dynamically
    res.addStyle = (css, priority = 0) => {
        res.locals.styles.push({ content: css, priority });
    };

    // Add JS files dynamically
    res.addScript = (js, priority = 0) => {
        res.locals.scripts.push({ content: js, priority });
    };

    // Render styles in priority order
    res.locals.renderStyles = () => {
        return res.locals.styles
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };

    // Render scripts in priority order
    res.locals.renderScripts = () => {
        return res.locals.scripts
            .sort((a, b) => b.priority - a.priority)
            .map(item => item.content)
            .join('\n');
    };
};

/**
 * Global middleware that adds variables available to all templates.
 */
const addLocalVariables = (req, res, next) => {

    // Environment info
    res.locals.NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

    // Current year for footer
    res.locals.currentYear = new Date().getFullYear();

    // Timestamp
    res.locals.timestamp = new Date().toISOString();

    // Query parameters
    res.locals.queryParams = req.query || {};

    // Greeting based on current time
    const hour = new Date().getHours();

    if (hour < 12) {
        res.locals.greeting = 'Good Morning';
    } else if (hour < 18) {
        res.locals.greeting = 'Good Afternoon';
    } else {
        res.locals.greeting = 'Good Evening';
    }

    // Random theme for body styling
    const themes = ['blue-theme', 'green-theme', 'red-theme'];
    res.locals.bodyClass = themes[Math.floor(Math.random() * themes.length)];

    // Enable dynamic asset loading functionality
    setHeadAssetsFunctionality(res);

    next();
};

export { addLocalVariables };