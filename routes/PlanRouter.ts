
import { body, query } from "express-validator";
import { PlansController } from "../controller/PlansController";
import { Translator } from "../languages/Translator";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ErrorMiddleware } from "../middlewares/ErrorMiddleware";
import { ValidatorMiddleware } from "../middlewares/ValidatorMiddleware";
import { Permission } from "../utils/auth/Permission";
import { Role } from "../utils/auth/Role";
import { BaseRouter } from "./BaseRouter";

/**
 * Enrutador de las funciones asociadas a los usuarios.
 */
export class PlanRouter extends BaseRouter {
    /**
     * Base de las rutas de los servicios asociados a los usuarios.
     */
    private static readonly PLANS_API: string = '/plans';

    /**
     * Nombre del endpoint que permite crear una licencia.
     */
    private static readonly CREATE_LICENSE: string = '/createLicense';
    /**
     * Nombre del endpoint que permite actualizar una licencia.
     */
    private static readonly UPDATE_LICENSE: string = '/updateLicense';
    /**
    * Nombre del endpoint que permite crear un plan
     */
    private static readonly CREATE_PLAN: string = '/createPlan';
    /**
    * Nombre del endpoint que permite actualizar un plan
    */
    private static readonly UPDATE_PLAN: string = '/updatePlan';
    /**
    * Nombre del endpoint que permite deshabilitar un plan
    */
    private static readonly REMOVE_PLAN: string = '/removePlan';
    /**
    * Nombre del endpoint que permite deshabilitar un plan
    */
    private static readonly GET_PLANS: string = '/getPlans';
    /**
    * Nombre del endpoint que permite deshabilitar un plan
    */
    private static readonly GET_LICENCE_BY_OWNER: string = '/getLicenceByOwner';
    /**
     * Constructor de la clase.
     */
    public constructor() {
        super(PlanRouter.PLANS_API);
    }

    public registerRoutes(): void {
        this.router.post(PlanRouter.CREATE_LICENSE,
            body('owner_id').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('plan_id').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('expiration_date').notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_LICENSE)),
            ErrorMiddleware.secureAsync(PlansController.createLicense));
        this.router.put(PlanRouter.UPDATE_LICENSE,
            body('license_id').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('expiration_date').notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_LICENSE)),
            ErrorMiddleware.secureAsync(PlansController.updateLicense));
        this.router.post(PlanRouter.CREATE_PLAN,
            body('name').notEmpty().isAlphanumeric().withMessage(Translator.BANK_NAME_MUST_BE_SPECIFIED),
            body('seller_count').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('monthly_price').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('administrators').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('allowed_banks').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_PLAN)),
            ErrorMiddleware.secureAsync(PlansController.createPlan));
        this.router.post(PlanRouter.CREATE_PLAN,
            body('name').notEmpty().isAlphanumeric().withMessage(Translator.BANK_NAME_MUST_BE_SPECIFIED),
            body('seller_count').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('monthly_price').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('administrators').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('allowed_banks').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_PLAN)),
            ErrorMiddleware.secureAsync(PlansController.createPlan));
        this.router.put(PlanRouter.UPDATE_PLAN,
            body('name').notEmpty().isAlphanumeric().withMessage(Translator.BANK_NAME_MUST_BE_SPECIFIED),
            body('seller_count').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('plan_id').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('monthly_price').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('administrators').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('allowed_banks').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_PLAN)),
            ErrorMiddleware.secureAsync(PlansController.updatePlan));
        this.router.delete(PlanRouter.REMOVE_PLAN,
            body('plan_id').notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.REMOVE_PLAN)),
            ErrorMiddleware.secureAsync(PlansController.disablePlan));
        this.router.get(PlanRouter.GET_PLANS,
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_PLANS)),
            ErrorMiddleware.secureAsync(PlansController.getPlans));
        this.router.get(PlanRouter.GET_LICENCE_BY_OWNER,
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_LICENCE_BY_OWNER)),
            ErrorMiddleware.secureAsync(PlansController.getLicenceByOwner));
    }
}