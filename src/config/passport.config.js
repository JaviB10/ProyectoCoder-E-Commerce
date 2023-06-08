import passport from "passport";
import local from "passport-local";
import userModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils.js";
import GitHubStrategy from "passport-github2";

const LocalStrategy = local.Strategy;
const initializePassport = () => {
    passport.use("github", new GitHubStrategy({
        clientID: "Iv1.cc34d37a291c0072",
        clientSecret: "7d85d87577b357abe376dcc748364a07c8333142",
        callbackURL: "http://localhost:8081/api/sessions/github-callback",
        scope: ["user:email"]
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile._json.email);
            const email = profile._json.email
            const user = await userModel.findOne({ email: email})
            if (!user) {
                const newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: "",
                    email: email,
                    password: ""
                }
                const result = await userModel.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }));

    passport.use("register", new LocalStrategy({
        passReqToCallback: true, //permite acceder al objeto request como cualquier otro middleword
        usernameField: "email"
    }, async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
            const user = await userModel.findOne({ email: username });
            if (user) {
                return done(null, false);
            }
            const userToSave = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }
            const result = await userModel.create(userToSave);
            return done(null, result)
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`)
        }
    }));

    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) {
                return done(null, false);
            }
            if (!isValidPassword(user, password)) {
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(`Error al obtener el usuario: ${error}`)
        }
    }));

    

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
}

export default initializePassport;