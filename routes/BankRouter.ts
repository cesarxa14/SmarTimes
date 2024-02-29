import { query, body } from "express-validator";
import { BankController } from "../controller/BankController";
import { Translator } from "../languages/Translator";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
import { ErrorMiddleware } from "../middlewares/ErrorMiddleware";
import { ValidatorMiddleware } from "../middlewares/ValidatorMiddleware";
import { Permission } from "../utils/auth/Permission";
import { BaseRouter } from "./BaseRouter";

/**
 * Enrutador de las funciones asociadas a los bancos.
 */
export class BankRouter extends BaseRouter {

    /**
     * Base de las rutas de los servicios asociados a los bancos.
     */
    private static readonly BANK_API: string = '/banks';

    /**
     * Método que permite devolver los bancos del super usuario o de un banquero en 
     * específico.
     */
    private static readonly GET_BANKS: string = '/getBanks';

    /**
     * Método que permite la creación de un banco.
     */
    private static readonly CREATE_BANK: string = '/createBank';

    /**
     * Método que permite editar un banco.
     */
    private static readonly UPDATE_BANK: string = '/updateBank';

    /**
     * Método que permite ediar el propietario de un banco.
     */
    private static readonly UPDATE_BANK_OWNER: string = '/updateBankOwner';

    /**
     * Método que permite modificar la disponibilidad de un banco.
     */
    private static readonly CHANGE_BANK_AVAILABILITY: string = '/changeBankAvailability';
    /**
     * Método que permite eliminar a un administrador de banco
     */
    private static readonly DELETE_BANK_ADMIN: string = '/deleteBankAdmin';
    /**
     * Método que permite eliminar a un vendedor del banco
     */
    private static readonly DELETE_BANK_SELLER: string = '/deleteBankSeller';
    /**
    * Método que permite vincular a un vendedor con un Admin
    */
    private static readonly LINK_BANK_SELLER_WITH_ADMIN: string = '/linkBankSellerWithAdmin';
    /**
    * Método que permite desvincular a un vendedor con un Admin
    */
    private static readonly UNLINK_BANK_SELLER_WITH_ADMIN: string = '/unlinkBankSellerWithAdmin';
    /**
    * Método que permite obtener los vendedores de un banco
    */
    private static readonly GET_BANK_SELLERS: string = '/getBankSellers';
    /**
     Método que permite obtener los vendedores de un banco
    */
    private static readonly GET_BANK_MANAGERS: string = '/getBankManagers';
    /**
     Método que permite obtener los vendedores de un banco
    */
    private static readonly GET_BANK_LOTTERIES: string = '/getBankLotteries';
    /**
    Método que permite parametrizar los vendedores
    */
    private static readonly PARAMETRIZE_SELLERS: string = '/parametrizeSellers';
    /**
    Método que permite parametrizar los vendedores
    */
    private static readonly PARAMETRIZE_MANAGERS: string = '/parametrizeManagers';
    /**
    Método que permite obtener resumen de ventas de un vendedor
    */
    private static readonly GET_SALES_SUMMARY_FROM_SELLER: string = '/getSalesSummaryFromSeller';
    /**
     *Método que permite obtener resumen de comisiones de los managers 
     */
    private static readonly GET_SALES_SUMMARY_FROM_MANAGER: string = '/getSalesSummaryFromManager';
    /**
     *Método operaciones de compra y venta de los bancos
     */
     private static readonly BANK_VENDOR_PAYMENT_OPERATIONS: string = '/bankVendorPaymentOperations';
    /**
     * Constructor de la clase.
     */
    public constructor() {
        super(BankRouter.BANK_API);
    }

    public registerRoutes(): void {
        this.router.get(BankRouter.GET_BANKS,
            query('page_number', Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(),
            query('elements_per_page', Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_BANKS)),
            ErrorMiddleware.secureAsync(BankController.getBanks)
        );

        this.router.post(BankRouter.CREATE_BANK,
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('name', Translator.BANK_NAME_MUST_BE_SPECIFIED).notEmpty(),
            body('owner_id', Translator.BANK_OWNER_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CREATE_BANK)),
            ErrorMiddleware.secureAsync(BankController.createBank)
        );

