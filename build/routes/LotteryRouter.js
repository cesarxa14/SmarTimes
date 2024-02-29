"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LotteryRouter = void 0;
const express_validator_1 = require("express-validator");
const LotteryController_1 = require("../controller/LotteryController");
const Translator_1 = require("../languages/Translator");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ErrorMiddleware_1 = require("../middlewares/ErrorMiddleware");
const ValidatorMiddleware_1 = require("../middlewares/ValidatorMiddleware");
const Permission_1 = require("../utils/auth/Permission");
const BaseRouter_1 = require("./BaseRouter");
const Utils_1 = require("../utils/Utils");
/**
 * Enrutador de las funciones asociadas a la lotería.
 */
class LotteryRouter extends BaseRouter_1.BaseRouter {
    /**
     * Constructor de la clase.
     */
    constructor() {
        super(LotteryRouter.LOTTERY_API);
    }
    registerRoutes() {
        this.router.post(LotteryRouter.CREATE_LOTTERY, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_LOTTERY)), (0, express_validator_1.body)('name').notEmpty().withMessage(Translator_1.Translator.LOTTERY_NAME_MUST_BE_SPECIFIED), (0, express_validator_1.body)('closing_time', Translator_1.Translator.CLOSING_TIME_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('lottery_time', Translator_1.Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_SPECIFIED).notEmpty(), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.createLottery));
        this.router.put(LotteryRouter.UPDATE_LOTTERY, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_LOTTERY)), (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('name').notEmpty().withMessage(Translator_1.Translator.LOTTERY_NAME_MUST_BE_SPECIFIED), (0, express_validator_1.body)('closing_time', Translator_1.Translator.CLOSING_TIME_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('lottery_time', Translator_1.Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_SPECIFIED).notEmpty(), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.LOTTERY_TYPE_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.updateLottery));
        this.router.delete(LotteryRouter.DELETE_LOTTERY, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_LOTTERY)), (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.deleteLottery));
        this.router.get(LotteryRouter.GET_LOTTERIES, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_LOTTERY)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getLotteries));
        this.router.post(LotteryRouter.PROGRAM_LOTTERY, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_LOTTERY)), (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('date', Translator_1.Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).custom(Utils_1.Utils.isValidDateFormat).withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).bail().custom(Utils_1.Utils.isFutureDate).withMessage(Translator_1.Translator.DATE_MUST_BE_GREATER_THAN_TODAY), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PROGRAM_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.programLottery));
        this.router.put(LotteryRouter.UPDATE_LOTTERY_PROGRAMING, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_LOTTERY)), (0, express_validator_1.body)('programming_lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('date', Translator_1.Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).custom(Utils_1.Utils.isValidDateFormat).withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).bail().custom(Utils_1.Utils.isFutureDate).withMessage(Translator_1.Translator.DATE_MUST_BE_GREATER_THAN_TODAY), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_LOTTERY_PROGRAMING)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.updateLotteryProgramming));
        this.router.get(LotteryRouter.GET_PROGRAMMED_LOTTERIES, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_PROGRAMMED_LOTTERIES)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getProgrammedLotteries));
        this.router.post(LotteryRouter.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE)), (0, express_validator_1.body)('lotteries', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(), (0, express_validator_1.body)('lotteries.*', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('date', Translator_1.Translator.LOTTERY_TIME_MUST_BE_SPECIFIED).notEmpty().isDate().withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).custom(Utils_1.Utils.isValidDateFormat).withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).bail().custom(Utils_1.Utils.isFutureDate).withMessage(Translator_1.Translator.DATE_MUST_BE_GREATER_THAN_TODAY), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.programMultipleLotteriesByDate));
        this.router.get(LotteryRouter.GET_LOTTERIES_TYPES, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_LOTTERY_TYPES)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getLotteriesTypes));
        this.router.get(LotteryRouter.GET_REVENTADO_AVAILABLE_BALLS, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_REVENTADO_AVAILABLE_BALLS)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getReventadoAviableBalls));
        this.router.get(LotteryRouter.GET_MONAZO_LOTTERY_TYPE, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_REVENTADO_AVAILABLE_BALLS)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getMonazoLotteryType));
        this.router.delete(LotteryRouter.DELETE_LOTTERY_PROGRAMMING, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.DELETE_LOTTERY_PROGRAMMING)), (0, express_validator_1.query)('programming_lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.DELETE_LOTTERY_PROGRAMMING)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.deleteLotteryProgramming));
        this.router.post(LotteryRouter.GENERATE_COMMON_LOTTERY_TICKET, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(), (0, express_validator_1.body)('numbers.*.number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_COMMON_LOTTERY_TICKET)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.createLotteryTicketMiddleware), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateCommonLotteryTicket));
        this.router.delete(LotteryRouter.CANCEL_LOTTERY_TICKET, (0, express_validator_1.query)('ticket_id', Translator_1.Translator.TICKET_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CANCEL_LOTTERY_TICKET)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.cancelLotteryTicket));
        this.router.get(LotteryRouter.GET_LOTTERY_TICKETS_BY_SELLER, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_LOTTERY_TICKETS)), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getTicketsBySeller));
        this.router.get(LotteryRouter.GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE, (0, express_validator_1.query)('programming_date', Translator_1.Translator.INVALID_DATE_FORMAT).notEmpty().withMessage(Translator_1.Translator.INVALID_DATE_FORMAT).bail().custom(Utils_1.Utils.isValidDateFormat).withMessage(Translator_1.Translator.INVALID_DATE_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getSellerLotteryProgrammingByDate));
        this.router.get(LotteryRouter.GET_SELLER_LOTTERIES_AVIABLE_TO_SELL, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_SELLER_LOTTERIES_AVIABLE_TO_SELL)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getSellerLotteriesAviableToSell));
        this.router.post(LotteryRouter.GENERATE_REVENTADO_LOTTERY_TICKET, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(), (0, express_validator_1.body)('numbers.*.number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_REVENTADO_LOTTERY_TICKET)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.createLotteryTicketMiddleware), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateReventadoLotteryTicket));
        this.router.post(LotteryRouter.GENERATE_MONAZOS_LOTTERY_TICKET, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(), (0, express_validator_1.body)('numbers.*.first_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT).bail().isInt({ min: 0, max: 9 }).withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.second_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT).isInt({ min: 0, max: 9 }).withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.third_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT).isInt({ min: 0, max: 9 }).withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.monazo_type_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_MONAZOS_LOTTERY_TICKET)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.createLotteryTicketMiddleware), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateMonazosLotteryTicket));
        this.router.post(LotteryRouter.GENERATE_PARLEY_LOTTERY_TICKET, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_type_id', Translator_1.Translator.PROGRAMMING_LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty(), (0, express_validator_1.body)('numbers.*.first_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.second_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('numbers.*.amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_PARLEY_LOTTERY_TICKET)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.createLotteryTicketMiddleware), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateParleyLotteryTicket));
        this.router.get(LotteryRouter.GET_LOTTERY_PRICES, (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_LOTTERY_PRICES)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getLotteryPrices));
        this.router.get(LotteryRouter.GET_REVENTADO_SUPPORTED_BALLS, (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_REVENTADO_SUPPORTED_BALLS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getReventadoSupportedBalls));
        this.router.post(LotteryRouter.CONFIG_REVENTADO_LOTTERY, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('red_ball_multiplier', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('multiplier', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CONFIG_REVENTADO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.configReventadoLottery));
        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_COMMON_LOTTERY, (0, express_validator_1.body)('number', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_prize_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_WINNING_NUMBERS_COMMON_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addWinningNumbersCommonLottery));
        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_PARLEY_LOTTERY, (0, express_validator_1.body)('first_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('second_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('third_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_WINNING_NUMBERS_PARLEY_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addWinningNumberParleyLottery));
        this.router.post(LotteryRouter.ADD_WINNING_NUMBERS_REVENTADO_LOTTERY, (0, express_validator_1.body)('number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('ball_type_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_WINNING_NUMBERS_REVENTADO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addWinningNumbersReventadoLottery));
        this.router.post(LotteryRouter.ADD_WINNING_NUMBER_MONAZO_LOTTERY, (0, express_validator_1.body)('first_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('second_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('third_number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_WINNING_NUMBER_MONAZO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addWinningNumberMonazoLottery));
        this.router.post(LotteryRouter.CONFIG_MONAZO_LOTTERY_TYPE, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('main_multiplier', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('secondary_multiplier', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('monazo_type_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CONFIG_MONAZO_LOTTERY_TYPE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.configMonazoLotteryType));
        this.router.post(LotteryRouter.CONFIG_PARLEY_LOTTERY, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('multiplier', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CONFIG_PARLEY_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.configParleyLotteryType));
        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateBillingStatementNormalLottery));
        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateBillingStatementReventadoLottery));
        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateBillingStatementMonazoLottery));
        this.router.post(LotteryRouter.GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateBillingStatementParleyLottery));
        this.router.post(LotteryRouter.GENERATE_LIST_PROGRAMMING_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GENERATE_LIST_PROGRAMMING_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.generateListProgrammingLottery));
        this.router.get(LotteryRouter.GET_TICKET_BY_ID, (0, express_validator_1.query)('ticket_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_TICKET_BY_ID)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getTicketById));
        this.router.post(LotteryRouter.ADD_REVENTADO_SUPPORTED_BALLS, (0, express_validator_1.body)('multiplier', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('ball_type_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_REVENTADO_SUPPORTED_BALLS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addReventadoSupportedBalls));
        this.router.post(LotteryRouter.ADD_LOTTERY_PRIZES, (0, express_validator_1.body)('multiplier', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('name', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isString().withMessage(Translator_1.Translator.LOTTERY_NAME_MUST_BE_SPECIFIED), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_LOTTERY_PRIZES)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addLotteryPrices));
        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_COMMON_LOTTERY, (0, express_validator_1.query)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_WINNING_NUMBERS_COMMON_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getWinningNumbersCommonLottery));
        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_COMMON_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_WINNING_NUMBERS_COMMON_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeWinningNumbersCommonLottery));
        this.router.delete(LotteryRouter.REMOVE_LOTTERY_PRICE, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('price_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_LOTTERY_PRICE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeLotteryPrices));
        this.router.delete(LotteryRouter.REMOVE_REVENTADO_SUPPORTED_BALLS, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('ball_type_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_REVENTADO_SUPPORTED_BALLS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeReventadoSupportedBalls));
        this.router.get(LotteryRouter.GET_PARLEY_LOTTERY_CONFIG, (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_PARLEY_LOTTERY_CONFIG)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getParleyLotteryConfig));
        this.router.get(LotteryRouter.GET_MONAZOS_LOTTERY_CONFIG, (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_MONAZOS_LOTTERY_CONFIG)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getMonazoLotteryConfig));
        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_REVENTADO_LOTTERY, (0, express_validator_1.query)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_WINNING_NUMBERS_REVENTADO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getWinningNumbersReventadoLottery));
        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeWinningNumbersReventadoLottery));
        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_MONAZOS_LOTTERY, (0, express_validator_1.query)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_WINNING_NUMBERS_MONAZOS_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getWinningNumbersMonazoLottery));
        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeWinningNumbersMonazoLottery));
        this.router.get(LotteryRouter.GET_WINNING_NUMBERS_PARLEY_LOTTERY, (0, express_validator_1.query)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_WINNING_NUMBERS_PARLEY_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getWinningNumbersParleyLottery));
        this.router.delete(LotteryRouter.REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY, (0, express_validator_1.body)('lottery_programming_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeWinningNumbersParleyLottery));
        this.router.get(LotteryRouter.GET_RESTRICTED_NUMBERS, (0, express_validator_1.query)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_RESTRICTED_NUMBERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getRestrictedNumbers));
        this.router.post(LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_LOTTERY, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_RESTRICTED_NUMBERS_TO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addRestrictedNumberToLottery));
        this.router.post(LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_SELLER, (0, express_validator_1.body)('lottery_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('number', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('amount', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.ADD_RESTRICTED_NUMBERS_TO_SELLER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.addRestrictedNumberToSeller));
        this.router.delete(LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY, (0, express_validator_1.body)('restricted_number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeRestrictedNumberToLottery));
        this.router.delete(LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_SELLER, (0, express_validator_1.body)('restricted_number_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_RESTRICTED_NUMBERS_TO_SELLER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.removeRestrictedNumberToSeller));
        this.router.get(LotteryRouter.GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING, (0, express_validator_1.query)('lottery_programming_id', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().bail().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(LotteryController_1.LotteryController.getRestrictedNumbersLotteryProgramming));
    }
}
exports.LotteryRouter = LotteryRouter;
/**
 * Base de las rutas de los servicios asociados a los usuarios.
 */
LotteryRouter.LOTTERY_API = '/lotteries';
/**
 * Nombre del endpoint que permite crear una lotería.
 */
LotteryRouter.CREATE_LOTTERY = '/createLottery';
/**
* Nombre del endpoint que permite actualizar una lotería.
*/
LotteryRouter.UPDATE_LOTTERY = '/updateLottery';
/**
* Nombre del endpoint que permite actualizar una lotería.
*/
LotteryRouter.DELETE_LOTTERY = '/deleteLottery';
/**
* Nombre del endpoint que permite obtener las loterías.
*/
LotteryRouter.GET_LOTTERIES = '/getLotteries';
/**
* Nombre del endpoint que permite programar las loterías.
*/
LotteryRouter.PROGRAM_LOTTERY = '/programLottery';
/**
 * Nombre del endpoint que permite actualizar las programaciones de las loterias
 */
LotteryRouter.UPDATE_LOTTERY_PROGRAMING = '/updateLotteryProgramming';
/**
 * Nombre del endpoint que permite obtener las loterías programadas.
 */
LotteryRouter.GET_PROGRAMMED_LOTTERIES = '/getProgrammedLotteries';
/**
* Nombre del endpoint que permite programar mnultiples loterias.
*/
LotteryRouter.PROGRAM_MULTIPLE_LOTTERIES_BY_DATE = '/programMultipleLotteriesByDate';
/**
 * Nombre del endpoint que permite los tipos de loterías.
 */
LotteryRouter.GET_LOTTERIES_TYPES = '/getLotteriesTypes';
/**
 * Nombre del endpoint que permite eliminar las programaciones de las loterias
 */
LotteryRouter.DELETE_LOTTERY_PROGRAMMING = '/deleteLotteryProgramming';
/**
* Nombre del endpoint que permite generar un ticket de lotería comun
*/
LotteryRouter.GENERATE_COMMON_LOTTERY_TICKET = '/generateCommonLotteryTicket';
/**
 * Nombre del endpoint que permite cancelar un ticket de lotería
 */
LotteryRouter.CANCEL_LOTTERY_TICKET = '/cancelLotteryTicket';
/**
* Nombre del endpoint que permite obtener los tickets filtrando
*/
LotteryRouter.GET_LOTTERY_TICKETS_BY_SELLER = '/getTicketsBySeller';
/**
* Nombre del endpoint que permite obtener los tickets que puede vender un Seller
*/
LotteryRouter.GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE = '/getSellerLotteryProgrammingByDate';
/**
* Nombre del endpoint que permite obtener las loterías que puede vender un seller
*/
LotteryRouter.GET_SELLER_LOTTERIES_AVIABLE_TO_SELL = '/getSellerLotteriesAviableToSell';
/**
* Nombre del endpoint que permite generar un ticket de lotería Reventado
*/
LotteryRouter.GENERATE_REVENTADO_LOTTERY_TICKET = '/generateReventadoLotteryTicket';
/**
* Nombre del endpoint que permite generar un ticket de lotteria 3 monazos
*/
LotteryRouter.GENERATE_MONAZOS_LOTTERY_TICKET = '/generateMonazosLotteryTicket';
/**
* Nombre del endpoint que permite generar un ticket de lotteria 3 monazos
*/
LotteryRouter.GENERATE_PARLEY_LOTTERY_TICKET = '/generateParleyLotteryTicket';
/**
 * Obtener los lottery prices dada una lotería
 */
LotteryRouter.GET_LOTTERY_PRICES = '/getLotteryPrices';
/**
 * Obtener los las bolas soportadas por dada una lotería de tipo reventado
 */
LotteryRouter.GET_REVENTADO_SUPPORTED_BALLS = '/getReventadoSupportedBalls';
/**
  * Obtener los resultados ganadores en la lotería común
  */
LotteryRouter.ADD_WINNING_NUMBERS_COMMON_LOTTERY = '/addWinningNumbersCommonLottery';
/**
  * Obtener los resultados ganadores en la lotería reventado
  */
LotteryRouter.ADD_WINNING_NUMBERS_REVENTADO_LOTTERY = '/addWinningNumbersReventadoLottery';
/**
  * Obtener los resultados ganadores en la lotería monazo
  */
LotteryRouter.ADD_WINNING_NUMBER_MONAZO_LOTTERY = '/addWinningNumberMonazoLottery';
/**
  * Obtener los resultados ganadores en la lotería parley
  */
LotteryRouter.ADD_WINNING_NUMBERS_PARLEY_LOTTERY = '/addWinningNumbersParleyLottery';
/**
  * Obtener la hoja de cobro de la lotería común
  */
LotteryRouter.GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY = '/generateBillingStatementNormalLottery';
/**
  * Obtener la hoja de cobro de la lotería reventado
  */
LotteryRouter.GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY = '/generateBillingStatementReventadoLottery';
/**
  * Obtener la hoja de cobro de la lotería Monazo
  */
LotteryRouter.GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY = '/generateBillingStatementMonazoLottery';
/**
  * Obtener la hoja de cobro de la lotería Parley
  */
LotteryRouter.GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY = '/generateBillingStatementParleyLottery';
/**
  * Obtener la lista de numeros de la programacion de la loteria
  */
LotteryRouter.GENERATE_LIST_PROGRAMMING_LOTTERY = '/generateListProgrammingLottery';
/**
 * Obtener Ticket por id
 */
LotteryRouter.GET_TICKET_BY_ID = '/getTicketByID';
/**
 * Añadir lottery prizes a una lotería
 */
LotteryRouter.ADD_LOTTERY_PRIZES = '/addLotteryPrices';
/**
 * Obtener Bolitas soportadas por una lotería
 */
LotteryRouter.ADD_REVENTADO_SUPPORTED_BALLS = '/addReventadoSupportedBalls';
/**
 * Configurar lotería de reventado
 */
LotteryRouter.CONFIG_REVENTADO_LOTTERY = '/configReventadoLottery';
/**
 * Obtener bolitas disponibles para bolita reventado
 */
LotteryRouter.GET_REVENTADO_AVAILABLE_BALLS = '/getReventadoAvailableBalls';
/**
 * Obtener tipos de loterías Monazo
 */
LotteryRouter.GET_MONAZO_LOTTERY_TYPE = '/getMonazoLotteryTypes';
/**
 * Configurar lotería monazo
 */
LotteryRouter.CONFIG_MONAZO_LOTTERY_TYPE = '/configMonazoLotteryType';
/**
 * Configurar lotería Parley
 */
LotteryRouter.CONFIG_PARLEY_LOTTERY = '/configParleyLottery';
/**
 * Obtener numeros ganadores loteria normal
 */
LotteryRouter.GET_WINNING_NUMBERS_COMMON_LOTTERY = '/getWinningNumbersCommonLottery';
/**
* remover numeros ganadores loteria normal
*/
LotteryRouter.REMOVE_WINNING_NUMBERS_COMMON_LOTTERY = '/removeWinningNumbersCommonLottery';
/**
* remover numeros ganadores loteria normal
*/
LotteryRouter.REMOVE_LOTTERY_PRICE = '/removeLotteryPrices';
/**
* remover numeros ganadores loteria normal
*/
LotteryRouter.REMOVE_REVENTADO_SUPPORTED_BALLS = '/removeReventadoSupportedBalls';
/**
* obtener configuracion de la lotería parley
*/
LotteryRouter.GET_PARLEY_LOTTERY_CONFIG = '/getParleyLotteryConfig';
/**
 * obtener configuracion de la lotería monazos
 */
LotteryRouter.GET_MONAZOS_LOTTERY_CONFIG = '/getMonazosLotteryConfig';
/**
* Obtener numeros ganadores loteria reventado
*/
LotteryRouter.GET_WINNING_NUMBERS_REVENTADO_LOTTERY = '/getWinningNumbersReventadoLottery';
/**
* remover numeros ganadores loteria reventado
*/
LotteryRouter.REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY = '/removeWinningNumbersRevenatdoLottery';
/**
* Obtener numeros ganadores loteria Parley
*/
LotteryRouter.GET_WINNING_NUMBERS_PARLEY_LOTTERY = '/getWinningNumbersParleyLottery';
/**
* remover numeros ganadores loteria Parley
*/
LotteryRouter.REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY = '/removeWinningNumbersParleyLottery';
/**
* Obtener numeros ganadores loteria Monazos
*/
LotteryRouter.GET_WINNING_NUMBERS_MONAZOS_LOTTERY = '/getWinningNumbersMonazosLottery';
/**
* remover numeros ganadores loteria Monazos
*/
LotteryRouter.REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY = '/removeWinningNumbersMonazosLottery';
/**
* Obtener números restringidos de una lotería
*/
LotteryRouter.GET_RESTRICTED_NUMBERS = '/getRestrictedNumbers';
/**
* Añadir numeros restringidos a una loteria
*/
LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_LOTTERY = '/addRestrictedNumberToLottery';
/**
* Añadir numeros restringidos a un vendedor
*/
LotteryRouter.ADD_RESTRICTED_NUMBERS_TO_SELLER = '/addRestrictedNumberToSeller';
/**
* Obtener números restringidos de una programación de lotería.
*/
LotteryRouter.GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING = '/getRestrictedNumbersLotteryProgramming';
/**
* Remover numeros restringidos a una loteria
*/
LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY = '/removeRestrictedNumberToLottery';
/**
* Remover numeros restringidos a un vendedor
*/
LotteryRouter.REMOVE_RESTRICTED_NUMBERS_TO_SELLER = '/removeRestrictedNumberToSeller';
//# sourceMappingURL=LotteryRouter.js.map