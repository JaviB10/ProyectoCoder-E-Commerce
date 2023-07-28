export const generateProductErrorInfo = (product) => {
    return `One or more properties were imcomplete or not valid.
    List of required properties:
    * title: needs to be a string, received ${product.title}
    * description: needs to be a string, received ${product.description}
    * code: needs to be a string, received ${product.code}
    * price: needs to be a Number, received ${product.price}
    * category: needs to be a string, received ${product.category}
    * stock: needs to be a Number, received ${product.stock}
    * thumbnail: needs to be a string, received ${product.thumbnail}
    `
}

export const generateUserErrorInfo = (user) => {
    return `One or more properties were imcomplete or not valid.
    List of required properties:
    * first_name: needs to be a string, received ${user.name}
    * last_name: needs to be a string, received ${user.last_name}
    * age: needs to be a number, received ${user.age}
    * phone: needs to be a number, received ${user.phone}
    * email: needs to be a string, received ${user.email}
    * password: needs to be a string, received ${user.password}
    `
}

export const generateUserErrorExist = (user) => {
    return `Email ${user.email} is already registered.`
}

export const generateUserErrorNotExist = (user) => {
    return `Email ${user.email} is not registered.`
}

export const generateUserErrorPassword = (user) => {
    return `The password ${user.password} is incorrect.`
}