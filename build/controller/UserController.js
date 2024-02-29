"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const auth_1 = require("firebase-admin/auth");
const DatabaseHelper_1 = require("../configs/database/DatabaseHelper");
const Translator_1 = require("../languages/Translator");
const ApiError_1 = require("../utils/api/ApiError");
const AuthUtils_1 = require("../utils/auth/AuthUtils");
const Role_1 = require("../utils/auth/Role");
const Constansts_1 = require("../utils/Constansts");
const Utils_1 = require("../utils/Utils");
/**
 * Clase controladora de los usuarios.
 */
class UserController {
    /**
     * Método que permite buscar un banco en función del rol del usuario
     * para crear un administrador.
     * @param clientUserRole Rol del usuario que quiere buscar el banco.
     * @param bankId Identificador del banco a buscar.
     * @param clientUserId Identificador del usuario que quiere buscar el banco.
     */
    static foundBankForModifications({ clientUserRole, clientUserId, bankId }) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let foundBank = null;
            if (clientUserRole == Role_1.Role.BANKER_USER) {
                foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId,
                        owner_id: clientUserId
                    }
                });
            }
            else if (clientUserRole == Role_1.Role.SUPER_USER) {
                foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId
                    }
                });
            }
            return foundBank;
        });
    }
    /**
     * Método que permite actualizar la información de un usuario.
     * @param request
     * @param response
     * @param next
     */
    static updateUserMiddleware(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            try {
                const email = request.body['email'].toLowerCase();
                const phone = request.body['phone'];
                const userToUpdateId = Number.parseInt(request.body['user_to_update_id']);
                yield prismaManager.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                    const foundUser = yield tx.user.findFirst({
                        where: {
                            id: userToUpdateId
                        }
                    });
                    if (foundUser) {
                        const updatedLocalUser = yield tx.user.update({
                            where: {
                                id: userToUpdateId
                            },
                            data: {
                                email: email,
                                phone: phone
                            }
                        });
                        const updateUserRequest = {
                            email: email,
                            phoneNumber: phone
                        };
                        yield (0, auth_1.getAuth)().updateUser(updatedLocalUser.uid, updateUserRequest);
                        response.status(statusCode).send();
                    }
                    else {
                        statusCode = 404;
                        response.status(statusCode).send(new ApiError_1.ApiError({
                            clientErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_FOUND, { language: clientLanguage })
                        }));
                    }
                }), { timeout: Constansts_1.Constants.TRANSACTION_TIMEOUT });
            }
            catch (error) {
                if (error.code == 'auth/invalid-phone-number') {
                    statusCode = 400;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage })
                    }));
                }
                else if (error.code == 'auth/email-already-exists') {
                    statusCode = 409;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage })
                    }));
                }
                else if (error.code == 'auth/phone-number-already-exists') {
                    statusCode = 409;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage })
                    }));
                }
                else if (error.code === 'P2002') {
                    statusCode = 409;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_USER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_USER, { language: clientLanguage }),
                    }));
                }
                else {
                    next(error);
                }
            }
        });
    }
    /**
     * Método que devuelve el resultado satisfactorio de la creación de un banquero.
     * @param request
     * @param response
     * @param next
     */
    static createBanker(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseObject = {
                'id': request.createdUserId
            };
            response.status(201).send(responseObject);
        });
    }
    /**
     * Método que permite crear las relaciones necesarias de un vendedor.
     * @param request
     * @param response
     * @param next
     */
    static createSeller(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 201;
            const bankId = request.body['bank_id'];
            try {
                const foundBank = yield UserController.foundBankForModifications({ clientUserRole: request.clientUserRole, clientUserId: request.clientUserId, bankId: bankId });
                if (foundBank) {
                    yield prismaManager.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        yield tx.seller.create({
                            data: {
                                user_id: request.createdUserId
                            }
                        });
                        yield tx.bank_seller.create({
                            data: {
                                bank_id: bankId,
                                seller_id: request.createdUserId
                            }
                        });
                    }));
                    const responseObject = {
                        'id': request.createdUserId
                    };
                    response.status(statusCode).send(responseObject);
                }
                else {
                    yield (0, auth_1.getAuth)().deleteUser(request.createdUserUid);
                    yield prismaManager.user.delete({
                        where: {
                            id: request.createdUserId
                        }
                    });
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                }
            }
            catch (error) {
                yield (0, auth_1.getAuth)().deleteUser(request.createdUserUid);
                yield prismaManager.user.delete({
                    where: {
                        id: request.createdUserId
                    }
                });
                next(error);
            }
        });
    }
    /**
     * Método que permite la creación de un administrador de un banco.
     * @param request
     * @param response
     * @param next
     */
    static createManager(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 201;
            const bankId = request.body['bank_id'];
            try {
                const foundBank = yield UserController.foundBankForModifications({ clientUserRole: request.clientUserRole, clientUserId: request.clientUserId, bankId: bankId });
                if (foundBank) {
                    yield prismaManager.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                        yield tx.manager.create({
                            data: {
                                user_id: request.createdUserId
                            }
                        });
                        yield tx.bank_manager.create({
                            data: {
                                bank_id: bankId,
                                manager_id: request.createdUserId
                            }
                        });
                    }));
                    const responseObject = {
                        'id': request.createdUserId
                    };
                    response.status(statusCode).send(responseObject);
                }
                else {
                    yield (0, auth_1.getAuth)().deleteUser(request.createdUserUid);
                    yield prismaManager.user.delete({
                        where: {
                            id: request.createdUserId
                        }
                    });
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                }
            }
            catch (error) {
                yield (0, auth_1.getAuth)().deleteUser(request.createdUserUid);
                yield prismaManager.user.delete({
                    where: {
                        id: request.createdUserId
                    }
                });
                next(error);
            }
        });
    }
    /**
     * Método que permite validar si se puede actualizar un manager.
     * @param request
     * @param response
     * @param next
     */
    static updateManagerValidator(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const userToUpdateId = Number.parseInt(request.body['user_to_update_id']);
            const bankId = Number.parseInt(request.body['bank_id']);
            const foundBank = yield UserController.foundBankForModifications({ bankId: bankId, clientUserId: request.clientUserId, clientUserRole: request.clientUserRole });
            if (foundBank) {
                const bankManagerRelation = yield prismaManager.bank_manager.findFirst({
                    where: {
                        bank_id: bankId,
                        manager_id: userToUpdateId
                    }
                });
                if (bankManagerRelation) {
                    next();
                }
                else {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                    }));
                }
            }
            else {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
            }
        });
    }
    /**
     * Método que permite validar si se puede actualizar un vendedor.
     * @param request
     * @param response
     * @param next
     */
    static updateSellerValidator(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const userToUpdateId = Number.parseInt(request.body['user_to_update_id']);
            const bankId = Number.parseInt(request.body['bank_id']);
            const foundBank = yield UserController.foundBankForModifications({ bankId: bankId, clientUserId: request.clientUserId, clientUserRole: request.clientUserRole });
            if (foundBank) {
                const bankSellerRelation = yield prismaManager.bank_seller.findFirst({
                    where: {
                        bank_id: bankId,
                        seller_id: userToUpdateId
                    }
                });
                if (bankSellerRelation) {
                    next();
                }
                else {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                    }));
                }
            }
            else {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
            }
        });
    }
    /**
     * Método que permite la obtención de los banqueros.
     * @param request
     * @param response
     * @param next
     */
    static getBankers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query['page_number']);
            const elementsPerPage = Number.parseInt(request.query['elements_per_page']);
            let bankers;
            if (elementsPerPage) {
                const elementsToSkip = pageNumber * elementsPerPage;
                bankers = yield prismaManager.user.findMany({
                    where: {
                        role_id: Role_1.Role.BANKER_USER
                    },
                    orderBy: {
                        email: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                });
            }
            else {
                bankers = yield prismaManager.user.findMany({
                    where: {
                        role_id: Role_1.Role.BANKER_USER
                    },
                    orderBy: {
                        email: 'asc'
                    }
                });
            }
            const bankersCountResult = yield prismaManager.user.aggregate({
                where: {
                    role_id: Role_1.Role.BANKER_USER
                },
                _count: {
                    id: true
                }
            });
            responseObject = {
                'bankers': bankers,
                'bankers_count': bankersCountResult._count.id
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
     * Método para devolver los permisos de un usuario en especifico.
     * @param request
     * @param response
     * @param next
     */
    static getUserPermissions(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            let responseObject = null;
            const user_permissions = yield prismaManager.role_permission.findMany({
                where: {
                    role_id: request.clientUserRole
                },
                select: {
                    permission_id: true,
                }
            });
            responseObject = {
                'user_permissions': user_permissions
            };
            response.status(statusCode).send(responseObject);
        });
    }
}
exports.UserController = UserController;
_a = UserController;
/**
 * Método que permite crear un usuario.
 * @param role Rol del usuario a crear.
 * @returns
 */
