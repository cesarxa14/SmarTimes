import { DatabaseHelper } from "../configs/database/DatabaseHelper";
import { Role } from "../utils/auth/Role";
import { Utils } from "../utils/Utils";

/**
 * Clase que contiene métodos útiles relacionados con los bancos.
 */
export class BankRepository {
    /**
     * Método que permite determinar si todos los vendedores pertenecen al
     * banco especificado.
     * @param bankId Identificador del banco en el cuál se buscarán a los vendedores.
     * @param sellersToCheck Identificadores de los vendedores a chequear en el banco.
     * @returns True si todos los vendedores pertenecen al banco especificado, false de lo contrario.
     */
    public static isAllowedToEditThisBank(bank, userRole: number, userId: number) {
        if (userRole == Role.SUPER_USER) {
            return true;
        } else if (userRole == Role.BANKER_USER && bank.owner_id == userId) {
            return true
        }
        return false;
    }
} 
 