import { DTOs } from "../dao/DTOs/users.dto.js";
import {
    deleteAllUsersService,
    deleteOneUserService,
    getUserByIdService,
    getUsersService,
    uploaderDocumentsService,
    userToPremiumService
} from "../services/users.services.js"
import { CantDeleteUser, CantSwitchRoles, DocumentsComplete, MissingDocuments, UserNotFound } from "../utils/custom-exceptions.js";

const getUser = async (req, res) => {
    try {
        const users = await getUsersService();
        const userDTO = []
        for (const user of users) {
            const users = new DTOs.GetUsersDTO(user);
            userDTO.push(users);
        }
        res.render('viewUsers', {user: userDTO});
    } catch (error) {
        res.sendServerError(error.message);
    }
}

const deleteUsers = async (req, res) => {
    try {
        const users = await getUsersService();
        const result = await deleteAllUsersService(users)
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof CantDeleteUser) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const deleteOneUser = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await getUserByIdService(uid);
        const result = await deleteOneUserService(uid, user)
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantDeleteUser) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const userToPremium = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await getUserByIdService(uid);
        const result = await userToPremiumService(user)
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof UserNotFound) {
            return res.sendClientError(error.message);
        }
        if (error instanceof CantSwitchRoles) {
            return res.sendClientError(error.message);
        }
        if (error instanceof MissingDocuments) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const uploaderDocuments = async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await getUserByIdService(uid)
        const files = req.files
        const result = await uploaderDocumentsService(files, user)
        res.sendSuccess(result)
    } catch (error) {
        if (error instanceof DocumentsComplete) {
            return res.sendClientError(error.message);
        }
        res.sendServerError(error.message);
    }
}

const getViewProfile = async (req, res) => {
    try {
        res.render("viewProfile", {user: req.user})
    } catch (error) {
        res.sendServerError(error.message);
    }
}

export {
    getUser,
    deleteUsers,
    deleteOneUser,
    userToPremium,
    uploaderDocuments,
    getViewProfile
}