import { Request, Response, NextFunction } from "express";
import { CreateRequest, getAuth, UpdateRequest, UserRecord } from "firebase-admin/auth";
import { stat } from "fs";
import { DatabaseHelper } from "../configs/database/DatabaseHelper";
import { Language, Translator } from "../languages/Translator";
import { ApiError } from "../utils/api/ApiError";
import { AuthUtils } from "../utils/auth/AuthUtils";
import { Role } from "../utils/auth/Role";
import { Constants } from "../utils/Constansts";
import { Utils } from "../utils/Utils";

/**
 * Clase controladora de los usuarios.
 */
export class UserController {
    /**
     * Método que permite buscar un banco en función del rol del usuario
     * para crear un administrador.
     * @param clientUserRole Rol del usuario que quiere buscar el banco.
     * @param bankId Identificador del banco a buscar.
     * @param clientUserId Identificador del usuario que quiere buscar el banco.
     */
    private static async foundBankForModifications({ clientUserRole, clientUserId, bankId }: { clientUserRole: Role, clientUserId: number, bankId: number }): Promise<any> {
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let foundBank = null;

        if (clientUserRole == Role.BANKER_USER) {
            foundBank = await prismaManager.bank.findFirst(
                {
                    where: {
                        id: bankId,
                        owner_id: clientUserId
                    }
                }
            );
        }
        else if (clientUserRole == Role.SUPER_USER) {
            foundBank = await prismaManager.bank.findFirst(
                {
                    where: {
                        id: bankId
                    }
                }
            );
        }

        return foundBank;
    }

