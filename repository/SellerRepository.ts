/**
 * Clase que contiene métodos útiles relacionados con los vendedores.
 */
export class SellerRepository {
    /**
     * Método que permite determinar si todos los vendedores pertenecen al
     * banco especificado.
     * @param bankId Identificador del banco en el cuál se buscarán a los vendedores.
     * @param sellersToCheck Identificadores de los vendedores a chequear en el banco.
     * @returns True si todos los vendedores pertenecen al banco especificado, false de lo contrario.
     */
    static async belongToBank({bankId, sellersToCheck}: {
        bankId: number, sellersToCheck: Array<number>   
    }): Promise<boolean>{
        return false;
    }
}