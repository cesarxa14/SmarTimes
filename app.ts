import express from "express";
import { DatabaseHelper } from "./configs/database/DatabaseHelper";
import { EnvironmentConstants } from "./configs/environment/EnvironmentsConfig";
import { initializeApp } from 'firebase-admin/app';
import { Translator } from "./languages/Translator";
import { ErrorMiddleware } from "./middlewares/ErrorMiddleware";
import { UserRouter } from "./routes/UserRouter";
import cors from 'cors';
import { BankRouter } from "./routes/BankRouter";
import { LotteryRouter } from "./routes/LotteryRouter";
import { PlanRouter } from "./routes/PlanRouter";


const Airbrake = require("@airbrake/node");
const airbrakeExpress = require("@airbrake/node/dist/instrumentation/express");

/**
 * Clase que contiene todos los recursos asociados a la aplicación.
 */
class App {
  /**
   * Instancia de express.
   */
  private _expressApp: express.Application;

  public get expressApp(): express.Application {
    return this._expressApp;
  }

  /**
   * Notificador de airbrake.
   */
  private _airbrake;

  /**
   * Método que permite registrar las rutas en la aplicación.
   */
  private registerRoutes(): void {
    // Inicializando las rutas del enrutador de los usuarios.
    const userRouter: UserRouter = new UserRouter();
    this._expressApp.use(userRouter.getBaseRoute(), userRouter.router);

    // Inicializando las rutas del enrutador de los bancos
    const bankRouter: BankRouter = new BankRouter();
    this._expressApp.use(bankRouter.getBaseRoute(), bankRouter.router);
    // Inicializando las rutas del enrutador de la lotería.
    const lotteryRouter: LotteryRouter = new LotteryRouter();
    this._expressApp.use(lotteryRouter.getBaseRoute(), lotteryRouter.router);
    // Inicializando las rutas del enrutador de los planes y licencias.
    const planRouter: PlanRouter = new PlanRouter();
    this._expressApp.use(planRouter.getBaseRoute(), planRouter.router);
  }

  /**
   * Método que permite registrar los manejadores de errores.
   */
  private registerErrorMiddlewares(): void {
    // Middleware que responde a los clientes cuando ocurre un error no manejado.
    this._expressApp.use(ErrorMiddleware.errorResponder);

    // Middleware que se encarga de almacenar el error en la base de datos.
    this._expressApp.use(ErrorMiddleware.errorLogger);

    if (this._airbrake)
      // Manejador de errores de airbrake.
      this._expressApp.use(airbrakeExpress.makeErrorHandler(this._airbrake));

    // Middleware que se encarga de responder a las solicitudes con rutas inválidas.
    this._expressApp.use(ErrorMiddleware.invalidRouteHandler);
  }

  /**
   * Método que permite configurar la app.
   */
  private configureApp(): void {
    // Permitiendo las solicitudes desde el localhost:4200 en cualquier entorno que no sea producción.
    if (EnvironmentConstants.NODE_ENV !== EnvironmentConstants.PRODUCTION_ENV) {
      const allowedOrigins = ['http://localhost:4200'];
      const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins
      };
      this._expressApp.use(cors(corsOptions));
    }

    // Definiendo el formato de intercambio con el servicio.
    this._expressApp.use(express.json());

    // Inicializando el manejador de la base de datos.
    DatabaseHelper.getInstance();

    // Inicializando el traductor.
    Translator.getInstance();

    // Configurando el notificador de airbrake.
    if (EnvironmentConstants.NODE_ENV.toLowerCase() != EnvironmentConstants.TEST_ENV.toLowerCase()) {
      this._airbrake = new Airbrake.Notifier({
        projectId: EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_ID || '480629',
        projectKey: EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_KEY || '81ef36d56aa787effebe42d5974af529',
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
  private initializeFirebase(): void {
    initializeApp();
  }


  /**
   * Constructors de la clase.
   */
  constructor() {
    this._expressApp = express();

    if (EnvironmentConstants.NODE_ENV === EnvironmentConstants.DEVELOPMENT_LOCAL_ENV) {
      this._expressApp.use(express.static(EnvironmentConstants.RESOURCES_FOLDER ||'C:\expressEnvironmentsPath\projects\smar-times-api-environments'))
    }

    this.configureApp();
  }
}

export default new App();
