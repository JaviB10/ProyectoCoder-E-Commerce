import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { 
    callBackGithub, 
    loginGithub, 
    userCurrent, 
    passwordLink, 
    passwordReset, 
    userLogout, 
    login, 
    register 
} from "../../controllers/sessions.controllers.js"

export default class SessionsRouter extends Router {
    init() {
        this.get("/github", ["PUBLIC"], passportStrategiesEnum.GITHUB, loginGithub)
        this.get("/github-callback", ["PUBLIC"], passportStrategiesEnum.GITHUB, callBackGithub)
        this.get("/logout", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, userLogout);
        this.get("/current", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, userCurrent);
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, login);
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, register);
        this.post("/passwordLink", ["PUBLIC"], passportStrategiesEnum.NOTHING, passwordLink);
        this.post("/passwordReset", ["PUBLIC"], passportStrategiesEnum.NOTHING, passwordReset);
    };
}