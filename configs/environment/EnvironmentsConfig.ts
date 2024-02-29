const dotenv = require('dotenv');

// Inicialización de variables de entornos. Se debe modificar el por la variable
// asociada al proyecto.
dotenv.config({
    path: `${process.env.EXPRESS_ENVIRONMENTS_CONFIG_PATH}/smar-times-api-environments/${process.env.NODE_ENV}.env`
});

/**
 * Clase donde se almacenan los valores de las variables de entorno necesarias en la aplicación.
 */
export class EnvironmentConstants {
    /**
     * Entorno test.
     */
    static readonly TEST_ENV: string = 'test';

    /**
     * Entorno development_local.
     */
    static readonly DEVELOPMENT_LOCAL_ENV: string = 'development_local';

    /**
     * Entorno development.
     */
    static readonly DEVELOPMENT_ENV: string = 'development';

    /**
     * Entorno production.
     */
    static readonly PRODUCTION_ENV: string = 'production';

    /**
     * Constante que almacena el entorno en el cual corre la aplicación.
     */
    static readonly NODE_ENV: string = process.env.NODE_ENV;

    /**
     * Identificador del proyecto de airbrake donde se notifican los errores de la API.
     */
     static readonly PLATFORM_AIRBRAKE_PROJECT_ID: string = process.env.PLATFORM_AIRBRAKE_PROJECT_ID;

     /**
      * Clave del proyecto de airbrake donde se notifican los errores de la API.
      */
     static readonly PLATFORM_AIRBRAKE_PROJECT_KEY: string = process.env.PLATFORM_AIRBRAKE_PROJECT_KEY;

     /**
      * Folder where the app resources are located.
     */
    static readonly RESOURCES_FOLDER: string = process.env.RESOURCES_FOLDER;

    /**
     * Puerto por el que correrá la aplicación.
     */
    static readonly APP_PORT: number = Number.parseInt(process.env.APP_PORT);

    /**
     * Dirección base de la API.
     */
    static readonly BASE_API: string = process.env.BASE_API;

    /**
     * Dirección temporal donde se almacenan los archivos temporales
     * subidos al servidor.
     */
    static readonly TEMP_UPLOAD_FOLDER: string = process.env.TEMP_UPLOAD_FOLDER;

    /**
     * Dirección donde se encuentra ubicado el fichero de configuración del proyecto de firebase(
     * GOOGLE_APPLICATION_CREDENTIALS es el nombre de la variable de entorno que usa firebase por
     * defecto para esto).
     */
    static readonly GOOGLE_APPLICATION_CREDENTIALS: string = process.env.GOOGLE_APPLICATION_CREDENTIALS;
}

