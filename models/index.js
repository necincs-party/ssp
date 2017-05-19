const mongoose = require('mongoose');
const { Schema } = mongoose;
const { Types } = Schema;

mongoose.connect('mongodb://localhost:27017/local');

const deviceSchema = Schema({
    ownerId: {
        type: Types.ObjectId,
        required: true,
    },
    registrationDate: {
        type: Date,
        default: Date.now
    },
    history: [{
        date: {
            type: Date,
            required: true,
        },
        coords: {
            lat: {
                type: Number,
                required: true,
            },
            lon: {
                type: Number,
                required: true,
            },
        },
    }],
    trustees: [Types.ObjectId],
});

const Device = mongoose.model('devices', deviceSchema);

const usersSchema  = Schema({
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        validate: {
            validator: value => (
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@[a-zA-Z\-0-9]+\.+[a-zA-Z]{2,}$/.test(value)
            ),
            message: '{VALUE} is not a valid email address',
        },
        required: true,
    }
});

const Users = mongoose.model('users', usersSchema);

module.exports = {
    Device,
    Users
};
