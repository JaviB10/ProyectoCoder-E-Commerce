import Router from "../router.js"
import { passportStrategiesEnum } from "../../config/enums.js"
import { saveTicket } from "../../controllers/tickets.controllers.js"

export default class TikcetsRouter extends Router {
    init() {
        this.post("/", ["ADMIN", "PREMIUM", "USER"], passportStrategiesEnum.JWT, saveTicket);
    }
}