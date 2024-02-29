"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
const EnvironmentsConfig_1 = require("../configs/environment/EnvironmentsConfig");
/**
 * Clase abstracta relacionada con los enrutadores.
 */
class BaseRouter {
    /**
     * Constructor de la clase.
     */
    constructor(childApi) {
        /**
         * Enrutador de la clase.
         */
        this._router = null;
        /**
         * Base de la ruta de la clase hija.
         */
        this._childApi = null;
        this._router = (0, express_1.Router)();
        this._childApi = childApi;
        this.registerRoutes();
    }
    /**
     * Método que permite obtener la ruta base de un enrutador.
     */
    getBaseRoute() {
        return `${EnvironmentsConfig_1.EnvironmentConstants.BASE_API}${this._childApi}`;
    }
    get router() {
        return this._router;
    }
    set router(value) {
        this._router = value;
    }
    get childApi() {
        return this._childApi;
    }
    set childApi(value) {
        this._childApi = value;
    }
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=BaseRouter.js.map