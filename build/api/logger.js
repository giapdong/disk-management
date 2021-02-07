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
const winston_1 = __importStar(require("winston"));
const enviroments_1 = require("./enviroments");
const logLevel = enviroments_1.NODE_ENV === "production" ? "info" : "silly";
winston_1.default.addColors({
    error: "bold red",
    warn: "bold yellow",
    info: "bold white",
    http: "bold white",
    verbose: "bold white",
    debug: "bold blue",
    silly: "bold gray"
});
const logger = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console({
            level: logLevel,
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
        })
    ],
    exitOnError: false
});
exports.default = logger;
