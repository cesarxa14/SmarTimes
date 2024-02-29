"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const Translator_1 = require("../languages/Translator");
/**
 * Clase con métodos útiles que pueden ser reutilizados en la aplicación.
 */
class Utils {
    /**
     * Método que devuelve el tiempo actual en segundos.
     */
    static getCurrentTimeInSeconds() {
        return Math.floor(Date.now() / 1000);
    }
    /**
     * Método que permite obtener el idioma especificado por el cliente de la API en el request.
     * @param request Request a extraerle el idioma especificado.
     */
    static getClientLanguage(request) {
        let extractedLanguage = Translator_1.Language.SPANISH;
        if (request.headers['accept-language'] == Translator_1.Language.SPANISH || request.headers['accept-language'] == Translator_1.Language.ENGLISH)
            extractedLanguage = request.headers['accept-language'];
        return extractedLanguage;
    }
    /**
     * Método que permite generar un código aleatorio alfanumérico del tamaño especificado.
     * @param length Tamaño del código alfanumérico a generar.
     * @returns Código alfanumérico generado.
     */
    static generateRandomCode(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    /**
     * Método que devuelve la fecha actual en utc.
     * @returns Fecha actual en utc.
     */
    static getNowInUtc() {
        const nowDate = new Date();
        const nowInUtc = Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), nowDate.getUTCDate(), nowDate.getUTCHours(), nowDate.getUTCMinutes(), nowDate.getUTCSeconds());
        return new Date(nowInUtc);
    }
    /**
     * Método que devuelve si un dato es valido en formato: HH:mm:ss.
     * @returns Fecha actual en utc.
     */
    static isValidTime(time) {
        // Separate the hours, minutes, and seconds using a regular expression
        const timeParts = time.match(/^(\d{1,2}):(\d{2}):(\d{2})$/);
        if (timeParts === null) {
            // The time is not in the expected format
            return false;
        }
        // Get the values for the hours, minutes, and seconds
        const hours = parseInt(timeParts[1]);
        const minutes = parseInt(timeParts[2]);
        const seconds = parseInt(timeParts[3]);
        // Check if the values are numeric
        if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
            return false;
        }
        // Check if the time is valid
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(seconds);
        return date.getHours() === hours && date.getMinutes() === minutes && date.getSeconds() === seconds;
    }
    /**
    * Función para parsear la hora a Datetime en UTC
    */
    static parseTime(time) {
        let date = new Date();
        let timeArray = time.split(':');
        date.setUTCHours(Number.parseInt(timeArray[0]));
        date.setUTCMinutes(Number.parseInt(timeArray[1]));
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        return date;
    }
    /**
     * Funcion para parsear una fecha a Datetime en UTC
     *
     */
    static convertToUTC(dateString) {
        const dateParts = dateString.split('/');
        const year = dateParts[0];
        const month = dateParts[1] - 1;
        const day = dateParts[2];
        const date = new Date(Date.UTC(year, month, day));
        return date.toISOString();
    }
    /**
     * Funcion para sumar un día a una fecha y devolverla en formato Datetime en UTC
     *
     */
    static addDay(dateString) {
        const dateParts = dateString.split('/');
        const year = dateParts[0];
        const month = dateParts[1] - 1;
        const day = Number(dateParts[2]) + 1;
        const date = new Date(Date.UTC(year, month, day));
        return date.toISOString();
    }
    // Funcion para validar si la fecha tiene el formato correcto
    static isValidDateFormat(dateString) {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$/;
        return dateRegex.test(dateString);
    }
    // Funcion para validar si la fecha es futura
    static isFutureDate(dateString) {
        const date = new Date(dateString);
        // Crear today con la hora y los segundos en 00 00 00
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
    }
    // Funcion para validar si la fecha es futura
    static areDistinctNumbers(num1, num2, num3) {
        if (num1 !== num2 && num1 !== num3 && num2 !== num3) {
            return true;
        }
        else {
            return false;
        }
    }
    // Funcion para validar si un arreglo de 2 posiciones de enteros tiene coincidencia con un arreglo de 3 posiciones de enteros
    static coincidenDosNumeros(arr1, arr2) {
        // Crear un Set a partir del primer arreglo
        const set1 = new Set(arr1);
        // Contador para almacenar las coincidencias encontradas
        let coincidencias = 0;
        // Iterar sobre el segundo arreglo
        for (let num of arr2) {
            // Si el número está en el Set y aún no se han encontrado 2 coincidencias,
            // incrementar el contador y eliminar el número del Set para evitar duplicados
            if (set1.has(num) && coincidencias < 2) {
                coincidencias++;
                set1.delete(num);
            }
            // Si ya se encontraron 2 coincidencias, retornar true
            if (coincidencias === 2) {
                return true;
            }
        }
        // Si no se encontraron 2 coincidencias, retornar false
        return false;
    }
    // Funcion para extraer la hora de una fecha en formato UTC
    static getHour(dateString) {
        const date = new Date(dateString);
        return date.getUTCHours();
    }
    static joinDateAndHour(fecha, hora) {
        // Crear objetos Date a partir de las fechas UTC
        const fechaObj = new Date(fecha);
        const horaObj = new Date(hora);
        // Extraer la hora, minutos y segundos de la horaObj
        const horas = horaObj.getUTCHours();
        const minutos = horaObj.getUTCMinutes();
        const segundos = horaObj.getUTCSeconds();
        // Establecer la hora, minutos y segundos en el objeto de fecha
        fechaObj.setUTCHours(horas, minutos, segundos);
        // Devolver la fecha resultante en formato UTC
        return fechaObj.toISOString();
    }
}
exports.Utils = Utils;
//# sourceMappingURL=Utils.js.map