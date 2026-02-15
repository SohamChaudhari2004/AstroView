"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
require("./jobs/cronJobs");
const PORT = process.env.PORT || 5001;
const startServer = async () => {
    await (0, database_1.connectDB)();
    await (0, redis_1.connectRedis)();
    app_1.default.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};
startServer();
