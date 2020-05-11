const passport = require('passport');
const JwtStartegy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

const User = require('../models/user');
const config = require('../config');

// Create local strategy
const localOptions = {usernameField: 'email'}; // for username use 'email' property in POST body.
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {

    User.findOne({email: email}, (err, user) => {
        if (err) {return done(err)}

        if(!user) {return done(null, false)}

        //compare passwords
        user.comparePassword(password, (err, isMatch) => {
            if (err) {return done(err);}

            if(!isMatch) {return done(null, false)}

            return done(null, user);
        })


    })
});

// 1. set up options for jwt-strategy. Where to look for token in http-request & how to decode the token
const jwtOptions = {
jwtFromRequest: ExtractJwt.fromHeader('authorization'),
secretOrKey: config.secret
}

// 2. create Jwt strategy
// 2nd arg: a function which is called whenever a user tries to login using jwt-token
const jwtLogin = new JwtStartegy(jwtOptions, (payload, done) => {
 //payload is decoded jwt-token
 //done is callback function, used to tell whether the authentication is successful or not
 // success: done(null, user), faliture: done(err, false) or done(null, false)

 const userId = payload.sub;
 User.findById(userId, (err, user) => {
     if (err) {
         // some error with database connection
         return done(err, false);
     }

     if(user) {
         // found user
         done(null, user)
     } else {
         // could not find user
         done(null, false)
     }

 })


})

// 3. tell passport to use jwt strartegy
passport.use(jwtLogin);
passport.use(localLogin);
