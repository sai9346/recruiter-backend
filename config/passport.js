const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const Recruiter = mongoose.model('Recruiter');
const dotenv = require('dotenv');

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const recruiter = await Recruiter.findById(jwt_payload.recruiterId);
                if (recruiter) {
                    return done(null, recruiter);
                } else {
                    return done(null, false);
                }
            } catch (err) {
                console.error(err);
                return done(err, false);
            }
        })
    );
};
