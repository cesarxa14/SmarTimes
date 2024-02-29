import { InputValidationError } from "./InputValidationError";

/**
 * Clase utilizada para almacenar la información asociada a un error ocurrido en la Api.
 */
export class ApiError {
    /**
     * Mensaje de error listo para mostrarle al cliente en diferentes idiomas.
     */
    public clientErrorMessage: string = null;
    
    /**
     * Mensaje de error orientado a los desarrolladores.
     */
    public debugErrorMessage: string = null;
    /**
     * Lista de InputValidationError asociados al error.
     */
    public inputValidationErrors: Array<InputValidationError> = null;
    /**
     * Constructor de la clase.
     * @param clientErrorMessage 
     * @param debugErrorMessage 
     */

    constructor({clientErrorMessage = '', debugErrorMessage = '', inputValidationErrors}:{clientErrorMessage?: string, debugErrorMessage?: string, inputValidationErrors?: Array<InputValidationError>}, ) {
        this.clientErrorMessage = clientErrorMessage;
        this.debugErrorMessage = debugErrorMessage;
        this.inputValidationErrors = inputValidationErrors;
    }

}