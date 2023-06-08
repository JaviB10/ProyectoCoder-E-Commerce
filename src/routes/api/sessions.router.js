import { Router } from "express";
import passport from "passport"

const router = Router();

router.post("/register", passport.authenticate("register", { failureRedirect: "/failed-registe" }) ,async (req, res) => {
    res.send({ status: "success", message: "User registered" });
});

router.get("/failed-register", (req, res) => {
    res.status(400).send({ status: "Error", message: "Register failed" });
})

router.post("/login", passport.authenticate("login", { failureRedirect: "/failed-login" }) ,async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", message: "Invalid credencials"});  
    if (req.user.email === "adminCoder@coder.com") {
        req.session.user = {
            email: req.user.email,
            role: "ADMIN"
        }
    } else {
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email,
            role: "USER"
        }
    }
    return res.send({ status: 'success', message: 'Login success' })
})

router.get("/failed-login", (req, res) => {
    res.status(400).send({ status: "Error", message: "Login failed" });
})

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err) return res.status(500).send({ status: 'error', error: 'Logout fail' });
        res.redirect('/login')
    })
});

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }, async (req, res) => {
    res.send({ status: "success", message: "User registered" })
}));

router.get("/github-callback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: "USER"
    }
    res.redirect("/products")
})

export default router