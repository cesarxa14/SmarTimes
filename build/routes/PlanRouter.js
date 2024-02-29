"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanRouter = void 0;
const express_validator_1 = require("express-validator");
const PlansController_1 = require("../controller/PlansController");
const Translator_1 = require("../languages/Translator");
const AuthMiddleware_1 = require("../middlewares/AuthMiddleware");
const ErrorMiddleware_1 = require("../middlewares/ErrorMiddleware");
const ValidatorMiddleware_1 = require("../middlewares/ValidatorMiddleware");
const Permission_1 = require("../utils/auth/Permission");
const BaseRouter_1 = require("./BaseRouter");
/**
 * Enrutador de las funciones asociadas a los usuarios.
 */
class PlanRouter extends BaseRouter_1.BaseRouter {
    /**
     * Constructor de la clase.
     */
    constructor() {
        super(PlanRouter.PLANS_API);
    }
    registerRoutes() {
        this.router.post(PlanRouter.CREATE_LICENSE, (0, express_validator_1.body)('owner_id').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('plan_id').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('expiration_date').notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_LICENSE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.createLicense));
        this.router.put(PlanRouter.UPDATE_LICENSE, (0, express_validator_1.body)('license_id').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('expiration_date').notEmpty(), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_LICENSE)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.updateLicense));
        this.router.post(PlanRouter.CREATE_PLAN, (0, express_validator_1.body)('name').notEmpty().isAlphanumeric().withMessage(Translator_1.Translator.BANK_NAME_MUST_BE_SPECIFIED), (0, express_validator_1.body)('seller_count').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('monthly_price').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('administrators').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('allowed_banks').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_PLAN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.createPlan));
        this.router.post(PlanRouter.CREATE_PLAN, (0, express_validator_1.body)('name').notEmpty().isAlphanumeric().withMessage(Translator_1.Translator.BANK_NAME_MUST_BE_SPECIFIED), (0, express_validator_1.body)('seller_count').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('monthly_price').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('administrators').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('allowed_banks').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.CREATE_PLAN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.createPlan));
        this.router.put(PlanRouter.UPDATE_PLAN, (0, express_validator_1.body)('name').notEmpty().isAlphanumeric().withMessage(Translator_1.Translator.BANK_NAME_MUST_BE_SPECIFIED), (0, express_validator_1.body)('seller_count').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('plan_id').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('monthly_price').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('administrators').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), (0, express_validator_1.body)('allowed_banks').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.UPDATE_PLAN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.updatePlan));
        this.router.delete(PlanRouter.REMOVE_PLAN, (0, express_validator_1.body)('plan_id').notEmpty().isNumeric().withMessage(Translator_1.Translator.INVALID_NUMBER_FORMAT), ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.REMOVE_PLAN)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.disablePlan));
        this.router.get(PlanRouter.GET_PLANS, ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_PLANS)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.getPlans));
        this.router.get(PlanRouter.GET_LICENCE_BY_OWNER, ValidatorMiddleware_1.ValidatorMiddleware.validateFields, ErrorMiddleware_1.ErrorMiddleware.secureAsync(AuthMiddleware_1.AuthMiddleware.authorize(Permission_1.Permission.GET_LICENCE_BY_OWNER)), ErrorMiddleware_1.ErrorMiddleware.secureAsync(PlansController_1.PlansController.getLicenceByOwner));
    }
}
exports.PlanRouter = PlanRouter;
/**
 * Base de las rutas de los servicios asociados a los usuarios.
 */
PlanRouter.PLANS_API = '/plans';
/**
 * Nombre del endpoint que permite crear una licencia.
 */
PlanRouter.CREATE_LICENSE = '/createLicense';
/**
 * Nombre del endpoint que permite actualizar una licencia.
 */
PlanRouter.UPDATE_LICENSE = '/updateLicense';
/**
* Nombre del endpoint que permite crear un plan
 */
PlanRouter.CREATE_PLAN = '/createPlan';
/**
* Nombre del endpoint que permite actualizar un plan
*/
PlanRouter.UPDATE_PLAN = '/updatePlan';
/**
* Nombre del endpoint que permite deshabilitar un plan
*/
PlanRouter.REMOVE_PLAN = '/removePlan';
/**
* Nombre del endpoint que permite deshabilitar un plan
*/
PlanRouter.GET_PLANS = '/getPlans';
/**
* Nombre del endpoint que permite deshabilitar un plan
*/
PlanRouter.GET_LICENCE_BY_OWNER = '/getLicenceByOwner';
//# sourceMappingURL=PlanRouter.js.map