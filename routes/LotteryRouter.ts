
import { body, query } from "express-validator";
import { LotteryController } from "../controller/LotteryController";
import { Translator } from "../languages/Translator";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ErrorMiddleware } from "../middlewares/ErrorMiddleware";
import { ValidatorMiddleware } from "../middlewares/ValidatorMiddleware";
import { Permission } from "../utils/auth/Permission";
import { Role } from "../utils/auth/Role";
import { BaseRouter } from "./BaseRouter";
import { Utils } from "../utils/Utils";

/**
 * Enrutador de las funciones asociadas a la lotería.
 */
export class LotteryRouter extends BaseRouter {
    /**
     * Base de las rutas de los servicios asociados a los usuarios.
     */
    private static readonly LOTTERY_API: string = '/lotteries';

    /**
     * Nombre del endpoint que permite crear una lotería.
     */
    private static readonly CREATE_LOTTERY: string = '/createLottery';
    /**
    * Nombre del endpoint que permite actualizar una lotería.
    */
    private static readonly UPDATE_LOTTERY: string = '/updateLottery';
    /**
    * Nombre del endpoint que permite actualizar una lotería.
    */
    private static readonly DELETE_LOTTERY: string = '/deleteLottery';
    /**
    * Nombre del endpoint que permite obtener las loterías.
    */
    private static readonly GET_LOTTERIES: string = '/getLotteries';
    /**
    * Nombre del endpoint que permite programar las loterías.
    */
    private static readonly PROGRAM_LOTTERY: string = '/programLottery';
    /**
     * Nombre del endpoint que permite actualizar las programaciones de las loterias
     */
    private static readonly UPDATE_LOTTERY_PROGRAMING: string = '/updateLotteryProgramming';
    /**
     * Nombre del endpoint que permite obtener las loterías programadas.
     */
    private static readonly GET_PROGRAMMED_LOTTERIES: string = '/getProgrammedLotteries';
    /**
    * Nombre del endpoint que permite programar mnultiples loterias.
    */
    private static readonly PROGRAM_MULTIPLE_LOTTERIES_BY_DATE: string = '/programMultipleLotteriesByDate';
    /**
     * Nombre del endpoint que permite los tipos de loterías.
     */
    private static readonly GET_LOTTERIES_TYPES: string = '/getLotteriesTypes';
    /**
     * Nombre del endpoint que permite eliminar las programaciones de las loterias
     */
    private static readonly DELETE_LOTTERY_PROGRAMMING: string = '/deleteLotteryProgramming';
    /**
    * Nombre del endpoint que permite generar un ticket de lotería comun
    */
    private static readonly GENERATE_COMMON_LOTTERY_TICKET: string = '/generateCommonLotteryTicket';
    /**
     * Nombre del endpoint que permite cancelar un ticket de lotería
     */
    private static readonly CANCEL_LOTTERY_TICKET: string = '/cancelLotteryTicket';
    /**
    * Nombre del endpoint que permite obtener los tickets filtrando
    */
    private static readonly GET_LOTTERY_TICKETS_BY_SELLER: string = '/getTicketsBySeller';
    /**
    * Nombre del endpoint que permite obtener los tickets que puede vender un Seller
    */
    private static readonly GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE: string = '/getSellerLotteryProgrammingByDate';
    /**
   * Nombre del endpoint que permite obtener las loterías que puede vender un seller
   */
    private static readonly GET_SELLER_LOTTERIES_AVIABLE_TO_SELL: string = '/getSellerLotteriesAviableToSell';
    /**
    * Nombre del endpoint que permite generar un ticket de lotería Reventado
    */
    private static readonly GENERATE_REVENTADO_LOTTERY_TICKET: string = '/generateReventadoLotteryTicket';
    /**
    * Nombre del endpoint que permite generar un ticket de lotteria 3 monazos
    */
    private static readonly GENERATE_MONAZOS_LOTTERY_TICKET: string = '/generateMonazosLotteryTicket';
    /**
    * Nombre del endpoint que permite generar un ticket de lotteria 3 monazos
    */
    private static readonly GENERATE_PARLEY_LOTTERY_TICKET: string = '/generateParleyLotteryTicket';
    /**
     * Obtener los lottery prices dada una lotería
     */
    private static readonly GET_LOTTERY_PRICES: string = '/getLotteryPrices';
    /**
     * Obtener los las bolas soportadas por dada una lotería de tipo reventado
     */
    private static readonly GET_REVENTADO_SUPPORTED_BALLS: string = '/getReventadoSupportedBalls';
    /**
      * Obtener los resultados ganadores en la lotería común
      */
    private static readonly ADD_WINNING_NUMBERS_COMMON_LOTTERY: string = '/addWinningNumbersCommonLottery';
    /**
      * Obtener los resultados ganadores en la lotería reventado
      */
    private static readonly ADD_WINNING_NUMBERS_REVENTADO_LOTTERY: string = '/addWinningNumbersReventadoLottery';
    /**
      * Obtener los resultados ganadores en la lotería monazo
      */
    private static readonly ADD_WINNING_NUMBER_MONAZO_LOTTERY: string = '/addWinningNumberMonazoLottery';
    /**
      * Obtener los resultados ganadores en la lotería parley
      */
    private static readonly ADD_WINNING_NUMBERS_PARLEY_LOTTERY: string = '/addWinningNumbersParleyLottery';
    /**
      * Obtener la hoja de cobro de la lotería común	
      */
    private static readonly GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY: string = '/generateBillingStatementNormalLottery';
    /**
      * Obtener la hoja de cobro de la lotería reventado
      */
    private static readonly GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY: string = '/generateBillingStatementReventadoLottery';
    /**
      * Obtener la hoja de cobro de la lotería Monazo
      */
    private static readonly GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY: string = '/generateBillingStatementMonazoLottery';
    /**
      * Obtener la hoja de cobro de la lotería Parley
      */
    private static readonly GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY: string = '/generateBillingStatementParleyLottery';
    /**
      * Obtener la lista de numeros de la programacion de la loteria
      */
    private static readonly GENERATE_LIST_PROGRAMMING_LOTTERY: string = '/generateListProgrammingLottery';
    /**
     * Obtener Ticket por id
     */
    private static readonly GET_TICKET_BY_ID: string = '/getTicketByID';
    /**
     * Añadir lottery prizes a una lotería
     */
    private static readonly ADD_LOTTERY_PRIZES: string = '/addLotteryPrices';
    /**
     * Obtener Bolitas soportadas por una lotería
     */
    private static readonly ADD_REVENTADO_SUPPORTED_BALLS: string = '/addReventadoSupportedBalls';
    /**
     * Configurar lotería de reventado
     */
    private static readonly CONFIG_REVENTADO_LOTTERY: string = '/configReventadoLottery';
    /**
     * Obtener bolitas disponibles para bolita reventado
     */
    private static readonly GET_REVENTADO_AVAILABLE_BALLS: string = '/getReventadoAvailableBalls';
    /**
     * Obtener tipos de loterías Monazo
     */
    private static readonly GET_MONAZO_LOTTERY_TYPE: string = '/getMonazoLotteryTypes';
    /**
     * Configurar lotería monazo
     */
    private static readonly CONFIG_MONAZO_LOTTERY_TYPE: string = '/configMonazoLotteryType';
    /**
     * Configurar lotería Parley
     */
    private static readonly CONFIG_PARLEY_LOTTERY: string = '/configParleyLottery';
    /**
     * Obtener numeros ganadores loteria normal
     */
    private static readonly GET_WINNING_NUMBERS_COMMON_LOTTERY: string = '/getWinningNumbersCommonLottery';
    /**
    * remover numeros ganadores loteria normal
    */
    private static readonly REMOVE_WINNING_NUMBERS_COMMON_LOTTERY: string = '/removeWinningNumbersCommonLottery';
    /**
    * remover numeros ganadores loteria normal
    */
    private static readonly REMOVE_LOTTERY_PRICE: string = '/removeLotteryPrices';
    /**
    * remover numeros ganadores loteria normal
    */
    private static readonly REMOVE_REVENTADO_SUPPORTED_BALLS: string = '/removeReventadoSupportedBalls';
    /**
    * obtener configuracion de la lotería parley
    */
    private static readonly GET_PARLEY_LOTTERY_CONFIG: string = '/getParleyLotteryConfig';
    /**
     * obtener configuracion de la lotería monazos
     */
    private static readonly GET_MONAZOS_LOTTERY_CONFIG: string = '/getMonazosLotteryConfig';
    /**
    * Obtener numeros ganadores loteria reventado
    */
    private static readonly GET_WINNING_NUMBERS_REVENTADO_LOTTERY: string = '/getWinningNumbersReventadoLottery';
    /**
    * remover numeros ganadores loteria reventado
    */
    private static readonly REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY: string = '/removeWinningNumbersRevenatdoLottery';
    /**
    * Obtener numeros ganadores loteria Parley
    */
    private static readonly GET_WINNING_NUMBERS_PARLEY_LOTTERY: string = '/getWinningNumbersParleyLottery';
    /**
    * remover numeros ganadores loteria Parley
    */
    private static readonly REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY: string = '/removeWinningNumbersParleyLottery';
    /**
    * Obtener numeros ganadores loteria Monazos
    */
    private static readonly GET_WINNING_NUMBERS_MONAZOS_LOTTERY: string = '/getWinningNumbersMonazosLottery';
    /**
    * remover numeros ganadores loteria Monazos
    */
    private static readonly REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY: string = '/removeWinningNumbersMonazosLottery';
    /**
    * Obtener números restringidos de una lotería
    */
    private static readonly GET_RESTRICTED_NUMBERS: string = '/getRestrictedNumbers';
    /**
    * Añadir numeros restringidos a una loteria
    */
    private static readonly ADD_RESTRICTED_NUMBERS_TO_LOTTERY: string = '/addRestrictedNumberToLottery';
    /**
    * Añadir numeros restringidos a un vendedor
    */
    private static readonly ADD_RESTRICTED_NUMBERS_TO_SELLER: string = '/addRestrictedNumberToSeller';
    /**
    * Obtener números restringidos de una programación de lotería.
    */
    private static readonly GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING: string = '/getRestrictedNumbersLotteryProgramming';
    /**
    * Remover numeros restringidos a una loteria
    */
    private static readonly REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY: string = '/removeRestrictedNumberToLottery';
    /**
    * Remover numeros restringidos a un vendedor
    */
    private static readonly REMOVE_RESTRICTED_NUMBERS_TO_SELLER: string = '/removeRestrictedNumberToSeller';


