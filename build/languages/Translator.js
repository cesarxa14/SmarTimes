"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Translator = exports.Language = void 0;
/**
 * Idiomas disponibles en la clase de traducción.
 */
var Language;
(function (Language) {
    Language["SPANISH"] = "es";
    Language["ENGLISH"] = "en";
})(Language = exports.Language || (exports.Language = {}));
/**
 * Clase donde se encuentra todo lo relacionado con los idiomas en la API.
 */
class Translator {
    /**
     * Constructor de la clase.
     */
    constructor() {
        this.initSpanishTranslation();
        this.initEnglishTranslation();
    }
    /**
     * Método que permite inicializar el mapa traductor de español.
     */
    initSpanishTranslation() {
        this._spanishTranslation = new Map([
            // Error inesperado 
            [Translator.UNEXPECTED_ERROR, 'Ocurrió un problema inesperado'],
            // Errores de autorización 
            [Translator.UNSPECIFIED_TOKEN, 'Debe especificar el token de acceso'],
            [Translator.REVOKED_TOKEN, 'El token ha sido revocado'],
            [Translator.EXPIRED_TOKEN, 'El token ha expirado'],
            [Translator.UNEXPECTED_ERROR_VALIDATING_TOKEN, 'Ocurrión un problema inesperado validando el token'],
            [Translator.NOT_ALLOWED, 'El usuario no tiene permiso para ejecutar la operación solicitada'],
            [Translator.ROLE_NOT_SPECIFIED, 'El rol del usuario no ha sido especificado'],
            [Translator.CLIENT_USER_NOT_FOUND, 'El usuario cliente no ha sido encontrado'],
            // Errores en la creación de los usuarios
            [Translator.EMAIL_MUST_BE_SPECIFIED, 'El correo tiene que ser especificado'],
            [Translator.PHONE_MUST_BE_SPECIFIED, 'El teléfono tiene que ser especificado'],
            [Translator.PASSWORD_MUST_BE_SPECIFIED, 'La contraseña tiene que ser especificada'],
            [Translator.EMAIL_FORMAT_INCORRECT, 'El formato del correo es incorrecto'],
            [Translator.PHONE_FORMAT_INCORRECT, 'El formato del teléfono es incorrecto'],
            [Translator.EMAIL_ALREADY_EXISTS, 'El correo especificado ya existe'],
            [Translator.PHONE_NUMBER_ALREADY_EXISTS, 'El número de teléfono especificado ya existe'],
            [Translator.INVALID_PASSWORD, 'La contraseña especificada no cumple con los requisitos mínimos'],
            [Translator.BANK_ID_MUST_BE_SPECIFIED, 'El identificador del banco tiene que ser especificado'],
            [Translator.BANK_NOT_FOUND, 'El banco especificado no ha sido encontrado'],
            [Translator.ADMIN_ID_MUST_BE_SPECIFIED, 'El identificador del administrador tiene que ser especificado'],
            [Translator.BANKER_NOT_ALLOWED, "El banquero no tiene permitido trabajar en este banco"],
            // Errores a la hora de eliminar un usuario
            [Translator.USER_NOT_FOUND, 'El usuario no ha sido encontrado'],
            [Translator.USER_ID_MUST_BE_SPECIFIED, 'El identificador del usuario tiene que ser especificado'],
            [Translator.USER_NOT_DELETED, 'El usuario no ha sido eliminado'],
            // Errores en la edicion de los usuarios
            [Translator.MANAGER_NOT_FOUND_FOR_BANK, 'No se ha encontrado el administrador para el banco especificado'],
            [Translator.SELLER_NOT_FOUND_FOR_BANK, 'No se ha encontrado el vendedor para el banco especificado'],
            [Translator.USER_TO_UPDATE_REQUIRED, 'El usuario a modificar tiene que ser especificado'],
            [Translator.DUPLICATED_USER, 'Ya existe un usuario con el correo o el número de teléfono especificado'],
            // Errores de paginación
            [Translator.PAGE_NUMBER_MUST_BE_SPECIFIED, 'El número de página tiene que ser especificado'],
            [Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED, 'El número de elementos por página debe ser especificado'],
            // Errores gestión de los bancos
            [Translator.BANK_NAME_MUST_BE_SPECIFIED, 'El nombre del banco tiene que ser especificado'],
            [Translator.BANK_OWNER_MUST_BE_SPECIFIED, 'El propietario del banco tiene que ser especificado'],
            [Translator.BANKER_NOT_FOUND, 'El banquero no ha sido encontrado'],
            [Translator.DUPLICATED_BANK_NAME, 'Ya existe un banco con el nombre especificado'],
            [Translator.BANK_NOT_FOUND_FOR_OWNER, 'Banco no encontrado para el propietario especificado'],
            [Translator.NEW_BANKER_NOT_FOUND, 'El nuevo banquero no ha sido encontrado'],
            [Translator.BANK_ID_MUST_SPECIFIED, 'El identificador del banco tiene que ser especificado'],
            [Translator.BANK_ADMIN_NOT_FOUND, 'El administrador del banco no ha sido encontrado'],
            [Translator.SELLER_ID_MUST_BE_SPECIFIED, 'El identificador del vendedor tiene que ser especificado'],
            [Translator.BANK_SELLER_NOT_FOUND, 'El vendedor del banco no ha sido encontrado'],
            [Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, 'El administrador del banco ya está vinculado al vendedor especificado'],
            [Translator.BANK_SELLER_ADMIN_NOT_LINKED, 'El administrador del banco no está vinculado al vendedor especificado'],
            // Errores en la gestion de loterías
            [Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, 'El usuario no tiene permiso para crear loterías'],
            [Translator.CLOSING_TIME_LESS_THAN_CURRENT_TIME, 'La hora de cierre debe ser mayor a la hora actual'],
            [Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, 'La hora de cierre debe ser menor a la hora de la lotería'],
            [Translator.LOTTERY_NAME_MUST_BE_SPECIFIED, 'El nombre de la lotería tiene que ser especificado'],
            [Translator.CLOSING_TIME_MUST_BE_SPECIFIED, 'La hora de cierre tiene que ser especificada'],
            [Translator.LOTTERY_TIME_MUST_BE_SPECIFIED, 'La hora de la lotería tiene que ser especificada'],
            [Translator.LOTTERY_DATE_MUST_BE_SPECIFIED, 'La fecha de la lotería tiene que ser especificada'],
            [Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED, 'El tipo de lotería tiene que ser especificado'],
            [Translator.LOTTERY_NOT_FOUND, 'La lotería no ha sido encontrada'],
            [Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, 'El usuario no tiene permiso para actualizar loterías'],
            [Translator.LOTTERY_ID_MUST_BE_SPECIFIED, 'El identificador de la lotería tiene que ser especificado'],
            [Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, 'El usuario no tiene permiso para eliminar loterías'],
            [Translator.LOTTERY_NOT_DELETED, 'La lotería no ha sido eliminada'],
            [Translator.BANK_AVAILABILITY_MUST_BE_SPECIFIED, 'La disponibilidad del banco tiene que ser especificada'],
            [Translator.LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH, 'Las loterías y los vendedores deben tener la misma longitud'],
            [Translator.LOTTERY_TYPE_NOT_FOUND, 'El tipo de lotería no ha sido encontrado'],
            [Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, 'El usuario no tiene permiso para programar loterías'],
            [Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, 'El usuario no tiene permiso para actualizar la programación de loterías'],
            [Translator.LOTTERY_PROGRAMMING_NOT_FOUND, 'La programación de la lotería no ha sido encontrada'],
            [Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED, 'El identificador de la programación de la lotería tiene que ser especificado'],
            [Translator.LOTTERY_ALREADY_PROGRAMMED, 'La lotería ya ha sido programada'],
            // Errores en gestion de tickets
            [Translator.TICKET_ALREADY_CANCELLED, 'El ticket ya ha sido cancelado'],
            [Translator.CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE, 'No se puede cancelar el ticket después de la fecha de cierre'],
            [Translator.TICKET_ID_MUST_BE_SPECIFIED, 'El identificador del ticket tiene que ser especificado'],
            [Translator.TICKETS_NOT_FOUND, 'Los tickets no han sido encontrados'],
            // Errores en formato de fechas
            [Translator.INVALID_DATE_FORMAT, 'El formato de la fecha es incorrecto'],
            [Translator.DATE_MUST_BE_GREATER_THAN_TODAY, 'La fecha debe ser mayor a la fecha actual'],
            // Errores en la validación de datos
            [Translator.INVALID_NUMBER_FORMAT, 'El formato del número es incorrecto'],
            [Translator.COMMISSION_MUST_BE_SPECIFIED, 'La comisión tiene que ser especificada'],
            //Errores en la gestion de numeros restringidos
            [Translator.NUMBER_NOT_ALLOWED, 'El número no está permitido'],
        ]);
    }
    /**
     * Método que permite inicializar el mapa traductor de inglés.
     */
    initEnglishTranslation() {
        this._englishTranslation = new Map([
            // Error inesperado 
            [Translator.UNEXPECTED_ERROR, 'Occured an unexpected error'],
            // Errores de autorización
            [Translator.UNSPECIFIED_TOKEN, 'You should specify the access token'],
            [Translator.REVOKED_TOKEN, 'The token has been revoked'],
            [Translator.EXPIRED_TOKEN, 'Expired token'],
            [Translator.UNEXPECTED_ERROR_VALIDATING_TOKEN, 'Occured an unexpected error validating token'],
            [Translator.NOT_ALLOWED, 'The user is not allowed to execute the requested operation'],
            [Translator.ROLE_NOT_SPECIFIED, 'The user role has not been specified'],
            [Translator.CLIENT_USER_NOT_FOUND, 'The client user has not been found'],
            // Errores en la creación de los usuarios
            [Translator.EMAIL_MUST_BE_SPECIFIED, 'The email must be specified'],
            [Translator.PHONE_MUST_BE_SPECIFIED, 'The phone number must be specified'],
            [Translator.PASSWORD_MUST_BE_SPECIFIED, 'The password must be specified'],
            [Translator.EMAIL_FORMAT_INCORRECT, 'Incorrect email format'],
            [Translator.PHONE_FORMAT_INCORRECT, 'Incorrect phone format'],
            [Translator.EMAIL_ALREADY_EXISTS, 'The specified email already exists'],
            [Translator.PHONE_NUMBER_ALREADY_EXISTS, 'The specified phone number already exists'],
            [Translator.INVALID_PASSWORD, 'The specified password does not meet the minimum requirements'],
            [Translator.BANK_ID_MUST_BE_SPECIFIED, 'The bank id must be specified'],
            [Translator.BANK_NOT_FOUND, 'The specified bank has not been found'],
            // Errores en la edicion de los usuarios
            [Translator.MANAGER_NOT_FOUND_FOR_BANK, 'The manager was not found for the specified bank'],
            [Translator.SELLER_NOT_FOUND_FOR_BANK, 'The seller was not found for the specified bank'],
            [Translator.USER_TO_UPDATE_REQUIRED, 'The user to update must be specified'],
            [Translator.DUPLICATED_USER, 'There is already a user with the specified email or phone number'],
            [Translator.ADMIN_ID_MUST_BE_SPECIFIED, 'The admin id must be specified'],
            // Errores a la hora de eliminar un usuario
            [Translator.USER_NOT_FOUND, 'The user has not been found'],
            [Translator.USER_ID_MUST_BE_SPECIFIED, 'The user id must be specified'],
            [Translator.USER_NOT_DELETED, 'The user has not been deleted'],
            // Errores de paginación
            [Translator.PAGE_NUMBER_MUST_BE_SPECIFIED, 'The page number must be specified'],
            [Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED, 'Element count per page must be specified'],
            // Errores gestión de los bancos
            [Translator.BANK_NAME_MUST_BE_SPECIFIED, 'The bank name must be specified'],
            [Translator.BANK_OWNER_MUST_BE_SPECIFIED, 'The bank owner must be specified'],
            [Translator.BANKER_NOT_FOUND, 'The banker has not been found'],
            [Translator.DUPLICATED_BANK_NAME, 'A bank with the specified name already exists'],
            [Translator.BANK_NOT_FOUND_FOR_OWNER, 'Bank not found for the specified owner'],
            [Translator.NEW_BANKER_NOT_FOUND, 'The new banker has not been found'],
            [Translator.BANK_ID_MUST_SPECIFIED, 'The bank id must be specified'],
            [Translator.BANK_ADMIN_NOT_FOUND, 'The bank admin has not been found'],
            [Translator.SELLER_ID_MUST_BE_SPECIFIED, 'The seller id must be specified'],
            [Translator.BANK_SELLER_NOT_FOUND, 'The bank seller has not been found'],
            [Translator.BANK_SELLER_ADMIN_ALREADY_LINKED, 'The bank seller and admin is already linked to a bank'],
            [Translator.BANK_SELLER_ADMIN_NOT_LINKED, 'The bank seller and admin aren\'t linked'],
            [Translator.BANKER_NOT_ALLOWED, "The banker is not allowed to perform this operation on this bank"],
            // Errores en la gestion de loterías
            [Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, 'The user is not allowed to create lotteries'],
            [Translator.CLOSING_TIME_LESS_THAN_CURRENT_TIME, 'The closing time must be greater than the current time'],
            [Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, 'The closing time must be less than the lottery time'],
            [Translator.LOTTERY_NAME_MUST_BE_SPECIFIED, 'The lottery name must be specified'],
            [Translator.CLOSING_TIME_MUST_BE_SPECIFIED, 'The closing time must be specified'],
            [Translator.LOTTERY_TIME_MUST_BE_SPECIFIED, 'The lottery time must be specified'],
            [Translator.LOTTERY_DATE_MUST_BE_SPECIFIED, 'The lottery date must be specified'],
            [Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED, 'The lottery type must be specified'],
            [Translator.LOTTERY_NOT_FOUND, 'The lottery has not been found'],
            [Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, 'The user is not allowed to update lotteries'],
            [Translator.LOTTERY_ID_MUST_BE_SPECIFIED, 'The lottery id must be specified'],
            [Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, 'The user is not allowed to delete lotteries'],
            [Translator.LOTTERY_NOT_DELETED, 'The lottery has not been deleted'],
            [Translator.BANK_AVAILABILITY_MUST_BE_SPECIFIED, 'The bank availability must be specified'],
            [Translator.LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH, 'The lotteries and sellers arrays must have the same length'],
            [Translator.LOTTERY_TYPE_NOT_FOUND, 'The lottery type has not been found'],
            [Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, 'The user is not allowed to program lotteries'],
            [Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, 'The user is not allowed to update the lottery programming'],
            [Translator.LOTTERY_PROGRAMMING_NOT_FOUND, 'The lottery programming has not been found'],
            [Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED, 'The lottery id must be specified'],
            [Translator.LOTTERY_ALREADY_PROGRAMMED, 'The lottery has already been programmed'],
            // Errores en gestion de tickets
            [Translator.TICKET_ALREADY_CANCELLED, 'The ticket has already been cancelled'],
            [Translator.CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE, 'The ticket cannot be cancelled after the closing date'],
            [Translator.TICKET_ID_MUST_BE_SPECIFIED, 'The ticket id must be specified'],
            [Translator.TICKETS_NOT_FOUND, 'The tickets have not been found'],
            // Errores en formato de fechas
            [Translator.INVALID_DATE_FORMAT, 'Invalid date format'],
            [Translator.DATE_MUST_BE_GREATER_THAN_TODAY, 'The date must be greater or equals than today'],
            // Errores en la validación de datos
            [Translator.INVALID_NUMBER_FORMAT, 'Invalid number format'],
            [Translator.COMMISSION_MUST_BE_SPECIFIED, 'The commission must be specified'],
            //Errores en la gestion de numeros restringidos
            [Translator.NUMBER_NOT_ALLOWED, 'The number is not allowed'],
        ]);
    }
    /**
     * Método que permite devolver la instancia única.
     * @returns Instancia única de la clase.
     */
    static getInstance() {
        if (Translator._instance == null)
            Translator._instance = new Translator();
        return this._instance;
    }
    /**
     * Método que permite obtener la traducción para la clave especificada en el idioma especificado.
     * @param language Idioma a obtener la traducción.
     * @param key Clave a obtenerle la traducción.
     */
    getTranslation(key, { language = Language.SPANISH }) {
        let translationValue;
        if (language == Language.ENGLISH)
            translationValue = this._englishTranslation.get(key);
        else
            translationValue = this._spanishTranslation.get(key);
        return translationValue;
    }
}
exports.Translator = Translator;
/**
 * Instancia única de la clase.
 */
