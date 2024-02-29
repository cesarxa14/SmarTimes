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
exports.ErrorMiddleware = exports.ErrorStatus = void 0;
const DatabaseHelper_1 = require("../configs/database/DatabaseHelper");
const ApiError_1 = require("../utils/api/ApiError");
/**
 * Estado asociados a un error.
 */
var ErrorStatus;
(function (ErrorStatus) {
    ErrorStatus[ErrorStatus["OPENED"] = 0] = "OPENED";
    ErrorStatus[ErrorStatus["CLOSED"] = 1] = "CLOSED";
})(ErrorStatus = exports.ErrorStatus || (exports.ErrorStatus = {}));
/**
 * Middleware donde se encuentra el manejo de los errores no controlados en la API.
 */
class ErrorMiddleware {
    /**
     * Middleware encargado de darle respuesta al cliente de la api cuando ocurre un error no manejado.
     * @param error Error no manejado ocurrido.
     * @param request Información de la solicitud http.
     * @param response Información de la respuesta http.
     * @param next Próximo middleware a llamar.
     */
    static errorResponder(error, request, response, next) {
        response.status(500).send(JSON.stringify(new ApiError_1.ApiError({ debugErrorMessage: error.message })));
        next(error);
    }
    /**
     * Middleware encargado de almacenar en la bd el error no manejado ocurrido.
     * @param error Error no manejado ocurrido.
     * @param request Información de la solicitud http.
     * @param response Información de la respuesta http.
     * @param next Próximo middleware a llamar.
     */
    static errorLogger(error, request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const prismaManager = DatabaseHelper_1.DatabaseHelper.getInstance().prismaDatabaseManager;
            try {
                yield prismaManager.error.create({
                    data: {
                        message: error.message,
                        stack: error.stack,
                        url: request.url,
                        path: request.path,
                        time: new Date(),
                        error_status: ErrorStatus.OPENED,
                        request_body: JSON.stringify(request.body)
                    }
                });
                next(error);
            }
            catch (error) {
                next(error);
            }
        });
    }
    /**
     * Middleware encargado de responder cuando la ruta especificada no está registrada.
     * @param request
     * @param response
     * @param next
     */
    static invalidRouteHandler(request, response, next) {
        response.status(404).send('Invalid route');
    }
}
exports.ErrorMiddleware = ErrorMiddleware;
_a = ErrorMiddleware;
/**
 * Middleware que permite llamar de manera segura(garantiza que se capturen las excepciones en los endpoint asincrónicos)
 * a los endpoints asincrónicos.
 * @param endpoint Endpoint que se quiere llamar.
 */
ErrorMiddleware.secureAsync = (endpoint) => (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield endpoint(request, response, next);
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=ErrorMiddleware.js.map