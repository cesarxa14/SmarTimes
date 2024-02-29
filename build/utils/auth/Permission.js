"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Permission = void 0;
/**
 * Enum que contiene los permisos soportados
 */
var Permission;
(function (Permission) {
    // Permiso necesario para poder crear un banquero.
    Permission[Permission["CREATE_BANKER"] = 1] = "CREATE_BANKER";
    // Permiso necesario para poder crear un vendedor.
    Permission[Permission["CREATE_SELLER"] = 2] = "CREATE_SELLER";
    // Permiso necesario para poder crear un administrador.
    Permission[Permission["CREATE_MANAGER"] = 3] = "CREATE_MANAGER";
    // Permiso necesario para poder obtener la información de los bancos.
    Permission[Permission["GET_BANKS"] = 4] = "GET_BANKS";
    // Permiso necesario para poder obtener los banqueros.
    Permission[Permission["GET_BANKERS"] = 5] = "GET_BANKERS";
    // Permiso necesario para poder crear un banco
    Permission[Permission["CREATE_BANK"] = 6] = "CREATE_BANK";
    // Permsiso necesario para poder eliminar a un banquero
    Permission[Permission["DELETE_BANKER"] = 7] = "DELETE_BANKER";
    // Permsiso necesario para poder crear una lotería
    Permission[Permission["CREATE_LOTTERY"] = 8] = "CREATE_LOTTERY";
    // Permsiso necesario para poder obtener las loterías
    Permission[Permission["GET_LOTTERIES"] = 9] = "GET_LOTTERIES";
    // Permsiso necesario para poder modificar las loterías
    Permission[Permission["UPDATE_LOTTERY"] = 10] = "UPDATE_LOTTERY";
    // Permsiso necesario para poder eliminar una lotería
    Permission[Permission["DELETE_LOTTERY"] = 11] = "DELETE_LOTTERY";
    // Permsiso necesario para programar una lotería
    Permission[Permission["PROGRAM_LOTTERY"] = 12] = "PROGRAM_LOTTERY";
    // Permiso necesario para poder editar un banco
    Permission[Permission["UPDATE_BANK"] = 13] = "UPDATE_BANK";
    // Permiso necesario para poder editar el propietario de un banco
    Permission[Permission["UPDATE_BANK_OWNER"] = 14] = "UPDATE_BANK_OWNER";
    // Permsiso necesario para poder obtener los sorteos
    Permission[Permission["CHANGE_BANK_AVAILABILITY"] = 15] = "CHANGE_BANK_AVAILABILITY";
    // Permiso necesario para poder actualizar las loterías
    Permission[Permission["UPDATE_LOTTERY_PROGRAMING"] = 16] = "UPDATE_LOTTERY_PROGRAMING";
    // Permiso necesario para poder obtener las loterías programadas
    Permission[Permission["GET_PROGRAMMED_LOTTERIES"] = 17] = "GET_PROGRAMMED_LOTTERIES";
    // Permiso para programar loterías dada una fecha
    Permission[Permission["PROGRAM_MULTIPLE_LOTTERIES_BY_DATE"] = 18] = "PROGRAM_MULTIPLE_LOTTERIES_BY_DATE";
    // Permiso para listar los tipos de loterias
    Permission[Permission["GET_LOTTERY_TYPES"] = 19] = "GET_LOTTERY_TYPES";
    // Permiso necesario para actualizar un banquero
    Permission[Permission["UPDATE_BANKER"] = 20] = "UPDATE_BANKER";
    // Permiso necesario para poder actualizar a un administrador
    Permission[Permission["UPDATE_MANAGER"] = 21] = "UPDATE_MANAGER";
    // Permiso necesario para poder actualizar a un vendedor
    Permission[Permission["UPDATE_SELLER"] = 22] = "UPDATE_SELLER";
    // Permiso para eliminar una programacion de loteria
    Permission[Permission["DELETE_LOTTERY_PROGRAMMING"] = 23] = "DELETE_LOTTERY_PROGRAMMING";
    // Permiso para eliminar un administrador de banco
    Permission[Permission["DELETE_BANK_ADMIN"] = 24] = "DELETE_BANK_ADMIN";
    // Permiso para eliminar un vendedor de banco
    Permission[Permission["DELETE_BANK_SELLER"] = 25] = "DELETE_BANK_SELLER";
    // Permiso para vincular un vendedor con un administrador
    Permission[Permission["LINK_BANK_SELLER_WITH_ADMIN"] = 26] = "LINK_BANK_SELLER_WITH_ADMIN";
    // Permiso para desvincular un vendedor con un administrador
    Permission[Permission["UNLINK_BANK_SELLER_WITH_ADMIN"] = 27] = "UNLINK_BANK_SELLER_WITH_ADMIN";
    // Permiso para obtener los vendedores de un banco
    Permission[Permission["GET_BANK_SELLERS"] = 28] = "GET_BANK_SELLERS";
    // Permiso para obtener los managers de un banco
    Permission[Permission["GET_BANK_MANAGERS"] = 29] = "GET_BANK_MANAGERS";
    // Permiso para obtener las loterias de un banco
    Permission[Permission["GET_BANK_LOTTERIES"] = 30] = "GET_BANK_LOTTERIES";
    // Permiso para parametrizar vendedores
    Permission[Permission["PARAMETRIZE_SELLERS"] = 31] = "PARAMETRIZE_SELLERS";
    // Permiso para parametrizar administradores
    Permission[Permission["PARAMETRIZE_MANAGERS"] = 32] = "PARAMETRIZE_MANAGERS";
    // Generar ticket de lotería normal
    Permission[Permission["GENERATE_COMMON_LOTTERY_TICKET"] = 33] = "GENERATE_COMMON_LOTTERY_TICKET";
    // Permiso para cancelar ticket de lotería
    Permission[Permission["CANCEL_LOTTERY_TICKET"] = 34] = "CANCEL_LOTTERY_TICKET";
    // Permiso para obtener los tickets de lotería
    Permission[Permission["GET_LOTTERY_TICKETS"] = 35] = "GET_LOTTERY_TICKETS";
    // Permiso para obtener las programaciones de loterías que pueden vender un vendedor en una fecha 
    Permission[Permission["GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE"] = 36] = "GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE";
    // Permiso para obtener las loterías que pueden vender los SELLERS
    Permission[Permission["GET_SELLER_LOTTERIES_AVIABLE_TO_SELL"] = 37] = "GET_SELLER_LOTTERIES_AVIABLE_TO_SELL";
    // Permiso para generar ticket de lotería reventado
    Permission[Permission["GENERATE_REVENTADO_LOTTERY_TICKET"] = 38] = "GENERATE_REVENTADO_LOTTERY_TICKET";
    // Permiso para generar ticket de lotería de 3 Monazos
    Permission[Permission["GENERATE_MONAZOS_LOTTERY_TICKET"] = 39] = "GENERATE_MONAZOS_LOTTERY_TICKET";
    // Permiso para generar ticket de lotería de Parley
    Permission[Permission["GENERATE_PARLEY_LOTTERY_TICKET"] = 40] = "GENERATE_PARLEY_LOTTERY_TICKET";
    //Permiso para obtenerlos lottery_prize asociados a una lotería comun
    Permission[Permission["GET_LOTTERY_PRICES"] = 41] = "GET_LOTTERY_PRICES";
    //Permiso para obtenerlos lottery_prize asociados a una lotería reventado
    Permission[Permission["GET_REVENTADO_SUPPORTED_BALLS"] = 42] = "GET_REVENTADO_SUPPORTED_BALLS";
    //Permiso para obtener los números ganadores de una lotería comun
    Permission[Permission["ADD_WINNING_NUMBERS_COMMON_LOTTERY"] = 43] = "ADD_WINNING_NUMBERS_COMMON_LOTTERY";
    //Permiso para obtener los números ganadores de una lotería reventado
    Permission[Permission["ADD_WINNING_NUMBERS_REVENTADO_LOTTERY"] = 44] = "ADD_WINNING_NUMBERS_REVENTADO_LOTTERY";
    //Permiso para obtener los números ganadores de una lotería monazos
    Permission[Permission["ADD_WINNING_NUMBER_MONAZO_LOTTERY"] = 45] = "ADD_WINNING_NUMBER_MONAZO_LOTTERY";
    //Permiso para obtener los números ganadores de una lotería parley
    Permission[Permission["ADD_WINNING_NUMBERS_PARLEY_LOTTERY"] = 46] = "ADD_WINNING_NUMBERS_PARLEY_LOTTERY";
    // Permiso para generar hoja de cobro de la lotería normal. 
    Permission[Permission["GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY"] = 47] = "GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY";
    // Permiso para generar hoja de cobro de la lotería reventado. 
    Permission[Permission["GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY"] = 48] = "GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY";
    // Permiso para generar hoja de cobro de la lotería monazo. 
    Permission[Permission["GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY"] = 49] = "GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY";
    // Permiso para generar hoja de cobro de la lotería parley. 
    Permission[Permission["GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY"] = 50] = "GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY";
    // Generar Lista de Números de una programación de lotería
    Permission[Permission["GENERATE_LIST_PROGRAMMING_LOTTERY"] = 51] = "GENERATE_LIST_PROGRAMMING_LOTTERY";
    // Obtener Ticket por ID
    Permission[Permission["GET_TICKET_BY_ID"] = 52] = "GET_TICKET_BY_ID";
    // Operaciones de pagos/cobros sobre un vendedor
    Permission[Permission["BANK_VENDOR_PAYMENT_OPERATIONS"] = 53] = "BANK_VENDOR_PAYMENT_OPERATIONS";
    // Obtener resumen de ventas de un vendedor
    Permission[Permission["GET_SALES_SUMMARY_FROM_SELLER"] = 54] = "GET_SALES_SUMMARY_FROM_SELLER";
    // Añadir lottery prizes to a lottery
    Permission[Permission["ADD_LOTTERY_PRIZES"] = 55] = "ADD_LOTTERY_PRIZES";
    // Añadir bolas soportadas
    Permission[Permission["ADD_REVENTADO_SUPPORTED_BALLS"] = 56] = "ADD_REVENTADO_SUPPORTED_BALLS";
    // Configurar lotería reventado
    Permission[Permission["CONFIG_REVENTADO_LOTTERY"] = 57] = "CONFIG_REVENTADO_LOTTERY";
    // Obtener bolas disponibles para lotería reventado
    Permission[Permission["GET_REVENTADO_AVAILABLE_BALLS"] = 58] = "GET_REVENTADO_AVAILABLE_BALLS";
    // Obtener tipos de lotería monazo
    Permission[Permission["GET_MONAZO_LOTTERY_TYPE"] = 59] = "GET_MONAZO_LOTTERY_TYPE";
    // Configurar lotería monazo
    Permission[Permission["CONFIG_MONAZO_LOTTERY_TYPE"] = 60] = "CONFIG_MONAZO_LOTTERY_TYPE";
    // Configurar lotería parley
    Permission[Permission["CONFIG_PARLEY_LOTTERY"] = 61] = "CONFIG_PARLEY_LOTTERY";
    // Obtener resumen de comisiones de managers
    Permission[Permission["GET_SALES_SUMMARY_FROM_MANAGER"] = 62] = "GET_SALES_SUMMARY_FROM_MANAGER";
    // Crear Licencia
    Permission[Permission["CREATE_LICENSE"] = 63] = "CREATE_LICENSE";
    // Actualizar Licencia
    Permission[Permission["UPDATE_LICENSE"] = 64] = "UPDATE_LICENSE";
    // remover bolas soportadas
    Permission[Permission["REMOVE_REVENTADO_SUPPORTED_BALLS"] = 65] = "REMOVE_REVENTADO_SUPPORTED_BALLS";
    // remover blottery prices
    Permission[Permission["REMOVE_LOTTERY_PRICE"] = 66] = "REMOVE_LOTTERY_PRICE";
    // obtener numeros ganadores lotería normal
    Permission[Permission["GET_WINNING_NUMBERS_COMMON_LOTTERY"] = 67] = "GET_WINNING_NUMBERS_COMMON_LOTTERY";
    // obtener numeros ganadores lotería normal
    Permission[Permission["REMOVE_WINNING_NUMBERS_COMMON_LOTTERY"] = 68] = "REMOVE_WINNING_NUMBERS_COMMON_LOTTERY";
    // obtener configuracion de la lotería parley
    Permission[Permission["GET_PARLEY_LOTTERY_CONFIG"] = 69] = "GET_PARLEY_LOTTERY_CONFIG";
    // obtener configuracion de la lotería monazo
    Permission[Permission["GET_MONAZOS_LOTTERY_CONFIG"] = 70] = "GET_MONAZOS_LOTTERY_CONFIG";
    // obtener numeros ganadores lotería parley
    Permission[Permission["GET_WINNING_NUMBERS_PARLEY_LOTTERY"] = 71] = "GET_WINNING_NUMBERS_PARLEY_LOTTERY";
    // obtener numeros ganadores lotería parley
    Permission[Permission["REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY"] = 72] = "REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY";
    // obtener numeros ganadores lotería monazos
    Permission[Permission["GET_WINNING_NUMBERS_MONAZOS_LOTTERY"] = 73] = "GET_WINNING_NUMBERS_MONAZOS_LOTTERY";
    // obtener numeros ganadores lotería monazos
    Permission[Permission["REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY"] = 74] = "REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY";
    // obtener numeros ganadores lotería monazos
    Permission[Permission["GET_WINNING_NUMBERS_REVENTADO_LOTTERY"] = 75] = "GET_WINNING_NUMBERS_REVENTADO_LOTTERY";
    // obtener numeros ganadores lotería monazos
    Permission[Permission["REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY"] = 76] = "REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY";
    //Obtener números restringidos de una lotería
    Permission[Permission["GET_RESTRICTED_NUMBERS"] = 77] = "GET_RESTRICTED_NUMBERS";
    //Añadir numeros restringidos a una loteria
    Permission[Permission["ADD_RESTRICTED_NUMBERS_TO_LOTTERY"] = 78] = "ADD_RESTRICTED_NUMBERS_TO_LOTTERY";
    //Añadir numeros restringidos a un vendedor
    Permission[Permission["ADD_RESTRICTED_NUMBERS_TO_SELLER"] = 79] = "ADD_RESTRICTED_NUMBERS_TO_SELLER";
    //Obtener números restringidos de una programación de lotería.
    Permission[Permission["GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING"] = 80] = "GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING";
    //Remover Numeros restringidos de una lotería
    Permission[Permission["REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY"] = 81] = "REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY";
    //Remover Numeros restringidos de un seller
    Permission[Permission["REMOVE_RESTRICTED_NUMBERS_TO_SELLER"] = 82] = "REMOVE_RESTRICTED_NUMBERS_TO_SELLER";
    //Crear Plan
    Permission[Permission["CREATE_PLAN"] = 83] = "CREATE_PLAN";
    //Actualizar Plan
    Permission[Permission["UPDATE_PLAN"] = 84] = "UPDATE_PLAN";
    //Deshabilitar Plan
    Permission[Permission["REMOVE_PLAN"] = 85] = "REMOVE_PLAN";
    //Obtener Planes
    Permission[Permission["GET_PLANS"] = 86] = "GET_PLANS";
    //Obtener Licencias
    Permission[Permission["GET_LICENCE_BY_OWNER"] = 87] = "GET_LICENCE_BY_OWNER";
})(Permission = exports.Permission || (exports.Permission = {}));
//# sourceMappingURL=Permission.js.map