Translator._instance = null;
// Error inesperado
Translator.UNEXPECTED_ERROR = 'UNEXPECTED_ERROR';
// Errores de autorización
Translator.UNSPECIFIED_TOKEN = 'UNSPECIFIED_TOKEN';
Translator.REVOKED_TOKEN = 'REVOKED_TOKEN';
Translator.EXPIRED_TOKEN = 'EXPIRED_TOKEN';
Translator.UNEXPECTED_ERROR_VALIDATING_TOKEN = 'UNEXPECTED_ERROR_VALIDATING_TOKEN';
Translator.NOT_ALLOWED = 'NOT_ALLOWED';
Translator.ROLE_NOT_SPECIFIED = 'ROLE_NOT_SPECIFIED';
Translator.CLIENT_USER_NOT_FOUND = 'CLIENT_USER_NOT_FOUND';
// Errores del controlador de usuarios
Translator.EMAIL_MUST_BE_SPECIFIED = 'EMAIL_MUST_BE_SPECIFIED';
Translator.EMAIL_FORMAT_INCORRECT = 'EMAIL_FORMAT_INCORRECT';
Translator.EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS';
Translator.PHONE_MUST_BE_SPECIFIED = 'PHONE_MUST_BE_SPECIFIED';
Translator.PHONE_FORMAT_INCORRECT = 'PHONE_FORMAT_INCORRECT';
Translator.PHONE_NUMBER_ALREADY_EXISTS = 'PHONE_NUMBER_ALREADY_EXISTS';
Translator.PASSWORD_MUST_BE_SPECIFIED = 'PASSWORD_MUST_BE_SPECIFIED';
Translator.INVALID_PASSWORD = 'INVALID_PASSWORD';
Translator.BANK_ID_MUST_BE_SPECIFIED = 'BANK_ID_MUST_SPECIFIED';
Translator.BANK_NOT_FOUND = 'BANK_NOT_FOUND';
Translator.USER_NOT_FOUND = 'USER_NOT_FOUND';
Translator.USER_ID_MUST_BE_SPECIFIED = 'USER_ID_MUST_BE_SPECIFIED';
Translator.USER_NOT_DELETED = 'USER_NOT_DELETED';
Translator.MANAGER_NOT_FOUND_FOR_BANK = 'MANAGER_NOT_FOUND_FOR_BANK';
Translator.SELLER_NOT_FOUND_FOR_BANK = 'SELLER_NOT_FOUND_FOR_BANK';
Translator.USER_TO_UPDATE_REQUIRED = 'USER_TO_UPDATE_REQUIRED';
Translator.DUPLICATED_USER = 'DUPLICATED_USER';
Translator.ADMIN_ID_MUST_BE_SPECIFIED = 'ADMIN_ID_MUST_BE_SPECIFIED';
// Errores de paginación
Translator.PAGE_NUMBER_MUST_BE_SPECIFIED = 'PAGE_NUMBER_MUST_BE_SPECIFIED';
Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED = 'ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED';
// Errores de la gestión de los bancos
Translator.BANK_NAME_MUST_BE_SPECIFIED = 'BANK_NAME_MUST_BE_SPECIFIED';
Translator.BANK_OWNER_MUST_BE_SPECIFIED = 'BANK_OWNER_MUST_BE_SPECIFIED';
Translator.BANKER_NOT_FOUND = 'BANKER_NOT_FOUND';
Translator.DUPLICATED_BANK_NAME = 'DUPLICATED_BANK_NAME';
Translator.BANK_NOT_FOUND_FOR_OWNER = 'BANK_NOT_FOUND_FOR_OWNER';
Translator.NEW_BANKER_NOT_FOUND = 'NEW_BANKER_NOT_FOUND';
Translator.BANK_ID_MUST_SPECIFIED = 'BANK_ID_MUST_SPECIFIED';
Translator.BANK_AVAILABILITY_MUST_BE_SPECIFIED = 'BANK_AVAILABILITY_MUST_BE_SPECIFIED';
Translator.BANK_ADMIN_NOT_FOUND = 'BANK_ADMIN_NOT_FOUND';
Translator.SELLER_ID_MUST_BE_SPECIFIED = 'SELLER_ID_MUST_BE_SPECIFIED';
Translator.BANK_SELLER_NOT_FOUND = 'BANK_SELLER_NOT_FOUND';
Translator.BANK_SELLER_ADMIN_ALREADY_LINKED = 'BANK_SELLER_ADMIN_ALREADY_LINKED';
Translator.BANK_SELLER_ADMIN_NOT_LINKED = 'BANK_SELLER_ADMIN_NOT_LINKED';
Translator.BANKER_NOT_ALLOWED = 'BANKER_NOT_ALLOWED';
// Errores en la gestión de loterías
Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY = 'USER_NOT_ALLOWED_TO_CREATE_LOTTERY';
Translator.CLOSING_TIME_LESS_THAN_CURRENT_TIME = 'CLOSING_TIME_LESS_THAN_CURRENT_TIME';
Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME = 'CLOSING_TIME_GREATER_THAN_LOTTERY_TIME';
Translator.LOTTERY_NAME_MUST_BE_SPECIFIED = 'LOTTERY_NAME_MUST_BE_SPECIFIED';
Translator.CLOSING_TIME_MUST_BE_SPECIFIED = 'CLOSING_TIME_MUST_BE_SPECIFIED';
Translator.LOTTERY_TIME_MUST_BE_SPECIFIED = 'LOTTERY_TIME_MUST_BE_SPECIFIED';
Translator.LOTTERY_DATE_MUST_BE_SPECIFIED = 'LOTTERY_DATE_MUST_BE_SPECIFIED';
Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED = 'LOTTERY_TYPE_MUST_BE_SPECIFIED';
Translator.LOTTERY_NOT_FOUND = 'LOTTERY_NOT_FOUND';
Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY = 'USER_NOT_ALLOWED_TO_UPDATE_LOTTERY';
Translator.LOTTERY_ID_MUST_BE_SPECIFIED = 'LOTTERY_ID_MUST_BE_SPECIFIED';
Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED = 'LOTTERY_ID_MUST_BE_SPECIFIED';
Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY = 'USER_NOT_ALLOWED_TO_DELETE_LOTTERY';
Translator.LOTTERY_NOT_DELETED = 'LOTTERY_NOT_DELETED';
Translator.LOTTERY_TYPE_NOT_FOUND = 'LOTTERY_TYPE_NOT_FOUND';
Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY = 'USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY';
Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING = 'USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING';
Translator.LOTTERY_PROGRAMMING_NOT_FOUND = 'LOTTERY_PROGRAMMING_NOT_FOUND';
Translator.LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH = 'LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH';
Translator.LOTTERY_ALREADY_PROGRAMMED = 'LOTTERY_ALREADY_PROGRAMMED';
// validacion de datos en los tickets
Translator.TICKET_ALREADY_CANCELLED = 'TICKET_ALREADY_CANCELLED';
Translator.CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE = 'CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE';
Translator.TICKET_ID_MUST_BE_SPECIFIED = 'TICKET_ID_MUST_BE_SPECIFIED';
Translator.TICKETS_NOT_FOUND = 'TICKET_NOT_FOUND';
// Errores en formato de fechas
Translator.INVALID_DATE_FORMAT = 'INVALID_DATE_FORMAT';
// Errores de validación de datos
Translator.INVALID_NUMBER_FORMAT = 'INVALID_NUMBER_FORMAT';
Translator.DATE_MUST_BE_GREATER_THAN_TODAY = 'DATE_MUST_BE_GREATER_THAN_TODAY';
Translator.COMMISSION_MUST_BE_SPECIFIED = 'COMMISSION_MUST_BE_SPECIFIED';
// Errores en la gestión de numeros restringidos
Translator.NUMBER_NOT_ALLOWED = 'NUMBER_NOT_ALLOWED';
//# sourceMappingURL=Translator.js.map