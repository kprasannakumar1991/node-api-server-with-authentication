const Authentication =  require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// a middleware
const authenticateUsingJwt = passport.authenticate('jwt', {
    session: false // dont use cookies
});
const authenticateUsingLocal = passport.authenticate('local', {session: false});

module.exports  = (app) => {

    app.get('/userprofile', authenticateUsingJwt, (req, res) => {
        res.send({user: req.user.email})
    });

    app.post('/signin', authenticateUsingLocal, Authentication.signin);
    app.post('/signup', Authentication.signup);
}
