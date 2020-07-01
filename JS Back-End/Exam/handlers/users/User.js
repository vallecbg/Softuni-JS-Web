const mongoose = require('mongoose')
const {
    Schema,
    model: Model
} = mongoose
const {
    String,
    ObjectId,
    Number
} = Schema.Types
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 11;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    likedPlays: [{
        type: ObjectId,
        ref: 'Play'
    }]
})

userSchema.methods = {
    passwordsMatch(password){
        return bcrypt.compare(password, this.password)
    }
}

userSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {

            if (err) {
                return next(err)
            }

            bcrypt.hash(this.password, salt, (err, hashedPassword) => {
                if (err) {
                    return next(err)
                }

                this.password = hashedPassword
                next()
            })
        })
        return
    }
    next()
})

module.exports = new Model('User', userSchema)