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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http = __importStar(require("http"));
const bodyparser = __importStar(require("body-parser"));
const winston = __importStar(require("winston"));
const expressWinston = __importStar(require("express-winston"));
const logger_1 = __importDefault(require("./logger"));
const routes_1 = require("./routes");
const ENV = __importStar(require("./enviroments"));
const APIError_1 = require("./bean/APIError");
const response_format_1 = __importDefault(require("response-format"));
const app = express_1.default();
const server = http.createServer(app);
const port = ENV.API_PORT;
app.use(bodyparser.json());
app.use(cors_1.default());
app.use(expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.label({ label: "HTTP" }), winston.format.timestamp(), winston.format.printf(({ level, message, label, timestamp }) => {
        return `${level}: [${label}] ${timestamp} ${message}`;
    })),
    msg: "{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    colorize: true,
    ignoreRoute: function (req, res) {
        return false;
    }
}));
app.use(routes_1.ApiRouter);
app.use((err, req, res, next) => {
    if (err instanceof APIError_1.APIError) {
        return res.json(err.data);
    }
    return res.json(response_format_1.default.internalError());
});
server.listen(port, () => {
    logger_1.default.info(`⚡️ Server is running at https://localhost:${port}`);
});