UserController.createUserMiddleware = (role) => {
    return (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
        let translator = Translator_1.Translator.getInstance();
        let clientLanguage = Utils_1.Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode = 201;
        try {
            const email = request.body['email'].toLowerCase();
            const phone = request.body['phone'];
            const password = request.body['password'];
            const createUserRequest = {
                email: email,
                password: password,
                phoneNumber: phone
            };
            const createdUser = yield (0, auth_1.getAuth)().createUser(createUserRequest);
            request.createdUserUid = createdUser.uid;
            const localCreatedUser = yield prismaManager.user.create({
                data: {
                    uid: createdUser.uid,
                    role_id: role,
                    email: email,
                    phone: phone
                }
            });
            request.createdUserId = localCreatedUser.id;
            yield AuthUtils_1.AuthUtils.setUserRole({ role: role, uid: createdUser.uid, id: localCreatedUser.id });
            next();
        }
        catch (error) {
            if (request.createdUserUid) {
                yield (0, auth_1.getAuth)().deleteUser(request.createdUserUid);
            }
            if (error.code == 'auth/invalid-phone-number') {
                statusCode = 400;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage })
                }));
            }
            else if (error.code == 'auth/invalid-password') {
                statusCode = 400;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.INVALID_PASSWORD, { language: clientLanguage }),
                    debugErrorMessage: error.message
                }));
            }
            else if (error.code == 'auth/email-already-exists') {
                statusCode = 409;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage })
                }));
            }
            else if (error.code == 'auth/phone-number-already-exists') {
                statusCode = 409;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage })
                }));
            }
            else {
                next(error);
            }
        }
    });
};
//# sourceMappingURL=UserController.js.map