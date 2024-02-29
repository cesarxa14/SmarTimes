"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appServer = void 0;
const app_1 = __importDefault(require("./app"));
const EnvironmentsConfig_1 = require("./configs/environment/EnvironmentsConfig");
// Corriendo el servidor.
let appPort = EnvironmentsConfig_1.EnvironmentConstants.APP_PORT || 3000;
exports.appServer = app_1.default.expressApp.listen(appPort, () => {
    console.log(`Environment: ${EnvironmentsConfig_1.EnvironmentConstants.NODE_ENV}`);
    console.log(`App initialized using ${appPort} port...`);
});
//# sourceMappingURL=server.js.map