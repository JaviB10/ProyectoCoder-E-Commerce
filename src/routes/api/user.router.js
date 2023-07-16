import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { callBackGithub, loginGithub, loginUser, registerUser, userCurrent } from "../../controllers/users.controllers.js"

export default class UsersRouter extends Router {
    init() {
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, loginUser);
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, registerUser);
        this.get('/github', ['PUBLIC'], passportStrategiesEnum.GITHUB, loginGithub)
        this.get('/github-callback', ['PUBLIC'], passportStrategiesEnum.GITHUB, callBackGithub)
        this.get('/logout', ["PUBLIC"], passportStrategiesEnum.NOTHING, (req, res) => {
            res.clearCookie("coderCookieToken").redirect('/login')
        });
        this.get('/current', ['ADMIN','USER'], passportStrategiesEnum.JWT, userCurrent);
    };
}

// export default class SessionsRouter extends Router {
//     init() {
//         this.get("/login", ["PUBLIC"], (req, res) => {
//             try {
//                 const user = {
//                     email: req.body.email,
//                     role: "USER"
//                 }

//                 const token = jwt.sign(user, "secretCoder")
//                 res.sendSuccess({ token })

//             } catch (error) {
//                 res.sendServerError(error.message)
//             }
//         })
//     }
// }