import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { 
    userToPremium, 
    uploaderDocuments, 
    getUser, 
    deleteUsers, 
    deleteOneUser 
} from "../../controllers/users.controllers.js"
import { uploader } from "../../utils/utils.js";

export default class UsersRouter extends Router {
    init() {
        this.get("/", ["ADMIN"], passportStrategiesEnum.JWT, getUser)
        this.post("/:uid/documents", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, 
        uploader.fields([
            {name: "profile", maxCount: 1}, 
            {name: "product", maxCount: 1},
            {name: "idCard", maxCount: 1},
            {name: "address", maxCount: 1},
            {name: "accountStatus", maxCount: 1}]), uploaderDocuments)
        this.put("/premium/:uid", ["ADMIN"], passportStrategiesEnum.JWT, userToPremium);
        this.delete("/", ["ADMIN"], passportStrategiesEnum.JWT, deleteUsers)
        this.delete("/:uid", ["ADMIN"], passportStrategiesEnum.JWT, deleteOneUser)
    };
}

