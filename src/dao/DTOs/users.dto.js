export default class UsersDTO {
    constructor(user) {
        this.name = `${user.name} ${user.last_name}`
        this.phone = user.phone ? user.phone.split("-").join("") : ""
    }
}
