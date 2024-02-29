"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_validator_1 = require("express-validator");
const UserController_1 = require("../controller/UserController");
const Translator_1 = require("../languages/Translator");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ErrorMiddleware_1 = require("../middlewares/ErrorMiddleware");
const ValidatorMiddleware_1 = require("../middlewares/ValidatorMiddleware");
const Permission_1 = require("../utils/auth/Permission");
const Role_1 = require("../utils/auth/Role");
const BaseRouter_1 = require("./BaseRouter");
/**
 * Enrutador de las funciones asociadas a los usuarios.
 */
class UserRouter extends BaseRouter_1.BaseRouter {
    /**
     * Constructor de la clase.
     */
    constructor() {
        super(UserRouter.USER_API);
    }
    registerRoutes() {
        this.router.post(UserRouter.CREATE_BANQUER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('password', Translator_1.Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_BANKER)), UserController_1.UserController.createUserMiddleware(Role_1.Role.BANKER_USER), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.createBanker));
        this.router.post(UserRouter.CREATE_SELLER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('password', Translator_1.Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_SELLER)), UserController_1.UserController.createUserMiddleware(Role_1.Role.SELLER_USER), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.createSeller));
        this.router.post(UserRouter.CREATE_MANAGER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('password', Translator_1.Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_MANAGER)), UserController_1.UserController.createUserMiddleware(Role_1.Role.MANAGER_USER), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.createManager));
        this.router.get(UserRouter.GET_BANKERS, (0, express_validator_1.query)('page_number', Translator_1.Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_BANKERS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.getBankers));
        this.router.get(UserRouter.GET_USER_PERMISSIONS, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize()), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.getUserPermissions));
        this.router.put(UserRouter.UPDATE_BANKER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('user_to_update_id', Translator_1.Translator.USER_TO_UPDATE_REQUIRED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_BANKER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.updateUserMiddleware));
        this.router.put(UserRouter.UPDATE_MANAGER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('user_to_update_id', Translator_1.Translator.USER_TO_UPDATE_REQUIRED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_MANAGER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.updateManagerValidator), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.updateUserMiddleware));
        this.router.put(UserRouter.UPDATE_SELLER, (0, express_validator_1.body)('email').notEmpty().withMessage(Translator_1.Translator.EMAIL_MUST_BE_SPECIFIED).bail()
            .isEmail().withMessage(Translator_1.Translator.EMAIL_FORMAT_INCORRECT), (0, express_validator_1.body)('phone', Translator_1.Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(), (0, express_validator_1.body)('user_to_update_id', Translator_1.Translator.USER_TO_UPDATE_REQUIRED).notEmpty(), (0, express_validator_1.body)('bank_id', Translator_1.Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_SELLER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.updateSellerValidator), ErrorMiddleware_1.ErrorMiddleware.secureAsync(UserController_1.UserController.updateUserMiddleware));
    }
}
exports.UserRouter = UserRouter;
/**
 * Base de las rutas de los servicios asociados a los usuarios.
 */
UserRouter.USER_API = '/users';
/**
 * Nombre del endpoint que permite crear un banquero.
 */
UserRouter.CREATE_BANQUER = '/createBanker';
/**
 * Nombre del endpoint que permite crear un vendedor.
 */
UserRouter.CREATE_SELLER = '/createSeller';
/**
 * Nombre del endpoint que permite crear un administrador.
 */
UserRouter.CREATE_MANAGER = '/createManager';
/**
 * Nombre del endpoint que permite obtener los banqueros registrados.
 */
UserRouter.GET_BANKERS = '/getBankers';
/**
* Nombre del endpoint que permite obtener los permisos de un usuario.
*/
UserRouter.GET_USER_PERMISSIONS = '/getUserPermissions';
/**
* Nombre del endpoint que permite modificar un banquero.
*/
UserRouter.UPDATE_BANKER = '/updateBanker';
/**
 * Nombre del endpoint que permite modificar un manager.
 */
UserRouter.UPDATE_MANAGER = '/updateManager';
/**
 * Nombre del endpoint que permite modificar a un vendedor.
 */
UserRouter.UPDATE_SELLER = '/updateSeller';
//# sourceMappingURL=UserRouter.js.map