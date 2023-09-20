//User's exeptions
export class UserNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class IncorrectLoginCredentials extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class UserAlreadyExists extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class IncorrectPassword extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class IncorrectToken extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class UseNewPassword extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantSwitchRoles extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class MissingDocuments extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantDeleteUser extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class DocumentsComplete extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

//Product's exceptions
export class ProductNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantDeleteProduct extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class IncompleteValues extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class OutStockProduct extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

//Cart's exceptions
export class CartNotFound extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantAddProduct extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantDeleteAllProduct extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}
export class CantPurchase extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

