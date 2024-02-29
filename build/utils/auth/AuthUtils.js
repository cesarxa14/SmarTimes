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
exports.AuthUtils = void 0;
const auth_1 = require("firebase-admin/auth");
/**
 * Clase con métodos útiles relacionados con la autenticación de los usuarios.
 */
class AuthUtils {
    /**
     * Método que permite actualizar el rol de un usuario.
     * @param role Rol a ponerle al usuario.
     * @param uid Identificador del usuario a ponerle el rol.
     * @param id  Identificador del usuario en la base de datos local.
     */
    static setUserRole({ role, uid, id }) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, auth_1.getAuth)().setCustomUserClaims(uid, { role: role, id: id });
        });
    }
}
exports.AuthUtils = AuthUtils;
//# sourceMappingURL=AuthUtils.js.map