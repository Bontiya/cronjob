const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    email: {
        type:String,
        required: [true, 'email is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength: [5, "Password it's too short"]
    },
    username: {
        type: String,
        unique: true,
        trim: true,
        index: true, 
        sparse: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
    },
    avatar: {
        type: String,
    },
    reputation: {
        type: String,
    },
    provider: {
        type: String,
        enum: ['default', 'google'],
    },
    tokenDeviceFirebase: {
        type: String
    }
},{
    timestamps: { 
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})


const User = mongoose.model('User', userSchema);
module.exports = User