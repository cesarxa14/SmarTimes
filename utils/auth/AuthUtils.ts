import { getAuth } from "firebase-admin/auth";
import { Role } from "./Role";

/**
 * Clase con métodos útiles relacionados con la autenticación de los usuarios.
 */
export class AuthUtils{
    /**
     * Método que permite actualizar el rol de un usuario.
     * @param role Rol a ponerle al usuario. 
     * @param uid Identificador del usuario a ponerle el rol.
     * @param id  Identificador del usuario en la base de datos local.
     */
    static async setUserRole({role, uid, id}: {role: Role, uid: string, id: number}): Promise<void>{
        await getAuth().setCustomUserClaims(uid, {role: role, id: id});
    }
}