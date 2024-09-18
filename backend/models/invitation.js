const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    fromUserId: String,
});

const invitationSchema = mongoose.Schema({
    fields: {
        type: Map,
        of: [itemSchema]
    }
});

module.exports = mongoose.model('Invitation', invitationSchema);
