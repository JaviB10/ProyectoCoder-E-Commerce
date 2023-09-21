import { deleteUserNotification } from "../utils/custom-html.js";
import UsersRepository from "../repositories/users.repository.js";
import { sendEmail } from "./email.services.js";
import { CantDeleteUser, CantSwitchRoles, DocumentsComplete, MissingDocuments, UserAlreadyExists, UserNotFound } from "../utils/custom-exceptions.js";
import CartsRepository from "../repositories/carts.repository.js";

const usersRepository = new UsersRepository();
const cartsRepository = new CartsRepository();

const getUsersService = async () => {
    const users = await usersRepository.getUsersRepository();
    return users
}

const getUserByIdService = async (uid) => {
    const user = await usersRepository.getUserByIdRepository(uid);
    if (!user) {
        throw new UserNotFound('User not found');
    }
    return user;
}

const getUserByEmailService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    return user;
}

const getUserByEmailLoginService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    if (!user) {
        throw new UserNotFound('User not found');
    }
    return user;
}

const getUserByEmailRegisterService = async (email) => {
    const user = await usersRepository.getUserByEmailRepository(email);
    if (user) {
        throw new UserAlreadyExists('User already exists');
    }
    return user;
}

const userToPremiumService = async (user) => {
    const newUser = user
    if (user.role === 'ADMIN') {
        throw new CantSwitchRoles('The user has a role as ADMIN')
    } 
    const requiredDocuments = ["idCard", "address", "accountStatus"];
    let areRequiredDocumentsUploaded 
    if (!user.documents) {
        areRequiredDocumentsUploaded = false; // El usuario no tiene ningún documento cargado
    } else {
        const userDocuments = user.documents.map(document => document.name);
        areRequiredDocumentsUploaded = requiredDocuments.every(document => userDocuments.includes(document));
    }
    if (!areRequiredDocumentsUploaded) {
        throw new MissingDocuments('The user has not uploaded all required documents');
    }
    newUser.role = user.role === "USER" ? "PREMIUM" : "USER"
    
    const result = await usersRepository.updateUserRepository(user._id, newUser);
    return result;
}

const updateUserService = async (cid, product) => {
    const result = await usersRepository.updateUserRepository(cid, product);
    return result;
}

const deleteOneUserService = async (uid, user) => {
    await cartsRepository.deleteOneCartRepository(user.cart._id)
    const result = await usersRepository.deleteUserRepository(uid)
    return result
}

const deleteAllUsersService = async (users) => {
    const currentDate = new Date();
    const millisecondsInADay = 24 * 60 * 60 * 1000; // Milisegundos en un día
    const days = 2; // Cambia esto según la cantidad de días que desees

    const inactivePeriodInMilliseconds = days * millisecondsInADay;

    for (const user of users) {

        if (user.role === 'ADMIN') {
            throw new CantDeleteUser('The user has a role as ADMIN')
        }

        const difference = currentDate - user.last_connection;
        // Comprobar si han pasado al menos 2 días desde la fecha actual
        const isInactiveForTwoDays = difference >= inactivePeriodInMilliseconds;
    
        if (!isInactiveForTwoDays) {
            throw new CantDeleteUser('The user hasnt been without connection for 2 days')
        }
        
        const email = {
            to: user.email,
            subject: 'Your account was delete',
            html: deleteUserNotification(user)
        }
        
        await sendEmail(email)
        const result = await usersRepository.deleteUserRepository(user._id)
        return result
    }
}

const uploaderDocumentsService = async (files, user) => {
    const newDocument = []
    const currentUserDocuments = user.documents.map(document => document.name);

    for (const fieldName in files) {
        if (fieldName) {
            const filesArray = files[fieldName];
            filesArray.forEach(file => {
                
                const fieldname = file.fieldname;
                const filename = file.filename;
            
                let name;
                if (fieldname === "profile") {
                    name = "profile";
                } else if (fieldname === "product") {
                    name = "product";
                } else if (fieldname === "idCard") {
                    name = "idCard";
                } else if (fieldname === "address") {
                    name = "address";
                } else if (fieldname === "accountStatus") {
                    name = "accountStatus";
                }
                
                let document = {
                    name: name,
                    reference: `http://localhost:8081/files/${name}/${filename}`
                };
                // Verificar si el usuario ya tiene este tipo de documento
                if (!currentUserDocuments.includes(name)) {
                    newDocument.push(document);
                }
                
            });
        }
    }
    if (newDocument.length === 0) {
        throw new DocumentsComplete('The user has successfully uploaded all the required documents')
    }
    const result = await usersRepository.updateUserRepository(user._id, {
        $addToSet: { documents: { $each: newDocument } }
    })
    return result
}

export {

    getUsersService,
    getUserByIdService,
    getUserByEmailService,
    getUserByEmailLoginService,
    getUserByEmailRegisterService,
    userToPremiumService,
    updateUserService,
    deleteOneUserService,
    deleteAllUsersService,
    uploaderDocumentsService
}