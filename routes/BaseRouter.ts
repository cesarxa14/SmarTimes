import { Router } from "express";
import { EnvironmentConstants } from "../configs/environment/EnvironmentsConfig";

/**
 * Clase abstracta relacionada con los enrutadores.
 */
export abstract class BaseRouter {
    /**
     * Enrutador de la clase.
     */
    private _router: Router = null;

    /**
     * Base de la ruta de la clase hija.
     */
    private _childApi: string = null;

    /**
     * Constructor de la clase.
     */
    public constructor(childApi: string) {
        this._router = Router();
        this._childApi = childApi;
        this.registerRoutes();
    }

    /**
     * Método que permite registrar las rutas del enrutador.
     */
    public abstract registerRoutes(): void;

    /**
     * Método que permite obtener la ruta base de un enrutador.
     */
    public getBaseRoute(): string{
        return `${EnvironmentConstants.BASE_API}${this._childApi}`;
    }

    public get router(): Router {
        return this._router;
    }
    public set router(value: Router) {
        this._router = value;
    }

    public get childApi(): string {
        return this._childApi;
    }
    public set childApi(value: string) {
        this._childApi = value;
    }
}