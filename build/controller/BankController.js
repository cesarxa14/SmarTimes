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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankController = void 0;
const DatabaseHelper_1 = require("../configs/database/DatabaseHelper");
const Translator_1 = require("../languages/Translator");
const ApiError_1 = require("../utils/api/ApiError");
const Role_1 = require("../utils/auth/Role");
const Utils_1 = require("../utils/Utils");
const BankRepository_1 = require("../repository/BankRepository");
const client_1 = require("@prisma/client");
/**
 * Clase controladora de los bancos.
 */
class BankController {
    /**
     * Método que devuelve los bancos asociados a un super usuario o a un banquero.
     * @param request
     * @param response
     * @param next
     */
    static getBanks(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query['page_number']);
            const elementsPerPage = Number.parseInt(request.query['elements_per_page']);
            const elementsToSkip = pageNumber * elementsPerPage;
            let banks = null;
            let bankCount = null;
            if (request.clientUserRole === Role_1.Role.SUPER_USER) {
                banks = yield prismaManager.bank.findMany({
                    include: {
                        bank_seller: {
                            select: {
                                seller: {
                                    select: {
                                        user: true
                                    }
                                }
                            }
                        },
                        bank_manager: {
                            select: {
                                manager: {
                                    select: {
                                        user: true,
                                        seller_manager: true
                                    }
                                }
                            }
                        },
                        owner: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage,
                    orderBy: {
                        name: 'asc'
                    }
                });
                const bankCountResult = yield prismaManager.bank.aggregate({
                    _count: {
                        id: true
                    }
                });
                bankCount = bankCountResult._count.id;
            }
            else if (request.clientUserRole === Role_1.Role.BANKER_USER) {
                banks = yield prismaManager.bank.findMany({
                    where: {
                        owner_id: request.clientUserId,
                        available: true
                    },
                    include: {
                        bank_seller: {
                            select: {
                                seller: {
                                    select: {
                                        user: true
                                    }
                                }
                            }
                        },
                        bank_manager: {
                            select: {
                                manager: {
                                    select: {
                                        user: true,
                                        seller_manager: true
                                    }
                                }
                            }
                        },
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage,
                    orderBy: {
                        name: 'asc'
                    }
                });
                const bankCountResult = yield prismaManager.bank.aggregate({
                    where: {
                        owner_id: request.clientUserId,
                        available: true
                    },
                    _count: {
                        id: true
                    }
                });
                bankCount = bankCountResult._count.id;
            }
            else if (request.clientUserRole === Role_1.Role.SELLER_USER) {
                banks = yield prismaManager.bank.findMany({
                    where: {
                        available: true,
                        bank_seller: {
                            some: {
                                seller_id: request.clientUserId
                            }
                        }
                    },
                    include: {
                        bank_seller: {
                            select: {
                                seller: {
                                    select: {
                                        user: true
                                    }
                                }
                            }
                        },
                        bank_manager: {
                            select: {
                                manager: {
                                    select: {
                                        user: true,
                                        seller_manager: true
                                    }
                                }
                            }
                        },
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage,
                    orderBy: {
                        name: 'asc'
                    }
                });
                const bankCountResult = yield prismaManager.bank.aggregate({
                    where: {
                        available: true,
                        bank_seller: {
                            some: {
                                seller_id: request.clientUserId
                            }
                        }
                    },
                    _count: {
                        id: true
                    }
                });
                bankCount = bankCountResult._count.id;
            }
            responseObject = {
                'banks': banks,
                'bank_count': bankCount
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
     * Método que permite la creación de un banco.
     * @param request
     * @param response
     * @param next
     */
    static createBank(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 201;
            const email = request.body['email'];
            const phone = request.body['phone'];
            const name = request.body['name'];
            const owner_id = Number.parseInt(request.body['owner_id']);
            try {
                const bankerFound = yield prismaManager.user.findFirst({
                    where: {
                        id: owner_id,
                        role_id: Role_1.Role.BANKER_USER
                    }
                });
                if (bankerFound) {
                    const createdBank = yield prismaManager.bank.create({
                        data: {
                            name: name,
                            email: email,
                            phone: phone,
                            owner_id: owner_id
                        }
                    });
                    const responseObject = {
                        'id': createdBank.id
                    };
                    response.status(statusCode).send(responseObject);
                }
                else {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_FOUND, { language: clientLanguage })
                    }));
                }
            }
            catch (error) {
                if (error.code == 'P2002') {
                    statusCode = 409;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_BANK_NAME, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_BANK_NAME, { language: clientLanguage })
                    }));
                }
                else {
                    next(error);
                }
            }
        });
    }
    /**
     * Método que permite la edición de un banco.
     * @param request
     * @param response
     * @param next
     */
    static updateBank(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const email = request.body['email'];
            const phone = request.body['phone'];
            const name = request.body['name'];
            try {
                if (request.clientUserRole === Role_1.Role.SUPER_USER) {
                    const validationBank = yield prismaManager.bank.findFirst({
                        where: {
                            id: bankId
                        }
                    });
                    if (validationBank) {
                        yield prismaManager.bank.update({
                            where: {
                                id: bankId
                            },
                            data: {
                                email: email,
                                phone: phone,
                                name: name
                            }
                        });
                        response.status(statusCode).send();
                    }
                    else {
                        statusCode = 404;
                        response.status(statusCode).send(new ApiError_1.ApiError({
                            clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                        }));
                    }
                }
                else if (request.clientUserRole === Role_1.Role.BANKER_USER) {
                    const validationBank = yield prismaManager.bank.findFirst({
                        where: {
                            id: bankId,
                            owner_id: request.clientUserId
                        }
                    });
                    if (validationBank) {
                        yield prismaManager.bank.update({
                            where: {
                                id: bankId
                            },
                            data: {
                                email: email,
                                phone: phone,
                                name: name
                            }
                        });
                        response.status(statusCode).send();
                    }
                    else {
                        statusCode = 404;
                        response.status(statusCode).send(new ApiError_1.ApiError({
                            clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                        }));
                    }
                }
                else {
                    throw new Error(translator.getTranslation(Translator_1.Translator.UNEXPECTED_ERROR, { language: clientLanguage }));
                }
            }
            catch (error) {
                if (error.code == 'P2002') {
                    statusCode = 409;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_BANK_NAME, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.DUPLICATED_BANK_NAME, { language: clientLanguage })
                    }));
                }
                else {
                    next(error);
                }
            }
        });
    }
    /**
     * Método que permite editar el propietario de un banco.
     * @param request
     * @param response
     * @param next
     */
    static updateBankOwner(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const newOwnerId = Number.parseInt(request.body['new_owner_id']);
            const foundBank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId
                }
            });
            if (foundBank) {
                const foundOwner = yield prismaManager.user.findFirst({
                    where: {
                        id: newOwnerId,
                        role_id: Role_1.Role.BANKER_USER
                    }
                });
                if (foundOwner) {
                    yield prismaManager.bank.update({
                        where: {
                            id: bankId
                        },
                        data: {
                            owner_id: newOwnerId
                        }
                    });
                    response.status(statusCode).send();
                }
                else {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.NEW_BANKER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.NEW_BANKER_NOT_FOUND, { language: clientLanguage })
                    }));
                }
            }
            else {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                }));
            }
        });
    }
    /**
     * Método que permite modificar la disponibilidad de un banco.
     * @param request
     * @param response
     * @param next
     */
    static changeBankAvailability(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const newBankAvailability = request.body['new_bank_availability'];
            const foundBank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId
                }
            });
            if (foundBank) {
                yield prismaManager.bank.update({
                    where: {
                        id: bankId
                    },
                    data: {
                        available: newBankAvailability
                    }
                });
                response.status(statusCode).send();
            }
            else {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                }));
            }
        });
    }
    /**
     * Método que permite eliminar un administrador de banco.
     * @param request
     * @param response
     * @param next
     */
    static deleteBankAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const adminId = Number.parseInt(request.body['manager_id']);
            const bankerId = Number.parseInt(request.clientUserId + '');
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Desvincular a todos sus vendedores en la base de datos
                const removeds = yield prismaManager.seller_manager.deleteMany({
                    where: {
                        manager_id: adminId,
                        bank_id: bankId
                    }
                });
                // Eliminar al administrador de la base de datos
                yield prismaManager.bank_manager.delete({
                    where: {
                        bank_id_manager_id: {
                            bank_id: bankId,
                            manager_id: adminId
                        }
                    }
                });
                response.status(200).json({
                    msg: "Deleted"
                });
                return;
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        AND: [
                            {
                                id: bankId,
                            },
                            {
                                owner_id: bankerId
                            }
                        ]
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Desvincular a todos sus vendedores en la base de datos
                const removeds = yield prismaManager.seller_manager.deleteMany({
                    where: {
                        bank_id: bankId,
                        manager_id: adminId
                    }
                });
                // Eliminar al administrador de la base de datos
                yield prismaManager.bank_manager.delete({
                    where: {
                        bank_id_manager_id: {
                            bank_id: bankId,
                            manager_id: adminId
                        }
                    }
                });
                response.status(200).json({
                    msg: "Deleted"
                });
                return;
            }
        });
    }
    /**
     * Método que permite eliminar un vendedor de un banco.
     * @param request
     * @param response
     * @param next
     */
    static deleteBankSeller(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const sellerId = Number.parseInt(request.body['seller_id']);
            const bankerId = Number.parseInt(request.clientUserId + '');
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el vendedor existe para ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Desvincular a todos sus vendedores en la base de datos
                const removeds = yield prismaManager.seller_manager.deleteMany({
                    where: {
                        seller_id: sellerId,
                        bank_id: bankId
                    }
                });
                // Eliminar al administrador de la base de datos
                yield prismaManager.bank_seller.delete({
                    where: {
                        bank_id_seller_id: {
                            seller_id: sellerId,
                            bank_id: bankId
                        }
                    }
                });
                response.status(200).json({
                    msg: "Deleted"
                });
                return;
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        AND: [
                            {
                                id: bankId,
                            },
                            {
                                owner_id: bankerId
                            }
                        ]
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el vendedor esta asociado a ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Desvincular a todos sus vendedores en la base de datos
                const removeds = yield prismaManager.seller_manager.deleteMany({
                    where: {
                        seller_id: sellerId,
                        bank_id: bankId
                    }
                });
                // Eliminar al administrador de la base de datos
                yield prismaManager.bank_seller.delete({
                    where: {
                        bank_id_seller_id: {
                            seller_id: sellerId,
                            bank_id: bankId
                        }
                    }
                });
                response.status(200).json({
                    msg: "Deleted"
                });
                return;
            }
        });
    }
    /**
     * Método que permite vincular un vendedor a un administrador de banco.
     * @param request
     * @param response
     * @param next
     */
    static linkBankSellerToAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const adminId = Number.parseInt(request.body['manager_id']);
            const sellerId = Number.parseInt(request.body['seller_id']);
            const bankerId = Number.parseInt(request.clientUserId + '');
            /**
             * Verificar que el banco exista
             * Verificar que el vendedor esté en el banco
             * Verificar que el administrador esté en el banco
             * Vincularlos
             */
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si existe el vendedor de ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Verificamos que no estén vinculados.
                const foundLink = yield prismaManager.seller_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (foundLink) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, { language: clientLanguage }),
                    }));
                    return;
                }
                // Vincularlos
                const created = yield prismaManager.seller_manager.create({
                    data: {
                        bank_id: bankId,
                        seller_id: sellerId,
                        manager_id: adminId
                    }
                });
                response.status(201).json({
                    created
                });
                return;
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        AND: [
                            {
                                id: bankId,
                                owner_id: bankerId
                            }
                        ]
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si existe el vendedor de ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Verificamos que no estén vinculados.
                const foundLink = yield prismaManager.seller_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (foundLink) {
                    statusCode = 400;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, { language: clientLanguage }),
                    }));
                    return;
                }
                // Vincularlos
                const created = yield prismaManager.seller_manager.create({
                    data: {
                        bank_id: bankId,
                        seller_id: sellerId,
                        manager_id: adminId
                    }
                });
                response.status(201).json({
                    created
                });
                return;
            }
        });
    }
    /**
     * Método que permite desvincular un vendedor a un administrador de banco.
     * @param request
     * @param response
     * @param next
     */
    static unlinkBankSellerToAdmin(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const adminId = Number.parseInt(request.body['manager_id']);
            const sellerId = Number.parseInt(request.body['seller_id']);
            const bankerId = Number.parseInt(request.clientUserId + '');
            /**
             * Verificar que el banco exista
             * Verificar que el vendedor esté en el banco
             * Verificar que el administrador esté en el banco
             * Vincularlos
             */
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si existe el vendedor de ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Verificamos que no estén vinculados.
                const foundLink = yield prismaManager.seller_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundLink) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_NOT_LINKED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_NOT_LINKED, { language: clientLanguage }),
                    }));
                    return;
                }
                // DesVincularlos
                const deleted = yield prismaManager.seller_manager.delete({
                    where: {
                        seller_id_manager_id_bank_id: {
                            bank_id: bankId,
                            seller_id: sellerId,
                            manager_id: adminId
                        }
                    }
                });
                response.status(201).json({
                    deleted
                });
                return;
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                // Buscar si el banco existe
                const foundBank = yield prismaManager.bank.findFirst({
                    where: {
                        AND: [
                            {
                                id: bankId,
                                owner_id: bankerId
                            }
                        ]
                    }
                });
                if (!foundBank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si el administrador existe como admin de ese banco
                const foundAdmin = yield prismaManager.bank_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundAdmin) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_ADMIN_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Buscar si existe el vendedor de ese banco
                const foundSeller = yield prismaManager.bank_seller.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            }
                        ]
                    }
                });
                if (!foundSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    }));
                    return;
                }
                // Verificamos que no estén vinculados.
                const foundLink = yield prismaManager.seller_manager.findFirst({
                    where: {
                        AND: [
                            {
                                bank_id: bankId
                            },
                            {
                                seller_id: sellerId
                            },
                            {
                                manager_id: adminId
                            }
                        ]
                    }
                });
                if (!foundLink) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_NOT_LINKED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_ADMIN_NOT_LINKED, { language: clientLanguage }),
                    }));
                    return;
                }
                // DesVincularlos
                const deleted = yield prismaManager.seller_manager.delete({
                    where: {
                        seller_id_manager_id_bank_id: {
                            bank_id: bankId,
                            seller_id: sellerId,
                            manager_id: adminId
                        }
                    }
                });
                response.status(201).json({
                    deleted
                });
                return;
            }
        });
    }
    /**
     * Método que permite obtener los datos de los vendedores asociados a un banco.
     * @param request
     * @param response
     * @param next
     */
    static getBankSellers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const bankerId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query.page_number);
            const elementsPerPage = Number.parseInt(request.query.elements_per_page);
            const bankId = Number.parseInt(request.query.bank_id);
            // Comprobar que el usuario tiene acceso al banco
            // Revisamos que el usuario tenga permiso para crear loterías en el banco
            const bank = yield prismaManager.bank.findUnique({
                where: {
                    id: bankId
                }
            });
            // Revisamos que el banco exista
            if (!bank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
            }
            // Revisamos que el usuario tenga permiso para crear loterías en el banco en caso de ser super usuario.
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                if (bank.owner_id != bankerId) {
                    statusCode = 403;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else {
                statusCode = 403;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                }));
                return;
            }
            let sellers;
            if (elementsPerPage) {
                const elementsToSkip = pageNumber * elementsPerPage;
                sellers = yield prismaManager.bank_seller.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    include: {
                        seller: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        seller_id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                });
            }
            else {
                sellers = yield prismaManager.bank_seller.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    include: {
                        seller: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        seller_id: 'asc'
                    }
                });
            }
            const sellersCountResult = yield prismaManager.bank_seller.aggregate({
                where: {
                    bank_id: bankId,
                },
                _count: {
                    seller_id: true
                },
            });
            responseObject = {
                'sellers': sellers,
                'sellers_count': sellersCountResult._count.seller_id
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
    * Método que permite obtener los datos de los vendedores asociados a un banco.
    * @param request
    * @param response
    * @param next
    */
    static getBankManagers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const bankerId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query.page_number);
            const elementsPerPage = Number.parseInt(request.query.elements_per_page);
            const bankId = Number.parseInt(request.query.bank_id);
            // Comprobar que el usuario tiene acceso al banco
            // Revisamos que el usuario tenga permiso para crear loterías en el banco
            const bank = yield prismaManager.bank.findUnique({
                where: {
                    id: bankId
                }
            });
            // Revisamos que el banco exista
            if (!bank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
            }
            // Revisamos que el usuario tenga permiso para crear loterías en el banco en caso de ser super usuario.
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                if (bank.owner_id != bankerId) {
                    statusCode = 403;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else {
                statusCode = 403;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                }));
                return;
            }
            let managers;
            if (elementsPerPage) {
                const elementsToSkip = pageNumber * elementsPerPage;
                managers = yield prismaManager.bank_manager.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    include: {
                        manager: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        manager_id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                });
            }
            else {
                managers = yield prismaManager.bank_manager.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    include: {
                        manager: {
                            include: {
                                user: true
                            }
                        }
                    },
                    orderBy: {
                        manager_id: 'asc'
                    }
                });
            }
            const sellersCountResult = yield prismaManager.bank_manager.aggregate({
                where: {
                    bank_id: bankId,
                },
                _count: {
                    manager_id: true
                },
            });
            responseObject = {
                'managers': managers,
                'managers_count': sellersCountResult._count.manager_id
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
    * Método que permite obtener los datos de los vendedores asociados a un banco.
    * @param request
    * @param response
    * @param next
    */
    static getBankLotteries(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const bankerId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query.page_number);
            const elementsPerPage = Number.parseInt(request.query.elements_per_page);
            const bankId = Number.parseInt(request.query.bank_id);
            // Comprobar que el usuario tiene acceso al banco
            // Revisamos que el usuario tenga permiso para crear loterías en el banco
            const bank = yield prismaManager.bank.findUnique({
                where: {
                    id: bankId
                }
            });
            // Revisamos que el banco exista
            if (!bank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
            }
            // Revisamos que el usuario tenga permiso para crear loterías en el banco en caso de ser super usuario.
            if (request.clientUserRole == Role_1.Role.SUPER_USER) {
            }
            else if (request.clientUserRole == Role_1.Role.BANKER_USER) {
                if (bank.owner_id != bankerId) {
                    statusCode = 403;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANKER_NOT_ALLOWED, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else {
                statusCode = 403;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                }));
                return;
            }
            let lotteries;
            if (elementsPerPage) {
                const elementsToSkip = pageNumber * elementsPerPage;
                lotteries = yield prismaManager.lottery.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                });
            }
            else {
                lotteries = yield prismaManager.lottery.findMany({
                    where: {
                        bank_id: bankId,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                });
            }
            const sellersCountResult = yield prismaManager.lottery.aggregate({
                where: {
                    bank_id: bankId,
                },
                _count: {
                    id: true
                },
            });
            responseObject = {
                'lotteries': lotteries,
                'lotteries_count': sellersCountResult._count.id
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
    * Método que permite parametrizar los vendedores de una lotería.
    * @param request
    * @param response
    * @param next
    */
    static parametrizeSellers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const lotteries = request.body['lotteries'];
            const sellers = request.body['sellers'];
            const commission = request.body['commission'];
            const bankerId = Number.parseInt(request.clientUserId + '');
            /**
             * Verificar que el banco exista
             * Verificar que el vendedor esté en el banco
             * Verificar que el administrador esté en el banco
             * Vincularlos
             */
            // Verificar que el banco exista
            const foundBank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId
                }
            });
            if (!foundBank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            if (!BankRepository_1.BankRepository.isAllowedToEditThisBank(foundBank, request.clientUserRole, bankerId)) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificar que los vendedores y lotteries pertenezcan al banco [1,2,3]
            const foundLotteries = yield prismaManager.lottery.findMany({
                where: {
                    id: {
                        in: lotteries
                    },
                    bank_id: bankId
                }
            });
            if (foundLotteries.length != lotteries.length) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificar que la lista de vendedores pertenezca al banco
            const foundSellers = yield prismaManager.bank_seller.findMany({
                where: {
                    seller_id: {
                        in: sellers
                    },
                    bank_id: bankId
                }
            });
            if (foundSellers.length != sellers.length) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                }));
                return;
            }
            // Insertar o Actualizar los registros en la tabla de las comisiones
            let createdOrUpdated = [];
            for (let i = 0; i < sellers.length; i++) {
                for (let j = 0; j < lotteries.length; j++) {
                    const createdOrUpdt = yield prismaManager.seller_commision.upsert({
                        where: {
                            seller_id_lottery_id: {
                                seller_id: sellers[i],
                                lottery_id: lotteries[j]
                            }
                        },
                        create: {
                            seller_id: sellers[i],
                            lottery_id: lotteries[j],
                            commission: parseFloat(commission)
                        },
                        update: {
                            seller_id: sellers[i],
                            lottery_id: lotteries[j],
                            commission: parseFloat(commission)
                        }
                    });
                    createdOrUpdated.push(createdOrUpdt);
                }
            }
            response.status(statusCode).send(createdOrUpdated);
            return;
        });
    }
    /**
    * Método que permite parametrizar los vendedores de una lotería.
    * @param request
    * @param response
    * @param next
    */
    static parametrizeManagers(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            const bankId = Number.parseInt(request.body['bank_id']);
            const lotteries = request.body['lotteries'];
            const managers = request.body['managers'];
            const commission = request.body['commission'];
            const bankerId = Number.parseInt(request.clientUserId + '');
            /**
             * Verificar que el banco exista
             * Verificar que el vendedor esté en el banco
             * Verificar que el administrador esté en el banco
             * Vincularlos
             */
            // Verificar que el banco exista
            const foundBank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId
                }
            });
            if (!foundBank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            if (!BankRepository_1.BankRepository.isAllowedToEditThisBank(foundBank, request.clientUserRole, bankerId)) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificar que los managers y lotteries pertenezcan al banco [1,2,3]
            const foundLotteries = yield prismaManager.lottery.findMany({
                where: {
                    id: {
                        in: lotteries
                    },
                    bank_id: bankId
                }
            });
            if (foundLotteries.length != lotteries.length) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificar que la lista de vendedores pertenezca al banco
            const foundSellers = yield prismaManager.bank_manager.findMany({
                where: {
                    manager_id: {
                        in: managers
                    },
                    bank_id: bankId
                }
            });
            if (foundSellers.length != managers.length) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                }));
                return;
            }
            // Insertar o Actualizar los registros en la tabla de las comisiones
            let createdOrUpdated = [];
            for (let i = 0; i < managers.length; i++) {
                for (let j = 0; j < lotteries.length; j++) {
                    const createdOrUpdt = yield prismaManager.manager_commission.upsert({
                        where: {
                            manager_id_lottery_id: {
                                manager_id: managers[i],
                                lottery_id: lotteries[j]
                            }
                        },
                        create: {
                            manager_id: managers[i],
                            lottery_id: lotteries[j],
                            commission: parseFloat(commission)
                        },
                        update: {
                            manager_id: managers[i],
                            lottery_id: lotteries[j],
                            commission: parseFloat(commission)
                        }
                    });
                    createdOrUpdated.push(createdOrUpdt);
                }
            }
            response.status(statusCode).send(createdOrUpdated);
            return;
        });
    }
    /**
    * Método de operaciones de pago y cobro entre un banco y un vendedor..
    * @param request
    * @param response
    * @param next
    */
    static bankVendorPaymentOperations(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const responsibleId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            const bankId = Number.parseInt(request.body.bank_id);
            const operationTypeId = Number.parseInt(request.body.operation_type_id);
            const sellerId = Number.parseInt(request.body.seller_id);
            const userId = Number.parseInt(request.clientUserId + '');
            // Comprobar que el usuario tiene acceso al banco si es seller o manager
            const bank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId,
                }
            });
            if (!bank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificamos los permisos según los roles de usuario
            if (request.clientUserRole === Role_1.Role.SUPER_USER) {
                // Pasa sin problemas
            }
            else if (request.clientUserRole === Role_1.Role.BANKER_USER) {
                // Si el usuario es banquero, debe ser el dueño del banco
                const bank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId,
                        bank_seller: {
                            some: {
                                seller_id: sellerId
                            }
                        }
                    }
                });
                if (bank.owner_id !== userId) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else if (request.clientUserRole === Role_1.Role.MANAGER_USER) {
                // Que este asociado al banco al que hace la peticion
                const bankUser = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId,
                        bank_manager: {
                            some: {
                                manager_id: userId
                            }
                        },
                        seller_manager: {
                            some: {
                                seller_id: sellerId
                            }
                        }
                    }
                });
                if (!bankUser) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
            }
            // Buscamos al Seller para verificar que exista, su saldo y que pertenezca al banco
            const seller = yield prismaManager.seller.findFirst({
                where: {
                    user_id: sellerId,
                }
            });
            if (!seller) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Si la operacion es 1 -> pago 2 -> cobro
            if (operationTypeId == 1) {
                if (seller.balance < 0) {
                    // Se le paga al seller tanto balance como tenga hasta que se le ponga en 0
                    // Transaccion:
                    const [sellerUpdated, operation] = yield prismaManager.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                        // Actualizamos la lotería y la marcamos como pagada
                        const sellerUpdated = yield prisma.seller.update({
                            where: {
                                user_id: sellerId,
                            },
                            data: {
                                balance: 0,
                                debts: {
                                    decrement: seller.balance
                                }
                            }
                        });
                        const operation = yield prisma.operation.create({
                            data: {
                                bank_id: bankId,
                                seller_id: sellerId,
                                amount: seller.balance,
                                operation_type_id: operationTypeId,
                                responsible_id: responsibleId
                            }
                        });
                        return [sellerUpdated, operation];
                    }));
                }
            }
            else {
                if (seller.balance > 0) {
                    // El seller paga al banco tanto balance tenga hasta dejar la deuda en 0               
                    // Transaccion:
                    const [sellerUpdated, operation] = yield prismaManager.$transaction((prisma) => __awaiter(this, void 0, void 0, function* () {
                        // Actualizamos la lotería y la marcamos como pagada
                        const sellerUpdated = yield prisma.seller.update({
                            where: {
                                user_id: sellerId,
                            },
                            data: {
                                balance: 0,
                                debts: {
                                    decrement: seller.balance
                                }
                            }
                        });
                        const operation = yield prisma.operation.create({
                            data: {
                                bank_id: bankId,
                                seller_id: sellerId,
                                amount: seller.balance,
                                operation_type_id: operationTypeId,
                                responsible_id: responsibleId
                            }
                        });
                        return [sellerUpdated, operation];
                    }));
                }
            }
            responseObject = {
                'msg': 'Operación realizada con éxito'
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
    * Método que obtienes resumen de comisiones ganadas por los vendedores
    * @param request
    * @param response
    * @param next
    */
    static getSalesSummaryFromSeller(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            let bankId = Number.parseInt(request.query.bank_id);
            let sellerId = Number.parseInt(request.query.seller_id);
            const lotteryId = Number.parseInt(request.query.lottery_id);
            const initDate = (Utils_1.Utils.isValidDateFormat(request.query.init_date)) ? new Date(request.query.init_date) : null;
            const endDate = (Utils_1.Utils.isValidDateFormat(request.query.end_date)) ? new Date(request.query.end_date) : null;
            // Comprobar que el usuario tiene acceso al banco si es seller o manager
            const bank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId,
                }
            });
            if (!(Role_1.Role.SELLER_USER == request.clientUserRole)) {
                const bank = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId,
                    }
                });
                if (!bank) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }));
                    return;
                }
            }
            // Verificamos los permisos según los roles de usuario
            if (request.clientUserRole === Role_1.Role.SUPER_USER) {
                // Pasa sin problemas
            }
            else if (request.clientUserRole === Role_1.Role.BANKER_USER) {
                // Si el usuario es banquero, debe ser el dueño del banco
                if (bank.owner_id !== userId) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else if (request.clientUserRole === Role_1.Role.SELLER_USER) {
                // Que este asociado al banco al que hace la peticion
                sellerId = userId;
                const bankUser = yield prismaManager.bank.findFirst({
                    where: {
                        bank_seller: {
                            some: {
                                seller_id: userId
                            }
                        }
                    }
                });
                if (!bankUser) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
                bankId = bankUser.id;
            }
            // Consulta con condiciones dinámicas
            const result = yield prismaManager.$queryRaw(client_1.Prisma.sql `
        SELECT lottery."name","user".email,SUM(seller_billing_statement.commission) as commision, SUM(seller_billing_statement.prize_to_be_paid) as premio, SUM(seller_billing_statement.quantity_sold) as quantity_sold 
        FROM seller_billing_statement
        JOIN seller ON seller.user_id = seller_billing_statement.seller_id 
        JOIN "user" ON "user".id = seller.user_id
        JOIN billing_statement ON billing_statement.id = seller_billing_statement.billing_statement_id
        JOIN lottery_programming ON lottery_programming.id = billing_statement.lottery_programming_id
        JOIN lottery ON lottery.id = lottery_programming.lottery_id
        JOIN bank ON bank.id = lottery.bank_id
        ${bankId ? client_1.Prisma.sql `WHERE bank.id = ${bankId}` : client_1.Prisma.empty}
        ${sellerId ? client_1.Prisma.sql `AND seller.user_id = ${sellerId}` : client_1.Prisma.empty}
        ${lotteryId ? client_1.Prisma.sql `AND lottery.id = ${lotteryId}` : client_1.Prisma.empty}
        ${initDate ? client_1.Prisma.sql `AND billing_statement.billing_date >= ${initDate}` : client_1.Prisma.empty}
        ${endDate ? client_1.Prisma.sql `AND billing_statement.billing_date <= ${endDate}` : client_1.Prisma.empty}
        GROUP BY("user".email,lottery.name)`);
            responseObject = {
                result
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
    * Método que obtienes resumen de comisiones ganadas por los vendedores
    * @param request
    * @param response
    * @param next
    */
    static getSalesSummaryFromManger(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            let responseObject = null;
            const bankId = Number.parseInt(request.query.bank_id);
            const managerId = Number.parseInt(request.query.manager_id);
            const lotteryId = Number.parseInt(request.query.lottery_id);
            const initDate = (request.query.init_date) ? Utils_1.Utils.convertToUTC(request.query.init_date) : null;
            const endDate = (request.query.end_date) ? Utils_1.Utils.convertToUTC(request.query.end_date) : null;
            // Comprobar que el usuario tiene acceso al banco si es seller o manager
            const bank = yield prismaManager.bank.findFirst({
                where: {
                    id: bankId,
                }
            });
            if (!bank) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Verificamos los permisos según los roles de usuario
            if (request.clientUserRole === Role_1.Role.SUPER_USER) {
                // Pasa sin problemas
            }
            else if (request.clientUserRole === Role_1.Role.BANKER_USER) {
                // Si el usuario es banquero, debe ser el dueño del banco
                if (bank.owner_id !== userId) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
            }
            else if (request.clientUserRole === Role_1.Role.MANAGER_USER) {
                // Que este asociado al banco al que hace la peticion
                const bankUser = yield prismaManager.bank.findFirst({
                    where: {
                        id: bankId,
                        bank_seller: {
                            some: {
                                seller_id: userId
                            }
                        }
                    }
                });
                if (!bankUser) {
                    statusCode = 404;
                    response.status(statusCode).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage })
                    }));
                    return;
                }
            }
            // Consulta con condiciones dinámicas
            let managersWithCommisions = yield prismaManager.$queryRaw(client_1.Prisma.sql `
            SELECT * FROM bank_manager JOIN manager_commission ON manager_commission.manager_id = bank_manager.manager_id JOIN "user" ON "user".id = bank_manager.manager_id
        ${bankId ? client_1.Prisma.sql `WHERE bank_manager.bank_id = ${bankId}
        ${managerId ? client_1.Prisma.sql `AND bank_manager.manager_id = ${managerId}` : client_1.Prisma.empty}
        ${lotteryId ? client_1.Prisma.sql `AND manager_commission.lottery_id = ${lotteryId}` : client_1.Prisma.empty}` : client_1.Prisma.empty}
        `);
            // Consulto el resumen de ventas de los sellers
            const resumenDeVentas = yield prismaManager.seller_billing_statement.findMany({
                where: {
                    billing_statement: Object.assign(Object.assign({}, (initDate && endDate ? { billing_date: { gte: initDate, lte: endDate } } : {})), { lottery_programming: {
                            lottery_id: {
                                in: managersWithCommisions.map((manager) => manager.lottery_id)
                            },
                            lottery: {
                                bank: {
                                    seller_manager: {
                                        every: {
                                            manager_id: {
                                                in: managersWithCommisions.map((manager) => manager.manager_id)
                                            }
                                        }
                                    }
                                }
                            }
                        } })
                },
                include: {
                    billing_statement: {
                        include: {
                            lottery_programming: {
                                include: {
                                    lottery: {
                                        include: {
                                            manager_commission: true,
                                            bank: {
                                                include: {
                                                    seller_manager: true
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            });
            //Para cada manager creo un objeto con la comision de las ventas de su seller:
            let result = [];
            for (let i = 0; i < managersWithCommisions.length; i++) {
                // Creo el objeto vacio para cada uno y lo guardo en result, si ya existe el manager_id lo ignoro.
                if (!result.some((manager) => manager.manager.manager_id === managersWithCommisions[i].manager_id)) {
                    result.push({
                        manager: managersWithCommisions[i],
                        comision: 0
                    });
                }
            }
            // Recorro cada uno de los resumenes de venta
            for (let i = 0; i < resumenDeVentas.length; i++) {
                //Recorro cada uno de los seller manager
                for (let j = 0; j < resumenDeVentas[i].billing_statement.lottery_programming.lottery.bank.seller_manager.length; j++) {
                    // Recorro cada uno de los managers
                    for (let k = 0; k < result.length; k++) {
                        // Si el manager es igual al seller manager
                        if (result[k].manager.manager_id === resumenDeVentas[i].billing_statement.lottery_programming.lottery.bank.seller_manager[j].manager_id) {
                            // Aumento la comision
                            result[k].comision += resumenDeVentas[i].commission * (result[k].manager.commission / 100);
                        }
                    }
                }
            }
            let results = result.map((result) => {
                return {
                    email: result.manager.email,
                    comission: result.comision
                };
            });
            responseObject = {
                results
            };
            response.status(statusCode).send(responseObject);
        });
    }
}
exports.BankController = BankController;
//# sourceMappingURL=BankController.js.map