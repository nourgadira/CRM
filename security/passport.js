const UserModel = require("../models/User");

var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async function (jwt_payload, done) {
            const user = await UserModel.findOne({ _id: jwt_payload.id })
            console.log(user)
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
    );
};