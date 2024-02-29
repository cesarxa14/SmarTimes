import { Role } from "../utils/auth/Role";

export {}

declare global{
    namespace Express {
        /**
         * Extensión a la estructura request de Express.
         */
        export interface Request {
           clientUserId: number 
           clientUserUid: string
           clientUserRole: Role
        }
     }
}