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
exports.AuthMiddleware = void 0;
const Translator_1 = require("../languages/Translator");
const ApiError_1 = require("../utils/api/ApiError");
const Utils_1 = require("../utils/Utils");
const auth_1 = require("firebase-admin/auth");
const DatabaseHelper_1 = require("../configs/database/DatabaseHelper");
/**
 * Middleware donde se encuentra el manejo de lo relacionado con la autenticación en la api.
 */
class AuthMiddleware {
}
exports.AuthMiddleware = AuthMiddleware;
_a = AuthMiddleware;
/**
 * Método que permite validar el acceso a un endpoint de la api.
 * @param requiredPermission
 * @returns
 */
AuthMiddleware.authorize = (requiredPermission) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    let translator = Translator_1.Translator.getInstance();
    let clientLanguage = Utils_1.Utils.getClientLanguage(request);
    let jwt = request.headers['authorization'];
    if (!jwt) {
        response.status(401).send(new ApiError_1.ApiError({
            clientErrorMessage: translator.getTranslation(Translator_1.Translator.UNSPECIFIED_TOKEN, { language: clientLanguage }),
            debugErrorMessage: translator.getTranslation(Translator_1.Translator.UNSPECIFIED_TOKEN, { language: clientLanguage }),
        }));
    }
    jwt = jwt.slice('bearer'.length).trim();
    try {
        const decodedToken = yield (0, auth_1.getAuth)().verifyIdToken(jwt, true);
        request.clientUserRole = decodedToken.role;
        request.clientUserUid = decodedToken.uid;
        const databaseManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
        const userFound = yield databaseManager.user.findFirst({
            where: {
                uid: request.clientUserUid
            }
        });
        if (userFound) {
            request.clientUserId = userFound.id;
            if (requiredPermission) {
                if (request.clientUserRole) {
                    const rolePermissionFound = yield databaseManager.role_permission.findFirst({
                        where: {
                            role_id: request.clientUserRole,
                            permission_id: requiredPermission
                        }
                    });
                    if (rolePermissionFound) {
                        next();
                    }
                    else {
                        response.status(403).send(new ApiError_1.ApiError({
                            clientErrorMessage: translator.getTranslation(Translator_1.Translator.NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator_1.Translator.NOT_ALLOWED, { language: clientLanguage })
                        }));
                    }
                }
                else {
                    response.status(401).send(new ApiError_1.ApiError({
                        clientErrorMessage: translator.getTranslation(Translator_1.Translator.ROLE_NOT_SPECIFIED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator_1.Translator.ROLE_NOT_SPECIFIED, { language: clientLanguage }),
                    }));
                }
            }
            else {
                next();
            }
        }
        else {
            response.status(401).send(new ApiError_1.ApiError({
                clientErrorMessage: translator.getTranslation(Translator_1.Translator.CLIENT_USER_NOT_FOUND, { language: clientLanguage }),
                debugErrorMessage: translator.getTranslation(Translator_1.Translator.CLIENT_USER_NOT_FOUND, { language: clientLanguage }),
            }));
        }
    }
    catch (error) {
        console.log('errpr', error);
        if (error.code == 'auth/id-token-revoked') {
            response.status(401).send(new ApiError_1.ApiError({
                clientErrorMessage: translator.getTranslation(Translator_1.Translator.REVOKED_TOKEN, { language: clientLanguage }),
                debugErrorMessage: translator.getTranslation(Translator_1.Translator.REVOKED_TOKEN, { language: clientLanguage })
            }));
        }
        else if (error.code == 'auth/id-token-expired') {
            response.status(401).send(new ApiError_1.ApiError({
                clientErrorMessage: translator.getTranslation(Translator_1.Translator.EXPIRED_TOKEN, { language: clientLanguage }),
                debugErrorMessage: translator.getTranslation(Translator_1.Translator.EXPIRED_TOKEN, { language: clientLanguage })
            }));
        }
        else {
            next(error);
        }
    }
});
//# sourceMappingURL=AuthMiddleware.js.map