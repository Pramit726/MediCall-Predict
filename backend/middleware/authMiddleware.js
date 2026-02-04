const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    // Check if token exists in the Authorization header (Format: Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token using your secret key from .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Add user data (id and role) to the request object
            req.user = decoded;

            next(); // Move to the next function (the controller)
        } catch (error) {
            console.error("Auth Middleware Error:", error);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ message: "Not authorized, no token provided" });
    }
};

module.exports = { protect };