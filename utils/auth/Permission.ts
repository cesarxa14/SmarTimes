/**
 * Enum que contiene los permisos soportados
 */
export enum Permission {
    // Permiso necesario para poder crear un banquero.
    CREATE_BANKER = 1,
    // Permiso necesario para poder crear un vendedor.
    CREATE_SELLER = 2,
    // Permiso necesario para poder crear un administrador.
    CREATE_MANAGER = 3,
    // Permiso necesario para poder obtener la información de los bancos.
    GET_BANKS = 4,
    // Permiso necesario para poder obtener los banqueros.
    GET_BANKERS = 5,
    // Permiso necesario para poder crear un banco
    CREATE_BANK = 6,
    // Permsiso necesario para poder eliminar a un banquero
    DELETE_BANKER = 7,
    // Permsiso necesario para poder crear una lotería
    CREATE_LOTTERY = 8,
    // Permsiso necesario para poder obtener las loterías
    GET_LOTTERIES = 9,
    // Permsiso necesario para poder modificar las loterías
    UPDATE_LOTTERY = 10,
    // Permsiso necesario para poder eliminar una lotería
    DELETE_LOTTERY = 11,
    // Permsiso necesario para programar una lotería
    PROGRAM_LOTTERY = 12,
    // Permiso necesario para poder editar un banco
    UPDATE_BANK = 13,
    // Permiso necesario para poder editar el propietario de un banco
    UPDATE_BANK_OWNER = 14,
    // Permsiso necesario para poder obtener los sorteos
    CHANGE_BANK_AVAILABILITY = 15,
    // Permiso necesario para poder actualizar las loterías
    UPDATE_LOTTERY_PROGRAMING = 16,
    // Permiso necesario para poder obtener las loterías programadas
    GET_PROGRAMMED_LOTTERIES = 17,
    // Permiso para programar loterías dada una fecha
    PROGRAM_MULTIPLE_LOTTERIES_BY_DATE = 18,
    // Permiso para listar los tipos de loterias
    GET_LOTTERY_TYPES = 19,
    // Permiso necesario para actualizar un banquero
    UPDATE_BANKER = 20,
    // Permiso necesario para poder actualizar a un administrador
    UPDATE_MANAGER = 21,
    // Permiso necesario para poder actualizar a un vendedor
    UPDATE_SELLER = 22,
    // Permiso para eliminar una programacion de loteria
    DELETE_LOTTERY_PROGRAMMING = 23,
    // Permiso para eliminar un administrador de banco
    DELETE_BANK_ADMIN = 24,
    // Permiso para eliminar un vendedor de banco
    DELETE_BANK_SELLER = 25,
    // Permiso para vincular un vendedor con un administrador
    LINK_BANK_SELLER_WITH_ADMIN = 26,
    // Permiso para desvincular un vendedor con un administrador
    UNLINK_BANK_SELLER_WITH_ADMIN = 27,
    // Permiso para obtener los vendedores de un banco
    GET_BANK_SELLERS = 28,
    // Permiso para obtener los managers de un banco
    GET_BANK_MANAGERS = 29,
    // Permiso para obtener las loterias de un banco
    GET_BANK_LOTTERIES = 30,
    // Permiso para parametrizar vendedores
    PARAMETRIZE_SELLERS = 31,
    // Permiso para parametrizar administradores
    PARAMETRIZE_MANAGERS = 32,
    // Generar ticket de lotería normal
    GENERATE_COMMON_LOTTERY_TICKET = 33,
    // Permiso para cancelar ticket de lotería
    CANCEL_LOTTERY_TICKET = 34,
    // Permiso para obtener los tickets de lotería
    GET_LOTTERY_TICKETS = 35,
    // Permiso para obtener las programaciones de loterías que pueden vender un vendedor en una fecha 
    GET_SELLER_LOTTERY_PROGRAMMING_BY_DATE = 36,
    // Permiso para obtener las loterías que pueden vender los SELLERS
    GET_SELLER_LOTTERIES_AVIABLE_TO_SELL = 37,
    // Permiso para generar ticket de lotería reventado
    GENERATE_REVENTADO_LOTTERY_TICKET = 38,
    // Permiso para generar ticket de lotería de 3 Monazos
    GENERATE_MONAZOS_LOTTERY_TICKET = 39,
    // Permiso para generar ticket de lotería de Parley
    GENERATE_PARLEY_LOTTERY_TICKET = 40,
    //Permiso para obtenerlos lottery_prize asociados a una lotería comun
    GET_LOTTERY_PRICES = 41,
    //Permiso para obtenerlos lottery_prize asociados a una lotería reventado
    GET_REVENTADO_SUPPORTED_BALLS = 42,
    //Permiso para obtener los números ganadores de una lotería comun
    ADD_WINNING_NUMBERS_COMMON_LOTTERY = 43,
    //Permiso para obtener los números ganadores de una lotería reventado
    ADD_WINNING_NUMBERS_REVENTADO_LOTTERY = 44,
    //Permiso para obtener los números ganadores de una lotería monazos
    ADD_WINNING_NUMBER_MONAZO_LOTTERY = 45,
    //Permiso para obtener los números ganadores de una lotería parley
    ADD_WINNING_NUMBERS_PARLEY_LOTTERY = 46,
    // Permiso para generar hoja de cobro de la lotería normal. 
    GENERATE_BILLING_STATEMENT_NORMAL_LOTTERY = 47,
    // Permiso para generar hoja de cobro de la lotería reventado. 
    GENERATE_BILLING_STATEMENT_REVENTADO_LOTTERY = 48,
    // Permiso para generar hoja de cobro de la lotería monazo. 
    GENERATE_BILLING_STATEMENT_MONAZO_LOTTERY = 49,
    // Permiso para generar hoja de cobro de la lotería parley. 
    GENERATE_BILLING_STATEMENT_PARLEY_LOTTERY = 50,
    // Generar Lista de Números de una programación de lotería
    GENERATE_LIST_PROGRAMMING_LOTTERY = 51,
    // Obtener Ticket por ID
    GET_TICKET_BY_ID = 52,
    // Operaciones de pagos/cobros sobre un vendedor
    BANK_VENDOR_PAYMENT_OPERATIONS = 53,
    // Obtener resumen de ventas de un vendedor
    GET_SALES_SUMMARY_FROM_SELLER = 54,
    // Añadir lottery prizes to a lottery
    ADD_LOTTERY_PRIZES = 55,
    // Añadir bolas soportadas
    ADD_REVENTADO_SUPPORTED_BALLS = 56,
    // Configurar lotería reventado
    CONFIG_REVENTADO_LOTTERY = 57,
    // Obtener bolas disponibles para lotería reventado
    GET_REVENTADO_AVAILABLE_BALLS = 58,
    // Obtener tipos de lotería monazo
    GET_MONAZO_LOTTERY_TYPE = 59,
    // Configurar lotería monazo
    CONFIG_MONAZO_LOTTERY_TYPE = 60,
    // Configurar lotería parley
    CONFIG_PARLEY_LOTTERY = 61,
    // Obtener resumen de comisiones de managers
    GET_SALES_SUMMARY_FROM_MANAGER = 62,
    // Crear Licencia
    CREATE_LICENSE = 63,
    // Actualizar Licencia
    UPDATE_LICENSE = 64,
    // remover bolas soportadas
    REMOVE_REVENTADO_SUPPORTED_BALLS = 65,
    // remover blottery prices
    REMOVE_LOTTERY_PRICE = 66,
    // obtener numeros ganadores lotería normal
    GET_WINNING_NUMBERS_COMMON_LOTTERY = 67,
    // obtener numeros ganadores lotería normal
    REMOVE_WINNING_NUMBERS_COMMON_LOTTERY = 68,
    // obtener configuracion de la lotería parley
    GET_PARLEY_LOTTERY_CONFIG = 69,
    // obtener configuracion de la lotería monazo
    GET_MONAZOS_LOTTERY_CONFIG = 70,
    // obtener numeros ganadores lotería parley
    GET_WINNING_NUMBERS_PARLEY_LOTTERY = 71,
    // obtener numeros ganadores lotería parley
    REMOVE_WINNING_NUMBERS_PARLEY_LOTTERY = 72,
    // obtener numeros ganadores lotería monazos
    GET_WINNING_NUMBERS_MONAZOS_LOTTERY = 73,
    // obtener numeros ganadores lotería monazos
    REMOVE_WINNING_NUMBERS_MONAZOS_LOTTERY = 74,
    // obtener numeros ganadores lotería monazos
    GET_WINNING_NUMBERS_REVENTADO_LOTTERY = 75,
    // obtener numeros ganadores lotería monazos
    REMOVE_WINNING_NUMBERS_REVENTADO_LOTTERY = 76,
    //Obtener números restringidos de una lotería
    GET_RESTRICTED_NUMBERS = 77,
    //Añadir numeros restringidos a una loteria
    ADD_RESTRICTED_NUMBERS_TO_LOTTERY = 78,
    //Añadir numeros restringidos a un vendedor
    ADD_RESTRICTED_NUMBERS_TO_SELLER = 79,
    //Obtener números restringidos de una programación de lotería.
    GET_RESTRICTED_NUMBERS_LOTTERY_PROGRAMMING = 80,
    //Remover Numeros restringidos de una lotería
    REMOVE_RESTRICTED_NUMBERS_TO_LOTTERY = 81,
    //Remover Numeros restringidos de un seller
    REMOVE_RESTRICTED_NUMBERS_TO_SELLER = 82,
    //Crear Plan
    CREATE_PLAN = 83,
    //Actualizar Plan
    UPDATE_PLAN = 84,
    //Deshabilitar Plan
    REMOVE_PLAN = 85,
    //Obtener Planes
    GET_PLANS = 86,
    //Obtener Licencias
    GET_LICENCE_BY_OWNER = 87,
}