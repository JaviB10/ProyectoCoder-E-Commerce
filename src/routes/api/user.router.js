import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { callBackGithub, loginGithub, loginUser, registerUser, userCurrent, passwordLink, passwordReset, userToPremium, userLogout, uploaderDocuments } from "../../controllers/users.controllers.js"
import { uploader } from "../../utils/utils.js";


export default class UsersRouter extends Router {
    init() {
        this.post("/login", ["PUBLIC"], passportStrategiesEnum.NOTHING, loginUser);
        this.post("/register", ["PUBLIC"], passportStrategiesEnum.NOTHING, registerUser);
        this.get('/github', ['PUBLIC'], passportStrategiesEnum.GITHUB, loginGithub)
        this.get('/github-callback', ['PUBLIC'], passportStrategiesEnum.GITHUB, callBackGithub)
        this.get('/logout', ['USER', 'ADMIN', 'PREMIUM'], passportStrategiesEnum.JWT, userLogout);
        this.get('/current', ['ADMIN','USER', 'PREMIUM'], passportStrategiesEnum.JWT, userCurrent);
        this.post('/password-link', ['PUBLIC'], passportStrategiesEnum.NOTHING, passwordLink);
        this.post('/password-reset', ['PUBLIC'], passportStrategiesEnum.NOTHING, passwordReset);
        this.get('/premium/:uid', ['ADMIN'], passportStrategiesEnum.JWT, userToPremium);
        this.post('/:uid/documents', ['ADMIN', 'USER', 'PREMIUM'], passportStrategiesEnum.JWT, 
        uploader.fields([
            {name: 'profiles', maxCount: 1}, 
            {name: 'products', maxCount: 1},
            {name: 'identificacion', maxCount: 1},
            {name: 'domicilio', maxCount: 1},
            {name: 'estadoCuenta', maxCount: 1}]), uploaderDocuments)
    };
}

