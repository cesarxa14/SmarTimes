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
exports.PlansController = void 0;
const DatabaseHelper_1 = require("../configs/database/DatabaseHelper");
const Translator_1 = require("../languages/Translator");
const ApiError_1 = require("../utils/api/ApiError");
const Utils_1 = require("../utils/Utils");
/**
 * Clase controladora de los Planes y Licencias.
 */
class PlansController {
    /**
    * Método para crear licencias
    * @param request
    * @param response
    * @param next
    */
    static createLicense(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 201;
            const owner_id = Number.parseInt(request.body.owner_id);
            const plan_id = Number.parseInt(request.body.plan_id);
            const expiration_date = (request.body.expiration_date) ? Utils_1.Utils.convertToUTC(request.body.expiration_date) : null;
            const existOwner = yield prismaManager.user.findFirst({
                where: {
                    id: owner_id
                }
            });
            if (!existOwner) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.USER_NOT_FOUND, { language: clientLanguage })
                }));
                return;
            }
            // Eliminamos las licencias anteriores
            const licenceOwner = yield prismaManager.license.updateMany({
                where: {
                    userId: owner_id
                },
                data: {
                    active: false
                }
            });
            const license = yield prismaManager.license.create({
                data: {
                    plan_id: plan_id,
                    userId: owner_id,
                    expiration_date: expiration_date,
                    license_update: {
                        create: {
                            expiration_date: expiration_date,
                            responsibleId: userId,
                        }
                    }
                },
            });
            response.status(statusCode).send(license);
        });
    }
    /**
    * Método para actualizar licencias
    * @param request
    * @param response
    * @param next
    */
    static updateLicense(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            const license_id = Number.parseInt(request.body.license_id);
            const expiration_date = (request.body.expiration_date) ? Utils_1.Utils.convertToUTC(request.body.expiration_date) : null;
            const existLicence = yield prismaManager.license.findFirst({
                where: {
                    id: license_id
                }
            });
            if (!existLicence) {
                statusCode = 404;
                response.status(statusCode).send(new ApiError_1.ApiError({
                    clientErrorMessage: translator.getTranslation(Translator_1.Translator.NOT_ALLOWED, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator_1.Translator.NOT_ALLOWED, { language: clientLanguage })
                }));
                return;
            }
            const license = yield prismaManager.license.update({
                where: {
                    id: license_id
                },
                data: {
                    expiration_date: expiration_date,
                    license_update: {
                        create: {
                            expiration_date: expiration_date,
                            responsibleId: userId,
                        }
                    }
                },
            });
            response.status(statusCode).send(license);
        });
    }
    /**
        * Método para crear planes
        * @param request
        * @param response
        * @param next
        */
    static createPlan(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 201;
            const name = request.body.name;
            const seller_count = Number.parseInt(request.body.seller_count);
            const monthly_price = Number.parseFloat(request.body.monthly_price);
            const administrators = Number.parseInt(request.body.administrators);
            const allowed_banks = Number.parseInt(request.body.allowed_banks);
            // Creamos el Plan con los datos anteriores
            const plan = yield prismaManager.plan.create({
                data: {
                    name: name,
                    seller_count: seller_count,
                    monthly_price: monthly_price,
                    administrators: administrators,
                    allowed_banks: allowed_banks,
                }
            });
            response.status(statusCode).send(plan);
        });
    }
    /**
        * Método para actualizar plan
        * @param request
        * @param response
        * @param next
        */
    static updatePlan(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 200;
            const plan_id = Number.parseInt(request.body.plan_id);
            const name = request.body.name;
            const seller_count = Number.parseInt(request.body.seller_count);
            const monthly_price = Number.parseFloat(request.body.monthly_price);
            const administrators = Number.parseInt(request.body.administrators);
            const allowed_banks = Number.parseInt(request.body.allowed_banks);
            // Creamos el Plan con los datos anteriores
            const plan = yield prismaManager.plan.update({
                where: {
                    id: plan_id
                },
                data: {
                    name: name,
                    seller_count: seller_count,
                    monthly_price: monthly_price,
                    administrators: administrators,
                    allowed_banks: allowed_banks,
                }
            });
            response.status(statusCode).send(plan);
        });
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static disablePlan(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            const userId = Number.parseInt(request.clientUserId);
            let statusCode = 201;
            const plan_id = Number.parseInt(request.body.plan_id);
            // Creamos el Plan con los datos anteriores
            const plan = yield prismaManager.plan.update({
                where: {
                    id: plan_id
                },
                data: {
                    is_deleted: true,
                }
            });
            response.status(statusCode).send({
                msg: "Deleted"
            });
        });
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static getPlans(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            let responseObject = null;
            const pageNumber = Number.parseInt(request.query.page_number);
            const elementsPerPage = Number.parseInt(request.query.elements_per_page);
            let plan_id = Number.parseInt(request.query.ticket_id);
            let plans;
            if (elementsPerPage) {
                const elementsToSkip = pageNumber * elementsPerPage;
                plans = yield prismaManager.plan.findMany({
                    where: {
                        is_deleted: false,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                });
            }
            else {
                plans = yield prismaManager.plan.findMany({
                    where: {
                        is_deleted: false,
                    },
                    orderBy: {
                        id: 'asc'
                    }
                });
            }
            const plansCountResult = yield prismaManager.plan.aggregate({
                where: {
                    is_deleted: false,
                },
                _count: {
                    id: true
                },
            });
            responseObject = {
                'plans': plans,
                'plans_count': plansCountResult._count.id
            };
            response.status(statusCode).send(responseObject);
        });
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static getLicenceByOwner(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let translator = Translator_1.Translator.getInstance();
            let clientLanguage = Utils_1.Utils.getClientLanguage(request);
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode = 200;
            let responseObject = null;
            let owner_id = Number.parseInt(request.query.owner_id);
            const licence = yield prismaManager.license.findFirst({
                where: {
                    userId: owner_id,
                    active: true
                },
                orderBy: {
                    id: 'asc'
                }
            });
            response.status(statusCode).send(licence);
        });
    }
}
exports.PlansController = PlansController;
//# sourceMappingURL=PlansController.js.map