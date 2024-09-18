//  This file is going validate the token

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (token == null) return res.sendStatus(401);
        jwt.verify(token, 'secret_this_should_be_longer', (err, user) => {
            if (err) return res.sendStatus(403);
            req.user = user; // Attach user info to request object
            next();
        });
    } catch (error) {
        res.status(401).json({
            message: 'Auth failed',
        });
    }
}