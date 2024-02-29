"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
/**
 * Clase utilizada para almacenar la información asociada a un error ocurrido en la Api.
 */
class ApiError {
    /**
     * Constructor de la clase.
     * @param clientErrorMessage
     * @param debugErrorMessage
     */
    constructor({ clientErrorMessage = '', debugErrorMessage = '', inputValidationErrors }) {
        /**
         * Mensaje de error listo para mostrarle al cliente en diferentes idiomas.
         */
        this.clientErrorMessage = null;
        /**
         * Mensaje de error orientado a los desarrolladores.
         */
        this.debugErrorMessage = null;
        /**
         * Lista de InputValidationError asociados al error.
         */
        this.inputValidationErrors = null;
        this.clientErrorMessage = clientErrorMessage;
        this.debugErrorMessage = debugErrorMessage;
        this.inputValidationErrors = inputValidationErrors;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map