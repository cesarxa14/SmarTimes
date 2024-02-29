/**
 * Clase utilizada para almacenar la información de los errores de validación.
 */
export class InputValidationError{

    /**
     * @type {string} Mensaje de error.
     */
    public msg: string;

    /** 
     * @type {string} Nombre del parámetro que ha generado el error.
     */
    public param: string;

    /**
     * @type {string} Ubicación del parámetro que ha generado el error.
     */
    public location: string;

    /**
     * Constructor de la clase 
     */

    constructor({msg = '', param = '', location = ''}:{msg?: string, param?: string, location?: string}) {
        this.msg = msg;
        this.param = param;
        this.location = location;
    }
}