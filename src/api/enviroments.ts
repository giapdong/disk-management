import * as dotenv from "dotenv";
if (!process.env.CHECK_POINT) dotenv.config({ path: "enviroments/.env" });

export const NODE_ENV = process.env.NODE_ENV || "development"; // development | production | test
export const IS_PRODUCTION = NODE_ENV === "production";
export const CLIENT_PORT = normalizePort(process.env.CLIENT_PORT);
export const API_PORT = normalizePort(process.env.API_PORT);

function normalizePort(value: string | null | undefined) {
  let defaultPort = 8088;
  if (!value) return defaultPort;

  let port: number = parseInt(value, 10);
  if (!isNaN(port) && port >= 0) return port;

  return defaultPort;
}
