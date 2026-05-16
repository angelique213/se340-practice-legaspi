const addVisitCount = (req, res, next) => {
    res.locals.visitCount = 42;
    next();
};

const addDemoHeaders = (req, res, next) => {
    res.setHeader('X-Demo-Page', 'true');
    res.setHeader('X-Middleware-Demo', 'Route-specific middleware demonstration');
    next();
};

export { addVisitCount, addDemoHeaders };