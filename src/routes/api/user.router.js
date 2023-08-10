import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { callBackGithub, loginGithub, loginUser, registerUser, userCurrent, passwordLink, passwordReset, userToPremium } from "../../controllers/users.controllers.js"


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
        this.post('/password-link', ['PUBLIC'], passportStrategiesEnum.NOTHING, passwordLink);
        this.post('/password-reset', ['PUBLIC'], passportStrategiesEnum.NOTHING, passwordReset);
        this.get('/premium/:uid', ['ADMIN'], passportStrategiesEnum.JWT, userToPremium);
    };
}

