import { Request, Response, NextFunction } from "express";
import { CreateRequest, getAuth, UserRecord } from "firebase-admin/auth";
import { DatabaseHelper } from "../configs/database/DatabaseHelper";
import { Language, Translator } from "../languages/Translator";
import { ApiError } from "../utils/api/ApiError";
import { AuthUtils } from "../utils/auth/AuthUtils";
import { Role } from "../utils/auth/Role";
import { Utils } from "../utils/Utils";
import { BankRepository } from "../repository/BankRepository";

/**
 * Clase controladora de los usuarios.
 */
export class LotteryController {


    /**
     * Método para crear una lotería.
     * @param request 
     * @param response 
     * @param next 
     */
    static async createLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        /**
         * name,closing_time,lottery_time,bank_id
         */
        const bankId: number = Number.parseInt(request.body.bank_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const name: string = request.body.name;
        const closingTime: Date = new Date(request.body.closing_time);
        const lotteryTime: Date = new Date(request.body.lottery_time);
        const bankerId: number = Number.parseInt(request.clientUserId);

        // Verificamos que el tipo de loteria exista
        const lotteryTypeExists = await prismaManager.lottery_type.findUnique({
            where: {
                id: lotteryType
            }
        });
        if (!lotteryTypeExists) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Verificamos que la fecha de cierre sea menor que la fecha de la loteria
        const ct = Utils.getHour(closingTime);
        const lt = Utils.getHour(lotteryTime);
        if (ct > lt) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Revisamos que el usuario tenga permiso para crear loterías en el banco
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: bankId
            }
        });

        // Revisamos que el banco exista
        if (!bank) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;

        }
        // Revisamos que el usuario tenga permiso para crear loterías en el banco en caso de ser super usuario.
        if (request.clientUserRole == Role.SUPER_USER) {

        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                        }
                    )
                );
                return;

            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                    }
                )
            );
            return;

        }

        // Según el tipo de lotería vinculamos y añadimos datos iniciales al resto
        let lottery;
        if (lotteryType == 2) {
            lottery = await prismaManager.lottery.create({
                data: {
                    name: name,
                    closing_time: closingTime,
                    lottery_time: lotteryTime,
                    bank_id: bankId,
                    lottery_type_id: lotteryType,
                    reventado_lottery: {
                        create: {
                            multiplier: -1
                        }
                    }
                },
                include: {
                    lottery_type: true,
                },
            });
        } else {
            lottery = await prismaManager.lottery.create({
                data: {
                    name: name,
                    closing_time: closingTime,
                    lottery_time: lotteryTime,
                    bank_id: bankId,
                    lottery_type_id: lotteryType,
                },
                include: {
                    lottery_type: true,
                },
            });
        }
        // Creamos la lotería

        response.status(statusCode).json({
            lottery
        });
    }
    static async updateLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryId: number = Number.parseInt(request.body.lottery_id);
        const bankId: number = Number.parseInt(request.body.bank_id);
        const lotteryTypeId: number = Number.parseInt(request.body.lottery_type_id);
        const name: string = request.body.name;
        const closingTime: Date = new Date(request.body.closing_time);
        const lotteryTime: Date = new Date(request.body.lottery_time);
        const bankerId: number = Number.parseInt(request.clientUserId);
        // Verificamos que la fecha de cierre sea menor que la fecha de la loteria
        if (closingTime > lotteryTime) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.CLOSING_TIME_GREATER_THAN_LOTTERY_TIME, { language: clientLanguage })
                    }
                )
            );
        }
        // Revisamos que el usuario tenga permiso para actualizar loterías en el banco
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: bankId
            }
        });
        // Revisamos que el banco exista
        if (!bank) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
        }
        // Revisamos que la lotería exista
        const lottery = await prismaManager.lottery.findUnique({
            where: {
                id: lotteryId,
            },
            include: {
                bank: true
            }
        });

        if (!lottery) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
        }
        const lottery_type = await prismaManager.lottery_type.findUnique({
            where: {
                id: lotteryTypeId,
            }
        })
        if (!lottery_type) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
        }
        // Revisamos que el usuario tenga permiso para actualizar loterías en el banco en caso de ser super usuario.
        if (request.clientUserRole == Role.SUPER_USER) {

        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (lottery.bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Actualizamos la lotería
        const updatedLottery = await prismaManager.lottery.update({
            where: {
                id: lotteryId
            },
            data: {
                name: name,
                closing_time: closingTime,
                lottery_time: lotteryTime,
                bank_id: bankId,
                lottery_type_id: lotteryTypeId
            },
            include: {
                lottery_type: true,
            }
        });

        response.status(statusCode).json({
            lottery: updatedLottery
        });
    }
    static async getLotteries(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const bankerId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const bankId: number = Number.parseInt(request.query.bank_id);
        // Comprobar que el usuario tiene acceso al banco
        // Revisamos que el usuario tenga permiso para crear loterías en el banco
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: bankId
            }
        });

        // Revisamos que el banco exista
        if (!bank) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
        }
        // Revisamos que el usuario tenga permiso para crear loterías en el banco en caso de ser super usuario.
        if (request.clientUserRole == Role.SUPER_USER) {

        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                        }
                    )
                );
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_CREATE_LOTTERY, { language: clientLanguage })
                    }
                )
            );
        }


        let lotteries;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;
            lotteries = await prismaManager.lottery.findMany(
                {
                    where: {
                        bank_id: bankId,
                        is_deleted: false
                    },
                    include: {
                        lottery_type: true,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        }
        else {
            lotteries = await prismaManager.lottery.findMany(
                {
                    where: {
                        bank_id: bankId,
                        is_deleted: false
                    },
                    include: {
                        lottery_type: true,
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            );
        }

        const lotteriesCountResult = await prismaManager.lottery.aggregate(
            {
                where: {
                    bank_id: bankId,
                    is_deleted: false
                },

                _count: {
                    id: true
                },

            }
        )

        responseObject = {
            'lotteries': lotteries,
            'lotteries_count': lotteriesCountResult._count.id
        }

        response.status(statusCode).send(responseObject);
    }
    static async deleteLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryId: number = Number.parseInt(request.query.lottery_id);
        const bankerId: number = Number.parseInt(request.clientUserId);

        // Revisamos que la lotería exista
        const lottery = await prismaManager.lottery.findUnique({
            where: {
                id: lotteryId,
            },
            include: {
                lottery_type: true,
            }
        });

        if (lottery.is_deleted) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                })
            );
            return;
        }

        // Revisamos que el usuario tenga permiso para eliminar la lotería
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: lottery.bank_id
            }
        });

        if (!bank) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage })
                })
            );
            return;
        }

        if (request.clientUserRole == Role.SUPER_USER) {

        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, { language: clientLanguage })
                    })
                );
                return;
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_DELETE_LOTTERY, { language: clientLanguage })
                })
            );
            return;
        }

        // Borramos la lotería de forma lógica
        await prismaManager.lottery.update({
            where: {
                id: lotteryId
            },
            include: {
                lottery_type: true,
            },
            data: {
                is_deleted: true
            }
        });
        lottery.is_deleted = true;
        response.status(statusCode).json({
            lottery: lottery
        });
    }
    static async programLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryId: number = Number.parseInt(request.body.lottery_id);
        const date: Date = new Date(Utils.convertToUTC(request.body.date));
        const bankerId: number = Number.parseInt(request.clientUserId);

        // Verificamos que la lotería exista
        const lottery = await prismaManager.lottery.findUnique({
            where: {
                id: lotteryId,
            },
            include: {
                restricted_number: true,
                seller_restricted_numbers: true,
                seller_commission: true
            }
        });

        if (lottery.is_deleted) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                })
            );
            return;
        }
        // Validacion para evitar crear dos programaciones de loterias en el mismo dia
        const programedLottery = await prismaManager.lottery_programming.findFirst({
            where: {
                lottery_id: lotteryId,
                date: date,
            }
        });
        if (programedLottery) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.LOTTERY_ALREADY_PROGRAMMED, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.LOTTERY_ALREADY_PROGRAMMED, { language: clientLanguage }),
                })
            );
            return;
        }
        // Verificamos que el usuario tenga permiso para programar la lotería
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: lottery.bank_id,
            },
        });

        if (request.clientUserRole == Role.SUPER_USER) {
            // El superusuario puede programar loterías en cualquier banco
        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                    })
                );
                return;
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                })
            );
            return;
        }

        // Creamos los números restringidos de la programación
        const restricted_numbers = lottery.restricted_number.map(number => {
            return {
                number: number.number,
                amount: number.amount
            }
        })
        // TODO: FIX IT
        const restricted_numbers_by_sellers = lottery.seller_restricted_numbers.map(number => {
            return {
                number: number.number,
                amount: number.amount
            }
        })
        let restricted_numbs = [];

        for (let sellerIndex = 0; sellerIndex < lottery.seller_commission.length; sellerIndex++) {
            const seller = lottery.seller_commission[sellerIndex];
            for (let restrictedNumberIndex = 0; restrictedNumberIndex < restricted_numbers_by_sellers.length; restrictedNumberIndex++) {
                const element = restricted_numbers_by_sellers[restrictedNumberIndex];
                restricted_numbs.push({
                    number: element.number,
                    amount: element.amount,
                    seller_id: seller.seller_id
                })
            }

        }
        if (lottery.lottery_type_id == 1 || lottery.lottery_type_id == 2) {

        }


        const lotteryProgramming = await prismaManager.lottery_programming.create({
            data: {
                lottery_id: lotteryId,
                date: Utils.joinDateAndHour(date, lottery.closing_time),
                programming_restricted_numbers: {
                    createMany: {
                        data: restricted_numbers
                    }
                },
                seller_programming_restricted_numbers: {
                    createMany: {
                        data: restricted_numbs
                    }
                }
            },
            include: {
                lottery: {
                    select: {
                        bank: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                programming_restricted_numbers: true,
                seller_programming_restricted_numbers: true
            }
        });

        response.status(statusCode).json({
            lottery_programming: lotteryProgramming,
        });
    }
    static async updateLotteryProgramming(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryProgrammingId: number = Number.parseInt(request.body.programming_lottery_id);
        const date: Date = new Date(Utils.convertToUTC(request.body.date));
        const bankerId: number = Number.parseInt(request.clientUserId);

        // Verificamos que la programación exista
        const lotteryProgramming = await prismaManager.lottery_programming.findUnique({
            where: {
                id: lotteryProgrammingId,
            },
        });

        if (lotteryProgramming.is_deleted) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                })
            );
            return;
        }

        // Verificamos que el usuario tenga permiso para actualizar la programación
        const lottery = await prismaManager.lottery.findUnique({
            where: {
                id: lotteryProgramming.lottery_id,
            },
        });
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: lottery.bank_id,
            },
        });

        if (request.clientUserRole == Role.SUPER_USER) {
            // El superusuario puede actualizar cualquier programación
        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                    })
                );
                return;
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                })
            );
            return;
        }

        // Actualizamos la programación
        const updatedLotteryProgramming = await prismaManager.lottery_programming.update({
            where: {
                id: lotteryProgrammingId,
            },
            data: {
                date: date,
            },
            include: {
                lottery: {
                    select: {
                        bank: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        response.status(statusCode).json({
            lottery_programming: updatedLotteryProgramming,
        });
    }
    static async getProgrammedLotteries(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const bankerId: number = Number.parseInt(request.clientUserId);
        const bankId: number = Number.parseInt(request.query.bank_id);
        let statusCode: number = 200;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        let startDate = request.query.start_date as string;
        let endDate = request.query.end_date;
        // Filtrado por fechas
        // Si el usuario es un superusuario, puede ver todas las programaciones
        if (startDate || endDate) {
            if (!Utils.isValidDateFormat(startDate) && !Utils.isValidDateFormat(endDate)) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.INVALID_DATE_FORMAT, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.INVALID_DATE_FORMAT, { language: clientLanguage }),
                    })
                );
                return;
            } else {
                startDate = await Utils.convertToUTC(startDate);
                // endDate = await Utils.convertToUTC(endDate);
                endDate = new Date(endDate);
                endDate = new Date(endDate.setUTCHours(23, 59, 59, 999));
            }
        }



        if (request.clientUserRole == Role.SUPER_USER) {
            // Si el usuario envía el identificador de banco se filtra por el banco
            if (bankId) {
                const bank = await prismaManager.bank.findUnique({
                    where: {
                        id: bankId
                    }
                });
                if (!bank) {
                    statusCode = 404;
                    response.status(statusCode).send(
                        new ApiError({
                            clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        })
                    );
                    return;
                }
                if (startDate && endDate) {


                    // Añadimos el filtro por las fechas
                    let lotteriesProgramings;

                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            },
                                            is_deleted: false
                                        }

                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            },
                                            name: true,
                                            lottery_time: true,
                                            closing_time: true,
                                            lottery_type_id: true
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            },
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            },
                                            name: true,
                                            lottery_time: true,
                                            closing_time: true,
                                            lottery_type_id: true
                                        }
                                    }
                                }
                            }
                        );
                    }

                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank: {
                                                id: bankId,
                                            },
                                            is_deleted: false

                                        }
                                    },
                                    {
                                        date: {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    },
                                    {
                                        is_deleted: false
                                    }
                                ]
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                } else {
                    let lotteriesProgramings;
                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false,
                                            },
                                        },
                                        {
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false,
                                            },

                                        },
                                        {
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }
                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank_id: bankId,
                                            is_deleted: false,
                                        },
                                    },
                                    {
                                        is_deleted: false
                                    }
                                ]
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                }
            } else {
                if (startDate && endDate) {


                    // Añadimos el filtro por las fechas
                    let lotteriesProgramings;

                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                is_deleted: false,
                                            }
                                        },
                                        {
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                is_deleted: false,
                                            }

                                        },
                                        {
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }

                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank: {
                                                owner_id: bankerId
                                            },
                                        },

                                    },
                                    {
                                        date: {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    },
                                    {
                                        is_deleted: false
                                    }
                                ]
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                } else {
                    let lotteriesProgramings;
                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            is_deleted: false,
                                            lottery: {
                                                is_deleted: false,
                                            }
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            is_deleted: false,
                                            lottery: {
                                                is_deleted: false,
                                            }
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }
                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                is_deleted: false,
                                lottery: {
                                    is_deleted: false,
                                }
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                }
            }

        } else if (request.clientUserRole == Role.BANKER_USER) {
            // Si el usuario envía el identificador de banco se filtra por el banco
            if (bankId) {
                // Si es banquero verificamos que el banco pertenezca al banquero
                const bank = await prismaManager.bank.findUnique({
                    where: {
                        id: bankId
                    }
                });
                if (!bank) {
                    statusCode = 404;
                    response.status(statusCode).send(
                        new ApiError({
                            clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND, { language: clientLanguage }),
                        })
                    );
                    return;
                }
                if (bank.owner_id != bankerId) {
                    statusCode = 403;
                    response.status(statusCode).send(
                        new ApiError({
                            clientErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.BANK_NOT_FOUND_FOR_OWNER, { language: clientLanguage }),
                        })
                    );
                    return;
                }

                if (startDate && endDate) {
                    // Añadimos el filtro por las fechas
                    let lotteriesProgramings;

                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            },
                                            is_deleted: false

                                        },


                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            },
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            },
                                            is_deleted: false
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }

                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank: {
                                                id: bankId,
                                            },
                                            is_deleted: false

                                        }
                                    },
                                    {
                                        date: {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    }, {
                                        is_deleted: false
                                    }
                                ]
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                } else {
                    let lotteriesProgramings;
                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            }
                                        },
                                        {
                                            is_deleted: false
                                        }

                                    ]

                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            lottery: {
                                                bank_id: bankId,
                                                is_deleted: false
                                            }
                                        },
                                        {
                                            is_deleted: false
                                        }

                                    ]

                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }
                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank_id: bankId,
                                            is_deleted: false
                                        }
                                    },
                                    {
                                        is_deleted: false
                                    }

                                ]

                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                }
            } else {
                if (startDate && endDate) {
                    // Añadimos el filtro por las fechas
                    let lotteriesProgramings;

                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            }
                                        }, {
                                            is_deleted: false,
                                        }, {
                                            lottery: {
                                                is_deleted: false
                                            }
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDate,
                                                lte: endDate
                                            }
                                        },
                                        {
                                            is_deleted: false
                                        },
                                        {
                                            lottery: {
                                                is_deleted: false
                                            }
                                        }
                                    ]
                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }

                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                AND: [
                                    {
                                        lottery: {
                                            bank: {
                                                owner_id: bankerId
                                            },
                                            is_deleted: false
                                        }
                                    },
                                    {
                                        date: {
                                            gte: startDate,
                                            lte: endDate
                                        }
                                    },
                                    {
                                        is_deleted: false
                                    }
                                ]
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                } else {
                    let lotteriesProgramings;
                    if (elementsPerPage) {
                        const elementsToSkip: number = pageNumber * elementsPerPage;
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    is_deleted: false,
                                    lottery: {
                                        is_deleted: false
                                    }

                                },
                                include: {
                                    lottery: {
                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                },
                                skip: elementsToSkip,
                                take: elementsPerPage
                            }
                        );
                    }
                    else {
                        lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                            {
                                where: {
                                    is_deleted: false
                                },
                                include: {
                                    lottery: {

                                        select: {
                                            lottery_type_id: true,
                                            bank: {
                                                select: {
                                                    id: true,
                                                    name: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        );
                    }
                    const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
                        {
                            where: {
                                lottery: {
                                    is_deleted: false
                                }
                            },
                            _count: {
                                id: true
                            },

                        }
                    )

                    responseObject = {
                        'lotteries_programings': lotteriesProgramings,
                        'lotteries_programings_count': lotteriesProgramingsCountResult._count.id
                    }

                    response.status(statusCode).send(responseObject);
                    return;
                }
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                })
            );
            return;
        }
    }
    public static async programMultipleLotteriesByDate(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        const bankerId: number = Number.parseInt(request.clientUserId);
        let statusCode: number = 201;
        let responseObject = null;

        const date: Date = new Date(Utils.convertToUTC(request.body.date));
        const lotteryIds: number[] = request.body.lotteries;

        // Verificar que existan las loterías y que el usuario tiene permiso para programarlas
        for (let i = 0; i < lotteryIds.length; i++) {
            const lottery = await prismaManager.lottery.findUnique({
                where: {
                    id: lotteryIds[i],
                },
                include: {
                    bank: true
                }
            });

            if (lottery.is_deleted) {
                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                    })
                );
                return;
            }
            if (request.clientUserRole == Role.BANKER_USER) {
                if (lottery.bank.owner_id != bankerId) {
                    statusCode = 403;
                    response.status(statusCode).send(
                        new ApiError({
                            clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                        })
                    );
                    return;
                }
            } else if (request.clientUserRole == Role.SUPER_USER) {
                // El superusuario puede programar cualquier lotería
            } else {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_PROGRAM_LOTTERY, { language: clientLanguage }),
                    })
                );
                return;
            }
        }
        let lotteriesProgramings = [];

        for (let i = 0; i < lotteryIds.length; i++) {
            const lotteryProgramming = await prismaManager.lottery_programming.create({
                data: {
                    lottery_id: lotteryIds[i],
                    date: date,
                },
                include: {
                    lottery: {
                        select: {
                            bank: {
                                select: {
                                    id: true,
                                    name: true
                                }
                            }
                        }
                    }
                }
            });
            lotteriesProgramings.push(lotteryProgramming);
        }

        responseObject = {
            'lotteries_programings': lotteriesProgramings,
        }

        response.status(statusCode).send(responseObject);
    }
    public static async getLotteriesTypes(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const lotteryTypes = await prismaManager.lottery_type.findMany();

        responseObject = {
            'lottery_types': lotteryTypes,
        }

        response.status(statusCode).send(responseObject);
    }
    static async deleteLotteryProgramming(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryProgrammingId: number = Number.parseInt(request.query.programming_lottery_id);
        const bankerId: number = Number.parseInt(request.clientUserId);

        // Verificamos que la programación exista
        const lotteryProgramming = await prismaManager.lottery_programming.findUnique({
            where: {
                id: lotteryProgrammingId,
            },
        });

        if (lotteryProgramming.is_deleted) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                })
            );
            return;
        }

        // Verificamos que el usuario tenga permiso para actualizar la programación
        const lottery = await prismaManager.lottery.findUnique({
            where: {
                id: lotteryProgramming.lottery_id,
            },
        });
        const bank = await prismaManager.bank.findUnique({
            where: {
                id: lottery.bank_id,
            },
        });

        if (request.clientUserRole == Role.SUPER_USER) {
            // El superusuario puede actualizar cualquier programación
        } else if (request.clientUserRole == Role.BANKER_USER) {
            if (bank.owner_id != bankerId) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError({
                        clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                    })
                );
                return;
            }
        } else {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError({
                    clientErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                    debugErrorMessage: translator.getTranslation(Translator.USER_NOT_ALLOWED_TO_UPDATE_LOTTERY_PROGRAMMING, { language: clientLanguage }),
                })
            );
            return;
        }

        // Actualizamos la programación
        const deletedLotteryProgramming = await prismaManager.lottery_programming.update({
            where: {
                id: lotteryProgrammingId,
            },
            data: {
                is_deleted: true,
            },
            include: {
                lottery: {
                    select: {
                        bank: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        });

        response.status(statusCode).json({
            lottery_programming: deletedLotteryProgramming,
        });
    }
    /**
     * Método para crear un ticket de lotería común
     * @param request 
     * @param response 
     * @param next 
     */
    static async generateCommonLotteryTicket(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const buyer_name: string = request.body.buyer_name;
        const numbers = request.body.numbers;
        const sellerId = request.clientUserId;

        let precio = 0;

        for (let index = 0; index < numbers.length; index++) {
            precio += numbers[index].amount;
        }
        //Recalculamos los restringidos

        // Obtenemos los numeros restringidos de la lotería y del vendedor
        const lotteryRestrictedNumbers = await prismaManager.programming_restricted_numbers.findMany({
            where: {
                programming_id: lotteryProgrammingId,
                number: {
                    in: numbers.map(number => number.number)
                }
            }
        });
        // Recorro cada uno de los números y sustraemos la cantidad del ticket para descontar en la bd
        for (let index = 0; index < lotteryRestrictedNumbers.length; index++) {
            const lotteryRestrictedNumber = lotteryRestrictedNumbers[index];
            const number = numbers.find(number => number.number == lotteryRestrictedNumber.number);
            if (number.amount > lotteryRestrictedNumber.amount) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            lotteryRestrictedNumber.amount -= number.amount;
            await prismaManager.programming_restricted_numbers.update({
                where: {
                    id: lotteryRestrictedNumber.id,
                },
                data: {
                    amount: lotteryRestrictedNumber.amount
                }
            })

        }
        const sellerRestrictedNumbers = await prismaManager.seller_programming_restricted_numbers.findMany({
            where: {
                programming_id: lotteryProgrammingId,
                seller_id: sellerId,
                number: {
                    in: numbers.map(number => number.number)
                }
            }
        });
        // Recorro cada uno de los números y sustraemos la cantidad del ticket para descontar en la bd
        for (let index = 0; index < sellerRestrictedNumbers.length; index++) {
            const sellerRestrictedNumber = sellerRestrictedNumbers[index];
            const number = numbers.find(number => number.number == sellerRestrictedNumber.number);
            if (number.amount > sellerRestrictedNumber.amount) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            sellerRestrictedNumber.amount -= number.amount;
            await prismaManager.seller_programming_restricted_numbers.update({
                where: {
                    id: sellerRestrictedNumber.id,
                },
                data: {
                    amount: sellerRestrictedNumber.amount
                }
            })
        }

        // Creamos la lotería
        const lotteryTicket = await prismaManager.ticket.create({
            data: {
                ticket_type_id: 1,
                buyer_name: buyer_name,
                lottery_programming_id: lotteryProgrammingId,
                purchase_date: Utils.getNowInUtc(),
                seller_id: sellerId,
                price: precio,
                bet_numbers: {
                    create: numbers
                }
            },
            include: {
                bet_numbers: true
            }
        });
        response.status(statusCode).json({
            lotteryTicket
        });
    }
    /**
    * Método para cancelar un Ticket
    * @param request 
    * @param response 
    * @param next 
    */
    static async cancelLotteryTicket(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        /**
         * buyer_name
           buyer_lastname
           lottery_programming_id
           lottery_type_id
           numbers
         */
        const ticketId: number = Number.parseInt(request.query.ticket_id);
        const sellerId = request.clientUserId;

        // Verificamos que el tipo de loteria exista
        const ticket = await prismaManager.ticket.findUnique({
            where: {
                id: ticketId
            }
        });

        if (!ticket) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.TICKET_ALREADY_CANCELLED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.TICKET_ALREADY_CANCELLED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Verificar que exista programación de lotería y que el closing time sea menor a la fecha actual
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                AND: [
                    {
                        id: ticket.lottery_programming_id
                    },
                    {
                        lottery: {
                            closing_time: {
                                gt: Utils.getNowInUtc()
                            }
                        }
                    }
                ]
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.CANNOT_CANCEL_TICKET_AFTER_CLOSING_DATE, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Verificar que el seller pertenesca al banco
        const bankSeller = await prismaManager.bank_seller.findFirst({
            where: {
                bank_id: lotteryProgramming.lottery.bank.id,
                seller_id: sellerId
            }
        })
        if (!bankSeller) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
        }
        const lotteryTicket = await prismaManager.ticket.update({
            where: {
                id: ticketId
            },
            data: {
                is_cancelled: true
            }
        })
        response.status(statusCode).json({
            lotteryTicket
        });
    }
    /**
     * Metodo para obtener todos los tickets asignados a un vendedor
     * @param request 
     * @param response 
     * @param next 
     */
    static async getTicketsBySeller(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        let ticket_id: number = (request.query.ticket_id) ? Number.parseInt(request.query.ticket_id) : undefined;
        let seller_id: number = Number.parseInt(request.clientUserId);

        if (request.query.date) {
            if (!Utils.isValidDateFormat(request.query.date)) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.INVALID_DATE_FORMAT, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.INVALID_DATE_FORMAT, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
        }

        let purchase_date = (request.query.date) ? new Date((request.query.date)) : undefined;
        purchase_date.setUTCHours(0, 0, 0, 0);

        let nextDate = (request.query.date) ? Utils.addDay((request.query.date)) : undefined;
        let lottery_id: number = (request.query.lottery_id) ? Number.parseInt(request.query.lottery_id) : undefined;

        if (ticket_id) {
            purchase_date = undefined;
            lottery_id = undefined;
        }

        let lotteries;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;
            lotteries = await prismaManager.ticket.findMany(
                {
                    where: {
                        ...(seller_id ? { seller_id } : {}),
                        ...(ticket_id ? { id: ticket_id } : {}),
                        lottery_programming: {
                            ...(lottery_id ? { lottery_id: lottery_id } : {}),
                            ...(purchase_date ? { date: { gte: purchase_date, lt: nextDate } } : {}),
                            lottery: {
                                bank: {
                                    bank_seller: {
                                        some: {
                                            seller_id: seller_id
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        bet_numbers: {
                            include: {
                                reventado_bet: true
                            }
                        },
                        monazo_bet_numbers: true,
                        parley_bet_numbers: true,
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        } else {
            lotteries = await prismaManager.ticket.findMany(
                {
                    where: {
                        ...(seller_id ? { seller_id } : {}),
                        ...(ticket_id ? { id: ticket_id } : {}),
                        lottery_programming: {
                            ...(lottery_id ? { lottery_id: lottery_id } : {}),
                            ...(purchase_date ? { date: { gte: purchase_date, lt: nextDate } } : {}),
                            lottery: {
                                bank: {
                                    bank_seller: {
                                        some: {
                                            seller_id: seller_id
                                        }
                                    }
                                }
                            }
                        }
                    },
                    include: {
                        bet_numbers: true,
                        monazo_bet_numbers: true,
                        parley_bet_numbers: true,
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            );
        }

        const ticketsCountResult = await prismaManager.ticket.aggregate(
            {
                where: {
                    ...(seller_id ? { seller_id } : {}),
                    ...(ticket_id ? { id: ticket_id } : {}),
                    lottery_programming: {
                        ...(lottery_id ? { lottery_id: lottery_id } : {}),
                        ...(purchase_date ? { date: { gte: purchase_date, lt: nextDate } } : {}),
                        lottery: {
                            bank: {
                                bank_seller: {
                                    some: {
                                        seller_id: seller_id
                                    }
                                }
                            }
                        }
                    }
                },
                _count: {
                    id: true
                },

            }
        )

        responseObject = {
            'tickets': lotteries,
            'tickets_count': ticketsCountResult._count.id
        }

        response.status(statusCode).send(responseObject);
    }
    /**
     * Metodo para obtener todos los tickets asignados a un vendedor
     * @param request 
     * @param response 
     * @param next 
     */
    static async getSellerLotteryProgrammingByDate(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const lottery_type_ids: number[] = (request.query.lottery_type_ids) ? request.query.lottery_type_ids : [1, 2, 3, 4];
        let seller_id: number = 0;
        let programming_date = (request.query.programming_date) ? request.query.programming_date : null;

        if (request.clientUserRole == Role.SUPER_USER || request.clientUserRole == Role.BANKER_USER) {
            seller_id = (!isNaN(Number.parseInt(request.query.seller_id))) ? Number.parseInt(request.query.seller_id) : 0;
            if (seller_id == 0) {
                statusCode = 404;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            // Verificar si ese seller está en alguno de sus bancos
            if (request.clientUserRole == Role.BANKER_USER) {
                const bankSeller = await prismaManager.bank_seller.findFirst({
                    where: {
                        seller_id: seller_id,
                        bank: {
                            owner_id: request.clientUserId
                        },

                    }
                });
                if (!bankSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                            }
                        )
                    );
                    return;
                }
            }

        } else if (request.clientUserRole == Role.SELLER_USER) {
            seller_id = request.clientUserId;
        }

        let startDate = new Date(programming_date);
        startDate.setUTCHours(0, 0, 0, 0);

        let endDate = new Date(programming_date);
        endDate.setUTCHours(23, 59, 0, 0);



        let lotteriesProgramings;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;
            lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                {
                    where: {
                        is_deleted: false,
                        date: {
                            gte: startDate,
                            lt: endDate
                        },
                        lottery: {
                            seller_commission: {
                                some: {
                                    seller_id: seller_id,
                                }
                            },
                            is_deleted: false
                        }
                    },
                    include: {
                        lottery: {
                            select: {
                                lottery_type_id: true,
                                lottery_type: true,
                                name: true,
                            }

                        }
                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        } else {
            lotteriesProgramings = await prismaManager.lottery_programming.findMany(
                {
                    where: {
                        is_deleted: false,
                        date: {
                            gte: startDate,
                            lte: endDate
                        },
                        lottery: {
                            seller_commission: {
                                some: {
                                    seller_id: seller_id,
                                }
                            },
                            is_deleted: false
                        }
                    },
                    include: {
                        lottery: {
                            select: {
                                lottery_type_id: true,
                                lottery_type: true,
                                name: true,
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            );
        }
        // Por ahora no lo estoy utilizando.
        // const lotteriesProgramingsCountResult = await prismaManager.lottery_programming.aggregate(
        //     {
        //         where: {
        //             is_deleted: false,
        //             date: programming_date,
        //             lottery: {
        //                 seller_commission: {
        //                     some: {
        //                         seller_id: seller_id,
        //                     }
        //                 },
        //             }
        //         },
        //         _count: {
        //             id: true
        //         },
        //     }
        // )
        let realResult = [];
        realResult = lotteriesProgramings.filter(lotteryProgramming => lottery_type_ids.includes(lotteryProgramming.lottery.lottery_type_id));

        if (!realResult) {
            realResult = [];
        }
        responseObject = {
            'lotteries_programings': realResult,
            'lotteries_programings_count': realResult.length
        }

        response.status(statusCode).send(responseObject);
    }
    /**
     * Metodo para obtener todos los tickets asignados a un vendedor
     * @param request 
     * @param response 
     * @param next 
     */
    static async getSellerLotteriesAviableToSell(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;

        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        let ticket_id: number = Number.parseInt(request.query.ticket_id);
        let seller_id: number = 0;

        if (request.clientUserRole == Role.SUPER_USER || request.clientUserRole == Role.BANKER_USER) {
            seller_id = Number.parseInt(request.query.seller_id);
            // Verificar si ese seller está en alguno de sus bancos
            if (request.clientUserRole == Role.BANKER_USER) {
                const bankSeller = await prismaManager.bank_seller.findFirst({
                    where: {
                        seller_id: seller_id,
                        bank: {
                            owner_id: request.clientUserId
                        },

                    }
                });
                if (!bankSeller) {
                    statusCode = 404;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.SELLER_NOT_FOUND_FOR_BANK, { language: clientLanguage })
                            }
                        )
                    );
                    return;
                }
            }

        } else if (request.clientUserRole == Role.SELLER_USER) {
            seller_id = request.clientUserId;
        }



        let lotteries;

        if (elementsPerPage) {
            const elementsToSkip: number = pageNumber * elementsPerPage;
            lotteries = await prismaManager.lottery.findMany(
                {
                    where: {
                        is_deleted: false,
                        seller_commission: {
                            some: {
                                seller_id: seller_id
                            }
                        }

                    },
                    orderBy: {
                        id: 'asc'
                    },
                    skip: elementsToSkip,
                    take: elementsPerPage
                }
            );
        } else {
            lotteries = await prismaManager.lottery.findMany(
                {
                    where: {
                        is_deleted: false,
                        seller_commission: {
                            some: {
                                seller_id: seller_id
                            }
                        }
                    },
                    orderBy: {
                        id: 'asc'
                    }
                }
            );
        }

        const lotteriesCountResult = await prismaManager.lottery.aggregate(
            {
                where: {
                    is_deleted: false,
                    seller_commission: {
                        some: {
                            seller_id: seller_id
                        }
                    }
                },
                _count: {
                    id: true
                },

            }
        )

        responseObject = {
            'lotteries': lotteries,
            'lotteries_count': lotteriesCountResult._count.id
        }

        response.status(statusCode).send(responseObject);
    }
    /**
    * Método para crear un ticket de reventado
    * @param request 
    * @param response 
    * @param next 
    */
    static async generateReventadoLotteryTicket(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const buyer_name: string = request.body.buyer_name;
        const numbers = request.body.numbers;
        const sellerId = request.clientUserId;
        // Calculamos el precio
        let price = 0;
        numbers.forEach(number => {
            price += number.amount;
            // Verificamos las bolas
            if (number.reventado_bet_amount) {
                price += number.reventado_bet_amount;
            }
        });
        //Recalculamos los restringidos

        // Obtenemos los numeros restringidos de la lotería y del vendedor
        const lotteryRestrictedNumbers = await prismaManager.programming_restricted_numbers.findMany({
            where: {
                programming_id: lotteryProgrammingId,
                number: {
                    in: numbers.map(number => number.number)
                }
            }
        });
        // Recorro cada uno de los números y sustraemos la cantidad del ticket para descontar en la bd
        for (let index = 0; index < lotteryRestrictedNumbers.length; index++) {
            const lotteryRestrictedNumber = lotteryRestrictedNumbers[index];
            const number = numbers.find(number => number.number == lotteryRestrictedNumber.number);
            if (number.amount > lotteryRestrictedNumber.amount) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            lotteryRestrictedNumber.amount -= number.amount;
            await prismaManager.programming_restricted_numbers.update({
                where: {
                    id: lotteryRestrictedNumber.id,
                },
                data: {
                    amount: lotteryRestrictedNumber.amount
                }
            })

        }
        const sellerRestrictedNumbers = await prismaManager.seller_programming_restricted_numbers.findMany({
            where: {
                programming_id: lotteryProgrammingId,
                seller_id: sellerId,
                number: {
                    in: numbers.map(number => number.number)
                }
            }
        });
        // Recorro cada uno de los números y sustraemos la cantidad del ticket para descontar en la bd
        for (let index = 0; index < sellerRestrictedNumbers.length; index++) {
            const sellerRestrictedNumber = sellerRestrictedNumbers[index];
            const number = numbers.find(number => number.number == sellerRestrictedNumber.number);
            if (number.amount > sellerRestrictedNumber.amount) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            sellerRestrictedNumber.amount -= number.amount;
            await prismaManager.seller_programming_restricted_numbers.update({
                where: {
                    id: sellerRestrictedNumber.id,
                },
                data: {
                    amount: sellerRestrictedNumber.amount
                }
            })
        }


        // Creamos la lotería
        const lotteryTicket = await prismaManager.ticket.create({
            data: {
                ticket_type_id: 2,
                buyer_name: buyer_name,
                lottery_programming_id: lotteryProgrammingId,
                purchase_date: Utils.getNowInUtc(),
                seller_id: sellerId,
                price: price,
                bet_numbers: {
                    create: numbers.map(number => ({
                        amount: number.amount,
                        number: number.number,
                        ...(number.reventado_bet_amount > 0 ? { reventado_bet: { create: { amount: number.reventado_bet_amount } } } : {}),
                    }))
                }

            },
            include: {
                bet_numbers: {
                    include: {
                        reventado_bet: true
                    }
                },

            }
        });
        response.status(statusCode).json({
            lotteryTicket
        });
    }
    /**
     * Método que permite validar la creacion de todos los tipos de tickets.
     * @param role Rol del usuario a crear.
     * @returns 
     */
    public static readonly createLotteryTicketMiddleware = async (request: Request, response: Response, next: NextFunction) => {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        /**
         * buyer_name
           buyer_lastname
           lottery_programming_id
           lottery_type_id
           numbers
         */
        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const buyer_name: string = request.body.buyer_name;
        const numbers = request.body.numbers;
        const sellerId = request.clientUserId;
        //Verificamos que el tipo de loteria exista
        const lotteryTypeExists = await prismaManager.lottery_type.findUnique({
            where: {
                id: lotteryType
            }
        });

        if (!lotteryTypeExists) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_TYPE_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Verificamos que el programing exista y obtenemos su lotería

        // Verificar que exista programación de lotería y que el closing time sea menor a la fecha actual
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                AND: [
                    {
                        id: lotteryProgrammingId
                    },
                    {
                        date: {
                            gte: Utils.getNowInUtc()
                        }
                    },
                    {
                        lottery: {
                            seller_commission: {
                                some: {
                                    seller_id: sellerId,
                                }
                            }
                        }
                    }

                ]
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                    }
                }
            }
        });

        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }


        const bankSeller = await prismaManager.bank_seller.findFirst({
            where: {
                bank_id: lotteryProgramming.lottery.bank.id,
                seller_id: sellerId
            }
        })

        if (!bankSeller) {
            statusCode = 404;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.BANK_SELLER_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        if (lotteryProgramming.lottery.lottery_type_id == 1 || lotteryProgramming.lottery.lottery_type_id == 2) {
            // Obtenemos los numeros restringidos de la lotería y del vendedor
            const lotteryRestrictedNumbers = await prismaManager.programming_restricted_numbers.findMany({
                where: {
                    programming_id: lotteryProgramming.id,
                    number: {
                        in: numbers.map(number => number.number)
                    }
                }
            });
            // Recorro cada uno de los números para compararlos y ver si es posible crear el ticket
            for (let index = 0; index < lotteryRestrictedNumbers.length; index++) {
                const lotteryRestrictedNumber = lotteryRestrictedNumbers[index];
                const number = numbers.find(number => number.number == lotteryRestrictedNumber.number);
                if (number.amount > lotteryRestrictedNumber.amount) {
                    statusCode = 400;
                    response.status(statusCode).json(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            programming_restricted_numbers: lotteryRestrictedNumbers
                        }
                    );
                    return;
                }

            }
            const sellerRestrictedNumbers = await prismaManager.seller_programming_restricted_numbers.findMany({
                where: {
                    programming_id: lotteryProgramming.id,
                    seller_id: sellerId,
                    number: {
                        in: numbers.map(number => number.number)
                    }
                }
            });
            // Recorro cada uno de los números para compararlos y ver si es posible crear el ticket
            for (let index = 0; index < sellerRestrictedNumbers.length; index++) {
                const sellerRestrictedNumber = sellerRestrictedNumbers[index];
                const number = numbers.find(number => number.number == sellerRestrictedNumber.number);
                if (number.amount > sellerRestrictedNumber.amount) {
                    statusCode = 400;
                    response.status(statusCode).json(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NUMBER_NOT_ALLOWED, { language: clientLanguage }),
                            seller_programming_restricted_numbers: sellerRestrictedNumbers
                        }
                    );
                    return;
                }
            }

        }
        // llamamos a la funcion next del middleware para proceder a la creación de la lotería.
        next();
    }
    /**
    * Método para crear un ticket de 3 monazos
    * @param request 
    * @param response 
    * @param next 
    */
    static async generateMonazosLotteryTicket(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const buyer_name: string = request.body.buyer_name;
        const numbers = request.body.numbers;
        const sellerId = request.clientUserId;

        // Validaciones de los Monazos
        for (let index = 0; index < numbers.length; index++) {
            if (numbers[index].monazo_type_id == 2 || numbers[index].monazo_type_id == 3) {
                if (Utils.areDistinctNumbers(numbers[index].first_number, numbers[index].second_number, numbers[index].third_number)) {
                    continue;
                } else {
                    statusCode = 400;
                    response.status(statusCode).send(
                        new ApiError(
                            {
                                clientErrorMessage: translator.getTranslation(Translator.INVALID_NUMBER_FORMAT, { language: clientLanguage }),
                                debugErrorMessage: translator.getTranslation(Translator.INVALID_NUMBER_FORMAT, { language: clientLanguage })
                            }
                        )
                    );
                    return;
                }
            }
        }



        let precio = 0;
        for (let index = 0; index < numbers.length; index++) {
            precio += numbers[index].amount;
        }
        // Creamos la lotería
        const lotteryTicket = await prismaManager.ticket.create({
            data: {
                ticket_type_id: 3,
                buyer_name: buyer_name,
                lottery_programming_id: lotteryProgrammingId,
                purchase_date: Utils.getNowInUtc(),
                seller_id: sellerId,
                price: precio,
                monazo_bet_numbers: {
                    create: numbers,
                }

            },
            include: {
                monazo_bet_numbers: true
            }
        });
        response.status(statusCode).json({
            lotteryTicket
        });
    }
    /**
    * Método para crear un ticket de Parley
    * @param request 
    * @param response 
    * @param next 
    */
    static async generateParleyLotteryTicket(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const lotteryType: number = Number.parseInt(request.body.lottery_type_id);
        const buyer_name: string = request.body.buyer_name;
        const numbers = request.body.numbers;
        const sellerId = request.clientUserId;

        let precio = 0;
        for (let index = 0; index < numbers.length; index++) {
            precio += numbers[index].amount;
        }

        // Creamos la lotería
        const lotteryTicket = await prismaManager.ticket.create({
            data: {
                ticket_type_id: 3,
                buyer_name: buyer_name,
                lottery_programming_id: lotteryProgrammingId,
                purchase_date: Utils.getNowInUtc(),
                seller_id: sellerId,
                price: precio,
                parley_bet_numbers: {
                    create: numbers,
                }
            },
            include: {
                parley_bet_numbers: true
            }
        });
        response.status(statusCode).json({
            lotteryTicket
        });
    }
    /**
     * Metodo para obtener los lottery prices
     * @param request 
     * @param response 
     * @param next 
     */
    static async getLotteryPrices(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const lotteryId = Number.parseInt(request.query.lottery_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                is_deleted: false,
                lottery_prizes: {
                    some: {
                        is_deleted: false
                    }
                }

            },
            include: {
                bank: true,
                lottery_prizes: true,
                lottery_type: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        responseObject = {
            'lottery_prizes': lottery.lottery_prizes,
            'lotteries_count': lottery.lottery_prizes.length
        }

        response.status(statusCode).send(responseObject);
    }
    /**
    * Metodo para eliminar lottery price
    * @param request 
    * @param response 
    * @param next 
    */
    static async removeLotteryPrices(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const priceId = Number.parseInt(request.body.price_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId
            },
            include: {
                bank: true,
                lottery_prizes: true,
                lottery_type: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        const prizes = await prismaManager.lottery_prize.update({
            where: {
                id: priceId,
            },
            data: {
                is_deleted: true
            }
        })


        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
    * Metodo para añadir los lottery prices
    * @param request 
    * @param response 
    * @param next 
    */
    static async addLotteryPrices(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const name = (request.body.name as string);
        const multiplier = Number.parseInt(request.body.multiplier as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId
            },
            include: {
                bank: true,
                lottery_prizes: true,
                lottery_type: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Añadimos el lottery price
        const lotteryPrice = await prismaManager.lottery_prize.create({
            data: {
                lottery_id: lotteryId,
                name: name,
                multiplier: multiplier
            }
        })

        response.status(statusCode).send(lotteryPrice);
    }

    /**
     * Metodo para obtener las bolas soportadas por una loteria reventado
     * @param request 
     * @param response 
     * @param next 
     */
    static async getReventadoSupportedBalls(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const lotteryId = Number.parseInt(request.query.lottery_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                is_deleted: false
            },
            include: {
                bank: true,
                lottery_type: true,
                reventado_lottery: {
                    select: {
                        lottery_id: true,
                        multiplier: true,
                        reventado_lottery_ball_types: true
                    }
                }
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        let reventadoConfig = {
            "lottery_id": lottery.id,
            "multiplier": lottery.reventado_lottery.multiplier,
        }
        responseObject = {
            'reventado_config': reventadoConfig,
            'reventado_lottery_ball_types': lottery.reventado_lottery.reventado_lottery_ball_types,
            'reventado_lottery_ball_types_count': lottery.reventado_lottery.reventado_lottery_ball_types.length
        }

        response.status(statusCode).send(responseObject);
    }
    /**
     * Metodo para eliminar las bolas soportadas por una loteria reventado
     * @param request 
     * @param response 
     * @param next 
     */
    static async removeReventadoSupportedBalls(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const ballTypeId = Number.parseInt(request.body.ball_type_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                is_deleted: false
            },
            include: {
                bank: true,
                lottery_type: true,
                reventado_lottery: {
                    select: {
                        lottery_id: true,
                        multiplier: true,
                        reventado_lottery_ball_types: true
                    }
                }
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        let reventadoBallType = await prismaManager.reventado_lottery_ball_type.delete(
            {
                where: {
                    reventado_lottery_id_ball_type_id: {
                        ball_type_id: ballTypeId,
                        reventado_lottery_id: lotteryId
                    }
                }
            }
        )

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
    * Metodo para obtener las bolas disponibles para las loterias reventado
    * @param request 
    * @param response 
    * @param next 
    */
    static async getReventadoAviableBalls(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;

        const balls = await prismaManager.ball_type.findMany();

        response.status(statusCode).send(balls);
    }
    /**
    * Metodo para obtener la configuracion de la lotería parley
    * @param request 
    * @param response 
    * @param next 
    */
    static async getParleyLotteryConfig(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryId = Number.parseInt(request.query.lottery_id as string);

        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                is_deleted: false
            },
            include: {
                bank: true,
                lottery_type: true,
                parley_lottery: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }


        response.status(statusCode).send({
            lottery: lottery.parley_lottery
        });
    }
    /**
    * Metodo para obtener la configuracion de la lotería parley
    * @param request 
    * @param response 
    * @param next 
    */
    static async getMonazoLotteryConfig(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryId = Number.parseInt(request.query.lottery_id as string);

        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                is_deleted: false
            },
            include: {
                bank: true,
                lottery_type: true,
                lottery_monazo_types: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }


        response.status(statusCode).send({
            lottery: lottery.lottery_monazo_types
        });
    }
    /**
    * Metodo para añadir balls que soportan una lotería
    * @param request 
    * @param response 
    * @param next 
    */
    static async addReventadoSupportedBalls(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const multiplier = Number.parseInt(request.body.multiplier as string);
        const ball_type_id = Number.parseInt(request.body.ball_type_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId
            },
            include: {
                bank: true,
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Añadimos el reventado_lottery_ball_type
        const reventadoLotteryBallType = await prismaManager.reventado_lottery_ball_type.create({
            data: {
                reventado_lottery_id: lotteryId,
                ball_type_id: ball_type_id,
                multiplier: multiplier
            }
        })



        response.status(statusCode).send(reventadoLotteryBallType);
    }
    /**
    * Metodo para obtener los tipos de monazo
    * @param request 
    * @param response 
    * @param next 
    */
    static async getMonazoLotteryType(request, response: Response, next: NextFunction) {
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        const monazoTypes = await prismaManager.monazo_type.findMany();
        response.status(statusCode).send(monazoTypes);
    }
    /**
    * Metodo configurar/actualizar una lotería de monazo
    * @param request 
    * @param response 
    * @param next 
    */
    static async configMonazoLotteryType(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const main_multiplier = Number.parseInt(request.body.main_multiplier as string);
        const secondary_multiplier = Number.parseInt(request.body.secondary_multiplier as string);
        const monazo_type_id = Number.parseInt(request.body.monazo_type_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                lottery_type_id: 3
            },
            include: {
                bank: true,
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        const monazoType = await prismaManager.monazo_type.findFirst({
            where: {
                id: monazo_type_id
            }
        });
        if (!monazoType) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Añadimos el reventado_lottery_ball_type
        const monazoLotteryType = await prismaManager.lottery_monazo_type.upsert({
            where: {
                lottery_id_monazo_type_id: {
                    lottery_id: lotteryId,
                    monazo_type_id: monazo_type_id
                }
            },
            create: {
                lottery_id: lotteryId,
                monazo_type_id: monazo_type_id,
                main_multiplier: main_multiplier,
                secondary_multiplier: secondary_multiplier
            },
            update: {
                main_multiplier: main_multiplier,
                secondary_multiplier: secondary_multiplier
            }
        })



        response.status(statusCode).send(monazoLotteryType);
    }
    /**
    * Metodo configurar/actualizar una lotería de parley
    * @param request 
    * @param response 
    * @param next 
    */
    static async configParleyLotteryType(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const multiplier = Number.parseInt(request.body.multiplier as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId,
                lottery_type_id: 4
            },
            include: {
                bank: true,
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Añadimos el reventado_lottery_ball_type
        const parleyLotteryType = await prismaManager.parley_lottery.upsert({
            where: {
                lottery_id: lotteryId
            },
            create: {
                lottery_id: lotteryId,
                multiplier: multiplier
            },
            update: {
                multiplier: multiplier
            }
        })

        response.status(statusCode).send(parleyLotteryType);
    }
    /**
    * Metodo para configurar/actualizar una lotería reventado
    * @param request 
    * @param response 
    * @param next 
    */
    static async configReventadoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const lotteryId = Number.parseInt(request.body.lottery_id as string);
        const multiplier = Number.parseInt(request.body.multiplier as string);
        const red_ball_multiplier = Number.parseInt(request.body.red_ball_multiplier as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lotteryId
            },
            include: {
                bank: true,
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Añadimos el reventado_lottery_ball_type
        const reventadoLotteryBallType = await prismaManager.reventado_lottery.update({
            where: {
                lottery_id: lotteryId
            },
            data: {
                multiplier: multiplier,
                lottery_id: lotteryId,
                reventado_lottery_ball_types: {
                    upsert: {
                        where: {
                            reventado_lottery_id_ball_type_id: {
                                ball_type_id: 2,
                                reventado_lottery_id: lotteryId
                            }
                        },
                        create: {
                            ball_type_id: 2,
                            multiplier: red_ball_multiplier
                        },
                        update: {
                            multiplier: red_ball_multiplier,
                        }

                    }
                }
                // roja y blanca

            }
        })



        response.status(statusCode).send(reventadoLotteryBallType);
    }
    /**
     * Metodo para añadir los números ganadores a una lotería común
     * @param request 
     * @param response 
     * @param next 
     */
    static async addWinningNumbersCommonLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;

        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const lotteryPrizeId = Number.parseInt(request.body.lottery_prize_id as string);
        const number = Number.parseInt(request.body.number as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        //Verificamos que exista el lottery prize
        const lotteryPrize = await prismaManager.lottery_prize.findFirst({
            where: {
                id: lotteryPrizeId
            }
        })
        if (!lotteryPrize) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // añadimos el número
        const winning_number = await prismaManager.lottery_winner_number.create({
            data: {
                number: number,
                lottery_prize_id: lotteryPrizeId,
                lottery_programming_id: lotteryProgrammingId
            }
        })


        response.status(statusCode).send(winning_number);
    }
    /**
    * Metodo para remover los numeros ganadores
     * @param request 
     * @param response 
     * @param next 
     */
    static async removeWinningNumbersCommonLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const number_id = Number.parseInt(request.body.number_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_number = await prismaManager.lottery_winner_number.deleteMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                id: number_id
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
    * Metodo para obtener los numeros ganadores
   * @param request 
   * @param response 
   * @param next 
   */
    static async getWinningNumbersCommonLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.query.lottery_programming_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_numbers = await prismaManager.lottery_winner_number.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            }
        })

        response.status(statusCode).send(winning_numbers);
    }
    /**
    * Metodo para remover los numeros ganadores de loteria reventado
    * @param request 
    * @param response 
    * @param next 
    */
    static async removeWinningNumbersReventadoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const number_id = Number.parseInt(request.body.number_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_number = await prismaManager.reventado_lottery_winner_number.deleteMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                id: number_id
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
  * Metodo para obtener los numeros ganadores de loteria reventado
   * @param request 
   * @param response 
   * @param next 
   */
    static async getWinningNumbersReventadoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.query.lottery_programming_id as string);
        const number_id = Number.parseInt(request.body.number_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_numbers = await prismaManager.reventado_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            }
        })
        const res = (winning_numbers) ? winning_numbers : {};
        response.status(statusCode).send(res);
    }
    /**
   * Metodo para remover los numeros ganadores de loteria monazos
   * @param request 
   * @param response 
   * @param next 
   */
    static async removeWinningNumbersMonazoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const number_id = Number.parseInt(request.body.number_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_number = await prismaManager.monazo_lottery_winner_number.deleteMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                id: number_id
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
  * Metodo para obtener los numeros ganadores de loteria reventado
   * @param request 
   * @param response 
   * @param next 
   */
    static async getWinningNumbersMonazoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.query.lottery_programming_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_numbers = await prismaManager.monazo_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            }
        })
        const res = (winning_numbers) ? winning_numbers : {};
        response.status(statusCode).send(res);
    }
    /**
   * Metodo para remover los numeros ganadores de loteria monazos
   * @param request 
   * @param response 
   * @param next 
   */
    static async removeWinningNumbersParleyLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const number_id = Number.parseInt(request.body.number_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_number = await prismaManager.parley_lottery_winner_number.deleteMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                id: number_id
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
  * Metodo para obtener los numeros ganadores de loteria reventado
   * @param request 
   * @param response 
   * @param next 
   */
    static async getWinningNumbersParleyLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.query.lottery_programming_id as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // añadimos el número
        const winning_numbers = await prismaManager.parley_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            }
        })
        const res = (winning_numbers) ? winning_numbers : {};
        response.status(statusCode).send(res);
    }
    /**
    * Metodo para añadir los números ganadores de una lotería Reventado
    * @param request 
    * @param response 
    * @param next 
    */
    static async addWinningNumbersReventadoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const ballTypeId = Number.parseInt(request.body.ball_type_id as string);
        const number = Number.parseInt(request.body.number as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }


        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // añadimos el número
        const reventado_lottery_winner_number = await prismaManager.reventado_lottery_winner_number.create({
            data: {
                number: number,
                ball_type_id: ballTypeId,
                lottery_programming_id: lotteryProgrammingId
            }
        });

        response.status(statusCode).send(reventado_lottery_winner_number);
    }
    /**
   * Metodo para obtener los números ganadores de una lotería Monazo
   * @param request 
   * @param response 
   * @param next 
   */
    static async addWinningNumberMonazoLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;

        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const firstNumber = Number.parseInt(request.body.first_number as string);
        const secondNumber = Number.parseInt(request.body.second_number as string);
        const thirdNumber = Number.parseInt(request.body.third_number as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });

        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // añadimos el número
        const monazo_lottery_winner_number = await prismaManager.monazo_lottery_winner_number.create({
            data: {
                first_number: firstNumber,
                second_number: secondNumber,
                third_number: thirdNumber,
                lottery_programming_id: lotteryProgrammingId
            }
        })

        response.status(statusCode).send(monazo_lottery_winner_number);
    }
    /**
 * Metodo para obtener los números ganadores de una lotería Parley
 * @param request 
 * @param response 
 * @param next 
 */
    static async addWinningNumberParleyLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        let responseObject = null;
        const pageNumber: number = Number.parseInt(request.query.page_number as string);
        const elementsPerPage: number = Number.parseInt(request.query.elements_per_page as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;

        const lotteryProgrammingId = Number.parseInt(request.body.lottery_programming_id as string);
        const firstNumber = Number.parseInt(request.body.first_number as string);
        const secondNumber = Number.parseInt(request.body.second_number as string);
        const thirdNumber = Number.parseInt(request.body.third_number as string);

        // Ver que existe la lotería
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId
            },
            include: {
                lottery: {
                    select: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // añadimos el número
        const parley_lottery_winner_number = await prismaManager.parley_lottery_winner_number.create({
            data: {
                first_number: firstNumber,
                second_number: secondNumber,
                third_number: thirdNumber,
                lottery_programming_id: lotteryProgrammingId
            }
        })
        response.status(statusCode).send(parley_lottery_winner_number);
    }

    /**
     * Método para generar hoja de cobro para una lotería normal
     * @param request 
     * @param response 
     * @param next 
     */
    static async generateBillingStatementNormalLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;
        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        // Obtener la programación de la lotería, verificar que sea de tipo normal 1 y que exista.
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
                lottery: {
                    lottery_type_id: 1,
                }
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                    }
                }
            }
        });
        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Verificar los permisos del usuario
        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez llegados a este punto buscaremos los números ganadores de la misma.
        const winningNumbers = await prismaManager.lottery_winner_number.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId
            },
            include: {
                lottery_prize: true,
            }
        });
        if (!winningNumbers) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez que tenemos los números ganadores, buscaremos los tickets de lotería que coincidan con los números ganadores.
        const lotteryTickets = await prismaManager.ticket.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                is_cancelled: false,
                is_computed: false,
            },
            include: {
                bet_numbers: true,
            }
        })

        let commisions = await prismaManager.seller_commision.findMany({
            where: {
                seller_id: {
                    in: lotteryTickets.map(ticket => ticket.seller_id)
                },
                lottery_id: lotteryProgramming.lottery_id,
            }
        })


        let seller_billing_statement_array = [];
        let winnerTickets = [];
        for (let i = 0; i < lotteryTickets.length; i++) {
            let winAmmount = 0;
            let ticketId = lotteryTickets[i].id;
            // Buscamos que ya exista el seller dentro de la variable seller_billing_statement_array
            if (seller_billing_statement_array.find(statement => statement.seller_id == lotteryTickets[i].seller_id)) {
                // Si ya existe aactualizamos
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let index = seller_billing_statement_array.findIndex(statement => statement.seller_id == lotteryTickets[i].seller_id);
                seller_billing_statement_array[index].quantity_sold += lotteryTickets[i].price;
                seller_billing_statement_array[index].commission += lotteryTickets[i].price * (comission.commission / 100);
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].bet_numbers.length; j++) {
                    let winningNumber = winningNumbers.find(winningNumber => winningNumber.number == lotteryTickets[i].bet_numbers[j].number);
                    if (winningNumber) {
                        seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].bet_numbers[j].amount * winningNumber.lottery_prize.multiplier;
                        winAmmount += lotteryTickets[i].bet_numbers[j].amount * winningNumber.lottery_prize.multiplier;
                    }
                }

            } else {
                // Si no existe, lo añadimos a la variable
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].bet_numbers.length; j++) {
                    let winningNumber = winningNumbers.find(winningNumber => winningNumber.number == lotteryTickets[i].bet_numbers[j].number);
                    if (winningNumber) {
                        seller_billing_statement.prize_to_be_paid += lotteryTickets[i].bet_numbers[j].amount * winningNumber.lottery_prize.multiplier;
                        winAmmount += lotteryTickets[i].bet_numbers[j].amount * winningNumber.lottery_prize.multiplier;
                    }
                }
                seller_billing_statement_array.push(seller_billing_statement);
            }
            if (winAmmount > 0) {
                winnerTickets.push({
                    ticket_id: ticketId,
                    win_amount: winAmmount
                })
            }
            winAmmount = 0;
        }
        // Transaccion:
        const [lottery_programming_updated, tickets, billing_statement] = await prismaManager.$transaction(async (prisma) => {
            // Actualizamos la lotería y la marcamos como computada
            const lottery_programming_updated = await prisma.lottery_programming.update({
                where: {
                    id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Actualizamos los tickets y los marcamos como computados
            const tickets = await prisma.ticket.updateMany({
                where: {
                    lottery_programming_id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Creamos la factura de venta y actualizamos los vendedores con los montos correspondientes
            const billing_statement = await prisma.billing_statement.create({
                data: {
                    lottery_programming_id: lotteryProgramming.id,
                    billing_date: Utils.getNowInUtc(),
                    seller_billing_statement: {
                        create: seller_billing_statement_array
                    }
                }
            })
            // Actualizamos el saldo de los sellers según la fórmula
            /**
             * let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                //Saldo vendedor = cantidad vendida - comision - premios
             */
            for (const seller of seller_billing_statement_array) {
                let sellerUpdated = await prisma.seller.update({
                    where: {
                        user_id: seller.seller_id
                    },
                    data: {
                        balance: {
                            increment: seller.quantity_sold - seller.commission - seller.prize_to_be_paid
                        }
                    }
                })
            }
            for (const ticket of winnerTickets) {
                const tickets = await prisma.ticket.update({
                    where: {
                        id: ticket.ticket_id
                    },
                    data: {
                        ticket_prize: {
                            increment: ticket.win_amount
                        }
                    }
                })
            }

            return [lottery_programming_updated, tickets, billing_statement];
        })


        response.status(statusCode).json({
            ok: "ok"
        });
    }
    /**
     * Método para generar hoja de cobro para una lotería reventado
     * @param request 
     * @param response 
     * @param next 
     */
    static async generateBillingStatementReventadoLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        // Obtener la programación de la lotería, verificar que sea de tipo normal 1 y que exista.
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
                lottery: {
                    lottery_type_id: 2,
                }
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                        reventado_lottery: {
                            include: {
                                reventado_lottery_ball_types: true,
                            }
                        },
                    }
                }
            }
        });

        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Verificar los permisos del usuario
        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez llegados a este punto buscaremos los números ganadores de la misma.
        const winningNumbers = await prismaManager.reventado_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            },

        });

        if (!winningNumbers) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez que tenemos los números ganadores, buscaremos los tickets de lotería que coincidan con los números ganadores.
        const lotteryTickets = await prismaManager.ticket.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                is_cancelled: false,
                is_computed: false,
            },
            include: {
                bet_numbers: {
                    include: {
                        reventado_bet: true,
                    }
                }
            }
        })

        let commisions = await prismaManager.seller_commision.findMany({
            where: {
                seller_id: {
                    in: lotteryTickets.map(ticket => ticket.seller_id)
                },
                lottery_id: lotteryProgramming.lottery_id,
            }
        })
        // Multiplicador sale de reventado lottery winner number

        let seller_billing_statement_array = [];
        let winnerTickets = [];
        for (let i = 0; i < lotteryTickets.length; i++) {
            let winAmmount = 0;
            let ticketId = lotteryTickets[i].id;
            // Buscamos que ya exista el seller dentro de la variable seller_billing_statement_array
            if (seller_billing_statement_array.find(statement => statement.seller_id == lotteryTickets[i].seller_id)) {
                // Si ya existe actualizamos
                let { commission } = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);

                let index = seller_billing_statement_array.findIndex(statement => statement.seller_id == lotteryTickets[i].seller_id);
                seller_billing_statement_array[index].quantity_sold += lotteryTickets[i].price;
                seller_billing_statement_array[index].commission += lotteryTickets[i].price * (commission / 100);
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].bet_numbers.length; j++) {

                    if (lotteryTickets[i].bet_numbers[j].number == winningNumbers.number) {

                        seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].bet_numbers[j].amount * (lotteryProgramming.lottery.reventado_lottery.multiplier);
                        // Si tiene bolas iteramos y en caso de resultar ganadora añadimos al price to be paid
                        winAmmount += lotteryTickets[i].bet_numbers[j].amount * (lotteryProgramming.lottery.reventado_lottery.multiplier);

                        if (lotteryTickets[i].bet_numbers[j].reventado_bet.amount) {
                            for (let l = 0; l < lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types.length; l++) {
                                seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].bet_numbers[j].reventado_bet.amount * (lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types[l].multiplier);
                                winAmmount += lotteryTickets[i].bet_numbers[j].reventado_bet.amount * (lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types[l].multiplier);

                            }
                        }
                    }
                }

            } else {
                // Si no existe, lo añadimos a la variable
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].bet_numbers.length; j++) {
                    if (lotteryTickets[i].bet_numbers[j].number == winningNumbers.number) {
                        seller_billing_statement.prize_to_be_paid += lotteryTickets[i].bet_numbers[j].amount * (lotteryProgramming.lottery.reventado_lottery.multiplier);
                        // Si tiene bolas multiplicamos
                        if (lotteryTickets[i].bet_numbers[j].reventado_bet.amount) {
                            for (let l = 0; l < lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types.length; l++) {
                                seller_billing_statement.prize_to_be_paid += lotteryTickets[i].bet_numbers[j].reventado_bet.amount * (lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types[l].multiplier);
                                winAmmount += lotteryTickets[i].bet_numbers[j].reventado_bet.amount * (lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types[l].multiplier);
                            }
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].bet_numbers[j].reventado_bet.amount * (lotteryProgramming.lottery.reventado_lottery.reventado_lottery_ball_types[0].multiplier);
                        }
                    }
                }
                seller_billing_statement_array.push(seller_billing_statement);
            }
            if (winAmmount > 0) {
                winnerTickets.push({
                    ticket_id: ticketId,
                    win_amount: winAmmount
                })
            }
            winAmmount = 0;
        }
        // Transaccion:
        const [lottery_programming_updated, tickets, billing_statement] = await prismaManager.$transaction(async (prisma) => {
            // Actualizamos la lotería y la marcamos como computada
            const lottery_programming_updated = await prisma.lottery_programming.update({
                where: {
                    id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Actualizamos los tickets y los marcamos como computados
            const tickets = await prisma.ticket.updateMany({
                where: {
                    lottery_programming_id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Creamos la factura de venta y actualizamos los vendedores con los montos correspondientes
            const billing_statement = await prisma.billing_statement.create({
                data: {
                    lottery_programming_id: lotteryProgramming.id,
                    billing_date: Utils.getNowInUtc(),
                    seller_billing_statement: {
                        create: seller_billing_statement_array
                    }
                }
            })
            // Actualizamos el saldo de los sellers según la fórmula
            /**
             * let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                //Saldo vendedor = cantidad vendida - comision - premios
             */
            for (const seller of seller_billing_statement_array) {
                let sellerUpdated = await prisma.seller.update({
                    where: {
                        user_id: seller.seller_id
                    },
                    data: {
                        balance: {
                            increment: seller.quantity_sold - seller.commission - seller.prize_to_be_paid
                        }
                    }
                })
            }
            for (const ticket of winnerTickets) {
                const tickets = await prisma.ticket.update({
                    where: {
                        id: ticket.ticket_id
                    },
                    data: {
                        ticket_prize: {
                            increment: ticket.win_amount
                        }
                    }
                })
            }
            return [lottery_programming_updated, tickets, billing_statement]
        })


        response.status(200).json({
            ok: "ok"
        });
    }
    /**
     * Método para generar hoja de cobro para una lotería Monazo
     * @param request 
     * @param response 
     * @param next 
     */
    static async generateBillingStatementMonazoLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        // Obtener la programación de la lotería, verificar que sea de tipo normal 1 y que exista.
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
                lottery: {
                    lottery_type_id: 3,
                }
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                        lottery_monazo_types: true,
                    }
                },
                monazo_lottery_winner_number: true, // Número ganador
            }
        });
        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Verificar los permisos del usuario
        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez llegados a este punto buscaremos los números ganadores de la misma.
        const winningNumbers = await prismaManager.monazo_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId,
            },
        });

        if (!winningNumbers) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez que tenemos los números ganadores, buscaremos los tickets de lotería que coincidan con los números ganadores.
        const lotteryTickets = await prismaManager.ticket.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                is_cancelled: false,
                is_computed: false,
            },
            include: {
                monazo_bet_numbers: true,
            }
        })

        let commisions = await prismaManager.seller_commision.findMany({
            where: {
                seller_id: {
                    in: lotteryTickets.map(ticket => ticket.seller_id)
                },
                lottery_id: lotteryProgramming.lottery_id,
            }
        })
        // Multiplicador sale del tipo de monazo

        let seller_billing_statement_array = [];
        let winnerTickets = [];
        for (let i = 0; i < lotteryTickets.length; i++) {
            let winAmmount = 0;
            let ticketId = lotteryTickets[i].id;
            // Buscamos que ya exista el seller dentro de la variable seller_billing_statement_array

            if (seller_billing_statement_array.find(statement => statement.seller_id == lotteryTickets[i].seller_id)) {
                // Si ya existe aactualizamos
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let index = seller_billing_statement_array.findIndex(statement => statement.seller_id == lotteryTickets[i].seller_id);
                seller_billing_statement_array[index].quantity_sold += lotteryTickets[i].price;
                seller_billing_statement_array[index].commission += lotteryTickets[i].price * (comission.commission / 100);
                for (let j = 0; j < lotteryTickets[i].monazo_bet_numbers.length; j++) {
                    //Buscamos según el tipo de orden
                    if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 1) {
                        // Monazo de tipo orden solo se favorece cuando los números coinciden con el orden
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;

                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 2) {
                        // Desorden solo se favorece cuando los números coinciden sin importar el orden
                        let winnersArray = [];
                        winnersArray.push([winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number]);
                        // Comprobamos que los numeros esten incluidos en el array de ganadores.
                        if (winnersArray.includes([lotteryTickets[i].monazo_bet_numbers[j].first_number, lotteryTickets[i].monazo_bet_numbers[j].second_number, lotteryTickets[i].monazo_bet_numbers[j].third_number])) {
                            let monazoDesorden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 2);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 3) {
                        // Combo orden - desorden
                        let winnersArray = [];
                        winnersArray.push([winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number]);
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        } else if (winnersArray.includes([lotteryTickets[i].monazo_bet_numbers[j].first_number, lotteryTickets[i].monazo_bet_numbers[j].second_number, lotteryTickets[i].monazo_bet_numbers[j].third_number])) {
                            let monazoDesorden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 2);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 4) {
                        // Combo orden
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        } else if (winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        }
                    }

                }

            } else {
                // Si no existe, lo añadimos a la variable
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].monazo_bet_numbers.length; j++) {
                    //Buscamos según el tipo de orden
                    if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 1) {
                        // Monazo de tipo orden solo se favorece cuando los números coinciden con el orden
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 2) {
                        // Desorden solo se favorece cuando los números coinciden sin importar el orden
                        let winnersArray = [];
                        winnersArray.push([winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number]);
                        // Comprobamos que los numeros esten incluidos en el array de ganadores.
                        if (winnersArray.includes([lotteryTickets[i].monazo_bet_numbers[j].first_number, lotteryTickets[i].monazo_bet_numbers[j].second_number, lotteryTickets[i].monazo_bet_numbers[j].third_number])) {
                            let monazoDesorden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 2);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 3) {
                        // Combo orden - desorden
                        let winnersArray = [];
                        winnersArray.push([winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number]);
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        } else if (winnersArray.includes([lotteryTickets[i].monazo_bet_numbers[j].first_number, lotteryTickets[i].monazo_bet_numbers[j].second_number, lotteryTickets[i].monazo_bet_numbers[j].third_number])) {
                            let monazoDesorden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 2);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoDesorden.main_multiplier;
                        }
                    } else if (lotteryTickets[i].monazo_bet_numbers[j].monazo_type_id == 4) {
                        // Combo orden
                        if (winningNumbers.first_number == lotteryTickets[i].monazo_bet_numbers[j].first_number && winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        } else if (winningNumbers.second_number == lotteryTickets[i].monazo_bet_numbers[j].second_number && winningNumbers.third_number == lotteryTickets[i].monazo_bet_numbers[j].third_number) {
                            let monazoOrden = lotteryProgramming.lottery.lottery_monazo_types.find(monazo => monazo.monazo_type_id == 1);
                            seller_billing_statement.prize_to_be_paid += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                            winAmmount += lotteryTickets[i].monazo_bet_numbers[j].amount * monazoOrden.main_multiplier;
                        }
                    }

                }
                seller_billing_statement_array.push(seller_billing_statement);
                if (winAmmount > 0) {
                    winnerTickets.push({
                        ticket_id: ticketId,
                        win_amount: winAmmount
                    })
                }
                winAmmount = 0;
            }
        }
        // Transaccion:
        const [lottery_programming_updated, tickets, billing_statement] = await prismaManager.$transaction(async (prisma) => {
            // Actualizamos la lotería y la marcamos como computada
            const lottery_programming_updated = await prisma.lottery_programming.update({
                where: {
                    id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Actualizamos los tickets y los marcamos como computados
            const tickets = await prisma.ticket.updateMany({
                where: {
                    lottery_programming_id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Creamos la factura de venta y actualizamos los vendedores con los montos correspondientes
            const billing_statement = await prisma.billing_statement.create({
                data: {
                    lottery_programming_id: lotteryProgramming.id,
                    billing_date: Utils.getNowInUtc(),
                    seller_billing_statement: {
                        create: seller_billing_statement_array
                    }
                }
            })
            // Actualizamos el saldo de los sellers según la fórmula
            /**
             * let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                //Saldo vendedor = cantidad vendida - comision - premios
             */
            for (const seller of seller_billing_statement_array) {
                let sellerUpdated = await prisma.seller.update({
                    where: {
                        user_id: seller.seller_id
                    },
                    data: {
                        balance: {
                            increment: seller.quantity_sold - seller.commission - seller.prize_to_be_paid
                        }
                    }
                })
            }
            for (const ticket of winnerTickets) {
                const tickets = await prisma.ticket.update({
                    where: {
                        id: ticket.ticket_id
                    },
                    data: {
                        ticket_prize: {
                            increment: ticket.win_amount
                        }
                    }
                })
            }
            return [lottery_programming_updated, tickets, billing_statement]
        })


        response.status(statusCode).json({
            ok: "ok"
        });
    }
    /**
    * Método para generar hoja de cobro para una lotería parley
    * @param request 
    * @param response 
    * @param next 
    */
    static async generateBillingStatementParleyLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 201;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        // Obtener la programación de la lotería, verificar que sea de tipo normal 1 y que exista.
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
                lottery: {
                    lottery_type_id: 4,
                }
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                        parley_lottery: true
                    }
                }
            }
        });
        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Verificar los permisos del usuario
        if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez llegados a este punto buscaremos los números ganadores de la misma.
        const winningNumbers = await prismaManager.parley_lottery_winner_number.findFirst({
            where: {
                lottery_programming_id: lotteryProgrammingId
            },
        });
        if (!winningNumbers) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        // Una vez que tenemos los números ganadores, buscaremos los tickets de lotería que coincidan con los números ganadores.
        const lotteryTickets = await prismaManager.ticket.findMany({
            where: {
                lottery_programming_id: lotteryProgrammingId,
                is_cancelled: false,
                is_computed: false,
            },
            include: {
                parley_bet_numbers: true,
            }
        })

        let commisions = await prismaManager.seller_commision.findMany({
            where: {
                seller_id: {
                    in: lotteryTickets.map(ticket => ticket.seller_id)
                },
                lottery_id: lotteryProgramming.lottery_id,
            }
        })


        let seller_billing_statement_array = [];
        let winnerTickets = [];
        for (let i = 0; i < lotteryTickets.length; i++) {
            let winAmmount = 0;
            let ticketId = lotteryTickets[i].id;
            // Buscamos que ya exista el seller dentro de la variable seller_billing_statement_array
            if (seller_billing_statement_array.find(statement => statement.seller_id == lotteryTickets[i].seller_id)) {
                // Si ya existe aactualizamos
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let index = seller_billing_statement_array.findIndex(statement => statement.seller_id == lotteryTickets[i].seller_id);
                seller_billing_statement_array[index].quantity_sold += lotteryTickets[i].price;
                seller_billing_statement_array[index].commission += lotteryTickets[i].price * (comission.commission / 100);
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].parley_bet_numbers.length; j++) {
                    let bet_numbers = [lotteryTickets[i].parley_bet_numbers[j].first_number, lotteryTickets[i].parley_bet_numbers[j].second_number];
                    let parleyWinningNumbers = [winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number];
                    if (Utils.coincidenDosNumeros(bet_numbers, parleyWinningNumbers)) {
                        winAmmount += lotteryTickets[i].parley_bet_numbers[j].amount * lotteryProgramming.lottery.parley_lottery.multiplier;
                        seller_billing_statement_array[index].prize_to_be_paid += lotteryTickets[i].parley_bet_numbers[j].amount * lotteryProgramming.lottery.parley_lottery.multiplier;
                    }
                }

            } else {
                // Si no existe, lo añadimos a la variable
                let comission = commisions.find(commission => commission.seller_id == lotteryTickets[i].seller_id);
                let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                // Recorremos cada uno de los números y verificamos que sea ganador si lo es se añade al premio a pagar
                for (let j = 0; j < lotteryTickets[i].parley_bet_numbers.length; j++) {
                    let bet_numbers = [lotteryTickets[i].parley_bet_numbers[j].first_number, lotteryTickets[i].parley_bet_numbers[j].second_number];
                    let parleyWinningNumbers = [winningNumbers.first_number, winningNumbers.second_number, winningNumbers.third_number];
                    if (Utils.coincidenDosNumeros(bet_numbers, parleyWinningNumbers)) {
                        seller_billing_statement.prize_to_be_paid += lotteryTickets[i].parley_bet_numbers[j].amount * lotteryProgramming.lottery.parley_lottery.multiplier;
                        winAmmount += lotteryTickets[i].parley_bet_numbers[j].amount * lotteryProgramming.lottery.parley_lottery.multiplier;
                    }
                }
                seller_billing_statement_array.push(seller_billing_statement);
            }
            if (winAmmount > 0) {
                winnerTickets.push({
                    ticket_id: ticketId,
                    win_amount: winAmmount
                })
            }
            winAmmount = 0;
        }
        // Transaccion:

        const [lottery_programming_updated, tickets, billing_statement] = await prismaManager.$transaction(async (prisma) => {
            // Actualizamos la lotería y la marcamos como computada
            const lottery_programming_updated = await prisma.lottery_programming.update({
                where: {
                    id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Actualizamos los tickets y los marcamos como computados
            const tickets = await prisma.ticket.updateMany({
                where: {
                    lottery_programming_id: lotteryProgramming.id
                },
                data: {
                    is_computed: true,
                }
            })

            // Creamos la factura de venta y actualizamos los vendedores con los montos correspondientes
            const billing_statement = await prisma.billing_statement.create({
                data: {
                    lottery_programming_id: lotteryProgramming.id,
                    billing_date: Utils.getNowInUtc(),
                    seller_billing_statement: {
                        create: seller_billing_statement_array
                    }
                }
            })
            // Actualizamos el saldo de los sellers según la fórmula
            /**
             * let seller_billing_statement = {
                    seller_id: lotteryTickets[i].seller_id,
                    quantity_sold: lotteryTickets[i].price,
                    commission: lotteryTickets[i].price * (comission.commission / 100),
                    prize_to_be_paid: 0 // Sale de los numeros que el tipo vendió.
                };
                //Saldo vendedor = cantidad vendida - comision - premios
             */
            for (const seller of seller_billing_statement_array) {
                let sellerUpdated = await prisma.seller.update({
                    where: {
                        user_id: seller.seller_id
                    },
                    data: {
                        balance: {
                            increment: seller.quantity_sold - seller.commission - seller.prize_to_be_paid
                        }
                    }
                })
            }
            for (const ticket of winnerTickets) {
                const tickets = await prisma.ticket.update({
                    where: {
                        id: ticket.ticket_id
                    },
                    data: {
                        ticket_prize: {
                            increment: ticket.win_amount
                        }
                    }
                })
            }
            return [lottery_programming_updated, tickets, billing_statement]
        })


        response.status(statusCode).json({
            ok: "ok"
        });
    }
    /**
    * Método para generar lista de números
    * @param request 
    * @param response 
    * @param next 
    */
    static async generateListProgrammingLottery(request, response: Response, next: NextFunction) {
        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);

        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const lotteryProgrammingId: number = Number.parseInt(request.body.lottery_programming_id);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        //Arreglo de ids de sellers

        const seller_ids: Array<number> = (request.body.seller_ids) ? request.body.seller_ids : null;
        //convertir sellers_ids a un arreglo válido de numbers

        // Obtener la programación de la lotería, verificar que sea de tipo normal 1 o 2 y que exista.
        const lotteryProgramming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lotteryProgrammingId,
                lottery: {
                    lottery_type_id: {
                        in: [1, 2]
                    }
                }
            },
            include: {
                lottery: {
                    include: {
                        bank: {
                            include: {
                                bank_seller: true,
                            }
                        },
                        seller_commission: true,
                    }
                }
            }
        });

        if (!lotteryProgramming || lotteryProgramming.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // Verificar los permisos del usuario
        if (userRole == Role.SELLER_USER) {

        } else if (!BankRepository.isAllowedToEditThisBank(lotteryProgramming.lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        let betNumbers;
        /**
         * Si el usuario es vendedor solo se le muestran los números que vendió
         */
        if (userRole == Role.SELLER_USER) {
            betNumbers = await prismaManager.bet_number.findMany({
                where: {
                    ticket: {
                        seller_id: userId,
                        lottery_programming_id: lotteryProgrammingId
                    },
                },
                include: {
                    reventado_bet: true,
                }
            })
            // Recorro cada Bet Number y si tiene reventado bet le sumo la cantidad de reventado bet al amount
            const map1 = betNumbers.map(number => (
                {
                    number: number.number,
                    amount: number.amount + ((number.reventado_bet) ? number.reventado_bet.amount : 0)
                }
            ))
            //Recorro el mapa anterior y los números iguales los sumo y los agrego a un nuevo mapa
            const map2 = map1.reduce((acc, curr) => {
                const numberIndex = acc.findIndex(item => item.number === curr.number);
                if (numberIndex === -1) {
                    acc.push(curr);
                } else {
                    acc[numberIndex].amount += curr.amount;
                }
                return acc;
            }, []);
            betNumbers = [{
                seller_id: userId,
                betNumbers: map2
            }]
        } else {
            betNumbers = [];
            if (!seller_ids || seller_ids.length == 0) {
                for (var i = 0; i < lotteryProgramming.lottery.seller_commission.length; i++) {
                    let betNumber = await prismaManager.bet_number.findMany({
                        where: {
                            ticket: {
                                seller_id: lotteryProgramming.lottery.seller_commission[i].seller_id,
                                lottery_programming_id: lotteryProgrammingId
                            },
                        },
                        include: {
                            reventado_bet: true,
                        }
                    })
                    // Recorro cada Bet Number y si tiene reventado bet le sumo la cantidad de reventado bet al amount
                    const map1 = betNumber.map(number => (
                        {
                            number: number.number,
                            amount: number.amount + ((number.reventado_bet) ? number.reventado_bet.amount : 0)
                        }
                    ))
                    //Recorro el mapa anterior y los números iguales los sumo y los agrego a un nuevo mapa
                    const map2 = map1.reduce((acc, curr) => {
                        const numberIndex = acc.findIndex(item => item.number === curr.number);
                        if (numberIndex === -1) {
                            acc.push(curr);
                        } else {
                            acc[numberIndex].amount += curr.amount;
                        }
                        return acc;
                    }, []);
                    betNumbers.push({
                        seller_id: lotteryProgramming.lottery.seller_commission[i].seller_id,
                        betNumbers: map2
                    })
                }
            } else {
                for (var i = 0; i < seller_ids.length; i++) {
                    let betNumber = await prismaManager.bet_number.findMany({
                        where: {
                            ticket: {
                                seller_id: seller_ids[i],
                                lottery_programming_id: lotteryProgrammingId
                            },
                        },
                        include: {
                            reventado_bet: true,
                        }
                    })
                    // Recorro cada Bet Number y si tiene reventado bet le sumo la cantidad de reventado bet al amount
                    const map1 = betNumber.map(number => (
                        {
                            number: number.number,
                            amount: number.amount + ((number.reventado_bet) ? number.reventado_bet.amount : 0)
                        }
                    ))
                    //Recorro el mapa anterior y los números iguales los sumo y los agrego a un nuevo mapa
                    const map2 = map1.reduce((acc, curr) => {
                        const numberIndex = acc.findIndex(item => item.number === curr.number);
                        if (numberIndex === -1) {
                            acc.push(curr);
                        } else {
                            acc[numberIndex].amount += curr.amount;
                        }
                        return acc;
                    }, []);
                    betNumbers.push({
                        seller_id: seller_ids[i],
                        betNumbers: map2
                    })
                }

            }

        }

        response.status(statusCode).json({
            numbers: betNumbers
        });
    }


    /**
    * Metodo para obtener un ticket por id
    * @param request 
    * @param response 
    * @param next 
    */
    static async getTicketById(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        let ticket_id: number = Number.parseInt(request.query.ticket_id);
        // Permitido SUPER_USER, BANKER_USER solo si el tiquete pertenece a una de la loterias de alguno de sus bancos, SELLER_USER solo si el tiquete pertenece a alguna de las loterias que el puede vender.
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;

        if (userRole == Role.BANKER_USER) {
            const ticket = await prismaManager.ticket.findFirst({
                where: {
                    id: ticket_id,
                    lottery_programming: {
                        lottery: {
                            bank: {
                                owner_id: userId
                            }
                        }
                    }
                },
                include: {
                    bet_numbers: true,
                    monazo_bet_numbers: true,
                    parley_bet_numbers: true
                }
            })
            if (!ticket) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            response.status(statusCode).send(ticket);
            return;
        } else if (userRole == Role.SELLER_USER) {
            const ticket = await prismaManager.ticket.findFirst({
                where: {
                    id: ticket_id,
                    lottery_programming: {
                        lottery: {
                            seller_commission: {
                                some: {
                                    seller_id: userId
                                }
                            }
                        }
                    }
                },
                include: {
                    bet_numbers: true,
                    monazo_bet_numbers: true,
                    parley_bet_numbers: true
                }
            })
            if (!ticket) {
                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            response.status(statusCode).send(ticket);
            return;
        } else if (userRole == Role.SUPER_USER) {
            const ticket = await prismaManager.ticket.findFirst({
                where: {
                    id: ticket_id
                },
                include: {
                    bet_numbers: true,
                    monazo_bet_numbers: true,
                    parley_bet_numbers: true
                }
            })
            if (!ticket) {

                statusCode = 400;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.TICKETS_NOT_FOUND, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
            response.status(statusCode).send(ticket);

            return;

        }

        statusCode = 403;
        response.status(statusCode).send(new ApiError(
            {
                clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
            }
        ));

    }
    // Restringidos
    /**
       * Metodo para obtener los numeros restringidos
       * @param request 
       * @param response 
       * @param next 
       */
    static async getRestrictedNumbers(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lottery_id = Number.parseInt(request.query.lottery_id as string);

        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lottery_id,
                lottery_type_id: {
                    in: [1, 2]
                }
            },
            include: {
                bank: true,
            }
        });
        if (!lottery) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        // obtenemos los restringidos
        const restricted_numbers = await prismaManager.restricted_number.findMany({
            where: {
                lottery_id: lottery_id
            }
        })
        const restricted_numbers_by_sellers = await prismaManager.seller_restricted_numbers.findMany({
            where: {
                lottery_id: lottery_id
            }
        })
        const responseObject = {
            restricted_numbers, restricted_numbers_by_sellers
        }
        response.status(statusCode).send(responseObject);
    }
    /**
       * Metodo para añadir numero restringido a una lotería
       * @param request 
       * @param response 
       * @param next 
       */
    static async addRestrictedNumberToLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lottery_id = Number.parseInt(request.body.lottery_id as string);
        const number = Number.parseInt(request.body.number as string);
        const amount = Number.parseInt(request.body.amount as string);

        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lottery_id,
            },
            include: {
                bank: true,
            }
        });
        if (!lottery) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        const existNumber = await prismaManager.restricted_number.findFirst({
            where: {
                lottery_id: lottery_id,
                number: number
            }
        })
        if (existNumber) {
            const restricted_numbers = await prismaManager.restricted_number.updateMany({
                where: {
                    lottery_id: lottery_id,
                    number: number
                },
                data: {
                    amount: amount,
                }
            })
            response.status(statusCode).send({
                msg: "Updated"
            });
            return;
        }

        // obtenemos los restringidos
        const restricted_numbers = await prismaManager.restricted_number.create({
            data: {
                lottery_id: lottery_id,
                amount: amount,
                number: number
            }
        })

        response.status(statusCode).send(restricted_numbers);
    }
    /**
       * Metodo para añadir numero restringido a un seller
       * @param request 
       * @param response 
       * @param next 
       */
    static async addRestrictedNumberToSeller(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lottery_id = Number.parseInt(request.body.lottery_id as string);
        const number = Number.parseInt(request.body.number as string);
        const amount = Number.parseInt(request.body.amount as string);
        const seller_id = Number.parseInt(request.body.seller_id as string);

        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                id: lottery_id,
            },
            include: {
                bank: true,
            }
        });
        if (!lottery) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        const existNumber = await prismaManager.seller_restricted_numbers.findFirst({
            where: {
                lottery_id: lottery_id,
                number: number
            }
        })
        if (existNumber) {
            const restricted_numbers = await prismaManager.seller_restricted_numbers.updateMany({
                where: {
                    lottery_id: lottery_id,
                    number: number
                },
                data: {
                    amount: amount,
                }
            })
            response.status(statusCode).send({
                msg: "Updated"
            });
            return;
        }

        // obtenemos los restringidos
        const restricted_numbers = await prismaManager.seller_restricted_numbers.create({
            data: {
                lottery_id: lottery_id,
                amount: amount,
                number: number
            }
        })

        response.status(statusCode).send(restricted_numbers);
    }
    /**
    * Metodo para eliminar numero restringido de una loteria
    * @param request 
    * @param response 
    * @param next 
    */
    static async removeRestrictedNumberToLottery(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const restricted_number_id = Number.parseInt(request.body.restricted_number_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                restricted_number: {
                    some: {
                        id: restricted_number_id,
                    }
                }
            },
            include: {
                bank: true,
                lottery_prizes: true,
                lottery_type: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        const number = await prismaManager.restricted_number.delete({
            where: {
                id: restricted_number_id,
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
    * Metodo para eliminar numero restringido de un seller
    * @param request 
    * @param response 
    * @param next 
    */
    static async removeRestrictedNumberToSeller(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;
        let responseObject = null;
        const restricted_number_id = Number.parseInt(request.body.restricted_number_id as string);
        const userRole = request.clientUserRole;
        const userId = request.clientUserId;


        // Ver que existe la lotería
        const lottery = await prismaManager.lottery.findFirst({
            where: {
                seller_restricted_numbers: {
                    some: {
                        id: restricted_number_id,
                    }
                }
            },
            include: {
                bank: true,
                lottery_prizes: true,
                lottery_type: true
            }
        });

        if (!lottery || lottery.is_deleted) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        if (!BankRepository.isAllowedToEditThisBank(lottery.bank.owner_id, userRole, userId)) {
            statusCode = 403;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                    }
                )
            );
            return;
        }

        const number = await prismaManager.seller_restricted_numbers.delete({
            where: {
                id: restricted_number_id,
            }
        })

        response.status(statusCode).send({
            msg: "Deleted"
        });
    }
    /**
   * Metodo para obtener los numeros restringidos
   * @param request 
   * @param response 
   * @param next 
   */
    static async getRestrictedNumbersLotteryProgramming(request, response: Response, next: NextFunction) {

        let translator: Translator = Translator.getInstance();
        let clientLanguage: Language = Utils.getClientLanguage(request);
        const prismaManager = DatabaseHelper.getInstance().prismaDatabaseManager;
        let statusCode: number = 200;

        const userRole = request.clientUserRole;
        const userId = request.clientUserId;
        const lottery_programming_id = Number.parseInt(request.query.lottery_programming_id as string);
        let seller_id = null;

        // Ver que existe la lotería
        const lottery_programming = await prismaManager.lottery_programming.findFirst({
            where: {
                id: lottery_programming_id,
            },
            include: {
                lottery: {
                    include: {
                        bank: true,
                    }
                }
            }
        });
        if (!lottery_programming) {
            statusCode = 400;
            response.status(statusCode).send(
                new ApiError(
                    {
                        clientErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage }),
                        debugErrorMessage: translator.getTranslation(Translator.LOTTERY_PROGRAMMING_NOT_FOUND, { language: clientLanguage })
                    }
                )
            );
            return;
        }
        if (userRole == Role.BANKER_USER) {
            if (!BankRepository.isAllowedToEditThisBank(lottery_programming.lottery.bank.owner_id, userRole, userId)) {
                statusCode = 403;
                response.status(statusCode).send(
                    new ApiError(
                        {
                            clientErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage }),
                            debugErrorMessage: translator.getTranslation(Translator.NOT_ALLOWED, { language: clientLanguage })
                        }
                    )
                );
                return;
            }
        } else if (userRole == Role.SELLER_USER) {
            seller_id = userId;
        }


        // obtenemos los restringidos
        const restricted_numbers = await prismaManager.programming_restricted_numbers.findMany({
            where: {
                programming_id: lottery_programming_id
            }
        })
        const restricted_numbers_by_sellers = await prismaManager.seller_programming_restricted_numbers.findMany({
            where: {
                programming_id: lottery_programming_id,
                ...(seller_id ? { seller_id } : {}),
            }
        })
        const responseObject = {
            restricted_numbers, restricted_numbers_by_sellers
        }
        response.status(statusCode).send(responseObject);
    }
}