    /**
     * Constructor de la clase.
     */

    public constructor() {
        super(LotteryRouter.LOTTERY_API);
    }

    public registerRoutes(): void {
        this.router.post(LotteryRouter.CREATE_LOTTERY,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_LOTTERY)),
            body('name').notEmpty().withMessage(Translator.LOTTERY_NAME_MUST_BE_SPECIFIED),
            body('closing_time', Translator.CLOSING_TIME_MUST_BE_SPECIFIED).notEmpty(),
            body('lottery_time', Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_SPECIFIED).notEmpty(),
            body('lottery_type_id', Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.createLottery));
        this.router.put(LotteryRouter.UPDATE_LOTTERY,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_LOTTERY)),
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty(),
            body('name').notEmpty().withMessage(Translator.LOTTERY_NAME_MUST_BE_SPECIFIED),
            body('closing_time', Translator.CLOSING_TIME_MUST_BE_SPECIFIED).notEmpty(),
            body('lottery_time', Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_SPECIFIED).notEmpty(),
            body('lottery_type_id', Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.updateLottery));
        this.router.delete(LotteryRouter.DELETE_LOTTERY,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_LOTTERY)),
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.deleteLottery));
        this.router.get(LotteryRouter.GET_LOTTERIES,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_LOTTERY)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getLotteries));
        this.router.post(LotteryRouter.PROGRAM_LOTTERY,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_LOTTERY)),
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('date', Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator.INVALID_DATE_FORMAT).custom(Utils.isValidDateFormat).withMessage(Translator.INVALID_DATE_FORMAT).bail().custom(Utils.isFutureDate).withMessage(Translator.DATE_MUST_BE_GREATER_THAN_TODAY),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PROGRAM_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.programLottery));
        this.router.put(LotteryRouter.UPDATE_LOTTERY_PROGRAMING,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_LOTTERY)),
            body('programming_lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('date', Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator.INVALID_DATE_FORMAT).custom(Utils.isValidDateFormat).withMessage(Translator.INVALID_DATE_FORMAT).bail().custom(Utils.isFutureDate).withMessage(Translator.DATE_MUST_BE_GREATER_THAN_TODAY),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_LOTTERY_PROGRAMING)),
            ErrorMiddleware.secureAsync(LotteryController.updateLotteryProgramming));
        this.router.get(LotteryRouter.GET_PROGRAMMED_LOTTERIES,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_PROGRAMMED_LOTTERIES)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getProgrammedLotteries));
        this.router.post(LotteryRouter.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE)),
            body('lotteries', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(),
            body('lotteries.*', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('date', Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator.INVALID_DATE_FORMAT).custom(Utils.isValidDateFormat).withMessage(Translator.INVALID_DATE_FORMAT).bail().custom(Utils.isFutureDate).withMessage(Translator.DATE_MUST_BE_GREATER_THAN_TODAY),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE)),
            ErrorMiddleware.secureAsync(LotteryController.programMultipleLotteriesByDate));
        this.router.get(LotteryRouter.GET_LOTTERIES_TYPES,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_LOTTERY_TYPES)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getLotteriesTypes));
        this.router.get(LotteryRouter.GET_REVENTADO_AVAILABLE_BALLS,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_REVENTADO_AVAILABLE_BALLS)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getReventadoAviableBalls));
        this.router.get(LotteryRouter.GET_MONAZO_LOTTERY_TYPE,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_REVENTADO_AVAILABLE_BALLS)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getMonazoLotteryType));
        this.router.delete(LotteryRouter.DELETE_LOTTERY_PROGRAMMING,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.DELETE_LOTTERY_PROGRAMMING)),
            query('programming_lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.DELETE_LOTTERY_PROGRAMMING)),
            ErrorMiddleware.secureAsync(LotteryController.deleteLotteryProgramming));
        this.router.post(LotteryRouter.GENERATE_COMMON_LOTTERY_TICKET,
            body('lottery_programming_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_type_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(),
            body('numbers.*.number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_COMMON_LOTTERY_TICKET)),
            ErrorMiddleware.secureAsync(LotteryController.createLotteryTicketMiddleware),
            ErrorMiddleware.secureAsync(LotteryController.generateCommonLotteryTicket));
        this.router.delete(LotteryRouter.CANCEL_LOTTERY_TICKET,
            query('ticket_id', Translator.TICKET_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CANCEL_LOTTERY_TICKET)),
            ErrorMiddleware.secureAsync(LotteryController.cancelLotteryTicket));
        this.router.get(LotteryRouter.GET_LOTTERY_TICKETS_BY_SELLER,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_LOTTERY_TICKETS)),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(LotteryController.getTicketsBySeller));
        this.router.get(LotteryRouter.GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE,
            query('programming_date', Translator.INVALID_DATE_FORMAT).notEmpty().withMessage(Translator.INVALID_DATE_FORMAT).bail().custom(Utils.isValidDateFormat).withMessage(Translator.INVALID_DATE_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE)),
            ErrorMiddleware.secureAsync(LotteryController.getSellerLotteryProgrammingByDate));
        this.router.get(LotteryRouter.GET_SELLER_LOTTERIES_AVIABLE_TO_SELL,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_SELLER_LOTTERIES_AVIABLE_TO_SELL)),
            ErrorMiddleware.secureAsync(LotteryController.getSellerLotteriesAviableToSell));
        this.router.post(LotteryRouter.GENERATE_REVENTADO_LOTTERY_TICKET,
            body('lottery_programming_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_type_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(),
            body('numbers.*.number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_REVENTADO_LOTTERY_TICKET)),
            ErrorMiddleware.secureAsync(LotteryController.createLotteryTicketMiddleware),
            ErrorMiddleware.secureAsync(LotteryController.generateReventadoLotteryTicket));
        this.router.post(LotteryRouter.GENERATE_MONAZOS_LOTTERY_TICKET,
            body('lottery_programming_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_type_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(),
            body('numbers.*.first_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT).bail().isInt({ min: 0, max: 9 }).withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.second_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT).isInt({ min: 0, max: 9 }).withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.third_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT).isInt({ min: 0, max: 9 }).withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.monazo_type_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),

            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_MONAZOS_LOTTERY_TICKET)),
            ErrorMiddleware.secureAsync(LotteryController.createLotteryTicketMiddleware),
            ErrorMiddleware.secureAsync(LotteryController.generateMonazosLotteryTicket));
        this.router.post(LotteryRouter.GENERATE_PARLEY_LOTTERY_TICKET,
            body('lottery_programming_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_type_id', Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(),
            body('numbers.*.first_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.second_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('numbers.*.amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_PARLEY_LOTTERY_TICKET)),
            ErrorMiddleware.secureAsync(LotteryController.createLotteryTicketMiddleware),
            ErrorMiddleware.secureAsync(LotteryController.generateParleyLotteryTicket));
        this.router.get(LotteryRouter.GET_LOTTERY_PRICES,
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_LOTTERY_PRICES)),
            ErrorMiddleware.secureAsync(LotteryController.getLotteryPrices));

        this.router.get(LotteryRouter.GET_REVENTADO_SUPPORTED_BALLS,
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_REVENTADO_SUPPORTED_BALLS)),
            ErrorMiddleware.secureAsync(LotteryController.getReventadoSupportedBalls));

        this.router.post(LotteryRouter.CONFIG_REVENTADO_LOTTERY,
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('red_ball_multiplier', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('multiplier', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CONFIG_REVENTADO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.configReventadoLottery));

        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_COMMON_LOTTERY,
            body('number', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_prize_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_WINNING_NUMBERS_COMMON_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.addWinningNumbersCommonLottery));

        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_PARLEY_LOTTERY,
            body('first_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('second_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('third_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_WINNING_NUMBERS_PARLEY_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.addWinningNumberParleyLottery));

        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_REVENTADO_LOTTERY,
            body('number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('ball_type_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_WINNING_NUMBERS_REVENTADO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.addWinningNumbersReventadoLottery));

        this.router.post(LotteryRouter.ADD_WINNING_NUMBER_MONAZO_LOTTERY,
            body('first_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('second_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('third_number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_WINNING_NUMBER_MONAZO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.addWinningNumberMonazoLottery));

        this.router.post(LotteryRouter.CONFIG_MONAZO_LOTTERY_TYPE,
            body('lottery_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('main_multiplier', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('secondary_multiplier', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('monazo_type_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CONFIG_MONAZO_LOTTERY_TYPE)),
            ErrorMiddleware.secureAsync(LotteryController.configMonazoLotteryType));
        this.router.post(LotteryRouter.CONFIG_PARLEY_LOTTERY,
            body('lottery_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('multiplier', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CONFIG_PARLEY_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.configParleyLotteryType));
        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.generateBillingStatementNormalLottery));

        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.generateBillingStatementReventadoLottery));

        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.generateBillingStatementMonazoLottery));

        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.generateBillingStatementParleyLottery));

        this.router.post(LotteryRouter.GENERATE_LIST_PROGRAMMING_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GENERATE_LIST_PROGRAMMING_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.generateListProgrammingLottery));
        this.router.get(LotteryRouter.GET_TICKET_BY_ID,
            query('ticket_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_TICKET_BY_ID)),
            ErrorMiddleware.secureAsync(LotteryController.getTicketById));

        this.router.post(LotteryRouter.ADD_REVENTADO_SUPPORTED_BALLS,
            body('multiplier', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('ball_type_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_REVENTADO_SUPPORTED_BALLS)),
            ErrorMiddleware.secureAsync(LotteryController.addReventadoSupportedBalls));
        this.router.post(LotteryRouter.ADD_LOTTERY_PRIZES,
            body('multiplier', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('name', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isString().withMessage(Translator.LOTTERY_NAME_MUST_BE_SPECIFIED),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_LOTTERY_PRIZES)),
            ErrorMiddleware.secureAsync(LotteryController.addLotteryPrices));

        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_COMMON_LOTTERY,
            query('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_WINNING_NUMBERS_COMMON_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.getWinningNumbersCommonLottery));

        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_COMMON_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_WINNING_NUMBERS_COMMON_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.removeWinningNumbersCommonLottery));

        this.router.delete(LotteryRouter.REMOVE_LOTTERY_PRICE,
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('price_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_LOTTERY_PRICE)),
            ErrorMiddleware.secureAsync(LotteryController.removeLotteryPrices));
        this.router.delete(LotteryRouter.REMOVE_REVENTADO_SUPPORTED_BALLS,
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('ball_type_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_REVENTADO_SUPPORTED_BALLS)),
            ErrorMiddleware.secureAsync(LotteryController.removeReventadoSupportedBalls));

        this.router.get(LotteryRouter.GET_PARLEY_LOTTERY_CONFIG,
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_PARLEY_LOTTERY_CONFIG)),
            ErrorMiddleware.secureAsync(LotteryController.getParleyLotteryConfig));
        this.router.get(LotteryRouter.GET_MONAZOS_LOTTERY_CONFIG,
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_MONAZOS_LOTTERY_CONFIG)),
            ErrorMiddleware.secureAsync(LotteryController.getMonazoLotteryConfig));

        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_REVENTADO_LOTTERY,
            query('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_WINNING_NUMBERS_REVENTADO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.getWinningNumbersReventadoLottery));

        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.removeWinningNumbersReventadoLottery));

        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_MONAZOS_LOTTERY,
            query('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_WINNING_NUMBERS_MONAZOS_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.getWinningNumbersMonazoLottery));

        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.removeWinningNumbersMonazoLottery));

        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_PARLEY_LOTTERY,
            query('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_WINNING_NUMBERS_PARLEY_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.getWinningNumbersParleyLottery));

        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY,
            body('lottery_programming_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.removeWinningNumbersParleyLottery));
        this.router.get(LotteryRouter.GET_RESTRICTED_NUMBERS,
            query('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_RESTRICTED_NUMBERS)),
            ErrorMiddleware.secureAsync(LotteryController.getRestrictedNumbers));
        this.router.post(LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_LOTTERY,
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_RESTRICTED_NUMBERS_TO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.addRestrictedNumberToLottery));
        this.router.post(LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_SELLER,
            body('lottery_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('number', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('amount', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.ADD_RESTRICTED_NUMBERS_TO_SELLER)),
            ErrorMiddleware.secureAsync(LotteryController.addRestrictedNumberToSeller));
        this.router.delete(LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY,
            body('restricted_number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY)),
            ErrorMiddleware.secureAsync(LotteryController.removeRestrictedNumberToLottery));
        this.router.delete(LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_SELLER,
            body('restricted_number_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_RESTRICTED_NUMBERS_TO_SELLER)),
            ErrorMiddleware.secureAsync(LotteryController.removeRestrictedNumberToSeller));
        this.router.get(LotteryRouter.GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING,
            query('lottery_programming_id', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING)),
            ErrorMiddleware.secureAsync(LotteryController.getRestrictedNumbersLotteryProgramming));
    }

}