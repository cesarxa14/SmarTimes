"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRouter = void 0;
const express_validator_1 = require("express-validator");
const BankController_1 = require("../controller/BankController");
const Translator_1 = require("../languages/Translator");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ErrorMiddleware_1 = require("../middlewares/ErrorMiddleware");
const ValidatorMiddleware_1 = require("../middlewares/ValidatorMiddleware");
const Permission_1 = require("../utils/auth/Permission");
const BaseRouter_1 = require("./BaseRouter");
/**
 * Enrutador de las funciones asociadas a los bancos.
 */
class BankRouter extends BaseRouter_1.BaseRouter {
    /**
     * Constructor de la clase.
     */
    constructor() {
        super(BankRouter.BANK_API);
    }
    registerRoutes() {
        this.router.get(BankRouter.GET_BANKS, (0, express_validator_1.query)('page_number', Translator_1.Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('elements_per_page', Translator_1.Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_BANKS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getBanks));
        this.router.post(BankRouter.CREATE_BANK, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('name', Translator_1.Translator.BANK_NAME_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('owner_id', Translator_1.Translator.BANK_OWNER_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_BANK)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.createBank));
        this.router.put(BankRouter.UPDATE_BANK, (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('name', Translator_1.Translator.BANK_NAME_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_BANK)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.updateBank));
        this.router.put(BankRouter.UPDATE_BANK_OWNER, (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('new_owner_id', Translator_1.Translator.BANK_OWNER_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_BANK_OWNER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.updateBankOwner));
        this.router.put(BankRouter.CHANGE_BANK_AVAILABILITY, (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('new_bank_availability', Translator_1.Translator.BANK_AVAILABILITY_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CHANGE_BANK_AVAILABILITY)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.changeBankAvailability));
        this.router.delete(BankRouter.DELETE_BANK_ADMIN, (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.BANK_ID_MUST_SPECIFIED), (0, express_validator_1.body)('manager_id', Translator_1.Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.DELETE_BANK_ADMIN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.deleteBankAdmin));
        this.router.delete(BankRouter.DELETE_BANK_SELLER, (0, express_validator_1.body)('seller_id', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.BANK_ID_MUST_SPECIFIED), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.DELETE_BANK_SELLER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.deleteBankSeller));
        this.router.post(BankRouter.LINK_BANK_SELLER_WITH_ADMIN, (0, express_validator_1.body)('manager_id', Translator_1.Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('seller_id', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.LINK_BANK_SELLER_WITH_ADMIN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.linkBankSellerToAdmin));
        this.router.post(BankRouter.UNLINK_BANK_SELLER_WITH_ADMIN, (0, express_validator_1.body)('manager_id', Translator_1.Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('seller_id', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UNLINK_BANK_SELLER_WITH_ADMIN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.unlinkBankSellerToAdmin));
        this.router.get(BankRouter.GET_BANK_SELLERS, (0, express_validator_1.query)('page_number', Translator_1.Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('elements_per_page', Translator_1.Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_BANK_SELLERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getBankSellers));
        this.router.get(BankRouter.GET_BANK_MANAGERS, (0, express_validator_1.query)('page_number', Translator_1.Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('elements_per_page', Translator_1.Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_BANK_MANAGERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getBankManagers));
        this.router.get(BankRouter.GET_BANK_LOTTERIES, (0, express_validator_1.query)('page_number', Translator_1.Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('elements_per_page', Translator_1.Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.query)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_BANK_LOTTERIES)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getBankLotteries));
        this.router.post(BankRouter.PARAMETRIZE_SELLERS, (0, express_validator_1.body)('sellers', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('sellers.*', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lotteries', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lotteries.*', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('commission', Translator_1.Translator.COMMISSION_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PARAMETRIZE_SELLERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.parametrizeSellers));
        this.router.post(BankRouter.PARAMETRIZE_MANAGERS, (0, express_validator_1.body)('managers', Translator_1.Translator.ADMIN_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('managers.*', Translator_1.Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lotteries', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('lotteries.*', Translator_1.Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('commission', Translator_1.Translator.COMMISSION_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PARAMETRIZE_SELLERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.parametrizeManagers));
        this.router.get(BankRouter.GET_SALES_SUMMARY_FROM_SELLER, (0, express_validator_1.query)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_SALES_SUMMARY_FROM_SELLER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getSalesSummaryFromSeller));
        this.router.get(BankRouter.GET_SALES_SUMMARY_FROM_MANAGER, (0, express_validator_1.query)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_SALES_SUMMARY_FROM_MANAGER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.getSalesSummaryFromManger));
        this.router.post(BankRouter.BANK_VENDOR_PAYMENT_OPERATIONS, (0, express_validator_1.body)('operation_type_id', Translator_1.Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('seller_id', Translator_1.Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.PARAMETRIZE_SELLERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(BankController_1.BankController.bankVendorPaymentOperations));
    }
}
exports.BankRouter = BankRouter;
/**
 * Base de las rutas de los servicios asociados a los bancos.
 */
BankRouter.BANK_API = '/banks';
/**
 * Método que permite devolver los bancos del super usuario o de un banquero en
 * específico.
 */
BankRouter.GET_BANKS = '/getBanks';
/**
 * Método que permite la creación de un banco.
 */
BankRouter.CREATE_BANK = '/createBank';
/**
 * Método que permite editar un banco.
 */
BankRouter.UPDATE_BANK = '/updateBank';
/**
 * Método que permite ediar el propietario de un banco.
 */
BankRouter.UPDATE_BANK_OWNER = '/updateBankOwner';
/**
 * Método que permite modificar la disponibilidad de un banco.
 */
BankRouter.CHANGE_BANK_AVAILABILITY = '/changeBankAvailability';
/**
 * Método que permite eliminar a un administrador de banco
 */
BankRouter.DELETE_BANK_ADMIN = '/deleteBankAdmin';
/**
 * Método que permite eliminar a un vendedor del banco
 */
BankRouter.DELETE_BANK_SELLER = '/deleteBankSeller';
/**
* Método que permite vincular a un vendedor con un Admin
*/
BankRouter.LINK_BANK_SELLER_WITH_ADMIN = '/linkBankSellerWithAdmin';
/**
* Método que permite desvincular a un vendedor con un Admin
*/
BankRouter.UNLINK_BANK_SELLER_WITH_ADMIN = '/unlinkBankSellerWithAdmin';
/**
* Método que permite obtener los vendedores de un banco
*/
BankRouter.GET_BANK_SELLERS = '/getBankSellers';
/**
 Método que permite obtener los vendedores de un banco
*/
BankRouter.GET_BANK_MANAGERS = '/getBankManagers';
/**
 Método que permite obtener los vendedores de un banco
*/
BankRouter.GET_BANK_LOTTERIES = '/getBankLotteries';
/**
Método que permite parametrizar los vendedores
*/
BankRouter.PARAMETRIZE_SELLERS = '/parametrizeSellers';
/**
Método que permite parametrizar los vendedores
*/
BankRouter.PARAMETRIZE_MANAGERS = '/parametrizeManagers';
/**
Método que permite obtener resumen de ventas de un vendedor
*/
BankRouter.GET_SALES_SUMMARY_FROM_SELLER = '/getSalesSummaryFromSeller';
/**
 *Método que permite obtener resumen de comisiones de los managers
 */
BankRouter.GET_SALES_SUMMARY_FROM_MANAGER = '/getSalesSummaryFromManager';
/**
 *Método operaciones de compra y venta de los bancos
 */
BankRouter.BANK_VENDOR_PAYMENT_OPERATIONS = '/bankVendorPaymentOperations';
//# sourceMappingURL=BankRouter.js.map