"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_PORT = exports.CLIENT_PORT = exports.IS_PRODUCTION = exports.NODE_ENV = void 0;
const dotenv = __importStar(require("dotenv"));
if (!process.env.CHECK_POINT)
    dotenv.config({ path: "enviroments/.env" });
exports.NODE_ENV = process.env.NODE_ENV || "development";
exports.IS_PRODUCTION = exports.NODE_ENV === "production";
exports.CLIENT_PORT = normalizePort(process.env.CLIENT_PORT);
exports.API_PORT = normalizePort(process.env.API_PORT);
function normalizePort(value) {
    let defaultPort = 8088;
    if (!value)
        return defaultPort;
    let port = parseInt(value, 10);
    if (!isNaN(port) && port >= 0)
        return port;
    return defaultPort;
}
