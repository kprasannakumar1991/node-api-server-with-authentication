const jwt = require('jwt-simple');
const config = require('../config');

const User = require('../models/user')


const signin = (req, res, next) => {
    // user is already authenticated due to passport-middleware in router.js, just return a jwt token
    // req.user is appended automatically by passport due to done(null, user) in passport.js
    return res.send({token: jwtTokenForUser(req.user)});

}

const signup = (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(422).send({error: 'email and password missing'});
    }
    // See if a user with given email exists
    User.findOne({email: email}, (err, existingUser) => {
        if (err) {
            // some error related to database
            return next(err);
        }

        if (existingUser) {
            // email already exists in database
            return res.status(422).send({error: 'Email already taken'})
        }

        //signup the new user
        const user = new User({
            email,
            password
        });

        user.save((err) => {
            if (err) {
                // some error related to database
                return next(err);
            }

            res.json({token: jwtTokenForUser(user)});
        });
    });
}

const jwtTokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret)
}


module.exports = {
    signup,
    signin
}