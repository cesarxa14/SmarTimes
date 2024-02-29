"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseHelper = void 0;
const client_1 = require("@prisma/client");
/**
 * Clase utilizada para facilitar el manejo de la base de datos.
 */
class DatabaseHelper {
    /**
     * Constructor de la clase.
     */
    constructor() {
        this._prismaDatabaseManager = new client_1.PrismaClient();
    }
    /**
     * Método que devuelve y crea la instancia única de la clase en caso de ser necesario.
     */
    static getInstance() {
        if (DatabaseHelper._instance == null) {
            DatabaseHelper._instance = new DatabaseHelper();
        }
        return DatabaseHelper._instance;
    }
    get prismaDatabaseManager() {
        return this._prismaDatabaseManager;
    }
    set prismaDatabaseManager(value) {
        this._prismaDatabaseManager = value;
    }
}
exports.DatabaseHelper = DatabaseHelper;
/**
 * Instancia única  de la clase.
 */
DatabaseHelper._instance = null;
//# sourceMappingURL=DatabaseHelper.js.map