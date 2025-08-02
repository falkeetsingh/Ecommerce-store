const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    let token;

    // Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    } 
    // Fallback to cookie
    else if (req.cookies?.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authenticated. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Typically contains { id, email }
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token invalid or expired.' });
    }
};

module.exports = auth;
