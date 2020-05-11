const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// Define our model
const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    password: String
});

// on Save Hook, encrypt password
// Before saving the model, run this function
userSchema.pre('save', function(next) {
    const user = this;

    // generate a salt, then run the callback
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            return next(err)
        }

        // hash the password or encrypt the password
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if(err) {
                return next(err);
            }
            user.password = hash; // salt + hashedPassword
            next();
        })
    })

})

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) {return callback(err);}

        callback(null, isMatch);
    })
}

// Create the model class
const ModelClass = mongoose.model('user', userSchema);

// Export the model
module.exports = ModelClass;