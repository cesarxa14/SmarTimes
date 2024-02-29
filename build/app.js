"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}; 
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const DatabaseHelper_1 = require("./configs/database/DatabaseHelper");
const EnvironmentsConfig_1 = require("./configs/environment/EnvironmentsConfig");
const app_1 = require("firebase-admin/app");
const Translator_1 = require("./languages/Translator");
const ErrorMiddleware_1 = require("./middlewares/ErrorMiddleware");
const UserRouter_1 = require("./routes/UserRouter");
const cors_1 = __importDefault(require("cors"));
const BankRouter_1 = require("./routes/BankRouter");
const LotteryRouter_1 = require("./routes/LotteryRouter");
const PlanRouter_1 = require("./routes/PlanRouter");
const Airbrake = require("@airbrake/node");
const airbrakeExpress = require("@airbrake/node/dist/instrumentation/express");
/**
 * Clase que contiene todos los recursos asociados a la aplicación.
 */
class App {
    get expressApp() {
        return this._expressApp;
    }
    /**
     * Método que permite registrar las rutas en la aplicación.
     */
    registerRoutes() {
        // Inicializando las rutas del enrutador de los usuarios.
        const userRouter = new UserRouter_1.UserRouter();
        this._expressApp.use(userRouter.getBaseRoute(), userRouter.router);
        // Inicializando las rutas del enrutador de los bancos
        const bankRouter = new BankRouter_1.BankRouter();
        this._expressApp.use(bankRouter.getBaseRoute(), bankRouter.router);
        // Inicializando las rutas del enrutador de la lotería.
        const lotteryRouter = new LotteryRouter_1.LotteryRouter();
        this._expressApp.use(lotteryRouter.getBaseRoute(), lotteryRouter.router);
        // Inicializando las rutas del enrutador de los planes y licencias.
        const planRouter = new PlanRouter_1.PlanRouter();
        this._expressApp.use(planRouter.getBaseRoute(), planRouter.router);
    }
    /**
     * Método que permite registrar los manejadores de errores.
     */
    registerErrorMiddlewares() {
        // Middleware que responde a los clientes cuando ocurre un error no manejado.
        this._expressApp.use(ErrorMiddleware_1.ErrorMiddleware.errorResponder);
        // Middleware que se encarga de almacenar el error en la base de datos.
        this._expressApp.use(ErrorMiddleware_1.ErrorMiddleware.errorLogger);
        if (this._airbrake)
            // Manejador de errores de airbrake.
            this._expressApp.use(airbrakeExpress.makeErrorHandler(this._airbrake));
        // Middleware que se encarga de responder a las solicitudes con rutas inválidas.
        this._expressApp.use(ErrorMiddleware_1.ErrorMiddleware.invalidRouteHandler);
    }
    /**
     * Método que permite configurar la app.
     */
    configureApp() {
        // Permitiendo las solicitudes desde el localhost:4200 en cualquier entorno que no sea producción.
        if (EnvironmentsConfig_1.EnvironmentConstants.NODE_ENV !== EnvironmentsConfig_1.EnvironmentConstants.PRODUCTION_ENV) {
            const allowedOrigins = ['http://localhost:4200'];
            const corsOptions = {
                origin: allowedOrigins
            };
            this._expressApp.use((0, cors_1.default)(corsOptions));
        }
        // Definiendo el formato de intercambio con el servicio.
        this._expressApp.use(express_1.default.json());
        // Inicializando el manejador de la base de datos.
        DatabaseHelper_1.DatabaseHelper.getInstance();
        // Inicializando el traductor.
        Translator_1.Translator.getInstance();
        // Configurando el notificador de airbrake.
        if (EnvironmentsConfig_1.EnvironmentConstants.NODE_ENV.toLowerCase() != EnvironmentsConfig_1.EnvironmentConstants.TEST_ENV.toLowerCase()) {
            this._airbrake = new Airbrake.Notifier({
                projectId: EnvironmentsConfig_1.EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_ID || '480629',
                projectKey: EnvironmentsConfig_1.EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_KEY || '81ef36d56aa787effebe42d5974af529',
            });
        }
        // registrando las rutas de la aplicación.
        this.registerRoutes();
        // registrando los manejadores de errores.
        this.registerErrorMiddlewares();
        // inicializando firebase.
        this.initializeFirebase();
    }
    /**
     * Método que permite inicializar firebase.
     */
    initializeFirebase() {
        (0, app_1.initializeApp)();
    }
    /**
     * Constructors de la clase.
     */
    constructor() {
        this._expressApp = (0, express_1.default)();
        if (EnvironmentsConfig_1.EnvironmentConstants.NODE_ENV === EnvironmentsConfig_1.EnvironmentConstants.DEVELOPMENT_LOCAL_ENV) {
            this._expressApp.use(express_1.default.static(EnvironmentsConfig_1.EnvironmentConstants.RESOURCES_FOLDER || 'C:\expressEnvironmentsPath\projects\smar-times-api-environments'));
        }
        this.configureApp();
    }
}
exports.default = new App();
//# sourceMappingURL=app.js.map