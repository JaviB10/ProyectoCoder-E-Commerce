import passport from "passport";
import jwt from "passport-jwt"
import config from "./config.js";
import GitHubStrategy from "passport-github2";
import { PRIVATE_KEY } from "./contants.js";
import { getUserByEmailService } from "../services/users.services.js";
import { saveCartService } from "../services/carts.services.js";
import { createHash } from "../utils/utils.js";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload.user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use("github", new GitHubStrategy({
        clientID: config.idGitHub, //"Iv1.cc34d37a291c0072"
        clientSecret: config.secretGitHub, //"7d85d87577b357abe376dcc748364a07c8333142",
        callbackURL: `http://localhost:${Number(config.port)}/api/users/github-callback`,
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile._json.email
            const user = await getUserByEmailService(email)
            if (!user) {
                const newCart = await saveCartService({ products: [] })
                const newUser = {
                    name: profile._json.name,
                    phone: "",
                    age: "",
                    email: email,
                    password: createHash(config.passDefault),
                    cart: newCart._id
                }
                const result = await saveCartService(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));
}

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["coderCookieToken"]
    }
    return token;
}

export default initializePassport;