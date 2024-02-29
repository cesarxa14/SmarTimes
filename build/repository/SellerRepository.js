"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerRepository = void 0;
/**
 * Clase que contiene métodos útiles relacionados con los vendedores.
 */
class SellerRepository {
    /**
     * Método que permite determinar si todos los vendedores pertenecen al
     * banco especificado.
     * @param bankId Identificador del banco en el cuál se buscarán a los vendedores.
     * @param sellersToCheck Identificadores de los vendedores a chequear en el banco.
     * @returns True si todos los vendedores pertenecen al banco especificado, false de lo contrario.
     */
    static belongToBank({ bankId, sellersToCheck }) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
    }
}
exports.SellerRepository = SellerRepository;
//# sourceMappingURL=SellerRepository.js.map