const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;
const shortid = require('shortid');

const sessionSchema = new Schema({
    expires:{
        type:Date
    },
    session:Object,
    _id: {
        type: String,
        default: shortid.generate
    },
    id: {
        type: String,
        default: shortid.generate
    }
});

const session = mongoose.model('session', sessionSchema, 'sessions');

module.exports = session;