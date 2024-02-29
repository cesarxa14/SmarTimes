import { Request, Response, NextFunction } from "express";
import { Language, Translator } from "../languages/Translator";
import { ApiError } from "../utils/api/ApiError";
import { Utils } from "../utils/Utils";
import { getAuth, UserRecord } from 'firebase-admin/auth';
import { auth } from "firebase-admin";
import { PrismaClient } from "@prisma/client";
import { DatabaseHelper } from "../configs/database/DatabaseHelper";

/**
 * Middleware donde se encuentra el manejo de lo relacionado con la autenticación en la api.
 */
export class AuthMiddleware {
    /**
     * Método que permite validar el acceso a un endpoint de la api.
     * @param requiredPermission 
     * @returns 
     */
    public static readonly authorize = (requiredPermission?: number) => async (request: Request, response: Response, next: NextFunction) => {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        let jwt: string = request.headers['authorization'];

        if (!jwt) {
            response.status(401).send(new ApiError(
                {
                    clientErrorMessage: translator.getTranslation(Translator.UNSPECIFIED_TOKEN, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.UNSPECIFIED_TOKEN, { language: clientLanguage }),
                }
            ))
        }

        jwt = jwt.slice('bearer'.length).trim();

        try {
            const decodedToken: auth.DecodedIdToken = await getAuth().verifyIdToken(jwt, true);
            request.clientUserRole = decodedToken.role;
            request.clientUserUid = decodedToken.uid;

            const databaseManager: PrismaClient = DatabaseHelper.getInstance().prismaDatabaseManager;

            const userFound = await databaseManager.user.findFirst(
                {
                    where: {
                        uid: request.clientUserUid
                    }
                }
            );

            if (userFound){
                request.clientUserId = userFound.id;    

                if (requiredPermission) {
                    if (request.clientUserRole) {
                        const rolePermissionFound = await databaseManager.role_permission.findFirst(
                            {
                                where: {
                                    role_id: request.clientUserRole,
                                    permission_id: requiredPermission
                                }
                            }
                        );
    
                        if (rolePermissionFound) {
                            next();
                        }
                        else {
                            response.status(403).send(
                                new ApiError(
                                    {
                                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                                    }
                                )
                            )
                        }
                    }
                    else {
                        response.status(401).send(
                            new ApiError(
                                {
                                    clientErrorMessage: translator.getTranslation(Translator.ROLE_NOT_SPECIFIED, { language: clientLanguage }),
                                    debugErrorMessage: translator.getTranslation(Translator.ROLE_NOT_SPECIFIED, { language: clientLanguage }),
                                }
                            )
                        )
                    }
                }
                else {
                    next();
                }
            }        
            else{
                response.status(401).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.CLIENT_USER_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.CLIENT_USER_NOT_FOUND, { language: clientLanguage }),
                        }
                    )
                )
            }
        }
        catch (error) {
            console.log('errpr', error)
            if (error.code == 'auth/id-token-revoked') {
                response.status(401).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.REVOKED_TOKEN, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.REVOKED_TOKEN, { language: clientLanguage })
                        }
                    )
                )
            }
            else if (error.code == 'auth/id-token-expired') {
                response.status(401).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.EXPIRED_TOKEN, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.EXPIRED_TOKEN, { language: clientLanguage })
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