        this.router.put(BankRouter.UPDATE_BANK,
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            body('email').notEmpty().withMessage(Translator.EMAIL_MUST_BE_SPECIFIED),
            body('phone', Translator.PHONE_MUST_BE_SPECIFIED).notEmpty(),
            body('name', Translator.BANK_NAME_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_BANK)),
            ErrorMiddleware.secureAsync(BankController.updateBank)
        );

        this.router.put(BankRouter.UPDATE_BANK_OWNER,
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            body('new_owner_id', Translator.BANK_OWNER_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UPDATE_BANK_OWNER)),
            ErrorMiddleware.secureAsync(BankController.updateBankOwner)
        );

        this.router.put(BankRouter.CHANGE_BANK_AVAILABILITY,
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            body('new_bank_availability', Translator.BANK_AVAILABILITY_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.CHANGE_BANK_AVAILABILITY)),
            ErrorMiddleware.secureAsync(BankController.changeBankAvailability)
        )
        this.router.delete(BankRouter.DELETE_BANK_ADMIN,
            body('bank_id', Translator.BANK_ID_MUST_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.BANK_ID_MUST_SPECIFIED),
            body('manager_id', Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.DELETE_BANK_ADMIN)),
            ErrorMiddleware.secureAsync(BankController.deleteBankAdmin));
        this.router.delete(BankRouter.DELETE_BANK_SELLER,
            body('seller_id', Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.SELLER_ID_MUST_BE_SPECIFIED),
            body('bank_id', Translator.BANK_ID_MUST_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.BANK_ID_MUST_SPECIFIED),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.DELETE_BANK_SELLER)),
            ErrorMiddleware.secureAsync(BankController.deleteBankSeller));

        this.router.post(BankRouter.LINK_BANK_SELLER_WITH_ADMIN,
            body('manager_id', Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('seller_id', Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.LINK_BANK_SELLER_WITH_ADMIN)),
            ErrorMiddleware.secureAsync(BankController.linkBankSellerToAdmin));
        this.router.post(BankRouter.UNLINK_BANK_SELLER_WITH_ADMIN,
            body('manager_id', Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('seller_id', Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.UNLINK_BANK_SELLER_WITH_ADMIN)),
            ErrorMiddleware.secureAsync(BankController.unlinkBankSellerToAdmin));
        this.router.get(BankRouter.GET_BANK_SELLERS,
            query('page_number', Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(),
            query('elements_per_page', Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(),
            query('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_BANK_SELLERS)),
            ErrorMiddleware.secureAsync(BankController.getBankSellers)
        );
        this.router.get(BankRouter.GET_BANK_MANAGERS,
            query('page_number', Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(),
            query('elements_per_page', Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(),
            query('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_BANK_MANAGERS)),
            ErrorMiddleware.secureAsync(BankController.getBankManagers)
        );
        this.router.get(BankRouter.GET_BANK_LOTTERIES,
            query('page_number', Translator.PAGE_NUMBER_MUST_BE_SPECIFIED).notEmpty(),
            query('elements_per_page', Translator.ELEMENT_COUNT_PER_PAGE_MUST_BE_SPECIFIED).notEmpty(),
            query('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_BANK_LOTTERIES)),
            ErrorMiddleware.secureAsync(BankController.getBankLotteries)
        );
        this.router.post(BankRouter.PARAMETRIZE_SELLERS,
            body('sellers', Translator.SELLER_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('sellers.*', Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lotteries', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lotteries.*', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('commission', Translator.COMMISSION_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PARAMETRIZE_SELLERS)),
            ErrorMiddleware.secureAsync(BankController.parametrizeSellers));
        this.router.post(BankRouter.PARAMETRIZE_MANAGERS,
            body('managers', Translator.ADMIN_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('managers.*', Translator.ADMIN_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lotteries', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).isArray().notEmpty().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('lotteries.*', Translator.LOTTERY_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('commission', Translator.COMMISSION_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PARAMETRIZE_SELLERS)),
            ErrorMiddleware.secureAsync(BankController.parametrizeManagers));
        this.router.get(BankRouter.GET_SALES_SUMMARY_FROM_SELLER,
            query('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_SALES_SUMMARY_FROM_SELLER)),
            ErrorMiddleware.secureAsync(BankController.getSalesSummaryFromSeller)
        );
        this.router.get(BankRouter.GET_SALES_SUMMARY_FROM_MANAGER,
            query('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty(),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.GET_SALES_SUMMARY_FROM_MANAGER)),
            ErrorMiddleware.secureAsync(BankController.getSalesSummaryFromManger)
        );
        this.router.post(BankRouter.BANK_VENDOR_PAYMENT_OPERATIONS,
            body('operation_type_id', Translator.INVALID_NUMBER_FORMAT).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('seller_id', Translator.SELLER_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            body('bank_id', Translator.BANK_ID_MUST_BE_SPECIFIED).notEmpty().isNumeric().withMessage(Translator.INVALID_NUMBER_FORMAT),
            ValidatorMiddleware.validateFields,
            ErrorMiddleware.secureAsync(AuthMiddleware.authorize(Permission.PARAMETRIZE_SELLERS)),
            ErrorMiddleware.secureAsync(BankController.bankVendorPaymentOperations));
    }
}