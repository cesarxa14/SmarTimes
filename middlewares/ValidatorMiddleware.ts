import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { Language, Translator } from "../languages/Translator";
import { Utils } from "../utils/Utils";
import { InputValidationError } from "../utils/api/InputValidationError";
import { ApiError } from "../utils/api/ApiError";

/**
 * Middleware donde se encuentra el manejo de los errores no controlados en la API.
 */
export class ValidatorMiddleware {

    public static readonly validateFields = async (request: Request, response: Response, next: NextFunction) => {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        try {
            const errors = validationResult(request);
            if (!errors.isEmpty()) {
                let validationErrors = [];
                let firstValidation: string = "";
                // Recorre los errores de validación y los agrega a un arreglo de errores de validación.
                for (const error of errors.array()) {
                    // Guardo el primer mensaje de error para mostrarlo en el ApiError.
                    if (firstValidation === "") {
                        firstValidation = error.msg;
                    }
                    validationErrors.push(new InputValidationError({ msg: translator.getTranslation(error.msg, { language: clientLanguage }), location: error.location, param: error.param }));
                }


                const statusCode = 400;
                const responseObject = new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(firstValidation, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(firstValidation, { language: clientLanguage }),
                        inputValidationErrors: validationErrors,
                    }
                );
                return response.status(statusCode).send(responseObject);
            }

        }
        catch (error) {
            next(error);
        }
        next();
    }

}