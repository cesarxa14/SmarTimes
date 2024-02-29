import { PrismaClient } from "@prisma/client";

/**
 * Clase utilizada para facilitar el manejo de la base de datos.
 */
export class DatabaseHelper {

    /**
     * Instancia única  de la clase.
     */
    private static _instance: DatabaseHelper = null;

    /**
     * Manejador de la base de datos que utiliza prisma.
     */
    private _prismaDatabaseManager: PrismaClient;

    /**
     * Constructor de la clase.
     */
    private constructor() {
        this._prismaDatabaseManager = new PrismaClient();
    }

    /**
     * Método que devuelve y crea la instancia única de la clase en caso de ser necesario.
     */
    public static getInstance(): DatabaseHelper {
        if (DatabaseHelper._instance == null) {
            DatabaseHelper._instance = new DatabaseHelper();
        }
        return DatabaseHelper._instance;
    }

    public get prismaDatabaseManager(): PrismaClient {
        return this._prismaDatabaseManager;
    }
    public set prismaDatabaseManager(value: PrismaClient) {
        this._prismaDatabaseManager = value;
    }
}