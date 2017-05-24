const mongoose = require('mongoose');
const crypto = require('crypto');
const { Schema } = mongoose;
const { Types } = Schema;

mongoose.Promise = Promise;
mongoose.set('debug', true);

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
        cords: {
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

const usersSchema = Schema({
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
        unique: true,
    },
    passwordHash: String,
    salt: String,
}, {
    timestamps: true,
});

usersSchema.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        if (password) {
            this.salt = crypto.randomBytes(128).toString('base64');
            this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString('base64');
        } else {
            this.salt = false;
            this.passwordHash = false;
        }
    })
    .get(function() { return this._plainPassword });

usersSchema.methods.checkPassword = function(password) {
    console.log(password, this.password, this.salt, this.passwordHash);
    if (!password || !this.passwordHash) return false;
    return crypto.pbkdf2Sync(password, this.salt, 1, 128, 'sha1').toString('base64') === this.passwordHash;
};

const Users = mongoose.model('users', usersSchema);

module.exports = {
    Device,
    Users
};
