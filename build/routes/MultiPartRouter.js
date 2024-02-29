"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiPartRouter = void 0;
const multer_1 = __importDefault(require("multer"));
const BaseRouter_1 = require("./BaseRouter");
const EnvironmentsConfig_1 = require("../configs/environment/EnvironmentsConfig");
/**
 * Clase abstracta que permite crear enrutadores con endpoints multipart.
 */
class MultiPartRouter extends BaseRouter_1.BaseRouter {
    /**
     * Constructor de la clase.
     * @param childApi Ruta de la Api hija.
     */
    constructor(childApi) {
        super(childApi);
        // Configurando la carpeta de archivos temporales subidos al server.
        const multerStorage = multer_1.default.diskStorage({
            destination: function (req, file, callback) {
                callback(null, EnvironmentsConfig_1.EnvironmentConstants.TEMP_UPLOAD_FOLDER);
            }
        });
        // Creando el manejador de ficheros subidos al servidor.
        this.uploadedFilesManager = (0, multer_1.default)({ storage: multerStorage });
    }
}
exports.MultiPartRouter = MultiPartRouter;
//# sourceMappingURL=MultiPartRouter.js.map