export class UsersDTO {
    constructor(user) {
        this.name = `${user.name} ${user.last_name}`
        this.phone = user.phone ? user.phone.split("-").join("") : ""
        this.age = user.age,
        this.email = user.email,
        this.password = user.password
    }
}

export class UserCurrentDTO {
    constructor(user) {
        this.name = `${user.name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
    }
}

export class GetUsersDTO {
    constructor(user) {
        this.id = user._id
        this.name = `${user.name} ${user.last_name}`
        this.email = user.email
        this.role = user.role
        this.last_connection = user.last_connection
    }
}

export const DTOs = { UsersDTO, UserCurrentDTO, GetUsersDTO };