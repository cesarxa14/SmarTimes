"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BankRepository = void 0;
const Role_1 = require("../utils/auth/Role");
/**
 * Clase que contiene métodos útiles relacionados con los bancos.
 */
class BankRepository {
    /**
     * Método que permite determinar si todos los vendedores pertenecen al
     * banco especificado.
     * @param bankId Identificador del banco en el cuál se buscarán a los vendedores.
     * @param sellersToCheck Identificadores de los vendedores a chequear en el banco.
     * @returns True si todos los vendedores pertenecen al banco especificado, false de lo contrario.
     */
    static isAllowedToEditThisBank(bank, userRole, userId) {
        if (userRole == Role_1.Role.SUPER_USER) {
            return true;
        }
        else if (userRole == Role_1.Role.BANKER_USER && bank.owner_id == userId) {
            return true;
        }
        return false;
    }
}
exports.BankRepository = BankRepository;
//# sourceMappingURL=BankRepository.js.map