    /**
     * Método que permite crear un usuario.
     * @param role Rol del usuario a crear.
     * @returns 
     */
    static readonly createUserMiddleware = (role: Role) => {
        return async (request, response, next) => {
            let translator: Translator = Translator.getInstance();
            let clientLanguage: Language = Utils.getClientLanguage(request);

            const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
            let statusCode: number = 201;

            try {
                const email: string = (request.body['email'] as string).toLowerCase();
                const phone: string = request.body['phone'];
                const password: string = request.body['password'];

                const createUserRequest: CreateRequest = {
                    email: email,
                    password: password,
                    phoneNumber: phone
                };

                const createdUser: UserRecord = await getAuth().createUser(createUserRequest);
                request.createdUserUid = createdUser.uid;

                const localCreatedUser = await prismaManager.user.create(
                    {
                        data: {
                            uid: createdUser.uid,
                            role_id: role,
                            email: email,
                            phone: phone
                        }
                    }
                );
                request.createdUserId = localCreatedUser.id;

                await AuthUtils.setUserRole({ role: role, uid: createdUser.uid, id: localCreatedUser.id });

                next();
            }
            catch (error) {
                if (request.createdUserUid) {
                    await getAuth().deleteUser(request.createdUserUid);
                }

                if (error.code == 'auth/invalid-phone-number') {
                    statusCode = 400;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage })
                            }
                        )
                    )
                }
                else if (error.code == 'auth/invalid-password') {
                    statusCode = 400;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.INVALID_PASSWORD, { language: clientLanguage }),
                                debugErrorMessage: error.message
                            }
                        )
                    );
                }
                else if (error.code == 'auth/email-already-exists') {
                    statusCode = 409;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage })
                            }
                        )
                    );
                }
                else if (error.code == 'auth/phone-number-already-exists') {
                    statusCode = 409;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage })
                            }
                        )
                    )
                }
                else {
                    next(error);
                }
            }
        }
    }

    /**
     * Método que permite actualizar la información de un usuario.
     * @param request 
     * @param response 
     * @param next 
     */
    static async updateUserMiddleware(request: Request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        try {
            const email: string = (request.body['email'] as string).toLowerCase();
            const phone: string = request.body['phone'];
            const userToUpdateId: number = Number.parseInt(request.body['user_to_update_id'] as string);

            await prismaManager.$transaction(async (tx) => {
                const foundUser = await tx.user.findFirst(
                    {
                        where: {
                            id: userToUpdateId
                        }
                    }
                );

                if (foundUser) {
                    const updatedLocalUser = await tx.user.update(
                        {
                            where: {
                                id: userToUpdateId
                            },
                            data: {
                                email: email,
                                phone: phone
                            }
                        }
                    );
    
                    const updateUserRequest: UpdateRequest = {
                        email: email,
                        phoneNumber: phone
                    };
    
                    await getAuth().updateUser(updatedLocalUser.uid, updateUserRequest);

                    response.status(statusCode).send();
                }    
                else {
                    statusCode = 404;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.USER_NOT_FOUND, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.USER_NOT_FOUND, { language: clientLanguage })
                            }
                        )
                    )
                }
            }, 
            {timeout: Constants.TRANSACTION_TIMEOUT});
        }
        catch (error) {
            if (error.code == 'auth/invalid-phone-number') {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.PHONE_FORMAT_INCORRECT, { language: clientLanguage })
                        }
                    )
                )
            }
            else if (error.code == 'auth/email-already-exists') {
                statusCode = 409;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.EMAIL_ALREADY_EXISTS, { language: clientLanguage })
                        }
                    )
                );
            }
            else if (error.code == 'auth/phone-number-already-exists') {
                statusCode = 409;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.PHONE_NUMBER_ALREADY_EXISTS, { language: clientLanguage })
                        }
                    )
                )
            }
            else if (error.code === 'P2002'){
                statusCode = 409;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.DUPLICATED_USER, {language: clientLanguage}),
                            debugErrorMessage: translator.getTranslation(Translator.DUPLICATED_USER, {language: clientLanguage}),
                        }
                    )
                );
            }
            else {
                next(error);
            }
        }
    }


    /**
     * Método que devuelve el resultado satisfactorio de la creación de un banquero.
     * @param request 
     * @param response 
     * @param next 
     */
    static async createBanker(request, response: Response, next: NextFunction) {
        const responseObject = {
            'id': request.createdUserId
        }

        response.status(201).send(responseObject);
    }

    /**
     * Método que permite crear las relaciones necesarias de un vendedor.
     * @param request 
     * @param response 
     * @param next 
     */
    static async createSeller(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const bankId: number = request.body['bank_id'];
        try {
            const foundBank = await UserController.foundBankForModifications({ clientUserRole: request.clientUserRole, clientUserId: request.clientUserId, bankId: bankId });

            if (foundBank) {
                await prismaManager.$transaction(async (tx) => {
                    await tx.seller.create(
                        {
                            data: {
                                user_id: request.createdUserId
                            }
                        }
                    );

                    await tx.bank_seller.create(
                        {
                            data: {
                                bank_id: bankId,
                                seller_id: request.createdUserId
                            }
                        }
                    );
                });

                const responseObject = {
                    'id': request.createdUserId
                }

                response.status(statusCode).send(responseObject);
            }
            else {
                await getAuth().deleteUser(request.createdUserUid);
                await prismaManager.user.delete(
                    {
                        where: {
                            id: request.createdUserId
                        }
                    }
                );

                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        }
                    )
                )
            }
        }
        catch (error) {
            await getAuth().deleteUser(request.createdUserUid);
            await prismaManager.user.delete(
                {
                    where: {
                        id: request.createdUserId
                    }
                }
            );

            next(error);
        }
    }

    /**
     * Método que permite la creación de un administrador de un banco.
     * @param request 
     * @param response 
     * @param next 
     */
    static async createManager(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const bankId: number = request.body['bank_id'];

        try {
            const foundBank = await UserController.foundBankForModifications({ clientUserRole: request.clientUserRole, clientUserId: request.clientUserId, bankId: bankId });

            if (foundBank) {
                await prismaManager.$transaction(async (tx) => {
                    await tx.manager.create(
                        {
                            data: {
                                user_id: request.createdUserId
                            }
                        }
                    );

                    await tx.bank_manager.create(
                        {
                            data: {
                                bank_id: bankId,
                                manager_id: request.createdUserId
                            }
                        }
                    )
                });

                const responseObject = {
                    'id': request.createdUserId
                }

                response.status(statusCode).send(responseObject);
            }
            else {
                await getAuth().deleteUser(request.createdUserUid);
                await prismaManager.user.delete(
                    {
                        where: {
                            id: request.createdUserId
                        }
                    }
                );

                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        }
                    )
                )
            }
        }
        catch (error) {
            await getAuth().deleteUser(request.createdUserUid);
            await prismaManager.user.delete(
                {
                    where: {
                        id: request.createdUserId
                    }
                }
            );

            next(error);
        }
    }

    /**
     * Método que permite validar si se puede actualizar un manager.
     * @param request 
     * @param response 
     * @param next 
     */
    static async updateManagerValidator(request: Request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userToUpdateId: number = Number.parseInt(request.body['user_to_update_id'] as string);
        const bankId: number = Number.parseInt(request.body['bank_id'] as string);

        const foundBank = await UserController.foundBankForModifications({ bankId: bankId, clientUserId: request.clientUserId, clientUserRole: request.clientUserRole });

        if (foundBank) {
            const bankManagerRelation = await prismaManager.bank_manager.findFirst(
                {
                    where: {
                        bank_id: bankId,
                        manager_id: userToUpdateId
                    }
                }
            );

            if (bankManagerRelation) {
                next();
            }
            else {
                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.MANAGER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                        }
                    )
                )
            }
        }
        else {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }
                )
            )
        }
    }

    /**
     * Método que permite validar si se puede actualizar un vendedor.
     * @param request 
     * @param response 
     * @param next 
     */
    static async updateSellerValidator(request: Request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userToUpdateId: number = Number.parseInt(request.body['user_to_update_id'] as string);
        const bankId: number = Number.parseInt(request.body['bank_id'] as string);

        const foundBank = await UserController.foundBankForModifications({ bankId: bankId, clientUserId: request.clientUserId, clientUserRole: request.clientUserRole });

        if (foundBank) {
            const bankSellerRelation = await prismaManager.bank_seller.findFirst(
                {
                    where: {
                        bank_id: bankId,
                        seller_id: userToUpdateId
                    }
                }
            );

            if (bankSellerRelation){
                next();
            }    
            else {
                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                        }
                    )
                )
            }
        }
        else {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }
                )
            )
        }
    }

    /**
     * Método que permite la obtención de los banqueros.
     * @param request 
     * @param response 
     * @param next 
     */
    static async getBankers(request: Request, response: Response, next: NextFunction) {
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query['page_number'] as string);
        const elementsPerPage: number = Number.parseInt(request.query['elements_per_page'] as string);

        let bankers;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;

            bankers = await prismaManager.user.findMany(
                {
                    where: {
                        role_id: Role.BANKER_USER
                    },
                    orderBy: {
                        email: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        }
        else {
            bankers = await prismaManager.user.findMany(
                {
                    where: {
                        role_id: Role.BANKER_USER
                    },
                    orderBy: {
                        email: 'asc'
                    }
                }
            );
        }

        const bankersCountResult = await prismaManager.user.aggregate(
            {
                where: {
                    role_id: Role.BANKER_USER
                },
                _count: {
                    id: true
                }
            }
        )

        responseObject = {
            'bankers': bankers,
            'bankers_count': bankersCountResult._count.id
        }

        response.status(statusCode).send(responseObject);
    }
    /**
     * Método para devolver los permisos de un usuario en especifico.
     * @param request 
     * @param response 
     * @param next 
     */
    static async getUserPermissions(request: Request, response: Response, next: NextFunction) {
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const user_permissions = await prismaManager.role_permission.findMany({
            where: {
                role_id: request.clientUserRole
            },
            select: {
                permission_id: true,
            }
        })
        responseObject = {
            'user_permissions': user_permissions
        }
        response.status(statusCode).send(responseObject);
    }
}