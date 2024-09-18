const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const router = express.Router();
const authenticateToken = require('../middleware/check-auth');


router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then((hash) => {
        const user = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            fullName: req.body.fname + " " + req.body.lname,
            email: req.body.email,
            password: hash,
            role: 'user',
            friends: []
        });
        user.save().then((result) => {
            res.status(201).json({
                message: 'User created',
                result: result
            })
        })
            .catch((err) => {
                res.status(500).json({
                    error: err
                })
            })
    });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(401).json({
                message: 'Auth failed',
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    })
        .then((result) => {
            if (!result) {
                return res.status(401).json({
                    message: 'Auth failed',
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_this_should_be_longer', { expiresIn: '1h' })
            res.status(200).json({
                token,
                expiresIn: 3600
            })
        })
        .catch(() => {
            return res.status(401).json({
                message: 'Auth failed',
            });
        })
});

router.get('/validate-email', (req, res, next) => {
    try {
        User.findOne({ email: req.query.email }).then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: 'No account with that email address.',
                });
            }
            res.status(200).json(user);
        })
    } catch (error) {
        res.status(500).send('Error fetching users.');
    }
})

router.put("/reset-password", (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
            return res.status(404).json({
                message: 'No account with that email address.',
            });
        }
        fetchedUser = user;
        return bcrypt.hash(req.body.password, 10);
    })
        .then((hash) => {
            if (!hash) {
                return res.status(401).json({
                    message: 'Auth failed',
                });
            }
            fetchedUser.password = hash;
            return fetchedUser.save();
        })
        .then(() => {
            res.status(201).json({
                message: 'password updated successfully'
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId }).select('-password'); // Exclude password from response
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile-update', authenticateToken, async (req, res) => {
    try {
        const { fname, lname } = req.body;
        const userId = req.user.userId; // Extract user ID from the JWT payload
        if (!fname || !lname) {
            return res.status(400).json({ message: 'First name and last name are required' });
        }
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { fname, lname },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
})

router.delete('/account/:userId', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

router.get('', authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.user.userId }).select('-password'); // Exclude password from response
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
})

router.get('/all-users', authenticateToken, async (req, res) => {
    try {
        const allUsers = await User.find({ role: { $ne: 'admin' } }).select('-password'); // Exclude password from response
        res.json(allUsers);
    } catch (error) {
        res.status(500).send('Error retrieving users');
    }
})

router.get("/get-friends", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findOne(
            { _id: userId },
            { friends: 1, _id: 0 }
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error retrieving user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;