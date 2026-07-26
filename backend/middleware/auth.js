const jwt = require('jsonwebtoken');

const auth = (userType = null) => {
    return (req, res, next) => {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No authorization token, access denied' });
        }

        const token = authHeader.replace('Bearer ', '');
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_virtual_greenhouse_2026_saas');
            req.user = decoded;

            if (userType && decoded.role !== userType) {
                return res.status(403).json({ message: `Access denied. Requires ${userType} authorization.` });
            }

            next();
        } catch (err) {
            res.status(401).json({ message: 'Token is invalid or expired' });
        }
    };
};

module.exports = auth;
