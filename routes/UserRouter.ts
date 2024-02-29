
import { body, query } from "express-validator";
import { UserController } from "../controller/UserController";
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
export class UserRouter extends BaseRouter {
    /**
     * Base de las rutas de los servicios asociados a los usuarios.
     */
    private static readonly USER_API: string = '/users';

    /**
     * Nombre del endpoint que permite crear un banquero.
     */
    private static readonly CREATE_BANQUER: string = '/createBanker';

    /**
     * Nombre del endpoint que permite crear un vendedor.
     */
    private static readonly CREATE_SELLER: string = '/createSeller';

    /**
     * Nombre del endpoint que permite crear un administrador.
     */
    private static readonly CREATE_MANAGER: string = '/createManager';

    /**
     * Nombre del endpoint que permite obtener los banqueros registrados.
     */
    private static readonly GET_BANKERS: string = '/getBankers';

    /**
    * Nombre del endpoint que permite obtener los permisos de un usuario.
    */
    private static readonly GET_USER_PERMISSIONS: string = '/getUserPermissions';

    /**
    * Nombre del endpoint que permite modificar un banquero.
    */
    private static readonly UPDATE_BANKER: string = '/updateBanker';

    /**
     * Nombre del endpoint que permite modificar un manager.
     */
    private static readonly UPDATE_MANAGER: string = '/updateManager';

    /**
     * Nombre del endpoint que permite modificar a un vendedor.
     */
    private static readonly UPDATE_SELLER: string = '/updateSeller';

    /**
     * Constructor de la clase.
     */
    public constructor() {
        super(UserRouter.USER_API);
    }

    public registerRoutes(): void {
        this.router.post(UserRouter.CREATE_BANQUER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('password', Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_BANKER)),
            UserController.createUserMiddleware(Role.BANKER_USER),
            ErrorMiddleware.secureAsync(UserController.createBanker));

        this.router.post(UserRouter.CREATE_SELLER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('password', Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_SELLER)),
            UserController.createUserMiddleware(Role.SELLER_USER),
            ErrorMiddleware.secureAsync(UserController.createSeller)
        );

        this.router.post(UserRouter.CREATE_MANAGER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('password', Translator.PASSWORD_MUST_BE_SPECIFIED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_MANAGER)),
            UserController.createUserMiddleware(Role.MANAGER_USER),
            ErrorMiddleware.secureAsync(UserController.createManager)
        );

        this.router.get(UserRouter.GET_BANKERS,
            query('page_number', Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_BANKERS)),
            ErrorMiddleware.secureAsync(UserController.getBankers));

        this.router.get(UserRouter.GET_USER_PERMISSIONS,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize()),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(UserController.getUserPermissions));

        this.router.put(UserRouter.UPDATE_BANKER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('user_to_update_id', Translator.USER_TO_UPDATE_REQUIRED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_BANKER)),
            ErrorMiddleware.secureAsync(UserController.updateUserMiddleware)
            );

         this.router.put(UserRouter.UPDATE_MANAGER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('user_to_update_id', Translator.USER_TO_UPDATE_REQUIRED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_MANAGER)),
            ErrorMiddleware.secureAsync(UserController.updateManagerValidator),
            ErrorMiddleware.secureAsync(UserController.updateUserMiddleware)
            );
            
        this.router.put(UserRouter.UPDATE_SELLER,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED).bail()
                .isEmail().withMessage(Translator.EMAIL_FORMAT_INCORRECT),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('user_to_update_id', Translator.USER_TO_UPDATE_REQUIRED).notEmpty(),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_SELLER)),
            ErrorMiddleware.secureAsync(UserController.updateSellerValidator),
            ErrorMiddleware.secureAsync(UserController.updateUserMiddleware)
        )
    }
}