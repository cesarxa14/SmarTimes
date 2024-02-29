/**
 * Idiomas disponibles en la clase de traducción.
 */
export enum Language {
    SPANISH = "es",
    ENGLISH = "en"
}

/**
 * Clase donde se encuentra todo lo relacionado con los idiomas en la API.
 */
export class Translator {
    /**
     * Traducción al español.
     */
    private _spanishTranslation: Map<string, string>;

    /**
     * Traducción al inglés.
     */
    private _englishTranslation: Map<string, string>;

    /**
     * Instancia única de la clase.
     */
    private static _instance: Translator = null;

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
    private initSpanishTranslation(): void {
        this._spanishTranslation = new Map(
            [
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

            ]
        );
    }

    /**
     * Método que permite inicializar el mapa traductor de inglés.
     */
    private initEnglishTranslation(): void {
        this._englishTranslation = new Map(
            [
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
            ]
        );
    }


    /**
     * Método que permite devolver la instancia única.
     * @returns Instancia única de la clase.
     */
    public static getInstance(): Translator {
        if (Translator._instance == null)
            Translator._instance = new Translator();

        return this._instance;
    }

    /**
     * Método que permite obtener la traducción para la clave especificada en el idioma especificado.
     * @param language Idioma a obtener la traducción.
     * @param key Clave a obtenerle la traducción.
     */
    public getTranslation(key: string, { language = Language.SPANISH }: { language?: Language }): string {
        let translationValue: string;

        if (language == Language.ENGLISH)
            translationValue = this._englishTranslation.get(key);
        else
            translationValue = this._spanishTranslation.get(key);

        return translationValue;
    }

    // Error inesperado
    public static readonly UNEXPECTED_ERROR: string = 'UNEXPECTED_ERROR';

    // Errores de autorización
    public static readonly UNSPECIFIED_TOKEN: string = 'UNSPECIFIED_TOKEN';
    public static readonly REVOKED_TOKEN: string = 'REVOKED_TOKEN';
    public static readonly EXPIRED_TOKEN: string = 'EXPIRED_TOKEN';
    public static readonly UNEXPECTED_ERROR_VALIDATING_TOKEN: string = 'UNEXPECTED_ERROR_VALIDATING_TOKEN';
    public static readonly NOT_ALLOWED: string = 'NOT_ALLOWED';
    public static readonly ROLE_NOT_SPECIFIED: string = 'ROLE_NOT_SPECIFIED';
    public static readonly CLIENT_USER_NOT_FOUND: string = 'CLIENT_USER_NOT_FOUND';

    // Errores del controlador de usuarios
    public static readonly EMAIL_MUST_BE_SPECIFIED: string = 'EMAIL_MUST_BE_SPECIFIED';
    public static readonly EMAIL_FORMAT_INCORRECT: string = 'EMAIL_FORMAT_INCORRECT';
    public static readonly EMAIL_ALREADY_EXISTS: string = 'EMAIL_ALREADY_EXISTS';
    public static readonly PHONE_MUST_BE_SPECIFIED: string = 'PHONE_MUST_BE_SPECIFIED';
    public static readonly PHONE_FORMAT_INCORRECT: string = 'PHONE_FORMAT_INCORRECT';
    public static readonly PHONE_NUMBER_ALREADY_EXISTS: string = 'PHONE_NUMBER_ALREADY_EXISTS';
    public static readonly PASSWORD_MUST_BE_SPECIFIED: string = 'PASSWORD_MUST_BE_SPECIFIED';
    public static readonly INVALID_PASSWORD: string = 'INVALID_PASSWORD';
    public static readonly BANK_ID_MUST_BE_SPECIFIED: string = 'BANK_ID_MUST_SPECIFIED';
    public static readonly BANK_NOT_FOUND: string = 'BANK_NOT_FOUND';
    public static readonly USER_NOT_FOUND: string = 'USER_NOT_FOUND';
    public static readonly USER_ID_MUST_BE_SPECIFIED: string = 'USER_ID_MUST_BE_SPECIFIED';
    public static readonly USER_NOT_DELETED: string = 'USER_NOT_DELETED';
    public static readonly MANAGER_NOT_FOUND_FOR_BANK: string = 'MANAGER_NOT_FOUND_FOR_BANK';
    public static readonly SELLER_NOT_FOUND_FOR_BANK: string = 'SELLER_NOT_FOUND_FOR_BANK';
    public static readonly USER_TO_UPDATE_REQUIRED: string = 'USER_TO_UPDATE_REQUIRED';
    public static readonly DUPLICATED_USER: string = 'DUPLICATED_USER';

    public static readonly ADMIN_ID_MUST_BE_SPECIFIED: string = 'ADMIN_ID_MUST_BE_SPECIFIED';
    // Errores de paginación
    public static readonly PAGE_NUMBER_MUST_BE_SPECIFIED: string = 'PAGE_NUMBER_MUST_BE_SPECIFIED';
    public static readonly ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED: string = 'ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED';

