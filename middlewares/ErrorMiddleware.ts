import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { DatabaseHelper } from "../configs/database/DatabaseHelper";
import { ApiError } from "../utils/api/ApiError";


/**
 * Estado asociados a un error.
 */
 export enum ErrorStatus{
    OPENED = 0,
    CLOSED
} 

/**
 * Middleware donde se encuentra el manejo de los errores no controlados en la API.
 */
export class ErrorMiddleware {

    /**
     * Middleware que permite llamar de manera segura(garantiza que se capturen las excepciones en los endpoint asincrónicos)
     * a los endpoints asincrónicos.
     * @param endpoint Endpoint que se quiere llamar.
     */
    public static readonly secureAsync = (endpoint: (request: Request, response: Response, next: NextFunction) => Promise<void>) => async (request: Request, response: Response, next: NextFunction) => {
        try{
            await endpoint(request, response, next);
        }
        catch (error) {
            next(error);
        }
    }
    

    /**
     * Middleware encargado de darle respuesta al cliente de la api cuando ocurre un error no manejado.
     * @param error Error no manejado ocurrido.
     * @param request Información de la solicitud http.
     * @param response Información de la respuesta http.
     * @param next Próximo middleware a llamar.
     */
    public static errorResponder(error: Error, request: Request, response: Response, next: NextFunction) {
        response.status(500).send(JSON.stringify(new ApiError({ debugErrorMessage: error.message })));
        next(error);
    }

    /**
     * Middleware encargado de almacenar en la bd el error no manejado ocurrido.
     * @param error Error no manejado ocurrido.
     * @param request Información de la solicitud http.
     * @param response Información de la respuesta http.
     * @param next Próximo middleware a llamar.
     */
    public static async errorLogger(error: Error, request: Request, response: Response, next: NextFunction) {
        const prismaManager: PrismaClient = DatabaseHelper.getInstance().prismaDatabaseManager;
        
        try {
            await prismaManager.error.create(
                {
                    data: {
                        message: error.message,
                        stack: error.stack,
                        url: request.url,
                        path: request.path,
                        time: new Date(),
                        error_status: ErrorStatus.OPENED,
                        request_body: JSON.stringify(request.body) 
                    }
                }
            );

            next(error);
        }
        catch(error){
            next(error);
        }
    }

    /**
     * Middleware encargado de responder cuando la ruta especificada no está registrada.
     * @param request 
     * @param response 
     * @param next 
     */
    public static invalidRouteHandler(request: Request, response: Response, next: NextFunction){
        response.status(404).send('Invalid route');
    }
}