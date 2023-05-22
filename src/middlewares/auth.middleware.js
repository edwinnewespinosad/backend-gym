// authMiddleware.js
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    const token = req.headers['x-access-token'];

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, 'secret');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token' });
    }
}