    // Errores de la gestión de los bancos
    public static readonly BANK_NAME_MUST_BE_SPECIFIED: string = 'BANK_NAME_MUST_BE_SPECIFIED';
    public static readonly BANK_OWNER_MUST_BE_SPECIFIED: string = 'BANK_OWNER_MUST_BE_SPECIFIED';
    public static readonly BANKER_NOT_FOUND: string = 'BANKER_NOT_FOUND';
    public static readonly DUPLICATED_BANK_NAME: string = 'DUPLICATED_BANK_NAME';
    public static readonly BANK_NOT_FOUND_FOR_OWNER: string = 'BANK_NOT_FOUND_FOR_OWNER';
    public static readonly NEW_BANKER_NOT_FOUND: string = 'NEW_BANKER_NOT_FOUND';
    public static readonly BANK_ID_MUST_SPECIFIED = 'BANK_ID_MUST_SPECIFIED';
    public static readonly BANK_AVAILABILITY_MUST_BE_SPECIFIED: string = 'BANK_AVAILABILITY_MUST_BE_SPECIFIED';
    public static readonly BANK_ADMIN_NOT_FOUND: string = 'BANK_ADMIN_NOT_FOUND';
    public static readonly SELLER_ID_MUST_BE_SPECIFIED: string = 'SELLER_ID_MUST_BE_SPECIFIED';
    public static readonly BANK_SELLER_NOT_FOUND: string = 'BANK_SELLER_NOT_FOUND';
    public static readonly BANK_SELLER_ADMIN_ALREADY_LINKED: string = 'BANK_SELLER_ADMIN_ALREADY_LINKED';
    public static readonly BANK_SELLER_ADMIN_NOT_LINKED: string = 'BANK_SELLER_ADMIN_NOT_LINKED';
    public static readonly BANKER_NOT_ALLOWED = 'BANKER_NOT_ALLOWED';
    // Errores en la gestión de loterías
    public static readonly USER_NOT_ALLOWED_TO_CREATE_LOTTERY: string = 'USER_NOT_ALLOWED_TO_CREATE_LOTTERY';
    public static readonly CLOSING_TIME_LESS_THAN_CURRENT_TIME: string = 'CLOSING_TIME_LESS_THAN_CURRENT_TIME';
    public static readonly CLOSING_TIME_GREATER_THAN_LOTTERY_TIME: string = 'CLOSING_TIME_GREATER_THAN_LOTTERY_TIME';
    public static readonly LOTTERY_NAME_MUST_BE_SPECIFIED: string = 'LOTTERY_NAME_MUST_BE_SPECIFIED';
    public static readonly CLOSING_TIME_MUST_BE_SPECIFIED: string = 'CLOSING_TIME_MUST_BE_SPECIFIED';
    public static readonly LOTTERY_TIME_MUST_BE_SPECIFIED: string = 'LOTTERY_TIME_MUST_BE_SPECIFIED';
    public static readonly LOTTERY_DATE_MUST_BE_SPECIFIED: string = 'LOTTERY_DATE_MUST_BE_SPECIFIED';
    public static readonly LOTTERY_TYPE_MUST_BE_SPECIFIED: string = 'LOTTERY_TYPE_MUST_BE_SPECIFIED';
    public static readonly LOTTERY_NOT_FOUND: string = 'LOTTERY_NOT_FOUND';
    public static readonly USER_NOT_ALLOWED_TO_UPDATE_LOTTERY: string = 'USER_NOT_ALLOWED_TO_UPDATE_LOTTERY';
    public static readonly LOTTERY_ID_MUST_BE_SPECIFIED: string = 'LOTTERY_ID_MUST_BE_SPECIFIED';
    public static readonly PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED: string = 'LOTTERY_ID_MUST_BE_SPECIFIED';
    public static readonly USER_NOT_ALLOWED_TO_DELETE_LOTTERY: string = 'USER_NOT_ALLOWED_TO_DELETE_LOTTERY';
    public static readonly LOTTERY_NOT_DELETED: string = 'LOTTERY_NOT_DELETED';
    public static readonly LOTTERY_TYPE_NOT_FOUND: string = 'LOTTERY_TYPE_NOT_FOUND';
    public static readonly USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY: string = 'USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY';
    public static readonly USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING: string = 'USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING';
    public static readonly LOTTERY_PROGRAMMING_NOT_FOUND: string = 'LOTTERY_PROGRAMMING_NOT_FOUND';
    public static readonly LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH: string = 'LOTTERIES_AND_SELLERS_MUST_HAVE_SAME_LENGTH';
    public static readonly LOTTERY_ALREADY_PROGRAMMED: string = 'LOTTERY_ALREADY_PROGRAMMED';
    // validacion de datos en los tickets
    public static readonly TICKET_ALREADY_CANCELLED: string = 'TICKET_ALREADY_CANCELLED';
    public static readonly CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE: string = 'CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE';
    public static readonly TICKET_ID_MUST_BE_SPECIFIED: string = 'TICKET_ID_MUST_BE_SPECIFIED';
    public static readonly TICKETS_NOT_FOUND: string = 'TICKET_NOT_FOUND';
    // Errores en formato de fechas
    public static readonly INVALID_DATE_FORMAT: string = 'INVALID_DATE_FORMAT';
    // Errores de validación de datos
    public static readonly INVALID_NUMBER_FORMAT: string = 'INVALID_NUMBER_FORMAT';
    public static readonly DATE_MUST_BE_GREATER_THAN_TODAY: string = 'DATE_MUST_BE_GREATER_THAN_TODAY';
    public static readonly COMMISSION_MUST_BE_SPECIFIED: string = 'COMMISSION_MUST_BE_SPECIFIED';
    // Errores en la gestión de numeros restringidos
    public static readonly NUMBER_NOT_ALLOWED: string = 'NUMBER_NOT_ALLOWED';


}