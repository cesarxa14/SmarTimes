import { Server } from "http";
import {default as App} from "./app";


import { EnvironmentConstants } from "./configs/environment/EnvironmentsConfig";

// Corriendo el servidor.
let appPort: number = EnvironmentConstants.APP_PORT || 3000;
export const appServer: Server = App.expressApp.listen(appPort, () => {
    console.log(`Environment: ${EnvironmentConstants.NODE_ENV}`);
    console.log(`App initialized using ${appPort} port...`);
});

