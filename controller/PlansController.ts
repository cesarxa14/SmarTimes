import { Request, Response, NextFunction } from "express";
import { DatabaseHelper } from "../configs/database/DatabaseHelper";
import { Language, Translator } from "../languages/Translator";
import { ApiError } from "../utils/api/ApiError";
import { Role } from "../utils/auth/Role";
import { Utils } from "../utils/Utils";
import { Prisma } from "@prisma/client";

/**
 * Clase controladora de los Planes y Licencias.
 */
export class PlansController {

    /**
    * Método para crear licencias
    * @param request
    * @param response
    * @param next
    */
    static async createLicense(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const userId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 201;

        const owner_id: number = Number.parseInt(request.body.owner_id);
        const plan_id: number = Number.parseInt(request.body.plan_id);
        const expiration_date = (request.body.expiration_date) ? Utils.convertToUTC(request.body.expiration_date) : null;

        const existOwner = await prismaManager.user.findFirst({
            where: {
                id: owner_id
            }
        })
        if (!existOwner) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Eliminamos las licencias anteriores
        const licenceOwner = await prismaManager.license.updateMany({
            where: {
                userId: owner_id
            },
            data:{
                active: false
            }
        });
        const license = await prismaManager.license.create({
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

        })


        response.status(statusCode).send(license);
    }

    /**
    * Método para actualizar licencias
    * @param request
    * @param response
    * @param next
    */
    static async updateLicense(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const userId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 200;

        const license_id: number = Number.parseInt(request.body.license_id);
        const expiration_date = (request.body.expiration_date) ? Utils.convertToUTC(request.body.expiration_date) : null;

        const existLicence = await prismaManager.license.findFirst({
            where: {
                id: license_id
            }
        })
        if (!existLicence) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;

        }
        const license = await prismaManager.license.update({
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

        })


        response.status(statusCode).send(license);
    }

    /**
        * Método para crear planes
        * @param request
        * @param response
        * @param next
        */
    static async createPlan(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const userId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 201;

        const name: string = request.body.name;
        const seller_count: number = Number.parseInt(request.body.seller_count);
        const monthly_price: number = Number.parseFloat(request.body.monthly_price);
        const administrators: number = Number.parseInt(request.body.administrators);
        const allowed_banks: number = Number.parseInt(request.body.allowed_banks);

        // Creamos el Plan con los datos anteriores
        const plan = await prismaManager.plan.create({
            data: {
                name: name,
                seller_count: seller_count,
                monthly_price: monthly_price,
                administrators: administrators,
                allowed_banks: allowed_banks,
            }
        })

        response.status(statusCode).send(plan);
    }

    /**
        * Método para actualizar plan
        * @param request
        * @param response
        * @param next
        */
    static async updatePlan(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const userId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 200;
        const plan_id: number = Number.parseInt(request.body.plan_id);
        const name: string = request.body.name;
        const seller_count: number = Number.parseInt(request.body.seller_count);
        const monthly_price: number = Number.parseFloat(request.body.monthly_price);
        const administrators: number = Number.parseInt(request.body.administrators);
        const allowed_banks: number = Number.parseInt(request.body.allowed_banks);

        // Creamos el Plan con los datos anteriores
        const plan = await prismaManager.plan.update({
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
        })

        response.status(statusCode).send(plan);
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static async disablePlan(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const userId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 201;
        const plan_id: number = Number.parseInt(request.body.plan_id);

        // Creamos el Plan con los datos anteriores
        const plan = await prismaManager.plan.update({
            where: {
                id: plan_id
            },
            data: {
                is_deleted: true,
            }
        })
        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static async getPlans(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        let plan_id: number = Number.parseInt(request.query.ticket_id);



        let plans;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;
            plans = await prismaManager.plan.findMany(
                {
                    where: {
                        is_deleted: false,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        } else {
            plans = await prismaManager.plan.findMany(
                {
                    where: {
                        is_deleted: false,
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            );
        }

        const plansCountResult = await prismaManager.plan.aggregate(
            {
                where: {
                    is_deleted: false,
                },
                _count: {
                    id: true
                },

            }
        )

        responseObject = {
            'plans': plans,
            'plans_count': plansCountResult._count.id
        }

        response.status(statusCode).send(responseObject);
    }
    /**
        * Método para deshabilitar plan
        * @param request
        * @param response
        * @param next
        */
    static async getLicenceByOwner(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        let owner_id: number = Number.parseInt(request.query.owner_id);

        const licence = await prismaManager.license.findFirst(
            {
                where: {
                    userId: owner_id,
                    active: true
                },
                orderBy: {
                    id: 'asc'
                }
            }
        )

        response.status(statusCode).send(licence);
    }
}