const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/check-auth');
const Invitation = require('../models/invitation');
const User = require('../models/user');

router.put("/send", authenticateToken, async (req, res, next) => {
    try {
        const existingDoc = await Invitation.findOne();
        if (!existingDoc) {
            const doc = new Invitation({
                fields: {}
            });
            await doc.save();
        }
        const updatedDocument = await Invitation.findOneAndUpdate(
            {},
            {
                $push: {
                    [`fields.${req.body.toUserId}`]: {
                        fromUserId: req.body.fromUserId,
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(201).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('', authenticateToken, async (req, res, next) => {
    Invitation.find().then(invitations => {
        res.status(200).json({
            message: "Invitations fetched successfully!",
            invitations
        });
    });
})

router.get('/current-user', authenticateToken, async (req, res, next) => {
    Invitation.find().then(invitations => {
        res.status(200).json({
            message: "Invitations fetched successfully!",
            invitations
        });
    });
})

router.put("/accept", authenticateToken, async (req, res, next) => {
    try {
        const updatedDocument = await Invitation.findOneAndUpdate(
            {},
            {
                $pull: {
                    [`fields.${req.body.toUserId}`]: {
                        fromUserId: req.body.fromUserId,
                    }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedDocument) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const fields = updatedDocument.fields;
        if (fields.get(req.body.toUserId) && fields.get(req.body.toUserId).length === 0) {
            await Invitation.updateOne(
                {},
                { $unset: { [`fields.${req.body.toUserId}`]: "" } }
            );
        }

        await User.findOneAndUpdate(
            { _id: req.body.toUserId },
            {
                $push: {
                    friends: { userId: req.body.fromUserId }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        await User.findOneAndUpdate(
            { _id: req.body.fromUserId },
            {
                $push: {
                    friends: { userId: req.body.toUserId }
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error('Error updating document:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;