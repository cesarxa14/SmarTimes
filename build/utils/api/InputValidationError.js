"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputValidationError = void 0;
/**
 * Clase utilizada para almacenar la información de los errores de validación.
 */
class InputValidationError {
    /**
     * Constructor de la clase
     */
    constructor({ msg = '', param = '', location = '' }) {
        this.msg = msg;
        this.param = param;
        this.location = location;
    }
}
exports.InputValidationError = InputValidationError;
//# sourceMappingURL=InputValidationError.js.map