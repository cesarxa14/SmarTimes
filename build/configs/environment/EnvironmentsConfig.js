"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentConstants = void 0;
const dotenv = require('dotenv');
// Inicialización de variables de entornos. Se debe modificar el por la variable
// asociada al proyecto.
dotenv.config({
    path: `${process.env.EXPRESS_ENVIRONMENTS_CONFIG_PATH}/smar-times-api-environments/${process.env.NODE_ENV}.env`
});
/**
 * Clase donde se almacenan los valores de las variables de entorno necesarias en la aplicación.
 */
class EnvironmentConstants {
}
exports.EnvironmentConstants = EnvironmentConstants;
/**
 * Entorno test.
 */
EnvironmentConstants.TEST_ENV = 'test';
/**
 * Entorno development_local.
 */
EnvironmentConstants.DEVELOPMENT_LOCAL_ENV = 'development_local';
/**
 * Entorno development.
 */
EnvironmentConstants.DEVELOPMENT_ENV = 'development';
/**
 * Entorno production.
 */
EnvironmentConstants.PRODUCTION_ENV = 'production';
/**
 * Constante que almacena el entorno en el cual corre la aplicación.
 */
EnvironmentConstants.NODE_ENV = process.env.NODE_ENV;
/**
 * Identificador del proyecto de airbrake donde se notifican los errores de la API.
 */
EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_ID = process.env.PLATFORM_AIRBRAKE_PROJECT_ID;
/**
 * Clave del proyecto de airbrake donde se notifican los errores de la API.
 */
EnvironmentConstants.PLATFORM_AIRBRAKE_PROJECT_KEY = process.env.PLATFORM_AIRBRAKE_PROJECT_KEY;
/**
 * Folder where the app resources are located.
*/
EnvironmentConstants.RESOURCES_FOLDER = process.env.RESOURCES_FOLDER;
/**
 * Puerto por el que correrá la aplicación.
 */
EnvironmentConstants.APP_PORT = Number.parseInt(process.env.APP_PORT);
/**
 * Dirección base de la API.
 */
EnvironmentConstants.BASE_API = process.env.BASE_API;
/**
 * Dirección temporal donde se almacenan los archivos temporales
 * subidos al servidor.
 */
EnvironmentConstants.TEMP_UPLOAD_FOLDER = process.env.TEMP_UPLOAD_FOLDER;
/**
 * Dirección donde se encuentra ubicado el fichero de configuración del proyecto de firebase(
 * GOOGLE_APPLICATION_CREDENTIALS es el nombre de la variable de entorno que usa firebase por
 * defecto para esto).
 */
EnvironmentConstants.GOOGLE_APPLICATION_CREDENTIALS = process.env.GOOGLE_APPLICATION_CREDENTIALS;
//# sourceMappingURL=EnvironmentsConfig.js.map