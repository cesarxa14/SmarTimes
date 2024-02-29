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
exports.ValidatorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const Translator_1 = require("../languages/Translator");
const Utils_1 = require("../utils/Utils");
const InputValidationError_1 = require("../utils/api/InputValidationError");
const ApiError_1 = require("../utils/api/ApiError");
/**
 * Middleware donde se encuentra el manejo de los errores no controlados en la API.
 */
class ValidatorMiddleware {
}
exports.ValidatorMiddleware = ValidatorMiddleware;
_a = ValidatorMiddleware;
ValidatorMiddleware.validateFields = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    let translator = Translator_1.Translator.getInstance();
    let clientLanguage = Utils_1.Utils.getClientLanguage(request);
    try {
        const errors = (0, express_validator_1.validationResult)(request);
        if (!errors.isEmpty()) {
            let validationErrors = [];
            let firstValidation = "";
            // Recorre los errores de validación y los agrega a un arreglo de errores de validación.
            for (const error of errors.array()) {
                // Guardo el primer mensaje de error para mostrarlo en el ApiError.
                if (firstValidation === "") {
                    firstValidation = error.msg;
                }
                validationErrors.push(new InputValidationError_1.InputValidationError({ msg: translator.getTranslation(error.msg, { language: clientLanguage }), location: error.location, param: error.param }));
            }
            const statusCode = 400;
            const responseObject = new ApiError_1.ApiError({
                clientErrorMessage: translator.getTranslation(firstValidation, { language: clientLanguage }),
                debugErrorMessage: translator.getTranslation(firstValidation, { language: clientLanguage }),
                inputValidationErrors: validationErrors,
            });
            return response.status(statusCode).send(responseObject);
        }
    }
    catch (error) {
        next(error);
    }
    next();
});
//# sourceMappingURL=ValidatorMiddleware.js.map