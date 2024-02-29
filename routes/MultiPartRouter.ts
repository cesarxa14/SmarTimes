import multer, { Multer } from "multer";
import { BaseRouter } from "./BaseRouter";

import { Request} from "express";
import { EnvironmentConstants } from "../configs/environment/EnvironmentsConfig";

/**
 * Clase abstracta que permite crear enrutadores con endpoints multipart.
 */
export abstract class MultiPartRouter extends BaseRouter{
    /**
     * Manejador de ficheros subidos al servidor.
     */
    protected uploadedFilesManager: Multer;
    
    /**
     * Constructor de la clase.
     * @param childApi Ruta de la Api hija.
     */
    constructor(childApi: string){
        super(childApi);

        // Configurando la carpeta de archivos temporales subidos al server.
        const multerStorage = multer.diskStorage({
            destination: function(req: Request, file: Express.Multer.File, callback){
                callback(null, EnvironmentConstants.TEMP_UPLOAD_FOLDER);
            }
        });

        // Creando el manejador de ficheros subidos al servidor.
        this.uploadedFilesManager = multer({storage: multerStorage});
    }
}